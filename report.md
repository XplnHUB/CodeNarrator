# CodeNarrator - Project Report

## Overview

- **What it does**
  - CLI tool that scans a codebase, sends file contents to Gemini, and writes per-file Markdown documentation.
- **Core flow**
  - `bin/cli.js` parses args and config -> calls `analyzeCodebase()`.
  - `src/analyzer.js` finds files, builds prompts, calls `callGemini()`, and writes docs via `writeMarkdown()`.
  - `src/aiEngine.js` integrates with `@google/generative-ai`.
  - `src/writer.js` writes normalized Markdown file paths under the output directory.

## Tech Stack

- Node.js (ESM)
- commander, chalk, ora (CLI UX)
- glob, fs / fs-extra (file scanning and IO)
- dotenv (env loading)
- @google/generative-ai (Gemini API)

## Project Structure (key)

- `bin/cli.js` – CLI entry, dotenv load, options, invokes analyzer.
- `src/analyzer.js` – Scans files, prompts AI, writes docs, progress + summary.
- `src/aiEngine.js` – Uses `@google/generative-ai`, reads `GEMINI_API_KEY` from environment, calls model `gemini-2.5-flash`.
- `src/writer.js` – Normalizes filenames and writes markdown.
- `test-models.js` – Connectivity test for Gemini and simple prompt.

## How It Works (summary)

1. CLI resolves absolute input and output paths and validates model.
2. Analyzer finds supported files (many extensions) using `glob` with some folder ignores.
3. For each file, constructs a documentation prompt -> calls Gemini -> writes a Markdown file under the output directory mirroring the relative path.
4. Provides a summary with success and failure counts.

## How to Run

- **Prerequisites**
  - Node.js 18+ (ESM + top-level await used).
  - A valid Gemini API key.

- **Setup**
  ```bash
  npm install
  # Provide your Gemini API key in the environment (recommended):
  export GEMINI_API_KEY=your_key
  # Or create a .env in project root (see Notes below):
  echo "GEMINI_API_KEY=your_key" > .env
  ```

- **CLI usage**
  ```bash
  # Local run
  npm start -- ./src --output ./docs --model gemini

  # Or link globally
  npm link
  codenarrator ./src --output ./docs --model gemini
  ```

- **Connectivity test**
  ```bash
  npm test
  ```

- **Notes**
  - If you install globally, relying solely on a package-local `.env` will fail; ensure `GEMINI_API_KEY` is available in your shell environment.

## Current Status

- **Lazy initialization implemented** (`src/aiEngine.js`)
  - The module now uses lazy initialization with `getClient()` and `getModel()` functions.
  - API key is only checked when functions are called, not at import time.
  - Client and model instances are cached for reuse.

- **Test script improvements** (`test-models.js`)
  - Now gracefully skips tests when `GEMINI_API_KEY` is missing instead of exiting with an error.
  - Provides helpful guidance on how to set up the key.
  - Working commands clearly documented:
    - Inline env: `GEMINI_API_KEY=YOUR_KEY VERBOSE=1 npm test`
    - With dotenv preload: `VERBOSE=1 node -r dotenv/config test-models.js`

- **Analyzer safeguards implemented**
  - File size limit (200KB) added to avoid sending large files to the API.
  - `supportedExtensions` excludes `md` files.
  - Output directory is dynamically ignored (absolute and relative paths), avoiding re-scan of generated docs.

- **Dependencies**
  - Versions are pinned to currently available releases (e.g., dotenv 16.4.5, chalk 5.3.0, commander 12.1.0, fs-extra 11.2.0).
  - `engines.node >= 18` is specified in package.json.

- **Documentation improved**
  - README now clearly explains API key setup options with examples.
  - Project structure description updated to reflect code changes.
  - Security note added about file size limits.

## Future Improvements

- **Analyzer enhancements**
  - Add simple concurrency (e.g., process N files at a time) with basic retry/backoff on API errors.
  - Implement a progress bar for better UX during processing.

- **CLI UX**
  - Validate that `input` and `output` are not nested in a way that causes re-scan of generated docs.
  - Offer `--exclude` and `--include` patterns for more granular file selection.
  - Provide a dry-run mode and a `--max-files` cap for testing.

- **AI integration**
  - Make model name configurable; keep a default but allow override with validation.
  - Add structured prompt templates per language for better outputs.
  - Consider adding OpenAI as an alternative model provider.

- **Error handling**
  - Add retry logic for API calls with exponential backoff.
  - Improve error messages with more specific guidance.

- **Performance**
  - Implement batch processing to reduce API calls.
  - Add caching for repeated analyses of the same files.

## Implementation Checklist

- [x] In `aiEngine.js`, lazy-init the client to avoid import-time throws; error clearly when used without `GEMINI_API_KEY`.
- [x] Keep dotenv loading only in `bin/cli.js` (already true); document `node -r dotenv/config` for non-CLI scripts.
- [x] Maintain analyzer ignores and `md` exclusion (already implemented).
- [x] Add file size limits to analyzer.js to avoid processing large files.
- [x] Keep dependency versions pinned and `engines.node` enforced.
- [x] Clarify environment setup in README (no fallback key; env var is required).
- [x] Update test-models.js to skip gracefully when API key is missing.

## Example Commands

```bash
# Generate docs for this repo's src into ./docs
npm start -- ./src --output ./docs --model gemini

# Global after linking
codenarrator ./src --output ./docs --model gemini

# Run quick connectivity test
npm test
```

## Risks & Considerations

- Cost and privacy: Files are sent to Gemini; avoid sensitive code without controls.
- Rate limits: Add retry/backoff and concurrency control if scaling to large repos.
- Large files/binaries: Add size/type filters to avoid sending non-text blobs.

## Conclusion

The project is now fully functional with robust error handling and user-friendly documentation. Key improvements include lazy initialization of the AI client, graceful handling of missing API keys, file size limits to prevent excessive token usage, and clear documentation for various usage scenarios. The codebase is now more maintainable, user-friendly, and ready for production use.

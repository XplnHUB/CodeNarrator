# CodeNarrator – Project Report

## Overview

- **What it does**
  - CLI tool that scans a codebase, sends file contents to Gemini, and writes per-file Markdown documentation.
- **Core flow**
  - `bin/cli.js` parses args and config → calls `analyzeCodebase()`.
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
- `src/aiEngine.js` – Loads `.env`, validates key, calls Gemini model `gemini-2.5-flash`.
- `src/writer.js` – Normalizes filenames and writes markdown.
- `test-models.js` – Connectivity test for Gemini and simple prompt.

## How It Works (summary)

1. CLI resolves absolute input and output paths and validates model.
2. Analyzer finds supported files (many extensions) using `glob` with some folder ignores.
3. For each file, constructs a documentation prompt → calls Gemini → writes a Markdown file under the output directory mirroring the relative path.
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

## Current Issues / Errors Observed

- **Hard failure on missing .env** (`src/aiEngine.js`)
  - The code exits if `.env` is not present: `process.exit(1)` if file missing or `GEMINI_API_KEY` unset.
  - README claims a fallback key; none exists. This is inconsistent and breaks global CLI use where `.env` may not exist.

- **Overly strict dependency versions (likely to 404 on install)**
  - `package.json` declares:
    - `dotenv: ^17.0.1` (as of Node ecosystem, latest known major is 16; 17 may not exist).
    - `chalk: ^5.4.1` (latest commonly available is ≤5.3.x).
    - `commander: ^14.0.0` (current stable known is around 12.x).
    - `fs-extra: ^11.3.0` (latest commonly available is around 11.2.x).
  - These may cause `npm install` to fail. Pin to available versions.

- **Recursive self-inclusion risk** (`src/analyzer.js`)
  - Analyzer includes `md` in `supportedExtensions` and does not ignore the output folder.
  - If `output` lies under the input folder (e.g., `./docs` while analyzing repo root), generated docs will be re-scanned, causing cascade growth and wasted tokens.

- **Global install env path mismatch**
  - `aiEngine.js` insists on a `.env` alongside the installed package (computed from `src`), which will not exist when installed globally. It should respect the shell env and not require a file.

- **Excessive console logging of secrets state**
  - Logs that a key was found; safe, but ensure no accidental key printing. Current code does not print the key, which is good.

- **User experience nits**
  - CLI says only Gemini is supported; option `--model` exists but warns for other values without offering OpenAI implementation.
  - On no args, `program.help()` exits immediately; acceptable, but a friendlier default could be to print a short usage banner.

## Suggested Improvements

- **Environment handling**
  - Prefer `process.env.GEMINI_API_KEY` if set; do not hard-require a `.env` file. Load `.env` opportunistically (no hard exit on missing file).
  - Remove duplicate dotenv loads (both CLI and aiEngine). Centralize in CLI and pass the key down or rely only on process.env.
  - Update README to remove the non-existent fallback key claim.

- **Dependencies**
  - Pin to known available versions to ensure install reliability, e.g.:
    - `dotenv@^16.4.5`
    - `chalk@^5.3.0`
    - `commander@^12.1.0`
    - `fs-extra@^11.2.0`
    - Verify `@google/generative-ai@^0.24.1` and `ora@^8.2.0` availability.
  - Add an `engines` field: `{ "node": ">=18" }`.

- **Analyzer safeguards**
  - Remove `md` from `supportedExtensions` or add a dynamic ignore for the output directory (e.g., always ignore `options.output/**`).
  - Add a max file size limit to avoid sending large bundles to the API.
  - Consider batching/concurrency with rate limiting and retries for robustness.

- **CLI UX**
  - Validate that `input` and `output` are not nested in a way that causes re-scan of generated docs.
  - Offer `--exclude` and `--include` patterns.
  - Provide a dry-run mode and a `--max-files` cap for tests.

- **AI integration**
  - Make model name configurable; keep a default but allow override with validation.
  - Add structured prompt templates per language for better outputs.

- **Logging**
  - Gate debug logs behind `VERBOSE` only; reduce noisy baseline logs (e.g., `.env` lookup prints).

- **Testing**
  - Convert `test-models.js` into a simple integration test that doesn’t exit the process on missing key; instead, skip with a message.

## Quick Fix Checklist

- [ ] In `aiEngine.js`, remove `.env` hard failure; use `process.env.GEMINI_API_KEY || ''` and throw only if missing, without requiring a file.
- [ ] In `bin/cli.js`, load dotenv once from project root and do not duplicate in `aiEngine.js`.
- [ ] In `analyzer.js`, exclude `options.output/**` from glob and/or drop `md` from supported extensions.
- [ ] Pin dependency versions to known-good releases; add `engines.node`.
- [ ] Update README to remove fallback key claim and clarify environment setup.

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

The project is close to usable, but a few dependency and environment handling fixes are needed to make installation and execution reliable, especially for global CLI usage. Addressing the analyzer recursion risk will prevent runaway scans and token waste.

# CodeNarrator – Project Report

## Overview

### Purpose

**CodeNarrator** is a command-line tool that scans a codebase, sends source files to the Gemini API, and generates per-file Markdown documentation automatically.

### Core Workflow

1. **`bin/cli.js`** – Parses CLI arguments and configuration, then calls `analyzeCodebase()`.
2. **`src/analyzer.js`** – Scans files, builds prompts, invokes `callGemini()`, and writes documentation using `writeMarkdown()`.
3. **`src/aiEngine.js`** – Handles communication with the `@google/generative-ai` package.
4. **`src/writer.js`** – Normalizes Markdown file paths and writes output files.

## Tech Stack

* **Runtime:** Node.js (ESM)
* **CLI Experience:** commander, chalk, ora
* **File Operations:** glob, fs, fs-extra
* **Configuration:** dotenv
* **AI Integration:** @google/generative-ai (Gemini API)

## Project Structure (Key Files)

| File              | Description                                                                   |
| ----------------- | ----------------------------------------------------------------------------- |
| `bin/cli.js`      | CLI entry point. Loads dotenv, parses arguments, and invokes the analyzer.    |
| `src/analyzer.js` | Main logic for scanning, prompting AI, writing docs, and summarizing results. |
| `src/aiEngine.js` | Initializes and manages Gemini API clients using the environment key.         |
| `src/writer.js`   | Handles path normalization and Markdown file creation.                        |
| `test-models.js`  | Tests Gemini connectivity and basic prompt execution.                         |

## How It Works

1. The CLI resolves absolute paths for input and output, validating the selected model.
2. The analyzer searches for supported files (using `glob`) while ignoring certain folders.
3. Each file’s content is sent to Gemini with a structured prompt, and its documentation is written to the output directory (mirroring its relative path).
4. A summary reports successful and failed operations.

## How to Run

### Prerequisites

* Node.js 18+ (uses ESM and top-level `await`)
* A valid **Gemini API key**

### Setup

```bash
npm install
# Provide your API key
export GEMINI_API_KEY=your_key
# Or create a .env file
echo "GEMINI_API_KEY=your_key" > .env
```

### CLI Usage

```bash
# Local run
npm start -- ./src --output ./docs --model gemini

# Or link globally
npm link
codenarrator ./src --output ./docs --model gemini
```

### Connectivity Test

```bash
npm test
```

> **Note:** When installed globally, `.env` files in the package directory will not be read. Ensure `GEMINI_API_KEY` is available in your shell environment.

## Current Status

### Lazy Initialization (`src/aiEngine.js`)

* Implemented `getClient()` and `getModel()` for on-demand setup.
* The API key is validated only when needed, not at import time.
* Client and model instances are cached for reuse.

### Test Script Improvements (`test-models.js`)

* Gracefully skips tests if `GEMINI_API_KEY` is missing.
* Provides clear setup guidance.
* Example commands:

  ```bash
  GEMINI_API_KEY=YOUR_KEY VERBOSE=1 npm test
  VERBOSE=1 node -r dotenv/config test-models.js
  ```

### Analyzer Safeguards

* Added **file size limit (200 KB)** to skip large files.
* Automatically excludes Markdown files and the output directory (both absolute and relative).

### Dependencies

* Versions pinned for stability:
  dotenv 16.4.5, chalk 5.3.0, commander 12.1.0, fs-extra 11.2.0.
* `engines.node >= 18` enforced in `package.json`.

### Documentation Updates

* README expanded with clearer setup examples and API key notes.
* Added a security reminder about file size and privacy.

## Future Improvements

### Analyzer

* Add simple concurrency (process multiple files simultaneously).
* Introduce retry/backoff logic for transient API errors.
* Include a visual progress bar for better UX.

### CLI UX

* Validate that input/output paths don’t overlap.
* Support `--include` / `--exclude` patterns.
* Add dry-run mode and `--max-files` limit.

### AI Integration

* Make model name configurable and validated.
* Add language-specific prompt templates.
* Consider OpenAI as an optional provider.

### Error Handling

* Add exponential backoff and richer error reporting.

### Performance

* Support batch requests to minimize API calls.
* Cache results for unchanged files.

## Implementation Checklist

* [x] Lazy initialization in `aiEngine.js`
* [x] dotenv only in CLI entry (`bin/cli.js`)
* [x] Analyzer ignores `.md` and output directories
* [x] File size limit enforced
* [x] Dependency versions pinned
* [x] Environment setup clarified in README
* [x] Test gracefully skips without API key

## Example Commands

```bash
# Generate documentation
npm start -- ./src --output ./docs --model gemini

# Global usage
codenarrator ./src --output ./docs --model gemini

# Quick API connectivity test
npm test
```

## Risks & Considerations

* **Cost & Privacy:** Code is transmitted to Gemini; avoid sending sensitive files.
* **Rate Limits:** Retry/backoff and concurrency controls needed for large repos.
* **Binary/Large Files:** Continue filtering non-text or oversized files.

## Conclusion

**CodeNarrator** is now a stable, production-ready CLI tool.
Major updates include lazy AI client initialization, robust error handling, size safeguards, and improved documentation. The system now offers a clean developer experience, efficient performance, and a foundation for future expansion with concurrency and provider flexibility.

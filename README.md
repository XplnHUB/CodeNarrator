# CodeNarrator - Understand Any Codebase Instantly

> An AI-powered CLI & Web tool that automatically explains codebases in plain English.

---

## Vision

**CodeNarrator** aims to bridge the gap between complex code and developer understanding. Whether you're a beginner exploring a new open-source repo, a maintainer reviewing a PR, or an engineer returning to your own old code — CodeNarrator helps you understand any codebase faster and with less effort.

We believe every developer deserves a tool that makes codebases more readable and approachable.

---

## Key Features

- Explain entire codebases using AI
- CLI tool for use in terminal
- Recursive file scanner for JavaScript, TypeScript, Python, and more
- Outputs structured Markdown documentation
- Powered by Gemini or GPT-based AI models
- Planned GitHub PR integration to summarize changes

---

## Tech Stack

| Layer               | Technologies Used                  |
|---------------------|------------------------------------|
| CLI Tool            | Node.js, Commander.js, Chalk       |
| AI Integration      | Gemini API (via Google SDK)        |
| File Scanning       | fs, glob                           |
| Markdown Generation | Markdown, fs-extra                 |
| Web UI (Planned)    | React.js, Tailwind CSS             |
| Automation (Planned)| GitHub Actions, Pre-push Hooks     |

---

## Project Structure

```
CodeNarrator/
|-- bin/
|   `-- cli.js                # CLI entry point
|-- src/
|   |-- analyzer.js           # Scans code and sends to AI (with file size limits)
|   |-- aiEngine.js           # Lazy-loads Gemini client when needed
|   `-- writer.js             # Saves generated Markdown
|-- test-models.js            # Test script (skips gracefully if no API key)
|-- .codenarratorrc.json      # Optional config
|-- .env                      # Your Gemini API key (if using dotenv method)
|-- README.md
`-- package.json

```

---

## Getting Started (CLI)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/CodeNarrator.git
cd CodeNarrator
````

### 2. Install dependencies

```bash
npm install
```

### 3. Add Gemini API Key (Required)

**Option A:** Export in your shell environment (recommended, especially for global installs):

```bash
export GEMINI_API_KEY=your-key
```

**Option B:** Create a `.env` file in the project root:

```bash
echo "GEMINI_API_KEY=your-key" > .env
```

**Option C:** Run commands with inline environment variable:

```bash
GEMINI_API_KEY=your-key codenarrator ./src --output ./docs
```

**For testing:**

```bash
# Test API connectivity
GEMINI_API_KEY=your-key npm test

# Or with dotenv preload
node -r dotenv/config test-models.js
```

### 4. Link CLI globally

```bash
npm link
```

### 5. Run on any codebase

```bash
codenarrator ./src --output ./docs --model=gemini
```

---

## Sample Output

A sample generated file (`docs/utils-logger.md`) might look like this:

```
File: utils/logger.js

Overview:
This file provides logging utilities for the application.

Functions:
- logInfo(msg): Logs informational messages
- logError(err): Logs errors with stack trace

Notes:
Uses 'chalk' for styled terminal output.
```

---

## Use Cases

* Understand unfamiliar open-source projects
* Speed up PR reviews with inline documentation
* Assist students in grasping legacy or complex code
* Help new team members onboard quickly

---

## Roadmap

| Version | Feature                                            |
| ------- | -------------------------------------------------- |
| 1.0     | CLI with basic AI documentation output             |
| 1.1     | GitHub PR summarizer integration (planned)         |
| 1.2     | Multi-language support: JS, Python, etc. (planned) |
| 1.3     | Web UI for drag-and-drop code analysis (planned)   |
| 2.0     | VS Code extension with inline explanations         |
| 2.1     | Team dashboard, history, authentication (planned)  |

---

## Security Note

* Your code is sent to Gemini servers for analysis unless self-hosted.
* Avoid analyzing confidential or proprietary files.
* Configuration files like `.env` are excluded from analysis.
* Files larger than 200KB are automatically skipped to avoid excessive token usage.

---

## Contributing

We welcome contributions from all developers.

* Open issues and feature suggestions
* Participate in [GitHub Discussions](https://github.com/your-username/CodeNarrator/discussions)
* Look for `good first issue` tags to get started

```bash
git checkout -b your-feature-branch
npm run dev
git commit -m "Add: your feature"
```

---

## License

CodeNarrator is licensed under the MIT License.
You are free to use, modify, and distribute it.


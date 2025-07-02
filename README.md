# CodeNarrator – Understand Any Codebase Instantly

> An AI-powered CLI & Web tool that automatically explains codebases in plain English.

---

## Vision

**CodeNarrator** aims to bridge the gap between complex code and developer understanding. Whether you're a beginner exploring a new open-source repo, a maintainer reviewing a PR, or an engineer returning to your own spaghetti code — CodeNarrator helps you understand any codebase faster, smarter, and with less frustration.

We believe **every developer deserves a code buddy** that makes codebases readable and approachable — instantly.

---

##  Key Features

- **Explain Any Codebase** – Analyze entire folders and files using AI
- **CLI Tool** – Run in terminal with simple commands
- **Recursive File Scanner** – Auto-detect `.js`, `.py`, `.ts`, `.java`, etc.
- **Markdown Output** – Generate `.md` docs per file or entire summary
- **AI-Powered** – Uses GPT-4 (or 3.5) to generate clear, structured explanations
- **GitHub PR Integration** *(coming soon)* – Auto-summarize new PR changes
- **VS Code Plugin** *(planned)* – Hover to see explanations inside the editor

---

## Tech Stack

| Layer          | Tech Used                     |
|----------------|-------------------------------|
| CLI Tool       | Node.js, Commander.js, Chalk  |
| AI Integration | OpenAI API (GPT-3.5 / GPT-4)  |
| File Parsing   | fs, glob, AST parser (planned)|
| Web UI         | React.js, Tailwind CSS        |
| Docs Generator | Markdown, fs-extra            |
| Pipeline (Planned) | GitHub Actions, Pre-push Hooks |

---

## Project Architecture

```

CodeNarrator/
├── bin/
│   └── codenarrator.js     # CLI entry point
├── src/
│   ├── fileWalker.js       # Recursively scan codebase
│   ├── parser.js           # Split code into chunks
│   ├── promptEngine.js     # Sends prompt to AI
│   ├── markdownGen.js      # Outputs .md files
├── cli/
│   └── commands.js         # CLI commands using commander
├── .env                    # Your OpenAI API Key
├── README.md
├── package.json

````

---

## ⚙️ How to Use (CLI)

# 1. Clone the repo
```
git clone https://github.com/your-username/CodeNarrator.git
cd CodeNarrator
```
# 2. Install dependencies
```
npm install
```
# 3. Add your OpenAI API Key to .env
```
echo "GEMINI_API_KEY=your-key" > .env
```
# 4. Link CLI tool
```
npm link
```
# 5. Run on any codebase
```
codenarrator ./my-project --output=./docs --model=gemini-pro
```

---

## Sample Output

``
📄 File: utils/logger.js

### Overview
This file provides logging utilities for the application, including info and error logging.

### Functions
- logInfo(msg): Logs standard info messages
- logError(err): Logs errors with stack trace

### Notes
Uses `chalk` for colorized console output.

## Use Cases

* Understand open-source codebases faster
* Help students learn unfamiliar projects
* Assist reviewers during PR reviews
* Onboard new team members with auto-generated code docs

---

## Roadmap

| Phase   | Feature                                          |
| ------- | ------------------------------------------------ |
| ✅ MVP   | Codebase scanner, AI summarizer, markdown export |
| 🟡 v1.1 | PR summarizer GitHub Action                      |
| 🟡 v1.2 | Language selector (JS, Python, etc.)             |
| 🟡 v1.3 | Web UI drag-and-drop                             |
| 🔜 v2.0 | VS Code extension with inline summaries          |
| 🔜 v2.1 | Team dashboard + SaaS (auth, project history)    |

---

## Security Note

* Your code is sent to OpenAI servers for analysis.
* Never upload sensitive or private code unless self-hosted.
* `.env` and config files are excluded by default.

---

## Contributing

We welcome contributions from all developers!

* Open issues or suggestions via GitHub
* Add your ideas to the [Discussions](https://github.com/your-username/CodeNarrator/discussions)
* Use `good first issue` tags to start helping

```bash
git checkout -b your-feature-branch
npm run dev
git commit -m "Add: your feature"
```

---

## License

MIT License — free to use, modify, and share.

---

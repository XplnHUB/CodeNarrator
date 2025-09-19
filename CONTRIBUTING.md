# Contributing to CodeNarrator

Thank you for considering contributing to CodeNarrator.  
This project exists because of contributors like you. We welcome developers of all experience levels — whether it is your first open-source contribution or your 100th.

---

## How You Can Contribute

You can contribute in several ways:

- Bug Fixes — Report or fix issues you encounter.
- New Features — Add functionality like new CLI flags, model support, or integrations.
- Documentation — Improve README, usage examples, or generated docs.
- Testing — Write or improve unit tests for CLI and core modules.
- UI/UX (Future) — Help build the planned React.js web dashboard.

---

## Getting Started

1. Fork the repository  
   Click the "Fork" button at the top right of this repository.

2. Clone your fork  
   ```bash
   git clone https://github.com/<your-username>/CodeNarrator.git
   cd CodeNarrator
   ```


3. Install dependencies

   ```bash
   npm install
   ```

4. (Optional) Configure API Key

   ```bash
   echo "GEMINI_API_KEY=your-key" > .env
   ```

5. Run in development

   ```bash
   npm run dev
   ```

6. Link CLI locally

   ```bash
   npm link
   ```

---

## Contribution Workflow

1. Create a new branch

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
   Follow the existing coding style and keep commits small and focused.

3. Run tests

   ```bash
   npm test
   ```

4. Commit changes

   ```bash
   git commit -m "Add: support for --apikey flag in CLI"
   ```

5. Push branch and open a Pull Request (PR)

   ```bash
   git push origin feature/your-feature-name
   ```

   Then open a PR on GitHub.

---

## Issue Labels

We use labels to help contributors find issues:

* `good first issue` → Beginner-friendly tasks
* `help wanted` → Tasks that need community input
* `enhancement` → Requests for new features
* `bug` → Issues to be fixed
* `documentation` → Documentation improvements

During Hacktoberfest, PRs to issues with these labels count toward your contributions if the repository has the `hacktoberfest` topic.

---

## Code of Conduct

Please follow our [Code of Conduct](./CODE_OF_CONDUCT.md).
We expect contributors to maintain a respectful and inclusive environment.

---

## Guidelines

* Do not commit `.env` or private API keys.
* Add or update tests if you introduce new functionality.
* Open an issue or discussion before starting work on a major feature.
* Ask questions in Issues or Discussions if you are unsure about anything.

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

---

### Thank You

Every contribution — whether code, documentation, or feedback — helps us build a tool that makes codebases more readable and approachable for developers everywhere.


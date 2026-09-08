# Contributing to EthioVuln

Thank you for your interest in contributing. This document outlines the process for reporting bugs, requesting features, and submitting code changes.

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and professional environment. Harassment, offensive language, or disruptive behavior will not be tolerated.

---

## Reporting Bugs

Before opening a bug report, check the [existing issues](https://github.com/melakudeguale9-droid/ethiovuln/issues) to avoid duplicates.

When reporting a bug, include:
- A clear description of the problem
- Steps to reproduce it
- Expected vs actual behavior
- Your OS, Python version, and Node.js version
- Relevant logs or screenshots

---

## Requesting Features

Open an issue with the `enhancement` label. Describe:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you considered

---

## Submitting Pull Requests

1. Fork the repository and create a branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the code style of the existing codebase.

3. Test your changes locally:
   ```bash
   # Backend
   cd backend && source venv/bin/activate
   uvicorn app.main:app --reload

   # Frontend
   cd frontend && npm run dev
   ```

4. Commit with a clear message:
   ```bash
   git commit -m "feat: add rate limiting to scan endpoints"
   ```

5. Push your branch and open a pull request against `main`.

---

## Commit Message Format

Use conventional commits:

| Prefix | When to use |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation change |
| `refactor:` | Code restructure without behavior change |
| `security:` | Security improvement |
| `chore:` | Maintenance, dependency updates |

---

## Security Issues

Do not open public issues for security vulnerabilities. See [SECURITY.md](SECURITY.md) for responsible disclosure instructions.

---

## Legal

By contributing to EthioVuln, you agree that your contributions will be licensed under the [MIT License](LICENSE).

All contributions must be for **authorized security testing purposes only**. Do not contribute code that enables unauthorized access, illegal scanning, or abuse of third-party systems.

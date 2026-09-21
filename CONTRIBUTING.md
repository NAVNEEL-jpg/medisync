# 🤝 Contributing to MediSync

Thank you for your interest in contributing to MediSync! Together, we can build open, interoperable, and life-saving digital emergency health infrastructure.

---

## 🚀 Getting Started

1. **Fork the Repository**: Create a personal fork on GitHub.
2. **Clone your Fork**:
   ```bash
   git clone https://github.com/<your-username>/medisync.git
   cd medisync
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/clinical-triage-enhancement
   ```

---

## 📋 Coding Standards & Guidelines

* **Framework & Language**: Next.js 16 (App Router), React 19, TypeScript (Strict mode enabled).
* **Styling**: Tailwind CSS v4 alongside modular CSS custom properties defined in `src/app/globals.css`.
* **Icons**: Use [Lucide React](https://lucide.dev/) for clinical and navigational icons.
* **Component Design**:
  - Keep components modular and single-responsibility.
  - Follow accessible design standards (WCAG 2.1 AA) with high-contrast text for medical triage displays.
  - Never introduce unverified dependencies or ad-hoc design utilities that conflict with the established palette (`--clr-navy`, `--clr-coral`, `--clr-mint`, `--clr-rose`).

---

## 🧪 Verification & Testing

Before submitting your Pull Request, ensure that:
1. **Linting Passes**:
   ```bash
   npm run lint
   ```
2. **Production Build Compiles**:
   ```bash
   npm run build
   ```
   *Your build must complete with 0 TypeScript or Next.js route errors.*

---

## 📝 Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

* `feat: ...` for a new capability or feature
* `fix: ...` for bug fixes or clinical validation fixes
* `docs: ...` for documentation updates
* `style: ...` for visual styling or CSS token refinement
* `refactor: ...` for code reorganization without behavior change
* `chore: ...` for dependency bumps or config changes

---

## 📬 Pull Request Process

1. Provide a clear, descriptive PR title and summary of changes.
2. Reference any related GitHub issue numbers.
3. Include screenshots or screen recordings for any visual UI modifications.
4. Ensure your branch is rebased cleanly on latest `origin/main`.

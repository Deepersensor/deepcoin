# Contributing to DeepCoin

Welcome! We’re excited to have you contribute to DeepCoin, an AI-powered DeFi platform. This guide will help you get started, follow best practices, and submit high-quality contributions—especially for new integrations.

## Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Adding Integrations](#adding-integrations)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Review Process](#code-review-process)
- [Contact & Discussion](#contact--discussion)

---

## Getting Started

1. **Fork the repository** and clone your fork.
2. **Install dependencies:**
   ```bash
   pnpm install # or npm/yarn/bun
   ```
3. **Set up environment variables:**
   - Copy `.env.sample` to `.env.local` and fill in required API keys (OKX, Solana, Nero, Blockchair, etc).
4. **Run the development server:**
   ```bash
   pnpm dev # or npm run dev, yarn dev, bun dev
   ```
5. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/` — Next.js pages and API routes
- `src/components/` — React components
- `src/hooks/` — Custom React hooks
- `src/lib/` — Integrations, services, and utilities
- `src/provider/` — Context providers
- `public/` — Static assets

## Adding Integrations

We welcome new blockchain, wallet, or data integrations! To add one:

1. **Create a new service or API wrapper** in `src/lib/services/` or `src/lib/api/`.
2. **Add UI components** (if needed) in `src/components/`.
3. **Add API routes** in `src/app/api/` for backend logic.
4. **Update environment variables** in `.env.sample` if new keys are required.
5. **Document your integration** in the README and/or a dedicated markdown file.
6. **Write tests** for your integration logic.

## Coding Standards

- Use **TypeScript** for all code.
- Follow the existing **file and folder structure**.
- Use **ESLint** and **Prettier** for code style (run `pnpm lint`).
- Write clear, descriptive comments and documentation.
- Prefer **functional components** and React hooks.

## Testing

- Add unit and integration tests for new features.
- Use existing test patterns and libraries.
- Ensure all tests pass before submitting a PR.

## Submitting Changes

1. **Create a new branch** for your feature or fix.
2. **Commit your changes** with clear, descriptive messages.
3. **Push your branch** to your fork.
4. **Open a Pull Request** against the main repository.
5. **Describe your changes** and reference any related issues.

## Code Review Process

- All PRs require review and approval.
- Address feedback promptly.
- Squash commits if requested.
- PRs must pass all CI checks before merging.

## Contact & Discussion

- For questions, open an issue or start a discussion in the repository.
- For urgent matters, contact maintainers directly (see README for links).

---

Thank you for contributing to DeepCoin!

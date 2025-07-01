# Copilot Instructions

This file provides guidelines for GitHub Copilot or other AI coding assistants when working in this project.

## General Principles

- Prioritize code quality, modularity, and maintainability.
- All UI should be responsive and mobile-friendly.
- Use Material UI (MUI) components for all new UI elements.
- Remove or refactor legacy or unused code/components.
- Keep CSS clean, minimal, and theme-aware (use CSS variables set from the MUI theme).
- Ensure accessibility (keyboard navigation, ARIA labels, etc.).

## When Refactoring or Adding Features

- Place new UI logic in the appropriate `src/components/` file.
- Place new game logic or utilities in `src/services/`.
- Do not mix solver/benchmarking logic into the main app UI.
- Use React hooks and functional components only.
- Use TypeScript types for all props and state.
- Keep the board and controls visually aligned and matching in width.
- Use MUI's ThemeProvider and CssBaseline for theme support.
- When adding new CSS, prefer using theme variables and avoid hardcoded colors.

## When Editing CSS

- Remove unused selectors.
- Order selectors by app flow (top-level layout, navigation, board, controls, etc.).
- Use CSS variables for all colors and backgrounds.
- Ensure all elements use `box-sizing: border-box`.

## When Adding Documentation

- Place user-facing instructions in `README.md`.
- Place Copilot/AI instructions in this file (`instructions.md`).

## Linting and Formatting

- Use ESLint for code quality and best practices. Run `npm run lint` to check for issues, and `npm run lint:fix` to auto-fix.
- Use Prettier for code formatting. Run `npm run format` or enable format on save in your editor (see `.vscode/settings.json`).
- ESLint and Prettier are configured to work together; formatting rules are handled by Prettier, and code quality by ESLint.
- If you add new files or folders, ensure they are included in lint and format scripts as needed.

## When in Doubt

- Ask for clarification or suggest best practices.
- Always prefer clarity, accessibility, and maintainability.

---

This file is for AI assistant use only. Do not include in user-facing documentation.

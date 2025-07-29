# GitHub Copilot Instructions for This Project

## General Guidelines

- Prioritize code quality, modularity, and maintainability.
- Use TypeScript for all new code and types for all props and state.
- Use React functional components and hooks only.
- All UI should be responsive and mobile-friendly.
- Use Material UI (MUI) components for all new UI elements.
- Remove or refactor legacy or unused code/components.
- Keep CSS clean, minimal, and theme-aware (use CSS variables set from the MUI theme).
- Ensure accessibility (keyboard navigation, ARIA labels, etc.).

## When Refactoring or Adding Features

- Place new UI logic in the appropriate `src/components/` file.
- Place new game logic or utilities in `src/services/`.
- Do not mix solver/benchmarking logic into the main app UI.
- Keep the board and controls visually aligned and matching in width.
- Use MUI's ThemeProvider and CssBaseline for theme support.
- When adding new CSS, prefer using theme variables and avoid hardcoded colors.
- The game uses persistent state management via localStorage to save progress between page refreshes.
- Game state is automatically saved after each move and when the page becomes hidden (screen off).

## When Editing CSS

- Remove unused selectors.
- Order selectors by app flow (top-level layout, navigation, board, controls, etc.).
- Use CSS variables for all colors and backgrounds.
- Ensure all elements use `box-sizing: border-box`.

## When Adding Documentation

- Document all exported functions, types, and components with JSDoc or TypeScript doc comments.
- Update the README with any new features or changes to usage.

## Testing

- Write or update tests for all new features and bug fixes.
- Use Vitest and React Testing Library for all tests.
- Place tests in the appropriate `src/services/__tests__/` or `src/components/__tests__/` folder.

## Persistent State Management

- The game automatically saves progress to localStorage after each move.
- State includes: board layout, board size, move count, timer, game ID, and timestamp.
- State is cleared when the game is completed or when starting a new game.
- State expires after 24 hours to prevent stale game restoration.
- Handle localStorage errors gracefully (quota exceeded, privacy mode, etc.).
- The game resumes automatically when the page loads if valid state exists.

## Docker & CI

- Ensure the Dockerfile always uses the correct build output folder (`dist`).
- Keep `.dockerignore` and `.gitignore` up to date with all build and dependency folders.
- CI should run lint, test, and build steps on every PR.

## Copilot Usage

- Use Copilot suggestions as a starting point, but always review and refactor for clarity and maintainability.
- Do not accept Copilot code that introduces security, accessibility, or performance issues.
- Prefer explicit, readable code over clever one-liners.

---

For any questions, refer to the main `instructions.md` in the project root or ask a maintainer.

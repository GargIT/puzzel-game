# 15 Puzzle Game – Modern React/MUI Edition

A modern, responsive web implementation of the classic 15-puzzle (sliding tile puzzle) game, built with React and Material UI (MUI).

## Features

- Play the sliding tile puzzle in sizes from 3x3 up to 7x7
- Responsive, mobile-friendly design
- Modern UI using Material UI (MUI)
- Light and dark mode support (auto-detects system preference)
- **Persistent game state** - automatically saves progress and resumes after page refresh or screen timeout
- Scoreboard with best times and moves
- Accessible controls and keyboard navigation
- Theme-aware custom styles

## How to Play

1. Select your desired board size using the tabs below the toolbar.
2. Click or tap tiles adjacent to the empty space to slide them.
3. Arrange the tiles in order (1, 2, 3, ..., N) to win.
4. Your time and move count are tracked.
5. Use the reset button in the toolbar to start a new game at any time.
6. Open the scoreboard drawer to view best scores.

**Note:** Your game progress is automatically saved! If your screen turns off or the page refreshes, your game will resume exactly where you left off (board layout, timer, and move count). This state is cleared when you complete a game or start a new one.

## Changing Theme (Light/Dark Mode)

- The app automatically follows your system's light/dark mode.
- To test in Chrome: Open DevTools → More tools → Rendering → Emulate CSS media feature prefers-color-scheme.

## Project Structure

- `src/` – Main React source code
  - `App.tsx` – Main app component, theme logic
  - `components/` – UI components (Board, Toolbar, Tabs, etc.)
  - `services/` – Game logic and utilities
  - `App.css` – Custom theme-aware styles
- `public/` – Static assets and HTML
- `backend/` – (Optional) Node.js backend for storing scores

## Development

- Install dependencies: `npm install`
- Start the app: `npm run dev`
- Build for production: `npm run build`

## Accessibility & Responsiveness

- All controls are keyboard accessible
- Layout adapts to all screen sizes

## Customization

- You can easily adjust colors, board sizes, or add new features by editing the React components and theme in `src/`.

---

Enjoy solving the puzzle!

// src/services/gameState.ts

export interface GameState {
  board: (number | null)[];
  boardSize: number;
  moveCount: number;
  timer: number;
  isTimerRunning: boolean;
  gameId: string; // Unique ID for each game session
  timestamp: number; // When the state was saved
}

const GAME_STATE_KEY = "fifteen-game-state";

/**
 * Save the current game state to localStorage
 */
export function saveGameState(state: Omit<GameState, "timestamp">): void {
  const stateWithTimestamp: GameState = {
    ...state,
    timestamp: Date.now(),
  };

  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(stateWithTimestamp));
  } catch (error) {
    console.warn("Failed to save game state:", error);
  }
}

/**
 * Load the saved game state from localStorage
 * Returns null if no valid state exists or if the state is too old (>24 hours)
 */
export function loadGameState(): GameState | null {
  try {
    const savedState = localStorage.getItem(GAME_STATE_KEY);
    if (!savedState) {
      return null;
    }

    const state: GameState = JSON.parse(savedState);

    // Check if the state is too old (24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const age = Date.now() - state.timestamp;

    if (age > maxAge) {
      clearGameState();
      return null;
    }

    // Validate the state structure
    const isValid = isValidGameState(state);

    if (!isValid) {
      clearGameState();
      return null;
    }

    return state;
  } catch (error) {
    console.warn("Failed to load game state:", error);
    clearGameState();
    return null;
  }
}

/**
 * Clear the saved game state
 */
export function clearGameState(): void {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
  } catch (error) {
    console.warn("Failed to clear game state:", error);
  }
}

/**
 * Generate a unique game ID
 */
export function generateGameId(): string {
  return `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate that the loaded state has the correct structure
 */
function isValidGameState(state: any): state is GameState {
  return (
    state &&
    typeof state === "object" &&
    Array.isArray(state.board) &&
    typeof state.boardSize === "number" &&
    typeof state.moveCount === "number" &&
    typeof state.timer === "number" &&
    typeof state.isTimerRunning === "boolean" &&
    typeof state.gameId === "string" &&
    typeof state.timestamp === "number" &&
    state.boardSize >= 3 &&
    state.boardSize <= 7 &&
    state.board.length === state.boardSize * state.boardSize &&
    state.moveCount >= 0 &&
    state.timer >= 0
  );
}

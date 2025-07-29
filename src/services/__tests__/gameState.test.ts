// src/services/__tests__/gameState.test.ts

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  saveGameState,
  loadGameState,
  clearGameState,
  generateGameId,
} from "../gameState";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

describe("gameState service", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  afterEach(() => {
    clearGameState();
  });

  describe("saveGameState and loadGameState", () => {
    it("saves and loads game state correctly", () => {
      const gameState = {
        board: [1, 2, 3, 4, 5, 6, 7, 8, null],
        boardSize: 3,
        moveCount: 5,
        timer: 30,
        isTimerRunning: true,
        gameId: "test-game-id",
      };

      saveGameState(gameState);
      const loadedState = loadGameState();

      expect(loadedState).not.toBeNull();
      expect(loadedState?.board).toEqual(gameState.board);
      expect(loadedState?.boardSize).toBe(gameState.boardSize);
      expect(loadedState?.moveCount).toBe(gameState.moveCount);
      expect(loadedState?.timer).toBe(gameState.timer);
      expect(loadedState?.isTimerRunning).toBe(gameState.isTimerRunning);
      expect(loadedState?.gameId).toBe(gameState.gameId);
      expect(loadedState?.timestamp).toBeDefined();
    });

    it("returns null when no saved state exists", () => {
      const loadedState = loadGameState();
      expect(loadedState).toBeNull();
    });

    it("returns null for invalid state structure", () => {
      // Save invalid state manually
      localStorageMock.setItem(
        "fifteen-game-state",
        JSON.stringify({
          board: "invalid",
          boardSize: "invalid",
        })
      );

      const loadedState = loadGameState();
      expect(loadedState).toBeNull();
    });

    it("returns null for state that is too old (>24 hours)", () => {
      const oldTimestamp = Date.now() - 25 * 60 * 60 * 1000; // 25 hours ago
      const gameState = {
        board: [1, 2, 3, 4, 5, 6, 7, 8, null],
        boardSize: 3,
        moveCount: 5,
        timer: 30,
        isTimerRunning: true,
        gameId: "test-game-id",
        timestamp: oldTimestamp,
      };

      localStorageMock.setItem("fifteen-game-state", JSON.stringify(gameState));
      const loadedState = loadGameState();
      expect(loadedState).toBeNull();
    });
  });

  describe("clearGameState", () => {
    it("removes saved game state", () => {
      const gameState = {
        board: [1, 2, 3, 4, 5, 6, 7, 8, null],
        boardSize: 3,
        moveCount: 5,
        timer: 30,
        isTimerRunning: true,
        gameId: "test-game-id",
      };

      saveGameState(gameState);
      expect(loadGameState()).not.toBeNull();

      clearGameState();
      expect(loadGameState()).toBeNull();
    });
  });

  describe("generateGameId", () => {
    it("generates unique game IDs", () => {
      const id1 = generateGameId();
      const id2 = generateGameId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^game-\d+-[a-z0-9]+$/);
      expect(id2).toMatch(/^game-\d+-[a-z0-9]+$/);
    });
  });

  describe("error handling", () => {
    it("handles localStorage errors gracefully during save", () => {
      // Mock localStorage to throw an error
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem = () => {
        throw new Error("Storage full");
      };

      const gameState = {
        board: [1, 2, 3, 4, 5, 6, 7, 8, null],
        boardSize: 3,
        moveCount: 5,
        timer: 30,
        isTimerRunning: true,
        gameId: "test-game-id",
      };

      // Should not throw
      expect(() => saveGameState(gameState)).not.toThrow();

      // Restore original method
      localStorageMock.setItem = originalSetItem;
    });

    it("handles localStorage errors gracefully during load", () => {
      // Mock localStorage to throw an error
      const originalGetItem = localStorageMock.getItem;
      localStorageMock.getItem = () => {
        throw new Error("Storage error");
      };

      // Should not throw and should return null
      const result = loadGameState();
      expect(result).toBeNull();

      // Restore original method
      localStorageMock.getItem = originalGetItem;
    });
  });
});

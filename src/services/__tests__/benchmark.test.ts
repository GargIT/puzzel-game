import { describe, it, expect } from 'vitest';
import { solveWithHeuristic, heuristics } from '../benchmark';

describe('solveWithHeuristic', () => {
  it('solves a simple 3x3 puzzle', () => {
    // Solved board
    const solved = [1,2,3,4,5,6,7,8,null];
    const result = solveWithHeuristic(solved, 3, heuristics[0].fn);
    expect(result.solved).toBe(true);
    expect(result.moves).toEqual([]);
  });

  it('returns unsolved for impossible board', () => {
    // Impossible board (swapped 1 and 2)
    const unsolvable = [2,1,3,4,5,6,7,8,null];
    const result = solveWithHeuristic(unsolvable, 3, heuristics[0].fn, 1000);
    expect(result.solved).toBe(false);
  });

  it('works for all heuristics', () => {
    const board = [1,2,3,4,5,6,7,null,8]; // One move away
    for (const h of heuristics) {
      const result = solveWithHeuristic(board, 3, h.fn);
      expect(result.solved).toBe(true);
      expect(result.moves?.length).toBe(1);
    }
  });
});

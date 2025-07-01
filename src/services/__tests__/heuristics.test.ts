import { describe, it, expect } from 'vitest';
import { manhattanHeuristic, linearConflictHeuristic, advancedHeuristicDescriptor, allHeuristics, heuristicNames } from '../heuristics';

describe('heuristics module', () => {
  it('exports all heuristics with correct names', () => {
    expect(allHeuristics.length).toBe(3);
    expect(heuristicNames).toEqual([
      'Manhattan',
      'Manhattan + Linear Conflict',
      'Advanced (Manhattan + Linear + Corners)'
    ]);
  });

  it('manhattanHeuristic returns correct value', () => {
    const arr = new Uint8Array([1,2,3,4,5,6,7,8,0]);
    expect(manhattanHeuristic.fn(arr, 3)).toBe(0);
  });

  it('linearConflictHeuristic returns correct value', () => {
    const arr = new Uint8Array([1,2,3,4,5,6,7,8,0]);
    expect(linearConflictHeuristic.fn(arr, 3)).toBe(0);
  });

  it('advancedHeuristicDescriptor returns correct value', () => {
    const arr = new Uint8Array([1,2,3,4,5,6,7,8,0]);
    expect(advancedHeuristicDescriptor.fn(arr, 3)).toBe(0);
  });
});

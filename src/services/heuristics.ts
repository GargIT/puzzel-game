// src/services/heuristics.ts
import { manhattanDistance, linearConflict, advancedHeuristic } from "./solver";
import { HeuristicFn, HeuristicDescriptor } from "./benchmark";

export const manhattanHeuristic: HeuristicDescriptor = {
  name: 'Manhattan',
  fn: (b, s) => manhattanDistance(b, s),
};

export const linearConflictHeuristic: HeuristicDescriptor = {
  name: 'Manhattan + Linear Conflict',
  fn: (b, s) => manhattanDistance(b, s) + linearConflict(b, s),
};

export const advancedHeuristicDescriptor: HeuristicDescriptor = {
  name: 'Advanced (Manhattan + Linear + Corners)',
  fn: (b, s) => advancedHeuristic(b, s),
};

export const allHeuristics: HeuristicDescriptor[] = [
  manhattanHeuristic,
  linearConflictHeuristic,
  advancedHeuristicDescriptor,
];

export const heuristicNames = allHeuristics.map(h => h.name);

// src/services/benchmark.ts
import { allHeuristics, heuristicNames } from "./heuristics";
import { MinHeap, PuzzleState, isSolved, getNeighbors, boardKeyCompact } from "./solver";

/**
 * Type for a heuristic function operating on a puzzle board.
 */
export type HeuristicFn = (b: Uint8Array, s: number) => number;

/**
 * Type for a heuristic descriptor (name and function).
 */
export interface HeuristicDescriptor {
  name: string;
  fn: HeuristicFn;
}

/**
 * List of available heuristics for benchmarking.
 */
export const heuristics = allHeuristics;

/**
 * Result type for solveWithHeuristic.
 */
export interface HeuristicSolveResult {
  moves: string[] | null;
  steps: number;
  solved: boolean;
}

/**
 * Solve a sliding puzzle using a given heuristic function.
 * @param startBoard The starting board as an array of numbers/null.
 * @param size The board size (NxN).
 * @param heuristic The heuristic function to use.
 * @param maxSteps Maximum number of search steps (default 200000).
 * @param boardKeyFn Optional custom board key function (default: boardKeyCompact).
 * @returns HeuristicSolveResult
 */
export function solveWithHeuristic(
  startBoard: (number | null)[],
  size: number,
  heuristic: HeuristicFn,
  maxSteps = 200000,
  boardKeyFn: (b: Uint8Array) => string = boardKeyCompact
): HeuristicSolveResult {
  const arr = new Uint8Array(startBoard.map(x => x === null ? 0 : x));
  const start: PuzzleState = {
    board: arr,
    size,
    moves: [],
    cost: 0,
    est: heuristic(arr, size),
  };
  const visited = new Set<string>();
  const openSet = new MinHeap<PuzzleState>(s => s.cost + s.est);
  openSet.push(start);
  let steps = 0;
  while (openSet.length > 0 && steps < maxSteps) {
    const curr = openSet.pop()!;
    if (isSolved(curr.board)) return { moves: curr.moves, steps, solved: true };
    visited.add(boardKeyFn(curr.board));
    for (const neighbor of getNeighbors(curr)) {
      const key = boardKeyFn(neighbor.board);
      if (!visited.has(key)) {
        neighbor.est = heuristic(neighbor.board, size);
        openSet.push(neighbor);
      }
    }
    steps++;
  }
  return { moves: null, steps, solved: false };
}

/**
 * Run all heuristics on a given board and size, returning timing and result for each.
 * @param startBoard The starting board.
 * @param size The board size.
 * @param maxSteps Max search steps per heuristic.
 * @returns Array of results with heuristic name, time, moves, steps, solved.
 */
export async function runBenchmarks(
  startBoard: (number | null)[],
  size: number,
  maxSteps = 200000
) {
  const results = [];
  for (const h of heuristics) {
    const t0 = performance.now();
    const res = solveWithHeuristic(startBoard, size, h.fn, maxSteps);
    const t1 = performance.now();
    results.push({
      name: h.name,
      time: (t1 - t0).toFixed(1),
      moves: res.moves ? res.moves.length : '-',
      steps: res.steps,
      solved: res.solved,
    });
  }
  return results;
}

/**
 * Export just the heuristic names for UI use.
 */
export { heuristicNames };

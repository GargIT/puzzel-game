import { useState, useCallback } from 'react';
import { solveSlidingPuzzle } from './solver';
import { applyMove } from './moveUtils';

export interface UseSolverResult {
  solution: string[] | null;
  solutionBoards: (number | null)[][];
  solutionStep: number;
  solverTime: number | null;
  solving: boolean;
  runSolver: (board: (number | null)[], boardSize: number, maxSteps?: number) => void;
  handleNextMove: () => void;
  resetSolution: () => void;
}

export function useSolver() : UseSolverResult {
  const [solution, setSolution] = useState<string[] | null>(null);
  const [solutionBoards, setSolutionBoards] = useState<(number | null)[][]>([]);
  const [solutionStep, setSolutionStep] = useState<number>(0);
  const [solverTime, setSolverTime] = useState<number | null>(null);
  const [solving, setSolving] = useState(false);

  const runSolver = useCallback((board: (number | null)[], boardSize: number, maxSteps: number = 20000) => {
    setSolving(true);
    setTimeout(() => {
      setSolutionBoards([board]);
      const t0 = performance.now();
      const result = solveSlidingPuzzle(board, boardSize, maxSteps);
      const t1 = performance.now();
      setSolverTime(t1 - t0);
      setSolution(result);
      setSolving(false);
    }, 100);
  }, []);

  const handleNextMove = useCallback(() => {
    if (!solution || solutionStep >= solution.length || !solutionBoards[solutionStep + 1]) return;
    setSolutionStep(step => step + 1);
  }, [solution, solutionStep, solutionBoards]);

  const resetSolution = useCallback(() => {
    setSolution(null);
    setSolutionBoards([]);
    setSolverTime(null);
    setSolutionStep(0);
  }, []);

  return {
    solution,
    solutionBoards,
    solutionStep,
    solverTime,
    solving,
    runSolver,
    handleNextMove,
    resetSolution,
  };
}

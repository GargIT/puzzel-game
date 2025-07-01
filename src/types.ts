// src/types.ts
export type ScoreEntry = { time: number; moves: number };
export type TopScores = { time: ScoreEntry[]; moves: ScoreEntry[] };
export type BenchmarkResult = {
  name: string;
  time: string;
  moves: number | string;
  steps: number;
  solved: boolean;
};

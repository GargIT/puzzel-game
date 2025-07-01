import { useCallback } from "react";

export type GameStats = {
  totalGames: number;
  minMoves: number;
  maxMoves: number;
  avgMoves: number;
  minTime: number;
  maxTime: number;
  avgTime: number;
};

export type StatsBySize = {
  [size: number]: GameStats;
};

const defaultStats: GameStats = {
  totalGames: 0,
  minMoves: 0,
  maxMoves: 0,
  avgMoves: 0,
  minTime: 0,
  maxTime: 0,
  avgTime: 0,
};

function getStatsKey(size: number) {
  return `fifteen-stats-${size}`;
}

export function getStats(size: number): GameStats {
  const raw = localStorage.getItem(getStatsKey(size));
  if (!raw) return { ...defaultStats };
  return { ...defaultStats, ...JSON.parse(raw) };
}

export function saveStats(size: number, stats: GameStats) {
  localStorage.setItem(getStatsKey(size), JSON.stringify(stats));
}

export function useStats(size: number) {
  // Returns current stats and an update function
  const updateStats = useCallback((moves: number, time: number) => {
    const prev = getStats(size);
    const totalGames = prev.totalGames + 1;
    const minMoves = prev.totalGames === 0 ? moves : Math.min(prev.minMoves, moves);
    const maxMoves = prev.totalGames === 0 ? moves : Math.max(prev.maxMoves, moves);
    const avgMoves = ((prev.avgMoves * prev.totalGames) + moves) / totalGames;
    const minTime = prev.totalGames === 0 ? time : Math.min(prev.minTime, time);
    const maxTime = prev.totalGames === 0 ? time : Math.max(prev.maxTime, time);
    const avgTime = ((prev.avgTime * prev.totalGames) + time) / totalGames;
    const stats: GameStats = {
      totalGames,
      minMoves,
      maxMoves,
      avgMoves,
      minTime,
      maxTime,
      avgTime,
    };
    saveStats(size, stats);
    return stats;
  }, [size]);

  return { get: () => getStats(size), update: updateStats };
}

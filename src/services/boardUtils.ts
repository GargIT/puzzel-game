// src/services/boardUtils.ts

// Helper to check if a board is solvable
export function isSolvable(board: (number | null)[], size: number): boolean {
  let inversions = 0;
  const arr = board.filter((n) => n !== null) as number[];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) inversions++;
    }
  }
  if (size % 2 === 1) {
    // Odd grid: solvable if inversions is even
    return inversions % 2 === 0;
  } else {
    // Even grid: blank on row from bottom (starting at 1)
    const emptyIndex = board.indexOf(null);
    const emptyRowFromBottom = size - Math.floor(emptyIndex / size);
    if (emptyRowFromBottom % 2 === 0) {
      return inversions % 2 === 1;
    } else {
      return inversions % 2 === 0;
    }
  }
}

export function createBoard(size: number): (number | null)[] {
  let board: (number | null)[];
  do {
    board = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
    board.push(null); // Empty space
    for (let i = board.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [board[i], board[j]] = [board[j], board[i]];
    }
  } while (!isSolvable(board, size));
  return board;
}

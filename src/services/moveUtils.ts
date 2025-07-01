// src/services/moveUtils.ts
/**
 * Returns the move direction string for a tile index relative to the empty space.
 */
export function getMoveDirection(index: number, emptyIndex: number, size: number): string | null {
  const emptyRow = Math.floor(emptyIndex / size);
  const emptyCol = emptyIndex % size;
  const indexRow = Math.floor(index / size);
  const indexCol = index % size;

  // Return the direction the empty space would move to reach the tile at index
  if (emptyRow === indexRow && emptyCol === indexCol - 1) return 'left';
  if (emptyRow === indexRow && emptyCol === indexCol + 1) return 'right';
  if (emptyCol === indexCol && emptyRow === indexRow - 1) return 'up';
  if (emptyCol === indexCol && emptyRow === indexRow + 1) return 'down';
  return null;
}

/**
 * Applies a move to a board and returns the new board state.
 */
export function applyMove(board: (number | null)[], move: string, size: number): (number | null)[] {
  const newBoard = [...board];
  const emptyIndex = newBoard.indexOf(null);
  let swapIndex = -1;
  if (move === 'up') swapIndex = emptyIndex - size;
  if (move === 'down') swapIndex = emptyIndex + size;
  if (move === 'left') swapIndex = emptyIndex - 1;
  if (move === 'right') swapIndex = emptyIndex + 1;
  if (swapIndex >= 0 && swapIndex < size * size) {
    [newBoard[emptyIndex], newBoard[swapIndex]] = [newBoard[swapIndex], newBoard[emptyIndex]];
  }
  return newBoard;
}

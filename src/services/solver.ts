// src/services/solver.ts

export interface PuzzleState {
  board: Uint8Array;
  size: number;
  moves: string[];
  cost: number;
  est: number;
}

export function manhattanDistance(board: Uint8Array, size: number): number {
  let dist = 0;
  for (let i = 0; i < board.length; i++) {
    const val = board[i];
    if (val === 0) continue;
    const goalRow = Math.floor((val - 1) / size);
    const goalCol = (val - 1) % size;
    const currRow = Math.floor(i / size);
    const currCol = i % size;
    dist += Math.abs(goalRow - currRow) + Math.abs(goalCol - currCol);
  }
  return dist;
}

export function linearConflict(board: Uint8Array, size: number): number {
  let conflict = 0;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const idx = row * size + col;
      const val = board[idx];
      if (val === 0) continue;
      const goalRow = Math.floor((val - 1) / size);
      if (goalRow === row) {
        for (let col2 = col + 1; col2 < size; col2++) {
          const idx2 = row * size + col2;
          const val2 = board[idx2];
          if (val2 === 0) continue;
          const goalRow2 = Math.floor((val2 - 1) / size);
          if (goalRow2 === row && val > val2) conflict++;
        }
      }
    }
  }
  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size; row++) {
      const idx = row * size + col;
      const val = board[idx];
      if (val === 0) continue;
      const goalCol = (val - 1) % size;
      if (goalCol === col) {
        for (let row2 = row + 1; row2 < size; row2++) {
          const idx2 = row2 * size + col;
          const val2 = board[idx2];
          if (val2 === 0) continue;
          const goalCol2 = (val2 - 1) % size;
          if (goalCol2 === col && val > val2) conflict++;
        }
      }
    }
  }
  return conflict * 2;
}

export function cornerTilesHeuristic(board: Uint8Array, size: number): number {
  let penalty = 0;
  if (board[0] !== 1) {
    if (board[1] !== 2) penalty++;
    if (board[size] !== size + 1) penalty++;
  }
  const tr = size - 1;
  if (board[tr] !== size) {
    if (board[tr - 1] !== size - 1) penalty++;
    if (board[tr + size] !== 2 * size) penalty++;
  }
  const bl = (size - 1) * size;
  if (board[bl] !== (size - 1) * size + 1) {
    if (board[bl + 1] !== (size - 1) * size + 2) penalty++;
    if (board[bl - size] !== bl - size + 1) penalty++;
  }
  const br = size * size - 1;
  if (board[br] !== 0) {
    if (board[br - 1] !== br) penalty++;
    if (board[br - size] !== br - size + 1) penalty++;
  }
  return penalty * 2;
}

export function advancedHeuristic(board: Uint8Array, size: number): number {
  return manhattanDistance(board, size) + linearConflict(board, size) + cornerTilesHeuristic(board, size);
}

export function getNeighbors(state: PuzzleState): PuzzleState[] {
  const { board, size, moves, cost } = state;
  const empty = board.indexOf(0);
  const row = Math.floor(empty / size);
  const col = empty % size;
  const directions = [
    { dr: -1, dc: 0, move: 'up', opposite: 'down' },
    { dr: 1, dc: 0, move: 'down', opposite: 'up' },
    { dr: 0, dc: -1, move: 'left', opposite: 'right' },
    { dr: 0, dc: 1, move: 'right', opposite: 'left' },
  ];
  const neighbors: PuzzleState[] = [];
  const lastMove = moves.length > 0 ? moves[moves.length - 1] : null;
  for (const { dr, dc, move, opposite } of directions) {
    if (lastMove && move === opposite) continue;
    const newRow = row + dr;
    const newCol = col + dc;
    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
      const newEmpty = newRow * size + newCol;
      const newBoard = board.slice();
      newBoard[empty] = newBoard[newEmpty];
      newBoard[newEmpty] = 0;
      neighbors.push({
        board: newBoard,
        size,
        moves: [...moves, move],
        cost: cost + 1,
        est: 0,
      });
    }
  }
  return neighbors;
}

export function isSolved(board: Uint8Array): boolean {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[board.length - 1] === 0;
}

// Compact board key for NxN
export function boardKeyCompact(board: Uint8Array): string {
  return String.fromCharCode(...board);
}

// BigInt key for 4x4
export function boardKeyBigInt(board: Uint8Array): bigint {
  let key = 0n;
  for (let i = 0; i < 16; i++) {
    key = (key << 4n) | BigInt(board[i]);
  }
  return key;
}

// MinHeap class (same as before)
export class MinHeap<T> {
  private heap: T[] = [];
  private score: (item: T) => number;
  constructor(score: (item: T) => number) {
    this.score = score;
  }
  push(item: T) {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }
  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const end = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    return top;
  }
  get length() {
    return this.heap.length;
  }
  private bubbleUp(n: number) {
    const item = this.heap[n];
    while (n > 0) {
      const parentN = Math.floor((n + 1) / 2) - 1;
      const parent = this.heap[parentN];
      if (this.score(item) >= this.score(parent)) break;
      this.heap[parentN] = item;
      this.heap[n] = parent;
      n = parentN;
    }
  }
  private sinkDown(n: number) {
    const length = this.heap.length;
    const item = this.heap[n];
    while (true) {
      let child2N = (n + 1) * 2;
      let child1N = child2N - 1;
      let swap: number | null = null;
      if (child1N < length) {
        const child1 = this.heap[child1N];
        if (this.score(child1) < this.score(item)) swap = child1N;
      }
      if (child2N < length) {
        const child2 = this.heap[child2N];
        if (
          this.score(child2) < (swap === null ? this.score(item) : this.score(this.heap[child1N]))
        ) swap = child2N;
      }
      if (swap === null) break;
      this.heap[n] = this.heap[swap];
      this.heap[swap] = item;
      n = swap;
    }
  }
}

// Main solver
export function solveSlidingPuzzle(
  startBoard: (number | null)[],
  size: number,
  maxSteps = 200000
): string[] | null {
  const arr = new Uint8Array(startBoard.map(x => x === null ? 0 : x));
  const start: PuzzleState = {
    board: arr,
    size,
    moves: [],
    cost: 0,
    est: advancedHeuristic(arr, size),
  };
  const visited4x4 = size === 4 ? new Map<bigint, number>() : undefined;
  const visitedMap = size !== 4 ? new Map<string, number>() : undefined;
  const openSet = new MinHeap<PuzzleState>(s => s.cost + s.est);
  openSet.push(start);
  let steps = 0;
  while (openSet.length > 0 && steps < maxSteps) {
    const curr = openSet.pop()!;
    if (isSolved(curr.board)) return curr.moves;
    if (size === 4) {
      const key = boardKeyBigInt(curr.board);
      if (visited4x4!.has(key) && visited4x4!.get(key)! <= curr.cost) continue;
      visited4x4!.set(key, curr.cost);
    } else {
      const key = boardKeyCompact(curr.board);
      if (visitedMap!.has(key) && visitedMap!.get(key)! <= curr.cost) continue;
      visitedMap!.set(key, curr.cost);
    }
    for (const neighbor of getNeighbors(curr)) {
      if (size === 4) {
        const key = boardKeyBigInt(neighbor.board);
        if (!visited4x4!.has(key) || neighbor.cost < visited4x4!.get(key)!) {
          neighbor.est = advancedHeuristic(neighbor.board, size);
          openSet.push(neighbor);
        }
      } else {
        const key = boardKeyCompact(neighbor.board);
        if (!visitedMap!.has(key) || neighbor.cost < visitedMap!.get(key)!) {
          neighbor.est = advancedHeuristic(neighbor.board, size);
          openSet.push(neighbor);
        }
      }
    }
    steps++;
  }
  return null;
}

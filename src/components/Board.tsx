import React, { useMemo } from "react";
import { getMoveDirection } from "../services/moveUtils";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";

type BoardProps = {
  board: (number | null)[];
  boardSize: number;
  getNextMoveIndex?: () => number | null;
  solution?: string[] | null;
  solutionStep?: number;
  // eslint-disable-next-line no-unused-vars
  moveTile: (index: number) => void;
};

const Board: React.FC<BoardProps> = ({
  board,
  boardSize,
  getNextMoveIndex,
  moveTile,
}) => {
  // Memoize empty index to avoid multiple indexOf calls
  const emptyIndex = useMemo(() => board.indexOf(null), [board]);

  // Helper to check if a tile is movable (adjacent to the empty space)
  const isMovable = (index: number) => {
    return getMoveDirection(index, emptyIndex, boardSize) !== null;
  };

  // Memoize tile states to avoid recalculating on every render
  const tileStates = useMemo(() => {
    const nextMoveIndex = getNextMoveIndex ? getNextMoveIndex() : null;

    // Find the next tile in order that is not in place
    let nextNum = 1;
    for (; nextNum <= board.length; nextNum++) {
      if (board[nextNum - 1] !== nextNum) break;
    }

    return board.map((num, index) => ({
      num,
      index,
      isMovable: isMovable(index),
      highlight: nextMoveIndex === index,
      isCorrect: num !== null && index === num - 1,
      isNextTarget: num !== null && num === nextNum && index !== num - 1,
    }));
  }, [board, emptyIndex, boardSize, getNextMoveIndex]);

  // Memoize tile button styles
  const tileButtonStyles = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      aspectRatio: "1 / 1",
      fontSize: "clamp(0.8rem, 8vw, 3.5vh)",
      fontWeight: 700,
      borderRadius: 2,
      userSelect: "none",
      transition: "background 0.2s, box-shadow 0.2s",
      backgroundColor: "var(--mui-primary, #007bff)",
      color: "var(--mui-on-primary, #fff)",
    }),
    []
  );

  // Memoize grid styles
  const gridStyles = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
      gridTemplateRows: `repeat(${boardSize}, 1fr)`,
      gap: 0.5,
      width: "100%",
      minWidth: 0,
      minHeight: 0,
      aspectRatio: "1 / 1",
      height: "min(100vw - 16px, 48vh - 16px)",
      maxWidth: "min(100vw - 16px, 48vh - 16px)",
      maxHeight: "min(100vw - 16px, 48vh - 16px)",
      margin: "20px auto",
      "--board-max-width": "min(100vw - 16px, 48vh - 16px)",
    }),
    [boardSize]
  );

  return (
    <Box sx={gridStyles}>
      {tileStates.map(
        ({
          num,
          index,
          isMovable: tileIsMovable,
          highlight,
          isCorrect,
          isNextTarget,
        }) => {
          return num === null ? (
            <Box
              key={index}
              sx={{ width: "100%", height: "100%" }}
              className="tile empty"
            />
          ) : (
            <ButtonBase
              key={index}
              className={`tile${
                highlight ? " highlight-move" : ""
              }${isCorrect ? " correct-tile" : ""}${
                isNextTarget ? " next-target-tile" : ""
              }`}
              onClick={() => tileIsMovable && moveTile(index)}
              disabled={!tileIsMovable}
              sx={tileButtonStyles}
              tabIndex={tileIsMovable ? 0 : -1}
              onKeyUp={(e) =>
                e.key === "Enter" && tileIsMovable && moveTile(index)
              }
              aria-disabled={!tileIsMovable}
              role="button"
              aria-label={`Tile ${num}`}
            >
              {num}
            </ButtonBase>
          );
        }
      )}
    </Box>
  );
};

export default React.memo(Board);

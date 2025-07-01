import React from "react";
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
  // Helper to check if a tile is movable (adjacent to the empty space)
  const isMovable = (index: number) => {
    const emptyIndex = board.indexOf(null);
    return getMoveDirection(index, emptyIndex, boardSize) !== null;
  };

  return (
    <Box
      sx={{
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
      }}
    >
      {board.map((num, index) => {
        const nextMoveIndex = getNextMoveIndex ? getNextMoveIndex() : null;
        const highlight = nextMoveIndex === index;
        // Check if tile is in the correct place
        const isCorrect = num !== null && index === num - 1;
        // Find the next tile in order that is not in place
        let isNextTarget = false;
        if (num !== null) {
          let nextNum = 1;
          for (; nextNum <= board.length; nextNum++) {
            if (board[nextNum - 1] !== nextNum) break;
          }
          isNextTarget = num === nextNum && !isCorrect;
        }
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
            onClick={() => isMovable(index) && moveTile(index)}
            disabled={!isMovable(index)}
            sx={{
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
              // Additional dynamic styles can be added here if needed
            }}
            tabIndex={isMovable(index) ? 0 : -1}
            onKeyUp={(e) =>
              e.key === "Enter" && isMovable(index) && moveTile(index)
            }
            aria-disabled={!isMovable(index)}
            role="button"
            aria-label={`Tile ${num}`}
          >
            {num}
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default Board;

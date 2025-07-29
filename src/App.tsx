import React, { useState, useEffect, useCallback, useRef } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./App.css";
import { createBoard } from "./services/boardUtils";
import { getMoveDirection } from "./services/moveUtils";
import {
  saveGameState,
  loadGameState,
  clearGameState,
  generateGameId,
} from "./services/gameState";
import Board from "./components/Board";
import AppToolbar from "./components/AppToolbar";
import BoardSizeTabs from "./components/BoardSizeTabs";
import ControlsPanel from "./components/ControlsPanel";
import AppDrawer from "./components/AppDrawer";
import StatisticsPage from "./components/StatisticsPage";
import { useStats } from "./services/useStats";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const App: React.FC = () => {
  const [board, setBoard] = useState<(number | null)[]>([]);
  const [boardSize, setBoardSize] = useState(4);
  const [moveCount, setMoveCount] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameId, setGameId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const stats = useStats(boardSize);

  // Load saved game state on component mount
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setBoard(savedState.board);
      setBoardSize(savedState.boardSize);
      setMoveCount(savedState.moveCount);
      setTimer(savedState.timer);
      setIsTimerRunning(savedState.isTimerRunning);
      setGameId(savedState.gameId);
    } else {
      // No saved state, start a new game
      const newGameId = generateGameId();
      const newBoard = createBoard(4);
      setBoard(newBoard);
      setBoardSize(4);
      setMoveCount(0);
      setTimer(0);
      setIsTimerRunning(false);
      setGameId(newGameId);
    }
    setIsLoading(false);
  }, []);

  // Initialize or reset the game
  const initializeGame = useCallback((size: number) => {
    const newGameId = generateGameId();
    const newBoard = createBoard(size);
    setBoard(newBoard);
    setBoardSize(size);
    setMoveCount(0);
    setIsGameWon(false);
    setTimer(0);
    setIsTimerRunning(false);
    setGameId(newGameId);

    // Clear any existing saved state since we're starting fresh
    clearGameState();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Separate effect to save state periodically when timer is running
  useEffect(() => {
    if (!isTimerRunning || !gameId || board.length === 0) return;

    const saveInterval = setInterval(() => {
      saveGameState({
        board,
        boardSize,
        moveCount,
        timer,
        isTimerRunning: true,
        gameId,
      });
    }, 5000); // Save every 5 seconds

    return () => clearInterval(saveInterval);
  }, [isTimerRunning, board, boardSize, moveCount, timer, gameId]);

  // Save state when board or move count changes (after moves)
  useEffect(() => {
    if (!gameId || board.length === 0 || moveCount === 0 || isGameWon) return;

    saveGameState({
      board,
      boardSize,
      moveCount,
      timer,
      isTimerRunning,
      gameId,
    });
  }, [board, moveCount, boardSize, timer, isTimerRunning, gameId, isGameWon]);

  const startTimer = () => setIsTimerRunning(true);

  const togglePause = () => {
    if (moveCount > 0 && !isGameWon) {
      setIsTimerRunning(!isTimerRunning);
    }
  };

  const isMovable = (index: number) => {
    const emptyIndex = board.indexOf(null);
    return !!getMoveDirection(index, emptyIndex, boardSize);
  };

  const moveTile = (index: number) => {
    if (!isMovable(index)) return;
    const emptyIndex = board.indexOf(null);
    const move = getMoveDirection(index, emptyIndex, boardSize);
    if (!move) return;
    const newBoard = [...board];
    [newBoard[emptyIndex], newBoard[index]] = [
      newBoard[index],
      newBoard[emptyIndex],
    ];
    const newMoveCount = moveCount + 1;

    setBoard(newBoard);
    setMoveCount(newMoveCount);
    if (!isGameWon && !isTimerRunning) startTimer();

    checkWin(newBoard);
  };

  const checkWin = (currentBoard: (number | null)[]) => {
    const won = currentBoard
      .slice(0, boardSize * boardSize - 1)
      .every((val, idx) => val === idx + 1);
    if (won) {
      setIsGameWon(true);
      setIsTimerRunning(false);
      stats.update(moveCount + 1, timer); // Use moveCount + 1 since state hasn't updated yet
      // Clear saved state when game is completed
      clearGameState();
    }
  };

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Handle page visibility changes (when screen turns off/on)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isTimerRunning && gameId && board.length > 0) {
        // Save state when page becomes hidden
        saveGameState({
          board,
          boardSize,
          moveCount,
          timer,
          isTimerRunning,
          gameId,
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [board, boardSize, moveCount, timer, isTimerRunning, gameId]);

  // Theme setup
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  );
  useEffect(() => {
    setMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);
  const theme = createTheme({
    palette: { mode },
    components: {
      MuiAppBar: { styleOverrides: { root: { background: "inherit" } } },
    },
  });

  // Set CSS variables for theme colors
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--mui-background",
      theme.palette.background.default
    );
    root.style.setProperty("--mui-primary", theme.palette.primary.main);
    root.style.setProperty("--mui-primary-dark", theme.palette.primary.dark);
    root.style.setProperty(
      "--mui-on-primary",
      theme.palette.getContrastText(theme.palette.primary.main)
    );
    root.style.setProperty("--mui-on-background", theme.palette.text.primary);
    root.style.setProperty("--mui-hover", theme.palette.action.hover);
    root.style.setProperty("--mui-active", theme.palette.action.selected);
    root.style.setProperty("--mui-success", theme.palette.success.main);
    root.style.setProperty("--mui-success-dark", theme.palette.success.dark);
    root.style.setProperty("--mui-success-light", theme.palette.success.light);
    root.style.setProperty(
      "--mui-on-success",
      theme.palette.getContrastText(theme.palette.success.main)
    );
    root.style.setProperty("--mui-warning", theme.palette.warning.main);
    root.style.setProperty("--mui-warning-dark", theme.palette.warning.dark);
    root.style.setProperty("--mui-warning-light", theme.palette.warning.light);
    root.style.setProperty(
      "--mui-on-warning",
      theme.palette.getContrastText(theme.palette.warning.main)
    );
    root.style.setProperty("--mui-error", theme.palette.error.main);
  }, [theme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStatisticsClick={() => {
          setShowStatistics(true);
          setDrawerOpen(false);
        }}
      />
      <Stack
        className="responsive-container"
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
        sx={{
          width: "100%",
          minHeight: "100vh",
          background: "var(--mui-background, #fff)",
        }}
      >
        <AppToolbar
          onMenuClick={() => setDrawerOpen(true)}
          onReset={() => initializeGame(boardSize)}
          onPause={togglePause}
          isPaused={!isTimerRunning && moveCount > 0 && !isGameWon}
        />
        <BoardSizeTabs
          boardSize={boardSize}
          onChange={(size) => initializeGame(size)}
        />
        <Stack
          direction="column"
          alignItems="center"
          sx={{
            width: "100%",
            background: "var(--mui-background, #fff)",
            borderRadius: 2,
            margin: "16px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "visible",
          }}
        >
          {isLoading ? (
            // Show loading state to prevent layout shift
            <Stack
              direction="column"
              alignItems="center"
              sx={{
                width: "100%",
                background: "var(--mui-background, #fff)",
                borderRadius: 2,
                margin: "16px 0",
                padding: "40px",
                minHeight: "400px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Loading game...
              </Typography>
            </Stack>
          ) : (
            <>
              <Board board={board} boardSize={boardSize} moveTile={moveTile} />
              <ControlsPanel timer={timer} moveCount={moveCount} />
            </>
          )}
        </Stack>
      </Stack>
      {showStatistics && (
        <StatisticsPage onBack={() => setShowStatistics(false)} overlay />
      )}
    </ThemeProvider>
  );
};

export default App;

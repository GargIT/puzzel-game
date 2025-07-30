import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
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

// Constants to avoid recreation
const SAVE_INTERVAL = 5000;
const TIMER_INTERVAL = 1000;

// Memoized components to prevent unnecessary re-renders
const MemoizedBoard = React.memo(Board);
const MemoizedControlsPanel = React.memo(ControlsPanel);
const MemoizedAppToolbar = React.memo(AppToolbar);
const MemoizedBoardSizeTabs = React.memo(BoardSizeTabs);

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

  // Memoize expensive calculations
  const isPaused = useMemo(
    () => !isTimerRunning && moveCount > 0 && !isGameWon,
    [isTimerRunning, moveCount, isGameWon]
  );

  // Memoize empty index calculation to avoid repeated indexOf calls
  const emptyIndex = useMemo(() => board.indexOf(null), [board]);

  // Optimize inline styles with useMemo
  const containerStyles = useMemo(
    () => ({
      width: "100%",
      minHeight: "100vh",
      background: "var(--mui-background, #fff)",
    }),
    []
  );

  const boardContainerStyles = useMemo(
    () => ({
      width: "100%",
      background: "var(--mui-background, #fff)",
      borderRadius: 2,
      margin: "16px 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflow: "visible",
    }),
    []
  );

  const loadingStyles = useMemo(
    () => ({
      width: "100%",
      background: "var(--mui-background, #fff)",
      borderRadius: 2,
      margin: "16px 0",
      padding: "40px",
      minHeight: "400px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }),
    []
  );

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

  // Memoize callback functions to prevent unnecessary re-renders
  const handleDrawerClose = useCallback(() => setDrawerOpen(false), []);

  const handleStatisticsClick = useCallback(() => {
    setShowStatistics(true);
    setDrawerOpen(false);
  }, []);

  const handleMenuClick = useCallback(() => setDrawerOpen(true), []);

  const handleResetClick = useCallback(
    () => initializeGame(boardSize),
    [initializeGame, boardSize]
  );

  const handleStatisticsBack = useCallback(() => setShowStatistics(false), []);

  // Memoize togglePause function
  const togglePause = useCallback(() => {
    if (moveCount > 0 && !isGameWon) {
      setIsTimerRunning(!isTimerRunning);
    }
  }, [moveCount, isGameWon, isTimerRunning]);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, TIMER_INTERVAL);
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
    }, SAVE_INTERVAL); // Save every 5 seconds

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

  // Memoize moveTile function to prevent unnecessary re-renders
  const memoizedMoveTile = useCallback(
    (index: number) => {
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
      if (!isGameWon && !isTimerRunning) setIsTimerRunning(true);

      // Check win condition
      const won = newBoard
        .slice(0, boardSize * boardSize - 1)
        .every((val, idx) => val === idx + 1);
      if (won) {
        setIsGameWon(true);
        setIsTimerRunning(false);
        stats.update(newMoveCount, timer);
        clearGameState();
      }
    },
    [
      board,
      emptyIndex,
      boardSize,
      moveCount,
      isGameWon,
      isTimerRunning,
      timer,
      stats,
    ]
  );

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

  // Theme setup - memoize theme creation
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  );
  useEffect(() => {
    setMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
        components: {
          MuiAppBar: { styleOverrides: { root: { background: "inherit" } } },
        },
      }),
    [mode]
  );

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
        onClose={handleDrawerClose}
        onStatisticsClick={handleStatisticsClick}
      />
      <Stack
        className="responsive-container"
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
        sx={containerStyles}
      >
        <MemoizedAppToolbar
          onMenuClick={handleMenuClick}
          onReset={handleResetClick}
          onPause={togglePause}
          isPaused={isPaused}
        />
        <MemoizedBoardSizeTabs
          boardSize={boardSize}
          onChange={initializeGame}
        />
        <Stack direction="column" alignItems="center" sx={boardContainerStyles}>
          {isLoading ? (
            // Show loading state to prevent layout shift
            <Stack direction="column" alignItems="center" sx={loadingStyles}>
              <Typography variant="h6" color="text.secondary">
                Loading game...
              </Typography>
            </Stack>
          ) : (
            <>
              <MemoizedBoard
                board={board}
                boardSize={boardSize}
                moveTile={memoizedMoveTile}
              />
              <MemoizedControlsPanel timer={timer} moveCount={moveCount} />
            </>
          )}
        </Stack>
      </Stack>
      {showStatistics && (
        <StatisticsPage onBack={handleStatisticsBack} overlay />
      )}
    </ThemeProvider>
  );
};

export default App;

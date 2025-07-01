import React, { useState, useEffect, useCallback, useRef } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./App.css";
import { createBoard } from "./services/boardUtils";
import { getMoveDirection } from "./services/moveUtils";
import Board from "./components/Board";
import AppToolbar from "./components/AppToolbar";
import BoardSizeTabs from "./components/BoardSizeTabs";
import ControlsPanel from "./components/ControlsPanel";
import AppDrawer from "./components/AppDrawer";
import StatisticsPage from "./components/StatisticsPage";
import { useStats } from "./services/useStats";
import Stack from "@mui/material/Stack";

const App: React.FC = () => {
  const [board, setBoard] = useState<(number | null)[]>(createBoard(4));
  const [boardSize, setBoardSize] = useState(4);
  const [moveCount, setMoveCount] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const stats = useStats(boardSize);

  // Initialize or reset the game
  const initializeGame = useCallback((size: number) => {
    setBoard(createBoard(size));
    setMoveCount(0);
    setIsGameWon(false);
    setTimer(0);
    setIsTimerRunning(false);
  }, []);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const startTimer = () => setIsTimerRunning(true);

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
    setBoard(newBoard);
    setMoveCount((prev) => prev + 1);
    if (!isGameWon) startTimer();
    checkWin(newBoard);
  };

  const checkWin = (currentBoard: (number | null)[]) => {
    const won = currentBoard
      .slice(0, boardSize * boardSize - 1)
      .every((val, idx) => val === idx + 1);
    if (won) {
      setIsGameWon(true);
      setIsTimerRunning(false);
      stats.update(moveCount, timer);
    }
    return won;
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

  // Reset board when boardSize changes
  useEffect(() => {
    initializeGame(boardSize);
  }, [boardSize, initializeGame]);

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
        />
        <BoardSizeTabs
          boardSize={boardSize}
          onChange={(size) => setBoardSize(size)}
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
          <Board board={board} boardSize={boardSize} moveTile={moveTile} />
          <ControlsPanel timer={timer} moveCount={moveCount} />
        </Stack>
      </Stack>
      {showStatistics && (
        <StatisticsPage onBack={() => setShowStatistics(false)} overlay />
      )}
    </ThemeProvider>
  );
};

export default App;

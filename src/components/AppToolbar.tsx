import React, { useMemo } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface AppToolbarProps {
  onMenuClick: () => void;
  onReset: () => void;
  onPause?: () => void;
  isPaused?: boolean;
  children?: React.ReactNode;
}

const AppToolbar: React.FC<AppToolbarProps> = ({
  onMenuClick,
  onReset,
  onPause,
  isPaused = false,
  children,
}) => {
  // Memoize styles
  const appBarStyles = useMemo(
    () => ({
      position: "sticky" as const,
      color: "default" as const,
      elevation: 1,
      zIndex: 200,
    }),
    []
  );

  const titleStyles = useMemo(
    () => ({
      fontWeight: 700,
      color: "primary.main",
      letterSpacing: "0.02em",
      flexGrow: 1,
      textAlign: "center" as const,
    }),
    []
  );

  const pauseButtonStyles = useMemo(
    () => ({
      mr: 1,
    }),
    []
  );

  // Memoize pause icon to prevent recreation
  const pauseIcon = useMemo(
    () => (isPaused ? <PlayArrowIcon /> : <PauseIcon />),
    [isPaused]
  );

  return (
    <AppBar sx={appBarStyles}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          size="large"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={titleStyles}>
          15 Game
        </Typography>
        {onPause && (
          <IconButton
            color="inherit"
            aria-label={isPaused ? "resume" : "pause"}
            onClick={onPause}
            size="large"
            sx={pauseButtonStyles}
          >
            {pauseIcon}
          </IconButton>
        )}
        <IconButton
          edge="end"
          color="inherit"
          aria-label="reset"
          onClick={onReset}
          size="large"
        >
          <RestartAltIcon />
        </IconButton>
        {children}
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;

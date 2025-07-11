import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

interface AppToolbarProps {
  onMenuClick: () => void;
  onReset: () => void;
  children?: React.ReactNode;
}

const AppToolbar: React.FC<AppToolbarProps> = ({ onMenuClick, onReset, children }) => (
  <AppBar position="sticky" color="default" elevation={1} sx={{ zIndex: 200 }}>
    <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick} size="large">
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: '0.02em', flexGrow: 1, textAlign: 'center' }}>
        15 Game
      </Typography>
      <IconButton edge="end" color="inherit" aria-label="reset" onClick={onReset} size="large">
        <RestartAltIcon />
      </IconButton>
      {children}
    </Toolbar>
  </AppBar>
);

export default AppToolbar;

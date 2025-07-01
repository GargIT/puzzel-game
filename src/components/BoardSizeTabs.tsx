import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

interface BoardSizeTabsProps {
  boardSize: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (size: number) => void;
}

const sizes = [3, 4, 5, 6, 7];

const BoardSizeTabs: React.FC<BoardSizeTabsProps> = ({ boardSize, onChange }) => {
  return (
    <Tabs
      value={boardSize}
      onChange={(_, newValue) => onChange(Number(newValue))}
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
      sx={{ mb: 1, width: 'min(100vw, 48vh)', maxWidth: 'min(100vw, 48vh)', mx: 'auto' }}
    >
      {sizes.map(size => (
        <Tab
          key={size}
          label={`${size} x ${size}`}
          value={size}
          aria-label={`Set board size to ${size}x${size}`}
          sx={{ minWidth: 0, px: 1 }}          
        />
      ))}
    </Tabs>
  );
};

export default BoardSizeTabs;

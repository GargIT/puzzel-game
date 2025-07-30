import React, { useMemo, useCallback } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

interface BoardSizeTabsProps {
  boardSize: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (size: number) => void;
}

const sizes = [3, 4, 5, 6, 7];

const BoardSizeTabs: React.FC<BoardSizeTabsProps> = ({
  boardSize,
  onChange,
}) => {
  // Memoize tab styles
  const tabsStyles = useMemo(
    () => ({
      mb: 1,
      width: "min(100vw, 48vh)",
      maxWidth: "min(100vw, 48vh)",
      mx: "auto",
    }),
    []
  );

  const tabStyles = useMemo(
    () => ({
      minWidth: 0,
      px: 1,
    }),
    []
  );

  // Memoize change handler
  const handleChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      onChange(Number(newValue));
    },
    [onChange]
  );

  // Memoize tabs to prevent recreation
  const tabs = useMemo(
    () =>
      sizes.map((size) => (
        <Tab
          key={size}
          label={`${size} x ${size}`}
          value={size}
          aria-label={`Set board size to ${size}x${size}`}
          sx={tabStyles}
        />
      )),
    [tabStyles]
  );

  return (
    <Tabs
      value={boardSize}
      onChange={handleChange}
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
      sx={tabsStyles}
    >
      {tabs}
    </Tabs>
  );
};

export default BoardSizeTabs;

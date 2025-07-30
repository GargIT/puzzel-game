import React, { useMemo } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

interface ControlsPanelProps {
  timer: number;
  moveCount: number;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({ timer, moveCount }) => {
  // Memoize formatted time to avoid recalculation on every render
  const formattedTime = useMemo(() => formatTime(timer), [timer]);

  // Memoize styles
  const paperStyles = useMemo(
    () => ({
      p: 2,
      mb: 2,
      width: "100%",
      maxWidth: "min(100vw - 16px, 48vh - 16px)",
      mx: "auto",
    }),
    []
  );

  return (
    <Paper elevation={2} sx={paperStyles}>
      <Stack
        direction="row"
        spacing={4}
        justifyContent="center"
        alignItems="center"
      >
        <Box textAlign="center" flex={1} minWidth={0}>
          <Typography
            variant="h4"
            component="div"
            fontWeight={700}
            data-testid="timer-display"
          >
            {formattedTime}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            time
          </Typography>
        </Box>
        <Box textAlign="center" flex={1} minWidth={0}>
          <Typography
            variant="h4"
            component="div"
            fontWeight={700}
            data-testid="move-display"
          >
            {moveCount}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            moves
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default React.memo(ControlsPanel);

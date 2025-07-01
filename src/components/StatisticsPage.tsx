import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { getStats, saveStats, GameStats } from "../services/useStats";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

interface StatisticsPageProps {
  onBack: () => void;
  overlay?: boolean;
}

const boardSizes = [3, 4, 5, 6, 7];

const StatisticsPage: React.FC<StatisticsPageProps> = ({ onBack, overlay }) => {
  // eslint-disable-next-line no-unused-vars
  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const handleDelete = () => {
    boardSizes.forEach((size) =>
      saveStats(size, {
        totalGames: 0,
        minMoves: 0,
        maxMoves: 0,
        avgMoves: 0,
        minTime: 0,
        maxTime: 0,
        avgTime: 0,
      })
    );
    forceUpdate();
  };

  return overlay ? (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1400,
        background: "rgba(0,0,0,0.10)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflowY: "auto",
      }}
    >
      <Stack
        direction="column"
        alignItems="center"
        spacing={0}
        sx={{
          background: "var(--mui-background, #fff)",
          borderRadius: 2,
          boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
          width: "100%",
          maxWidth: "min(100vw, 48vh)",
          height: "100vh",
          margin: "0 auto",
          padding: 0,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AppBar
          position="sticky"
          color="default"
          elevation={1}
          sx={{ zIndex: 210 }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={onBack}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1, textAlign: "center", fontWeight: 700 }}
            >
              Statistics
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="delete"
              onClick={handleDelete}
            >
              <DeleteIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Grid container spacing={2} sx={{ p: 0, width: "100%" }}>
          {boardSizes.map((size) => {
            const stats: GameStats = getStats(size);
            if (stats.totalGames === 0) return null;
            return (
              <Grid size={{ xs: 12 }} key={size}>
                <Card sx={{ width: "100%" }}>
                  <CardHeader
                    title={`${size} x ${size}`}
                    sx={{ textAlign: "center", fontWeight: 700 }}
                  />
                  <CardContent>
                    <div>
                      Total games: <b>{stats.totalGames}</b>
                    </div>
                    <div>
                      Min moves: <b>{stats.minMoves}</b>
                    </div>
                    <div>
                      Max moves: <b>{stats.maxMoves}</b>
                    </div>
                    <div>
                      Avg moves: <b>{stats.avgMoves.toFixed(1)}</b>
                    </div>
                    <div>
                      Min time: <b>{stats.minTime}s</b>
                    </div>
                    <div>
                      Max time: <b>{stats.maxTime}s</b>
                    </div>
                    <div>
                      Avg time: <b>{stats.avgTime.toFixed(1)}s</b>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </Box>
  ) : (
    <Stack
      direction="column"
      alignItems="center"
      spacing={0}
      sx={{
        background: "var(--mui-background, #fff)",
        borderRadius: 2,
        boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
        width: "100%",
        maxWidth: "min(100vw, 48vh)",
        height: "100vh",
        margin: "0 auto",
        padding: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <AppBar
        position="sticky"
        color="default"
        elevation={1}
        sx={{ zIndex: 210 }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={onBack}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, textAlign: "center", fontWeight: 700 }}
          >
            Statistics
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="delete"
            onClick={handleDelete}
          >
            <DeleteIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} sx={{ p: 0, width: "100%" }}>
        {boardSizes.map((size) => {
          const stats: GameStats = getStats(size);
          if (stats.totalGames === 0) return null;
          return (
            <Grid size={{ xs: 12 }} key={size}>
              <Card sx={{ width: "100%" }}>
                <CardHeader
                  title={`${size} x ${size}`}
                  sx={{ textAlign: "center", fontWeight: 700 }}
                />
                <CardContent>
                  <div>
                    Total games: <b>{stats.totalGames}</b>
                  </div>
                  <div>
                    Min moves: <b>{stats.minMoves}</b>
                  </div>
                  <div>
                    Max moves: <b>{stats.maxMoves}</b>
                  </div>
                  <div>
                    Avg moves: <b>{stats.avgMoves.toFixed(1)}</b>
                  </div>
                  <div>
                    Min time: <b>{stats.minTime}s</b>
                  </div>
                  <div>
                    Max time: <b>{stats.maxTime}s</b>
                  </div>
                  <div>
                    Avg time: <b>{stats.avgTime.toFixed(1)}s</b>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};

export default StatisticsPage;

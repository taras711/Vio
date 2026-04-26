import { Box, Typography } from "@mui/material";
import { useTimeline } from "./TimelineContext";

export function TimelineHeader() {
  const { now, windowHours } = useTimeline();

  // výpočet časového okna
  const startWindow = now - (windowHours / 2) * 60 * 60 * 1000;
  const endWindow = now + (windowHours / 2) * 60 * 60 * 1000;
  const totalMs = endWindow - startWindow;

  // generování časových značek po 30 minutách
  const ticks: { time: number; label: string }[] = [];
  const step = 30 * 60 * 1000; // 30 min

  for (let t = startWindow; t <= endWindow; t += step) {
    const date = new Date(t);
    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");

    ticks.push({
      time: t,
      label: `${hh}:${mm}`,
    });
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 20,
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      {ticks.map((tick) => {
        const ratio = (tick.time - startWindow) / totalMs;
        const leftPercent = ratio * 100;

        return (
          <Box
            key={tick.time}
            sx={{
              position: "absolute",
              left: `${leftPercent}%`,
              transform: "translateX(-100%)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontSize: 10, color: "#667" }}
            >
              {tick.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

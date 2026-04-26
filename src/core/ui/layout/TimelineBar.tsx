import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, ExpandLess, ExpandMore } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useTimeline } from "./TimelineContext";
import { TimelineHeader } from "./TimelineHeader";
import type { TimelineEvent } from "@src/types/timelineEvent";
import { useNavigate } from "react-router-dom";
import { pages } from "@app/routes/registry";

export function TimelineBar() {
  const { events, now, windowHours, setWindowHours } = useTimeline();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

    function handleEventClick(ev: TimelineEvent) {
    if (ev.source.module === "tasks") {
        navigate(`/tasks/${ev.source.entityId}`);
        return;
    }
    if (ev.source.module === "plans") {
        navigate(`/plans/${ev.source.entityId}`);
        return;
    }
    // atd…
    }

  // auto-scroll k "now" po mountu a při změně okna
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    // jednoduchý střed – zatím bez přesného výpočtu px
    el.scrollTo({ left: el.scrollWidth / 2 - el.clientWidth / 2, behavior: "smooth" });
    console.log("SCROLL:", el.scrollWidth, el.clientWidth);
  }, [windowHours]);

  function getEventOpacity(ev: TimelineEvent) {
    const now = Date.now();

    if (ev.end && now > ev.end) return 0.4; // celé proběhlo
    if (!ev.end && now > ev.start) return 0.6; // jednorázové, už proběhlo
    return 1; // budoucí nebo probíhající
  }

   function getEventColor(ev: TimelineEvent) {
    return ev.color || "#1976d2";
   }


function formatRelativeTime(start: number, end?: number) {
  const now = Date.now();

  if (end && now > end) {
    // event skončil
    const diff = now - end;
    return ` Skončilo před ${formatDuration(diff)}`;
  }

  if (now >= start && (!end || now <= end)) {
    // probíhá
    const diff = now - start;
    return ` Probíhá ${formatDuration(diff)}`;
  }

  if (now < start) {
    // začne
    const diff = start - now;
    return ` Začne za ${formatDuration(diff)}`;
  }

  return "";
}

function formatDuration(ms: number) {
  const min = Math.floor(ms / 60000);
  const hr = Math.floor(min / 60);

  if (hr > 0) return `${hr} h ${min % 60} min`;
  return `${min} min`;
}


  // jednoduchý mapping eventů do pozice (zatím hrubý)
  function renderEvents() {
    if (!events.length) {
      return (
        <Typography variant="caption" sx={{ position: "relative", color: "#888", zIndex: 1, backgroundColor: "white", padding: .5}}>
          No events to show.
        </Typography>
      );
    }

const startWindow = now - (windowHours / 2) * 60 * 60 * 1000;
const endWindow = now + (windowHours / 2) * 60 * 60 * 1000;
const totalMs = endWindow - startWindow;

return events.map((ev) => {
  const startRatio = (ev.start - startWindow) / totalMs;
  const endRatio = ((ev.end ?? ev.start) - startWindow) / totalMs;

  const leftPercent = startRatio * 100;
  const widthPercent = Math.max((endRatio - startRatio) * 100, 0.5);

return (
  <Tooltip
    key={ev.id}
    title={
      <Box sx={{ p: 0.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {ev.title}
        </Typography>
        <Typography variant="caption">
          {formatRelativeTime(ev.start, ev.end)}
        </Typography>
      </Box>
    }
    arrow
    placement="top"
  >
    <Box
      sx={{
        position: "absolute",
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        top: `calc(50% - ${open ? 5 : 10.5}px)`,
        padding: "5px 5px",
        borderRadius: 0.5,
        backgroundColor: getEventColor(ev),
        opacity: getEventOpacity(ev),
        color: "white",
        fontSize: 11,
        cursor: "pointer",
        zIndex: 1,
      }}
      onClick={() => handleEventClick(ev)}
    >
      {ev.title}
    </Box>
  </Tooltip>
);

    });
  }

  return (
    <Box
      sx={{
        position: "sticky",
        top: 72, // podle výšky tvého TopBaru
        zIndex: 10,
        marginLeft: "24px",
        marginRight: "32px",
        borderBottom: "1px solid #c4d8df"
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1,
          height: open ? 72 : 24,
          transition: "height 0.2s ease",
          overflow: "hidden",
        }}
      >
        {/* Levý panel – toggle + info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
          <IconButton size="small" onClick={() => setOpen((v) => !v)}>
            {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
          <Typography variant="caption" sx={{ fontWeight: 600, opacity: open ? 1 : "0.3" }}>
            Timeline ({windowHours}h)
          </Typography>
        </Box>

        {/* Ovládání okna */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 2, opacity: open ? 1 : "0.3" }}>
          <Tooltip title="Minimize window">
            <span>
              <IconButton
                size="small"
                disabled={windowHours <= 2}
                onClick={() => setWindowHours(Math.max(2, windowHours - 1))}
              >
                <ChevronLeft fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Maximize window">
            <IconButton
              size="small"
              onClick={() => setWindowHours(Math.min(12, windowHours + 1))}
            >
              <ChevronRight fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Vlastní timeline */}
        
         
        <Box
          ref={containerRef}
          sx={{
            opacity: open ? 1 : "0.3",
            position: "relative",
            flex: 1,
            height: "100%",
            overflow: "hidden",
          }}
        > 
            {/* eventy */}
            {renderEvents()}
            <TimelineHeader />
          {/* základní linka */}
          <Box
            sx={{
              position: "absolute",
              top: open ? 40 : 12,
              left: 0,
              right: 0,
              height: open ? "2px" : 0,
              background: "linear-gradient(to right, #e0e0e000, #bdbdbd, #e0e0e000)",
            }}
          />

          {/* "teď" marker – zatím uprostřed */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: "1px",
              height: open ? "100%" : "40px",
              backgroundColor: "#e53935",
              transform: "translateX(-50%)",
              zIndex: 2
            }}
          />

          
        </Box>
      </Box>
    </Box>
  );
}

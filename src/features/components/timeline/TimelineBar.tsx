import { Box, IconButton, Tooltip, Typography, Drawer, Backdrop, CircularProgress } from "@mui/material";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "@src/utils/api";
import { useTimeline } from "./TimelineContext";
import { TimelineHeader } from "./TimelineHeader";
import type { EventDetail, TimelineEvent } from "../../../../shared/types";
import { useNavigate } from "react-router-dom";
import { pages } from "@app/routes/registry";
import { TimelineEventDetailPanel } from "./TimelineEventDetailPanel";


export function TimelineBar() {
  const { events, now, windowHours, setWindowHours } = useTimeline();
  const [open, setOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<EventDetail | null>(null);
  const [detailEventLoading, setDetailEventLoading] = useState(false);

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

function getEventStyleByStatus(ev: TimelineEvent) {
  const status = ev.status ?? "scheduled";

  if (status === "cancelled") {
    return {
      backgroundColor: "#000000b8",
      color: "#fff",
      opacity: 0.5,
      textDecoration: "line-through"
    };
  }

  if (status === "completed") {
    return {
      backgroundColor: "#4caf50",
      color: "#fff",
      opacity: 0.9,
      textDecoration: "none"
    };
  }

  // scheduled
  return {
    backgroundColor: getEventColor(ev),
    color: "#fff",
    opacity: getEventOpacity(ev),
    textDecoration: "none"
  };
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

async function openDetail(ev: TimelineEvent) {
  setDetailEventLoading(true);
  setDetailEvent(null);

  const res = await api.get(`/events/${ev.id}/detail`);
  const data = await res.data;

  setDetailEvent(data);
  setDetailEventLoading(false);
}

  // jednoduchý mapping eventů do pozice
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
const style = getEventStyleByStatus(ev);
return (
  <Tooltip
    
    key={ev.id}
    title={
      <Box sx={{ p: 0.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {ev.title}
        </Typography>
        <Typography variant="caption" sx={{ fontStyle: "italic", opacity: 0.8 }}>
          {formatRelativeTime(ev.start, ev.end)} {ev.status === "cancelled" ? "(Zrušeno)" : ev.status === "completed" ? "(Dokončeno)" : ""}
        </Typography>
      </Box>
    }
    arrow
    placement="top-end"
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
        fontSize: 11,
        cursor: "pointer",
        zIndex: 1,
        ...style
      }}
      onClick={() => openDetail(ev)}
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
        zIndex: 10,
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
            {open ? <ChevronUp size="15" /> : <ChevronDown size="15" />}
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
                <ChevronLeft size="15" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Maximize window">
            <IconButton
              size="small"
              disabled={windowHours >= 12}
              onClick={() => setWindowHours(Math.min(12, windowHours + 1))}
            >
              <ChevronRight size="15" />
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
      <Drawer
        anchor="right"
        open={Boolean(detailEventLoading || detailEvent)}
        onClose={() => {
          setDetailEvent(null);
          setDetailEventLoading(false);
        }}
        variant="persistent"
        hideBackdrop
        ModalProps={{
          keepMounted: true,
          disableEnforceFocus: true,
          disableAutoFocus: true,
          disableRestoreFocus: true,
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#ffffffe0",
            backdropFilter: "blur(15px)",
            width: 340,
            p: 2,
            borderLeft: "1px solid #ddd",
            boxShadow: "-2px 0 6px rgba(0,0,0,0.1)",
            top: "72px",
            height: "calc(100vh - 105px)",
          },
        }}
      >
        {detailEventLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {!detailEventLoading && detailEvent && (
          <TimelineEventDetailPanel
            event={detailEvent}
            onClose={() => setDetailEvent(null)}
            setDetailEvent={setDetailEvent}
            onEdit={() => {
              setDetailEvent(null);
              // onEditEvent?.(detailEvent);
            }}
          />
        )}
      </Drawer>
    </Box>
  );
}

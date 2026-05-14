import { useState, useRef, useEffect } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X, Bookmark} from "lucide-react";
import { useTabStore } from "./store/TabStore";
import { useNavigate } from "react-router-dom";

export function TabBar() {
  const navigate = useNavigate();
  const { tabs, activeTabId, setActiveTab, removeTab } = useTabStore();
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  if (activeRef.current) {
    activeRef.current.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }
}, [activeTabId]);

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: -120, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: 120, behavior: "smooth" });
  };



  // const tabs: TabBarItem[] = [
  //   { id: 1, title: "Event 123", icon: <FolderIcon size="15" /> },
  //   { id: 2, title: "User: John Doe", icon: <FolderIcon size="15" /> },
  // ];

  if (tabs.length === 0) return null;

  return (
    <Box>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #ddd",
        height: open ? 44 : 26,
        px: 1,
        transition: "height 0.2s ease",
        overflow: "hidden"
      }}
    >
      {/* Left side: collapse + label */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
        <IconButton size="small" onClick={() => setOpen((v) => !v)}>
          {open ? <ChevronUp size="15" /> : <ChevronDown size="15" />}
        </IconButton>

        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            opacity: open ? 1 : 0.4,
            transition: "opacity 0.2s",
          }}
        >
          Bookmarks ({tabs.length})
        </Typography>
      </Box>

      {/* Middle: scrollable tab list */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
          overflowX: "auto",
          overflowY: "hidden",
          py: open ? 0.5 : 0,
          opacity: open ? 1 : 0.4,
          transition: "opacity 0.2s",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {tabs.map((tab) => (
          <Tooltip title={`${tab.title} (${new Date(Number(tab.createdAt)).toLocaleString()})`} key={tab.id}>
          <Box
            ref={tab.id === activeTabId ? activeRef : null}
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              navigate(tab.path);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              whiteSpace: "nowrap",
              cursor: "pointer",
              bgcolor: tab.id === activeTabId ? "primary.light" : "action.hover",
              "&:hover": { bgcolor: tab.id === activeTabId ? "primary.main" : "action.selected" },
              color: tab.id === activeTabId ? "text.primary" : "text.secondary",
              transition: "0.15s ease"
            }}
          >
            <Box sx={{ mr: 1, opacity: 0.7 }}><Bookmark size="15" /></Box>

            <Typography variant="body2">{tab.title}</Typography>

            <IconButton
              size="small"
              sx={{ ml: 1 }}
              onClick={(e) => {e.stopPropagation(); removeTab(tab.id)}}
            >
              <X size="15" />
            </IconButton>
          </Box>
          </Tooltip>
        ))}

        {/* Add new tab */}
        {/* <IconButton size="small">
          <Plus size="15" />
        </IconButton> */}
      </Box>

      {/* Right side: navigation arrows */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          ml: 2,
          opacity: open ? 1 : 0.4,
          transition: "opacity 0.2s",
        }}
      >
        <Tooltip title="Previous tab">
          <span>
            <IconButton size="small" onClick={scrollLeft}>
              <ChevronLeft size="15" />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Next tab">
          <IconButton size="small" onClick={scrollRight}>
            <ChevronRight size="15" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
    </Box>
  );
}

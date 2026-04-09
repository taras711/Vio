// SidebarWrapper.tsx
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useEffect } from "react";
import { SideBar } from "./Sidebar";

export function SidebarWrapper({
  sidebarOpen,
  setSidebarOpen,
  children,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const SIDEBAR_WIDTH = sidebarOpen ? 240 : 102;

  // Swipe gestures
  useEffect(() => {
    if (!isMobile) return;

    let startX = 0;

    const handleStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleMove = (e: TouchEvent) => {
      const diff = e.touches[0].clientX - startX;

      if (diff > 50 && !sidebarOpen) setSidebarOpen(true);
      if (diff < -50 && sidebarOpen) setSidebarOpen(false);
    };

    window.addEventListener("touchstart", handleStart);
    window.addEventListener("touchmove", handleMove);

    return () => {
      window.removeEventListener("touchstart", handleStart);
      window.removeEventListener("touchmove", handleMove);
    };
  }, [isMobile, sidebarOpen]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Overlay only on mobile */}
      {isMobile && sidebarOpen && (
        <Box
          onClick={() => setSidebarOpen(false)}
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar always fixed */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: isMobile ? (sidebarOpen ? 0 : -260) : 0,
          width: isMobile ? 260 : SIDEBAR_WIDTH,
          height: "100vh",
          transition: "all 0.25s ease",
          zIndex: 999,
        }}
      >
        <SideBar open={sidebarOpen} />
      </Box>

      {/* Content */}
      <Box
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : `${SIDEBAR_WIDTH}px`,
          transition: "margin-left 0.25s ease",
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
import { Box, useMediaQuery} from "@mui/material";
import { Outlet, useMatches } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useUI } from "./ui-store";
import { TopBar } from "./Topbar";
import { SideBar } from "./Sidebar";
import { RightPanel } from "./RightPanel";
import { PageHeaderPanel } from "./PageHeaderPanel";
import type { RouteHandle } from "@app/routes/types";
import { router } from "@app/routes/router";


function buildBreadcrumbs(meta: any, params: any) {
  const items = [];
  const { t } = useTranslation();
  // Dashboard
  items.push({
    label: t("dashboard.breadcrumb"),
    to: "/",
  });

  if (meta.path.startsWith("/users")) {
    items.push({
      label: t("users.breadcrumb"),
      to: "/users",
    });
  }

  if (meta.path === "/users/:id") {
    items.push({
      label: t("userDetail.breadcrumb"),
      to: `/users/${params.id}`,
    });
  }

  if (meta.path === "/users/:id/admin") {
    items.push({
      label: t("userAdminTools.breadcrumb"),
      to: `/users/${params.id}/admin`,
    });
  }

  return items;
}

export function PageLayout() {
const { sidebarOpen, setSidebarOpen } = useUI();

  const { t } = useTranslation();
const matches = useMatches() as Array<{ handle?: RouteHandle; params?: any }>;
const meta = matches.map(m => m.handle?.meta).filter(Boolean).at(-1);
const params = matches.at(-1)?.params ?? {};

  const isMobile = useMediaQuery("(max-width: 600px), (max-height: 600px)");

  const SIDEBAR_WIDTH = sidebarOpen ? 255 : 117;
console.log("ROUTES:", router.routes);


  // Swipe gestures (mobile only)
useEffect(() => {
  if (!isMobile) return; // ← swipe jen na mobilech

  let startX = 0;

  const handleStart = (e: TouchEvent) => {
    startX = e.touches[0].clientX;
  };

  const handleMove = (e: TouchEvent) => {
    const diff = e.touches[0].clientX - startX;

    // otevřít jen když sidebar je zavřený
    if (diff > 50 && !sidebarOpen) {
      setSidebarOpen(true);
    }

    // zavřít jen když sidebar je otevřený
    if (diff < -50 && sidebarOpen) {
      setSidebarOpen(false);
    }
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

      {/* Sidebar (always fixed) */}
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

      {/* Main content wrapper */}
      <Box
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : `${SIDEBAR_WIDTH}px`,
          transition: "margin-left 0.25s ease",
          width: "100%",
        }}
      >
        <TopBar />

        <Box component="main" sx={{ mt: "64px", p: isMobile ? 2 : 3 }}>
          {meta && (
            <PageHeaderPanel
              title={t(meta.titleKey)}
              breadcrumbs={buildBreadcrumbs(meta, params)}
            />



          )}

          <Outlet />
        </Box>
      </Box>

      {/* Right panel (fixed) */}
      <RightPanel />
    </Box>
  );
}
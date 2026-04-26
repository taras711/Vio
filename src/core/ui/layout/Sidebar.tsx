// ModernSidebar.tsx
import { Box, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { NAV_ITEMS } from "./Navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { Settings, LogOut, Terminal } from "lucide-react";
import { useLicenseInfo } from "../../../auth/License";
import trialLogo from "@assets/logo_trial.png";
import standardLogo from "@assets/logo_standard.png";
import enterpriseLogo from "@assets/logo_enterprise.png";
import { useAuth } from "../../../auth/AuthContext";
import { useUI } from "./ui-store";
import logoLabel from "@assets/logo_label.png";
import { PERMISSIONS } from "../../../../shared/permissions";
import { IfAllowed } from "@src/auth/IfAllowed";
import { usePermission } from "@src/auth/PermissionContext";

export function SideBar({ open }: { open: boolean }) {
  const { setSidebarOpen } = useUI();
  const location = useLocation();
  const navigate = useNavigate();
  const license = useLicenseInfo();
  const { user, logout } = useAuth()!;
  const roles = { superadmin: "Super Admin", admin: "Admin", user: "User" };
  const userRole = user?.role || "user";
  const isMobile = useMediaQuery("(max-width: 600px), (max-height: 600px)");
  const logoMap: Record<string, string> = {
    free: trialLogo,
    pro: standardLogo,
    enterprise: enterpriseLogo,
  };
  const { can } = usePermission();

  const logo = license?.type ? logoMap[license.type] || trialLogo : trialLogo;
  console.log("NAVIGATE:", navigate);
  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <Box
      className={`sidebar ${open ? "open" : "collapsed"}`}
      style={{
        width: open ? 240 : 102,
        transition: "width 0.25s ease"
      }}
    >
      <Box className="sidebar-inner">
        <Box className="sidebar-logo">
          <img src={logo} alt="Logo" />
          {open && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

              <img src={logoLabel} alt="Vecta" style={{ width: 86, margin: "0 15px" }} />
              <Typography variant="caption" sx={{ ml: 3, fontWeight: 600, color: "#818080" }}>
                {roles[userRole as keyof typeof roles] || roles.user}
              </Typography>
            </Box>
          )}
        </Box>

        <Box className="sidebar-menu">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Tooltip key={item.path} title={item.label} placement="right">
                <Box
                  className="sidebar-menu-item"
                  style={{
                    backgroundColor: active ? "rgb(119 205 253 / 20%)" : "transparent",
                    color: active ? "#0070f6 !important;" : "#7186a7;",
                  }}
                  onClick={() => {
                    (isMobile && setSidebarOpen(false));
                    navigate(item.path)
                  }}
                >
                  <item.icon />
                  {open && <span className="sidebar-label">{item.label}</span>}
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        <Box className="sidebar-bottom">
          <Tooltip title="Nastavení" placement="right">
            <Box className="sidebar-menu-item" onClick={() => {
                (isMobile && setSidebarOpen(false)); navigate("/settings")
              }}>
              <Settings />
              {open && <span className="sidebar-label">Nastavení</span>}
            </Box>
          </Tooltip>

          <Tooltip title="Logout" placement="right">
            <Box className="sidebar-menu-item" onClick={handleLogout}>
              <LogOut />
              {open && <span className="sidebar-label">Logout</span>}
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}


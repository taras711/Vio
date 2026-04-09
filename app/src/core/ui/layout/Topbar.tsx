import { Menu, Scan, Bell } from "lucide-react";
import { Box, Typography, IconButton, useMediaQuery, Avatar } from "@mui/material";
import { useUI } from "./ui-store";
import { UserProfile } from "@pages/UserProfile";
import { useAuth } from "../../../auth/AuthContext";

export function TopBar() {
    const { toggleSidebar, openRightPanel } = useUI();
    const { user } = useAuth()!;
    const isMobile = useMediaQuery("(max-width: 600px), (max-height: 600px)");
  return (
    <Box
        className="topbar"
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={toggleSidebar}>
          <Menu size={22} />
        </IconButton>

        <Typography variant="h6" fontWeight={600} style={{ fontSize: isMobile ? "1rem" : "1.25rem", whiteSpace: "nowrap" }}>
          Dobrý den, {user?.name ?? "uživateli"}
!
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton>
          <Scan size={22} />
        </IconButton>

        <IconButton>
          <Bell size={22} />
        </IconButton>

        <Avatar src={user?.avatarUrl ?? ""} onClick={() => openRightPanel(<UserProfile />, "modal")}>
          {user?.name?.charAt(0).toUpperCase() ?? ""}
        </Avatar>
      </Box>
    </Box>
  );
}
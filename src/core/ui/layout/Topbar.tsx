import { Menu, Scan, Bell } from "lucide-react";
import { Box, Typography, IconButton, useMediaQuery, Avatar } from "@mui/material";
import { useUI } from "./ui-store";
import { UserProfile } from "@pages/UserProfile";
import { useAuth } from "../../../auth/AuthContext";
import { IdentificatedPeriod } from "@src/core/ui/hooks/IdentifyPeriod";

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

        <Typography variant="subtitle1" fontWeight={600} style={{color: "#797979",textOverflow: "ellipsis",overflow: "hidden", maxWidth: 400, fontSize: isMobile ? "1rem" : "1.25rem", whiteSpace: "nowrap" }}>
          {IdentificatedPeriod({time: new Date().getHours()}).period}, {user?.name ?? "User"}!
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
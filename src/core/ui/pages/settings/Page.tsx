import { useState } from "react";
import { Box, List, ListItemButton, ListItemText, ListItemIcon, IconButton, Tooltip } from "@mui/material";
import { SETTINGS_CATEGORIES } from "./SettingsCategories";
import SettingsContent from "./SettingsContent";
import { Settings2, Lock, Users, Award, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";


export function Component() {
    const theme = useTheme();
    const [active, setActive] = useState("general");
    const [collapsed, setCollapsed] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const ICON_MAP = {
    home: Settings2,
    license: Award,
    lock: Lock,
    users: Users,
    bell: Bell
  } as const;

    return (
    <Box sx={{ display: "flex", gap: 3 }}>
        
        {/* Levý panel */}
        <Box
        sx={{
            width: isMobile ? "240" : collapsed ? 64 : 240,
            transition: "width 0.2s ease",
            borderRight: "1px solid #c4d8df",
            pr: collapsed ? 0 : 1,
            overflow: "hidden",
        }}
        >
            {!isMobile &&
            <Tooltip title="Collapse settings panel" placement="right">
                <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ m: 1 }}>
                    {collapsed ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
            </Tooltip>}

        <List disablePadding>
            {SETTINGS_CATEGORIES.map((item) => {
            const Icon = ICON_MAP[item.icon];

            return (
                <ListItemButton
                key={item.id}
                selected={active === item.id}
                onClick={() => setActive(item.id)}
                sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: collapsed ? 1 : 2,
                }}
                >
                <ListItemIcon
                    sx={{
                    minWidth: collapsed ? "auto" : 40,
                    justifyContent: "center",
                    }}
                >
                    <Icon size={20} />
                </ListItemIcon>

                {!collapsed && !isMobile && <ListItemText primary={item.label} />}
                </ListItemButton>
            );
            })}
        </List>
        </Box>

        {/* Pravý panel */}
        <Box sx={{ flexGrow: 1 }}>
        <SettingsContent active={active} />
        </Box>
    </Box>
    );
}
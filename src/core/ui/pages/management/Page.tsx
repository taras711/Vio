// src/core/ui/pages/management/Page.tsx
import { useState } from "react";
import { useMediaQuery } from "@mui/material";
import { ICON_MAP} from "./iconMap";
import { ChevronLeft, ChevronRight, } from "lucide-react";
import { Box, List, ListItemButton, ListItemText, ListItemIcon, IconButton, Tooltip } from "@mui/material";
import { MANAGEMENT_CATEGORIES } from "./ManagenmentCategories";
import Collapse from "@mui/material/Collapse";
import ManagementContent from "./ManagementContent";

export function Component() {
    const [active, setActive] = useState<string | undefined>("users");
    const [subActive, setSubActive] = useState<string | undefined>(undefined);
    const [collapsed, setCollapsed] = useState(false);
    const isMobile = useMediaQuery("(max-width: 600px), (max-height: 600px)");

     return (
    <Box sx={{ display: "flex", gap: 3, flexDirection: isMobile ? "column" : "row" }}>
        
        {/* Levý panel */}
        <Box
        sx={{
          position: "sticky",
          top: 0,
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

<List disablePadding sx={{ display: "flex", flexDirection: isMobile ? "row" : "column" }} >
  {MANAGEMENT_CATEGORIES.map((item) => {
    const Icon = ICON_MAP[item.icon];
    const isActive = active === item.id;
    const hasChildren = !!item.children;

    return (
      <Box key={item.id}>
        {/* Hlavní kategorie */} 
        <Tooltip title={isMobile || collapsed ? item.label : undefined} placement="right">
        <ListItemButton
            onClick={() => {
                const hasChildren = !!item.children?.length;

                if (active === item.id) {
                // toggle OFF
                setActive(undefined);
                setSubActive(undefined);
                } else {
                // toggle ON
                setActive(item.id);

                if (hasChildren) {
                    // nastavíme první podkategorii jako default
                    setSubActive(item.children![0].id);
                } else {
                    setSubActive(undefined);
                }
                }
            }}

          selected={isActive}
          sx={{
            minHeight: 48,
            justifyContent: collapsed ? "center" : "initial",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: collapsed ? 0 : 3,
              justifyContent: "center",
            }}
          >
            <Icon />
          </ListItemIcon>

          {!collapsed && !isMobile && <ListItemText
            primary={item.label}
            sx={{ opacity: collapsed ? 0 : 1 }}
          />}
        </ListItemButton>
        </Tooltip>

        {/* Podkategorie */}
{hasChildren && (
  <Collapse in={isActive} timeout="auto" unmountOnExit>
    
    <List className="sub-list" disablePadding sx={{ pl: collapsed || isMobile ? 0 : 4 }}>
        {item.children!.map((child) => {
        const ChildIcon = ICON_MAP[child.icon];
        return (
        <Tooltip title={isMobile || collapsed ? child.label : undefined} placement="right">
            <ListItemButton
            className="sub-list-item"
            key={child.id}
            onClick={() => setSubActive(child.id)}
            selected={subActive === child.id}
            sx={{
                minHeight: 40,
                justifyContent: collapsed ? "center" : "flex-start",
                pl: collapsed ? 0 : 2,
            }}
            >
            <ListItemIcon sx={{ minWidth: 32 }}>
                <ChildIcon color="#86a6ad" />
            </ListItemIcon>

            {/* TADY JE KLÍČOVÁ OPRAVA */}
            {!collapsed && !isMobile && <ListItemText primary={child.label} />}
            </ListItemButton>
            </Tooltip>
        );
        })}
    </List>
    
  </Collapse>
)}
      </Box>
    );
  })}
</List>

        </Box>

        {/* Hlavní obsah */}
        <Box sx={{ flex: 1 }}>
            <ManagementContent active={active} subActive={subActive} />
        </Box>
    </Box>
  );
}
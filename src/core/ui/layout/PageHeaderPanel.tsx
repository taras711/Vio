import { Box, Typography, Breadcrumbs, IconButton, Tooltip } from "@mui/material";
import {BookmarkPlus, BookmarkOff} from "lucide-react";
// import { workspace, currentPage } from "@src/workspace";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTabStore } from "@src/features/components/bookmark/store/TabStore";


export interface BreadcrumbItem {
  label: string;
  to: string;
}

export function PageHeaderPanel({
  title,
  breadcrumbs = [],
  meta,
  params
}: {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  meta: any,
  params: any
}) {
  console.log("meta, params", meta, params);
    const { tabs, addTab, removeTab } = useTabStore();
  const { t } = useTranslation();

  const location = useLocation();

  const existing = tabs.find(t => t.path === location.pathname);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Breadcrumbs sx={{ mb: 1 }}>
        {breadcrumbs.map((item, i) => (
          <Link
            key={i}
            to={item.to}
            style={{
              textDecoration: "none",
              color: "#777",
              fontSize: "0.9rem",
            }}
          >
            {item.label}
          </Link>
        ))}
      </Breadcrumbs>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* <IconButton onClick={() => workspace.addTab(currentPage)}> */}
        {!existing && <Tooltip title="Add to bookmarks">
          <IconButton onClick={() =>
            addTab({
              id: crypto.randomUUID(),
              title: title || t(meta.titleKey),
              path: location.pathname,
            })
          }>
            <BookmarkPlus />
          </IconButton>
        </Tooltip>}
        {existing && <Tooltip title="Odebrat z bookmarků">
          <IconButton onClick={() => removeTab(existing?.id || "")}>
            <BookmarkOff />
          </IconButton>
        </Tooltip>}
      </Box>
      </Box>

      {title && <Typography variant="h4" fontWeight={600}>
        {title}
      </Typography>
      }
    </Box>
  );
}
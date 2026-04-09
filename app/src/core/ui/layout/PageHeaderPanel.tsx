import { Box, Typography, Breadcrumbs } from "@mui/material";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  to: string;
}

export function PageHeaderPanel({
  title,
  breadcrumbs = [],
}: {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  return (
    <Box sx={{ mb: 3 }}>
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

      <Typography variant="h4" fontWeight={600}>
        {title}
      </Typography>
    </Box>
  );
}
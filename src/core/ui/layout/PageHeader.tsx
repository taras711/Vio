// core/ui/layout/PageHeader.tsx
import { Box, Typography } from "@mui/material";

export function PageHeader(props: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="h5" fontWeight={600}>{props.title}</Typography>
        {props.subtitle && (
          <Typography variant="body2" color="text.secondary">
            {props.subtitle}
          </Typography>
        )}
      </Box>
      {props.actions}
    </Box>
  );
}
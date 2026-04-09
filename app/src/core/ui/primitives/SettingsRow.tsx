import { Box, Typography } from "@mui/material";

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsRow({ label, description, children }: SettingsRowProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 4,
        py: 2,
        alignItems: "flex-start",
        flexWrap: "wrap",
        maxWidth: 900, // drží to u sebe i na velkých monitorech
      }}
    >
      {/* Levá část */}
      <Box sx={{ width: 250 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>

        {description && (
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Box>

      {/* Pravá část */}
      <Box sx={{ flexGrow: 1, minWidth: 250 }}>
        {children}
      </Box>
    </Box>
  );
}
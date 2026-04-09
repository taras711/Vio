import { Box, Typography, Paper, Divider } from "@mui/material";
import { SettingsRow } from "@ui/primitives/SettingsRow";

export function ChangePermissionsPanel() {
  return (
    <Box sx={{ maxWidth: 900 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Change User Permissions
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Permission Matrix</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Adjust granular permissions for the selected user.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <SettingsRow label="User" description="Select the user whose permissions you want to modify">
          <div>TODO: UserSelect</div>
        </SettingsRow>

        <SettingsRow label="Permissions" description="Enable or disable specific permissions">
          <div>TODO: PermissionMatrix</div>
        </SettingsRow>
      </Paper>
    </Box>
  );
}
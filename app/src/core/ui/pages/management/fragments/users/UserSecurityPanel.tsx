import { Box, Typography, Paper, Divider, Button } from "@mui/material";
import { SettingsRow } from "@ui/primitives/SettingsRow";

export function UserSecurityPanel() {
  return (
    <Box sx={{ maxWidth: 900 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        User Security
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Security Actions</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Manage account security for the selected user.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <SettingsRow label="User" description="Select the user to manage security settings">
          <div>TODO: UserSelect</div>
        </SettingsRow>

        <SettingsRow label="Reset Password" description="Force the user to set a new password">
          <Button variant="outlined">Reset Password</Button>
        </SettingsRow>

        <SettingsRow label="Deactivate Account" description="Disable login for this user">
          <Button variant="outlined" color="error">Deactivate</Button>
        </SettingsRow>

        <SettingsRow label="Active Sessions" description="View and revoke active sessions">
          <div>TODO: SessionList</div>
        </SettingsRow>
      </Paper>
    </Box>
  );
}
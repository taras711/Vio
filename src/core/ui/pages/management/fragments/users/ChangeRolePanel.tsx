import { Box, Typography, Paper, Divider, Button } from "@mui/material";
import { SettingsRow } from "@ui/primitives/SettingsRow";

export function ChangeRolePanel() {
  return (
    <Box sx={{ maxWidth: 900 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Change User Role
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Role Assignment</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Select a user and assign a new role.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <SettingsRow label="User" description="Select the user whose role you want to change">
          <div>TODO: UserSelect</div>
        </SettingsRow>

        <SettingsRow label="New Role" description="Choose the new role for the user">
          <div>TODO: RoleSelect</div>
        </SettingsRow>

        <Box sx={{ mt: 2 }}>
          <Button variant="contained">Apply Role Change</Button>
        </Box>
      </Paper>
    </Box>
  );
}
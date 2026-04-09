import { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider, Button, Stack, CircularProgress } from "@mui/material";
import { SettingsRow } from "@ui/primitives/SettingsRow";
import { UsersService, type UsersStats } from "@src/services/UsersService";
import { useLicenseInfo } from "@src/auth/License";

export function AdministrationPanel() {
  const [stats, setStats] = useState<UsersStats | null>(null);
  const [loading, setLoading] = useState(true);
  const license = useLicenseInfo();

  useEffect(() => {
    UsersService.getStats().then((data) => {
      setStats({
        ...data,
        maxUsers: license?.maxUsers ?? 0,
        licenseStatus: license?.status ?? "",
      });
      setLoading(false);
    });
  }, [license]);

  return (
    <Box sx={{ maxWidth: 900 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        User Administration
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Overview</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Basic statistics and quick actions for user management.
        </Typography>

        <Divider sx={{ my: 2 }} />

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && stats && (
          <>
            <SettingsRow label="Total Users" description="Number of registered accounts">
              <Typography variant="body1">{stats.total}</Typography>
            </SettingsRow>

            <SettingsRow label="Active Users" description="Users currently able to log in">
              <Typography variant="body1">{stats.active}</Typography>
            </SettingsRow>

            <SettingsRow label="Deactivated Users" description="Users who cannot access the system">
              <Typography variant="body1">{stats.deactivated}</Typography>
            </SettingsRow>

            <SettingsRow label="Logins (24h)" description="User logins in the last 24 hours">
              <Typography variant="body1">{stats.logins24h}</Typography>
            </SettingsRow>

            <SettingsRow label="MFA Enabled" description="Users with multi-factor authentication enabled">
              <Typography variant="body1">{stats.mfaEnabled}</Typography>
            </SettingsRow>
          </>
        )}
      </Paper>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Quick Actions</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Frequently used administrative operations.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={2}>
          <Button variant="contained">Create New User</Button>
          <Button variant="outlined">Import Users</Button>
          <Button variant="outlined">Export Users</Button>
        </Stack>
      </Paper>

      {/* Insights Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">User Insights</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Activity trends, login statistics, and more.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ height: 200, opacity: 0.4 }}>
          <Typography variant="body2">[Chart Placeholder]</Typography>
        </Box>
      </Paper>
    </Box>
  );
}
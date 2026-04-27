import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { usePermission } from "@src/auth/PermissionContext";
import { addRegistry, type AddRegistryKey } from "@src/core/ui/pages/new/Registry/TypeRegistry";
import { NotificationPage } from "@pages/notification/NotificationPage";
export function Component() {
  const { type } = useParams<{ type: AddRegistryKey }>();
  const { can } = usePermission();

  const config = type ? addRegistry[type] : null;

  if (!config) {
    return <NotificationPage message="Item not found" />;
  }

  if (!can(config.perm)) {
    return <NotificationPage message="You do not have permission to create this item." />;
  }

  const FormComponent = config.component;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        {config.title}
      </Typography>

      <FormComponent endpoint={config.endpoint} />
    </Box>
  );
}

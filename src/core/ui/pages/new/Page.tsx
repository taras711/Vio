import { Box, Grid} from "@mui/material";
import { AddTile } from "@ui/primitives/AddTile";
import { useNavigate } from "react-router-dom";
import { usePermission } from "@src/auth/PermissionContext";
import { addRegistry } from "@pages/new/Registry/TypeRegistry";

export function Component() {
    const navigate = useNavigate();
    const { can } = usePermission();
  console.log("addRegistry", addRegistry);
    const allowedTypes = Object.entries(addRegistry).filter(
      ([key, cfg]) => can(cfg.perm)
    );
    
 console.log("allowedTypes", allowedTypes);
  return (
    <Box sx={{ p: 3, maxWidth: 1100 }}>

      <Grid container spacing={2}>
        {allowedTypes.map(([key, cfg]) => (
            <AddTile
                key={key}
                title={cfg.title || key}
                description={cfg.description}
                icon={<cfg.icon />}
                onClick={() => navigate(`/new/${key}`)}
            />
        ))}
      </Grid>
    </Box>
  );
}

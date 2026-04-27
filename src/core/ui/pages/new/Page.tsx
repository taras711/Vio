import { Box, Grid} from "@mui/material";
import { AddTile } from "@ui/primitives/AddTile";
import { useNavigate } from "react-router-dom";
import { usePermission } from "@src/auth/PermissionContext";
import { addRegistry } from "@pages/new/Registry/typeRegistry";

export function Component() {
    const navigate = useNavigate();
    const { can } = usePermission();

    const allowedTypes = Object.entries(addRegistry).filter(
    ([key, cfg]) => can(cfg.perm)
    );

  return (
    <Box sx={{ p: 3, maxWidth: 1100 }}>

      <Grid container spacing={2}>
        {allowedTypes.map(([key, cfg]) => (
            <AddTile
                key={key}
                title={cfg.title}
                description={cfg.description}
                icon={<cfg.icon />}
                onClick={() => navigate(`/new/${key}`)}
            />
        ))}
        {/* <AddTile
          title="Event"
          description="Meeting, shift, appointment, schedule item"
          icon={<CalendarPlus/>}
          onClick={() => navigate("/add/event")}
        />

        <AddTile
          title="Task"
          description="Assign a task to yourself or others"
          icon={<NotebookPen />}
          onClick={() => navigate("/add/task")}
        />

        <AddTile
          title="Problem"
          description="Report issue, incident, malfunction"
          icon={<ClipboardPen />}
          onClick={() => navigate("/add/problem")}
        />

        <AddTile
          title="Plan"
          description="Create production or work plan"
          icon={<CalendarDays />}
          onClick={() => navigate("/add/plan")}
        />

        <AddTile
          title="Maintenance"
          description="Schedule maintenance or inspection"
          icon={<Toolbox />}
          onClick={() => navigate("/add/maintenance")}
        />

        <AddTile
          title="Audit"
          description="Create audit or checklist"
          icon={<ScrollText />}
          onClick={() => navigate("/add/audit")}
        /> */}
      </Grid>
    </Box>
  );
}

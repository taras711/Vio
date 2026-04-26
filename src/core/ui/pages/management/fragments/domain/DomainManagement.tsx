import { Typography } from "@mui/material";
import { IntegrationManagement, SectorsManagement } from ".";

export function DomainManagement({section}: {section?: string}) {
    switch (section) {
        case "integration":
            return <IntegrationManagement />;
        case "sectors":
            return <SectorsManagement />;
        default:
            return (
                <div>
                <Typography variant="h4">Domain Management Overview</Typography>
                <Typography variant="body2" style={{ marginTop: "1rem", opacity: 0.7 }}>Select a sub‑section from the left.</Typography>
                </div>
            );
    }
}
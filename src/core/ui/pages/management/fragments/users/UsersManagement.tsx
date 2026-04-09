import { ChangeRolePanel, ChangePermissionsPanel, UserSecurityPanel, AdministrationPanel } from "./index";
import { Typography } from "@mui/material";
export function UsersManagement({ section }: { section?: string }) {
    switch (section) {
        case "administration":
            return <AdministrationPanel />
        case "change-role":
            return <ChangeRolePanel />;

        case "change-permissions":
            return <ChangePermissionsPanel />;

        case "lock":
            return <UserSecurityPanel />;

        default:
            return (
                <div>
                <Typography variant="h4">User Management Overview</Typography>
                <Typography variant="body2" style={{ marginTop: "1rem", opacity: 0.7 }}>Select a sub‑section from the left.</Typography>
                </div>
            );

    }
}
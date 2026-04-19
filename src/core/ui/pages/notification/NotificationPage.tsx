// src/core/ui/pages/notification/NotificationPage.tsx
import { Box, Typography } from "@mui/material";
import { APP_VERSION } from "../../../../../shared/version";
import { InfoBar } from "@core/ui/primitives/InfoBar";
import { Unplug } from "lucide-react"
export function NotificationPage({ message, description, children}: {message?: string, description?: string, children?: React.ReactNode}) {
    return (
        <Box className="notification-page">
            <Box style={{display: "flex", flexDirection: "column", textAlign: "center", position: "relative"}}>
                <Box sx={{ display: "flex", justifyContent: "center", color: "#758c9d;", alignItems: "center", gap: 2}}>
                    <Unplug />
                    <Typography
                        className="notification-page-title"
                        variant="h5"
                        gutterBottom
                    >
                        {message}
                    </Typography>
                </Box>
                <Typography color="#c3cfd4" variant="subtitle1">{description}</Typography>
                <Box sx={{ marginTop: 6 }}>
                {children}
                </Box>
            </Box>
            <InfoBar>
                <Typography variant="body2">Version: {APP_VERSION}</Typography>
                <Typography variant="body2">&copy; {new Date().getFullYear()} ARAS Soft</Typography>
            </InfoBar>
        </Box>
    )
}
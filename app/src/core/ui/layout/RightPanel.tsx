import { Box, IconButton } from "@mui/material";
import { X } from "lucide-react";
import { useUI } from "./ui-store";

export function RightPanel() {
    const { rightPanelContent, rightPanelMode, closeRightPanel } = useUI();

    const isOpen = Boolean(rightPanelContent);
    const isModal = rightPanelMode === "modal";

    return (
        <>
            {/* Overlay only for modal */}
            {isOpen && isModal && (
                <Box
                className="right-panel-overlay"
                onClick={closeRightPanel}
                />
            )}

            <Box
            className="right-panel"
            sx={{
                width: rightPanelContent ? 380 : 0,
                boxShadow: rightPanelContent ? "-4px 0 12px rgba(0,0,0,0.1)" : "none"
            }}
            >
            {isOpen && (
                <>
                <Box
                    className="right-panel-header"
                >
                    <IconButton onClick={closeRightPanel}>
                    <X size={20} />
                    </IconButton>
                </Box>

                <Box
                className="right-panel-content"
                sx={{ p: 2, overflowY: "auto", flexGrow: 1 }}>
                    {rightPanelContent}
                </Box>
                </>
            )}
            </Box>
        </>
    );
}

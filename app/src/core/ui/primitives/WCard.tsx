import { Box } from "@mui/material";
import type { ReactNode } from "react";

export const SetupCard = ({ headerContent, children, image }: { headerContent: ReactNode, children: ReactNode, image?: HTMLImageElement | string | undefined }) => {
  return (
    <Box className="w-card" fontStyle={{ display: "flex" }}>
      {image && typeof image === "string" ? <img src={image} className="w-card-logo" alt="logo" style={{ width: "100px", height: "100px", margin: "0px auto" }} /> : <></>}
      <Box className="setup-card" style={{ display: "flex", gap: "20px", padding: "20px", maxWidth: "500px", margin: "0px auto" }}>
        <Box className="w-card-header">
          {headerContent}
        </Box>
        <Box className="w-card-body">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

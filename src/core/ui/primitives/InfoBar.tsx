import { Box } from "@mui/material";

export const InfoBar = ({children}: {children: React.ReactNode}) => {
  return (
    <Box className="info-bar">
      {children}
    </Box>
  );
};
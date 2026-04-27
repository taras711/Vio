import { Box, Grid, Paper, Typography } from "@mui/material";
import { useMediaQuery } from "@mui/material";
export function AddTile({ title, description, icon, onClick }: any) {

  const isMobile = useMediaQuery("(max-width: 670px)");
  return (
    <Grid item xs={12} sm={6} md={4} alignItems="stretch">
      <Paper
        onClick={onClick}
        sx={{
          cursor: "pointer",
          height: "100%",
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
          overflow: "hidden",
          position: "relative",
          transition: "0.25s ease",
          ...(!isMobile && {
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-2px)"
            },
            "&:hover .tile-title": {
              fontSize: "1rem",
              transform: "translateY(-4px)"
            },
            "&:hover .tile-description": {
              opacity: 1,
              transform: "translateY(0)"
            }
          })
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ padding: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "white", background: "linear-gradient(179deg, #7c4097 4%, black)", height: "stretch"}}>{icon}</Box>
          <Box sx={{ padding: 1 }}>
            <Typography className="tile-title" variant="subtitle1" sx={{
                fontWeight: 600,
                transition: "0.25s ease"
              }}>
              {title}
            </Typography>
            <Typography className="tile-description" variant="body2" sx={{
                opacity: isMobile ? 1 : 0,
                ...!isMobile && {transform: "translateY(10px)"},
                transition: "0.25s ease",
                color: "text.secondary"
              }}>
              {description}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
}

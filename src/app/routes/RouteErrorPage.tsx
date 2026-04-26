// src/app/routes/RouteErrorPage.tsx
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { NotificationPage } from "@core/ui/pages/notification/NotificationPage";
import noFound from "@assets/no-found.png";
import forbidden from "@assets/forbidden.png";

export function RouteErrorPage() {
  const error = useRouteError();
  const images = {
    403: forbidden,
    404: noFound,
    default: "error.png",
  };

  let title = "Chyba stránky";
  let detail = "Nastala neočekávaná chyba.";
  let status: number | null = null;
  let image = images.default;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (error.status === 404) {
      title = "Stránka nenalezena";
      detail = "Požadovaná URL neexistuje.";
      image = images[404];
    } else if (error.status === 403) {
      title = "Přístup odepřen";
      detail = "Na tuto stránku nemáte oprávnění.";
      image = images[403];
    } else {
      detail = error.statusText ?? detail;
    }
  } else if (error instanceof Error) {
    detail = error.message;
  }

  return (
    <NotificationPage
      message={title}
      description={detail + (status ? ` (Status: ${status})` : "")}
    >
        <img src={image} alt="Error" style={{ maxWidth: "250px", margin: "0px auto" }} />
        <Box sx={{ mt: 4 }}>
          <Button component={Link} to="/" variant="contained">
            Zpět na dashboard
          </Button>
        </Box>
    </NotificationPage>
  );
}
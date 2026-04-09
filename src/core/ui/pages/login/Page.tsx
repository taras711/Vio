// src/core/ui/pages/login/Page.tsx
import { LoginForm } from "@ui/primitives/Login";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export function Component() {
    return <LoginPage />;
}
export function LoginPage() {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!localStorage.getItem("setupDone")) {
            navigate("/setup");
        }
    }, []);

  return (
    <Box
      className="wizard"
      style={{
        zIndex: 999,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <LoginForm />
    </Box>
  );
}
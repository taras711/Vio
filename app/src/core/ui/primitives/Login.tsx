// src/core/ui/primitives/Login.tsx
import { useState } from "react";
import { Typography, TextField, Button, InputAdornment, IconButton, useMediaQuery } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../../auth/AuthContext";
import {SetupCard} from "@ui/primitives/WCard";
import logo from "@assets/logo_trial.png";
import { useNavigate } from "react-router-dom";
import { useActionFeedback } from "@hooks/ActionFeedback";

export function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const [iserror, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { success, error } = useActionFeedback();

const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
  e.preventDefault();
  setError("");

  if (!email.trim()) {
    setError("Zadejte email");
    return;
  }
  if (!password.trim()) {
    setError("Zadejte heslo");
    return;
  }

  try {
    await login(email, password);
    navigate("/", { replace: true });
  } catch (err) {
    setError(String(err));
    error(String(err));
  }
};

return (
  <SetupCard
    headerContent={
      <>
        <img src={logo} width="50" />
        <h3>VECTA</h3>
      </>
    }
  >
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" className="w-b-header" gutterBottom>
        Login
      </Typography>

      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((p) => !p)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {iserror && <div className="error">{iserror}</div>}

      <Button style={{ marginTop: 20 }} fullWidth type="submit">
        Login
      </Button>
    </form>
  </SetupCard>
);

}


import { useState } from "react";
import {SetupCard} from "../../core/ui/primitives/WCard";
import { Box, Button, TextField, Select, Typography, MenuItem} from "@mui/material";
import { InfoBar } from "@core/ui/primitives/InfoBar";
import logo from "@assets/logo_trial.png";
import { APP_VERSION } from "../../../shared/version"; 
import { useNavigate } from "react-router-dom";
import { useActionFeedback } from "@hooks/ActionFeedback";

export function SetupWizard() {
  const { success, error } = useActionFeedback();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const version = APP_VERSION;
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseError, setLicenseError] = useState("");

  type DbConfig =
  | {
      type: "postgres" | "mysql";
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    }
  | {
      type: "sqlite";
      file: string;
    }
  | {
      type: "mongo";
      url: string;
      database: string;
    }
  | {
      type: "firebird";
      host: string;
      port: number;
      user: string;
      password: string;
      file: string;
    };

const [db, setDb] = useState<DbConfig>({
  type: "postgres",
  host: "",
  port: 5432,
  user: "",
  password: "",
  database: ""
});
  const [dbError, setDbError] = useState("");
  const [dbTesting, setDbTesting] = useState(false);

  const [admin, setAdmin] = useState({
    email: "",
    name: "",
    password: ""
  });
  const [adminError, setAdminError] = useState("");

  const [loading, setLoading] = useState(false);

  async function testDb() {
    console.log("DB SENT TO BACKEND (testDb):", db);
    setDbError("");
    setDbTesting(true);

    try {
      const res = await fetch("/api/setup/test-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(db)
      });

      const json = await res.json();

      if (!json.ok) {
        setDbError(json.error);
        return false;
      }

      return true;
    } catch (err: any) {
      setDbError(err.message);
      return false;
    } finally {
      setDbTesting(false);
    }
  }

  async function validateLicense() {
    try {
      const res = await fetch("/api/setup/validate-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey })
      });

      const json = await res.json();

      if (!json.ok) {
        setLicenseError(json.error);
        error(json.error);
        return false;
      }

      return true;
    } catch (err: any) {
      setLicenseError(err.message);
      error(err.message);
      return false;
    }
  }

async function finishSetup() {
  setLoading(true);
  setAdminError("");

  if (!await validateLicense()) {
    setLoading(false);
    error("Invalid license key");
    return;
  }

  if (!admin.email.includes("@")) {
    setAdminError("Invalid email address");
    setLoading(false);
    error("Invalid email address");
    return;
  }

  if (admin.name.length < 3) {
    setAdminError("Name must be at least 3 characters long");
    setLoading(false);
    error("Name must be at least 3 characters long");
    return;
  }

  if (admin.password.length < 6) {
    setAdminError("Password must be at least 6 characters long");
    setLoading(false);
    error("Password must be at least 6 characters long");
    return;
  }

  try {
    const res = await fetch("/api/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: admin.email,
        name: admin.name,
        password: admin.password,
        licenseKey,
        database: db
      })
    });

    const json = await res.json();

    if (!json.ok) {
      setAdminError(json.error);
      setLoading(false);
      return;
    }

    // ⭐ TADY JE KLÍČ
    localStorage.setItem("setupDone", "true");

    // ⭐ ŽÁDNÝ reload
    navigate("/login", { replace: true });

  } catch (err: any) {
    setAdminError(err.message);
    success("Setup finished");
  } finally {
    setLoading(false);
  }
}

  return (
    <Box className="wizard">

      {/* STEP 1 – LICENSE */}
      {step === 1 && (
        <SetupCard headerContent={(
          <>
            <img src={logo} width="50" />
            <h3>VECTA</h3>
          </>
        )} children={(
          <>
            <Typography variant="h4"className="w-b-header" gutterBottom>License Key</Typography>
            <>
            <Typography variant="body2" gutterBottom style={{ color: "gray"}}>Don't have a license key? <a href="https://www.vectaportal.com/contact" target="_blank" rel="noreferrer">Contact service support</a></Typography>
            <TextField
              label="Licenční klíč"
              fullWidth
              value={licenseKey}
              onChange={e => setLicenseKey(e.target.value)}
            />
              {licenseError && (
                <Typography style={{ color: "red", marginTop: 10 }}>{licenseError}</Typography>
              )}
            <Button style={{ marginTop: 20 }}
              onClick={async () => {
                if (!licenseKey.trim()) {
                  setLicenseError("License key is required");
                  return;
                }
                const ok = await validateLicense();
                if (ok) setStep(2);
              }}>Next</Button>
            </>
          </>
        )} />
      )}

      {/* STEP 2 – DATABASE */}
{/* STEP 2 – DATABASE */}
      {step === 2 && (
        
        <SetupCard
          headerContent={
            <>
              <img src={logo} width="50" />
              <h3>VECTA</h3>
            </>
          }
          children={
            <>
              <Typography variant="h4" className="w-b-header" gutterBottom>
                Database Setup
              </Typography>
              <Select
                label="Type"
                fullWidth
                value={db.type}
                onChange={e => {
                  const type = e.target.value as any;

                  // reset fields when switching DB type
                  if (type === "sqlite") {
                    setDb({ type, file: "" } as any);
                  } else if (type === "mongo") {
                    setDb({ type, url: "", database: "" } as any);
                  } else if (type === "firebird") {
                    setDb({
                      type,
                      host: "",
                      port: 3050,
                      user: "",
                      password: "",
                      file: ""
                    } as any);
                  } else {
                    // postgres / mysql
                    setDb({
                      type,
                      host: "",
                      port: type === "postgres" ? 5432 : 3306,
                      user: "",
                      password: "",
                      database: ""
                    } as any);
                  }
                }}
              >
                <MenuItem value="postgres">PostgreSQL</MenuItem>
                <MenuItem value="mysql">MySQL / MariaDB</MenuItem>
                <MenuItem value="sqlite">SQLite</MenuItem>
                <MenuItem value="mongo">MongoDB</MenuItem>
                <MenuItem value="firebird">Firebird</MenuItem>
              </Select>

              {/* PostgreSQL / MySQL */}
              {(db.type === "postgres" || db.type === "mysql") && (
                <>
                  <TextField label="Host" fullWidth value={db.host} onChange={e => setDb({ ...db, host: e.target.value })} />
                  <TextField label="Port" fullWidth value={db.port} onChange={e => setDb({ ...db, port: Number(e.target.value) })} />
                  <TextField label="User" fullWidth value={db.user} onChange={e => setDb({ ...db, user: e.target.value })} />
                  <TextField label="Password" fullWidth value={db.password} onChange={e => setDb({ ...db, password: e.target.value })} />
                  <TextField label="Database" fullWidth value={db.database} onChange={e => setDb({ ...db, database: e.target.value })} />
                </>
              )}

              {/* SQLite */}
              {db.type === "sqlite" && (
                <TextField
                  label="SQLite File Path"
                  fullWidth
                  value={db.file || ""}
                  onChange={e => setDb({ ...db, file: e.target.value })}
                />
              )}

              {/* MongoDB */}
              {db.type === "mongo" && (
                <>
                  <TextField
                    label="MongoDB URL"
                    fullWidth
                    value={db.url || ""}
                    onChange={e => setDb({ ...db, url: e.target.value })}
                  />
                  <TextField
                    label="Database Name"
                    fullWidth
                    value={db.database || ""}
                    onChange={e => setDb({ ...db, database: e.target.value })}
                  />
                </>
              )}

              {/* Firebird */}
              {db.type === "firebird" && (
                <>
                  <TextField label="Host" fullWidth value={db.host} onChange={e => setDb({ ...db, host: e.target.value })} />
                  <TextField label="Port" fullWidth value={db.port} onChange={e => setDb({ ...db, port: Number(e.target.value) })} />
                  <TextField label="User" fullWidth value={db.user} onChange={e => setDb({ ...db, user: e.target.value })} />
                  <TextField label="Password" fullWidth value={db.password} onChange={e => setDb({ ...db, password: e.target.value })} />
                  <TextField
                    label="Database File (.fdb)"
                    fullWidth
                    value={db.file || ""}
                    onChange={e => setDb({ ...db, file: e.target.value })}
                  />
                </>
              )}
      {  console.log("DB SENT TO BACKEND:", db)}
              {dbError && (
                <Typography style={{ color: "red", marginTop: 10 }}>
                  {dbError}
                </Typography>
              )}

              <Button style={{ marginTop: 20 }} onClick={async () => {
                const ok = await testDb();
                if (ok) setStep(3);
              }}>
                {dbTesting ? "Connecting…" : "Next"}
              </Button>
            </>
          }
        />
      )}

      {/* STEP 3 – ADMIN */}
      {step === 3 && (
        <SetupCard
          headerContent={
            <>
              <img src={logo} width="50" />
              <h3>VECTA</h3>
            </>
          }
          children={(
            <>
              <Typography variant="h4" className="w-b-header" gutterBottom>
                Admin Account
              </Typography>
              <Typography variant="body2" gutterBottom style={{ color: "gray" }}>
                This account will have full access to the system. Make sure to choose a strong password.
              </Typography>
              <TextField
                label="Email"
                fullWidth
                value={admin.email}
                autoComplete="email"
                type="email"
                autoFocus
                onChange={e => setAdmin({ ...admin, email: e.target.value })}
              />
              <TextField
                label="User Name"
                fullWidth
                value={admin.name}
                onChange={e => setAdmin({ ...admin, name: e.target.value })}
              />
              <TextField
                label="Password"
                fullWidth
                autoComplete="new-password"
                minRows={6}
                type="password"
                value={admin.password}
                onChange={e => setAdmin({ ...admin, password: e.target.value })}
              />
              {adminError && (
                <Typography style={{ color: "red", marginTop: 10 }}>
                  {adminError}
                </Typography>
              )}
              <Button style={{ marginTop: 20 }} disabled={loading} onClick={finishSetup}>
                {loading ? "Installing..." : "Finish"}
              </Button>
            </>
          )} />
      )}
      <InfoBar>
        <Typography variant="body2">Version: {version}</Typography>
        <Typography variant="body2">&copy; {new Date().getFullYear()} ARAS Soft</Typography>
      </InfoBar>
    </Box>
  );
}
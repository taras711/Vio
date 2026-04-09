import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UsersService } from "@src/services/users";
import { Tabs, Tab, Box, Card, CardContent, Button } from "@mui/material";
import type { UserData, Session } from "@src/types/users";

interface PermissionsTabProps {
  userData: UserData;
  onChange: (permissions: string[]) => void;
}

interface RoleTabProps {
  userData: UserData;
  onChange: (role: string) => void;
}

interface SecurityTabProps {
  userData: UserData;
}

interface SessionsTabProps {
  userData: UserData;
}

export function Component() {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [tab, setTab] = useState<number>(0);

  useEffect(() => {
    if (!id) return;
    UsersService.get(id).then(res => setUserData(res.data as UserData));
  }, [id]);

  if (!id) return <div>Invalid user ID</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <Tabs value={tab} onChange={(_, v: number) => setTab(v)}>
        <Tab label="Permissions" />
        <Tab label="Role" />
        <Tab label="Security" />
        <Tab label="Sessions" />
      </Tabs>

      <Box mt={4}>
        {tab === 0 && (
          <PermissionsTab
            userData={userData}
            onChange={perms =>
              setUserData({ ...userData, permissions: perms })
            }
          />
        )}

        {tab === 1 && (
          <RoleTab
            userData={userData}
            onChange={role => setUserData({ ...userData, role })}
          />
        )}

        {tab === 2 && <SecurityTab userData={userData} />}

        {tab === 3 && <SessionsTab userData={userData} />}
      </Box>
    </div>
  );
}

function SessionsTab({ userData }: SessionsTabProps) {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    UsersService.getSessions(userData.id).then(res => {
      setSessions(res.data);
    });
  }, [userData.id]);

  const killAll = () => {
    UsersService.killSessions(userData.id).then(() => {
      setSessions([]);
    });
  };

  return (
    <Card>
      <CardContent>
        <ul>
          {sessions.map(s => (
            <li key={s.id}>
              {s.device} – {s.ip} – {s.lastActive}
            </li>
          ))}
        </ul>

        <Button variant="contained" color="error" onClick={killAll}>
          Odhlásit všechny sessions
        </Button>
      </CardContent>
    </Card>
  );
}

function SecurityTab({ userData }: SecurityTabProps) {
  const resetPassword = () => {
    UsersService.resetPassword(userData.id);
  };

  const deactivate = () => {
    UsersService.deactivate(userData.id);
  };

  const activate = () => {
    UsersService.activate(userData.id);
  };

  return (
    <Card>
      <CardContent>
        <Button variant="contained" color="error" onClick={resetPassword}>
          Reset hesla
        </Button>

        <Button
          variant="outlined"
          color="warning"
          sx={{ ml: 2 }}
          onClick={deactivate}
        >
          Deaktivovat účet
        </Button>

        <Button
          variant="outlined"
          color="success"
          sx={{ ml: 2 }}
          onClick={activate}
        >
          Aktivovat účet
        </Button>
      </CardContent>
    </Card>
  );
}

function RoleTab({ userData, onChange }: RoleTabProps) {
  const [role, setRole] = useState<string>(userData.role);

  const save = () => {
    UsersService.updateRole(userData.id, role).then(() => {
      onChange(role);
    });
  };

  const ROLES: string[] = ["user", "admin", "superAdmin"];

  return (
    <Card>
      <CardContent>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{ padding: 8, marginBottom: 16 }}
        >
          {ROLES.map(r => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <Button variant="contained" onClick={save}>
          Změnit roli
        </Button>
      </CardContent>
    </Card>
  );
}

function PermissionsTab({ userData, onChange }: PermissionsTabProps) {
  const [permissions, setPermissions] = useState<string[]>(userData.permissions);

  const toggle = (perm: string) => {
    setPermissions(prev =>
      prev.includes(perm)
        ? prev.filter(p => p !== perm)
        : [...prev, perm]
    );
  };

  const save = () => {
    UsersService.updatePermissions(userData.id, permissions).then(() => {
      onChange(permissions);
    });
  };

  const ALL_PERMISSIONS: string[] = [
    "users.view",
    "users.edit",
    "users.delete",
    "machines.view",
    "machines.manage",
    "admin.super",
  ];

  return (
    <Card>
      <CardContent>
        {ALL_PERMISSIONS.map(p => (
          <div key={p}>
            <label>
              <input
                type="checkbox"
                checked={permissions.includes(p)}
                onChange={() => toggle(p)}
              />
              {p}
            </label>
          </div>
        ))}

        <Button variant="contained" sx={{ mt: 2 }} onClick={save}>
          Uložit změny
        </Button>
      </CardContent>
    </Card>
  );
}
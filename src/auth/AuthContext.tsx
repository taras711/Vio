import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // načtení uživatele při startu
useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    setLoading(false);
    return;
  }

  api.get("/auth/me")
    .then(res => setUser(res.data))
    .catch(() => setUser(null))
    .finally(() => setLoading(false));   // ← TADY JE TEN KLÍČ
}, []);

async function login(email: string, password: string) {
  try {
    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    const me = await api.get("/auth/me");
    setUser(me.data);
    setLoading(false);
  } catch (err: any) {
    const message =
      err?.response?.data?.error ||
      err?.message ||
      "Přihlášení selhalo";

    throw message;
  }
}

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
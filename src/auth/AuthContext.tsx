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

  // 🔥 Po startu aplikace vždy obnovíme session
useEffect(() => {
  api.post("/auth/refresh")
    .then(async () => {
      const me = await api.get("/auth/me");
      setUser(me.data);
    })
    .catch(() => {
      // 🔥 TADY JE POINTA:
      // "No refresh token" = uživatel není přihlášen → normální stav
      setUser(null);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

useEffect(() => {
  function handleForceLogout() {
    setUser(null);
  }

  window.addEventListener("force-logout", handleForceLogout);
  return () => window.removeEventListener("force-logout", handleForceLogout);
}, []);


  async function login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });

    const me = await api.get("/auth/me");
    setUser(me.data);
  }


  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.warn("Logout failed:", e);
    }

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

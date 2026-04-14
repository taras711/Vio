import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";


interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const navigate = useNavigate();
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // načtení uživatele při startu
useEffect(() => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    setUser(null);
    setLoading(false);
    navigate("/login", { replace: true });
    return;
  }

  api.get("/auth/me")
    .then(res => {
      setUser(res.data);
    })
    .catch(err => {
      if (err.response?.status === 401) {
        // token expiroval nebo je neplatný
        localStorage.removeItem("accessToken");
        setUser(null);
        navigate("/login", { replace: true });
        return;
      }

      // jiná chyba
      console.error(err);
    })
    .finally(() => setLoading(false));
}, []);


async function login(email: string, password: string) {
  try {
    const res = await api.post("http://localhost:3000/api/auth/login", { email, password });

    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("csrf", res.data.csrfToken);

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
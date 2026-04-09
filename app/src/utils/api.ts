import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// REQUEST: přidáme access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE: zachytíme 401 a zkusíme refresh
let isRefreshing = false;
let queue: any[] = [];

api.interceptors.response.use(
  res => res,
  async (error) => {
    const original = error.config;

    if (original.url?.includes("/auth/login")) {
      return Promise.reject(error);
    }
    // pokud není 401 → normální chyba
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    // pokud už probíhá refresh → počkáme
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      })
        .then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        })
        .catch(Promise.reject);
    }

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      const res = await axios.post("/api/auth/refresh", { refreshToken });

      const newAccess = res.data.accessToken;
      const newRefresh = res.data.refreshToken;

      localStorage.setItem("accessToken", newAccess);
      localStorage.setItem("refreshToken", newRefresh);

      // probudíme čekající requesty
      queue.forEach((p) => p.resolve(newAccess));
      queue = [];
      isRefreshing = false;

      // zopakujeme původní request
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);

    } catch (err) {
      queue.forEach((p) => p.reject(err));
      queue = [];
      isRefreshing = false;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // ❌ window.location.href = "/login";
      // ✔ nech to na ProtectedRoute
      return Promise.reject(err);
    }

  }
);

export default api;
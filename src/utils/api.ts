import axios from "axios";
import Cookies from "js-cookie";
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true
});

// REQUEST: přidáme access token


api.interceptors.request.use((config) => {
  const csrf = Cookies.get("csrf_token"); // název cookie z backendu
  const access = localStorage.getItem("accessToken");

  if (csrf) {
    config.headers["x-csrf-token"] = csrf;
  }

  if (access) {
    config.headers["Authorization"] = "Bearer " + access;
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

    // login ani refresh neřešíme přes interceptor
    if (original.url?.includes("/auth/login") || original.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

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
      

      const res = await api.post("/auth/refresh");

      const newAccess = res.data.accessToken;

      localStorage.setItem("accessToken", newAccess);

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
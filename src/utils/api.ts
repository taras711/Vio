import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// REQUEST: přidáme access token
axios.interceptors.request.use((config) => {
  const csrf = localStorage.getItem("csrf");
  if (csrf) {
    config.headers["x-csrf-token"] = csrf;
  }
  return config;
});

// 1) CSRF RESPONSE INTERCEPTOR – MUSÍ BÝT PRVNÍ
api.interceptors.response.use((response) => {
  const csrf = response.headers["x-csrf-token"];
  if (csrf) {
    localStorage.setItem("csrf", csrf);
  }
  return response;
});

// 2) REFRESH TOKEN INTERCEPTOR – MUSÍ BÝT AŽ POD TÍM
let isRefreshing = false;
let queue: any[] = [];

api.interceptors.response.use(
  res => res,
  async (error) => {
    const original = error.config;

    if (original.url?.includes("/auth/login")) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

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

      queue.forEach((p) => p.resolve(newAccess));
      queue = [];
      isRefreshing = false;

      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);

    } catch (err) {
      queue.forEach((p) => p.reject(err));
      queue = [];
      isRefreshing = false;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return Promise.reject(err);
    }
  }
);


export default api;
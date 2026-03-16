import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ENV } from "./env.config";

// ─── Consistent token keys — used everywhere ──────────────────────────────────
export const TOKEN_KEYS = {
  access: "accessToken",
  refresh: "refreshToken",
};

const axiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor — attach access token ────────────────────────────────
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEYS.access);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — refresh on 401 ───────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

const clearAuthAndRedirect = () => {
  localStorage.removeItem(TOKEN_KEYS.access);
  localStorage.removeItem(TOKEN_KEYS.refresh);
  window.location.href = "/login";
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as any;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(TOKEN_KEYS.refresh);

      if (!refreshToken) {
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${ENV.API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const newAccessToken: string = data.data.accessToken;
        const newRefreshToken: string = data.data.refreshToken;

        localStorage.setItem(TOKEN_KEYS.access, newAccessToken);
        localStorage.setItem(TOKEN_KEYS.refresh, newRefreshToken);

        processQueue(null, newAccessToken);
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(original);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
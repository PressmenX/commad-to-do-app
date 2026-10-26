import axios, { type AxiosError } from "axios";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config;
    const url = request?.url ?? "";

    if (
      error.response?.status !== 401 ||
      !request ||
      url.includes("/auth/login") ||
      url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (request._retry) {
      window.dispatchEvent(new Event("auth:unauthorized"));
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api
          .post("/auth/refresh")
          .then(() => undefined)
          .finally(() => {
            refreshPromise = null;
          });
      }

      await refreshPromise;
      return api.request(request);
    } catch (refreshError) {
      if (
        refreshError &&
        typeof refreshError === "object" &&
        "response" in refreshError &&
        refreshError.response &&
        typeof refreshError.response === "object" &&
        "status" in refreshError.response &&
        refreshError.response.status === 401
      ) {
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
      return Promise.reject(refreshError);
    }
  },
);
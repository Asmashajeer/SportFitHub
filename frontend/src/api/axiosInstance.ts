import axios from "axios";
import { useAuthStore } from "../features/auth/store/useAuthStore";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLoginPath = originalRequest.url.includes("/auth/login");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginPath &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh");

        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

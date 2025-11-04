// src/api/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false; // prevent multiple refreshes

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and refresh token available
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) return Promise.reject(error);
      isRefreshing = true;

      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: refreshToken,
          });

          localStorage.setItem("access_token", res.data.access);
          axiosInstance.defaults.headers.Authorization = `Bearer ${res.data.access}`;
          isRefreshing = false;

          // Retry the failed request
          return axiosInstance(originalRequest);
        } catch (err) {
          // 🔴 Token refresh failed → logout once
          isRefreshing = false;
          localStorage.clear();

          // Instead of refreshing the entire page, redirect softly
          if (window.location.pathname !== "/login") {
            setTimeout(() => {
              window.location.replace("/login");
            }, 100);
          }
        }
      } else {
        localStorage.clear();
        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

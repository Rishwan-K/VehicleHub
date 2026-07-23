import axios from "axios";

export const axiosInstance = axios.create({
  // Set REACT_APP_API_URL in client/.env, e.g. http://localhost:8082/api
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

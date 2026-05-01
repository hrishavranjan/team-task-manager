import axios from "axios";

const API = axios.create({
  baseURL: "https://team-task-manager-48k6.onrender.com/api" // ✅ FIXED
});

// 🔥 Attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
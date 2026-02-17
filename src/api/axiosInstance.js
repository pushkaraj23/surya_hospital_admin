import axios from "axios";
import { BASE_URL } from "./apiConfig";
const axiosInstance = axios.create({
  baseURL: BASE_URL + "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach auth token when present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      `🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received:`, response.status, response.data);
    return response;
  },
  (error) => {
    // Handle 401: clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminEmail");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
    // Handle other errors
    if (error.response) {
      console.error("❌ API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      console.error("❌ Network Error:", error.message);
      error.message = "Network error: Unable to connect to server";
    } else {
      console.error("❌ Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

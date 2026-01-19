import axios from "axios";
import { BASE_URL } from "./apiConfig";
const axiosInstance = axios.create({
  baseURL: BASE_URL + "api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
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
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      console.error("❌ API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      // Request made but no response received
      console.error("❌ Network Error:", error.message);
      error.message = "Network error: Unable to connect to server";
    } else {
      // Something else happened
      console.error("❌ Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

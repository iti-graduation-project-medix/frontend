import axios from "axios";

const baseURL = "https://backend.dawaback.com";

// Create axios instance with default config
const api = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token and set Content-Type smartly
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        config.headers.Authorization = `Bearer ${parsedToken}`;
      } catch (error) {
        console.error("Error parsing token:", error);
        localStorage.removeItem("token");
      }
    }
    // Smart Content-Type handling
    if (
      config.data &&
      typeof config.data === "object" &&
      !(config.data instanceof FormData)
    ) {
      config.headers["Content-Type"] = "application/json";
    } else {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (error.code === "NETWORK_ERROR" || error.code === "ERR_NETWORK") {
      throw new Error(
        "Network error. Please check your internet connection and try again."
      );
    }

    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      throw new Error(
        "Request timeout. Please check your connection and try again."
      );
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // You can redirect to login page here if needed
      throw new Error("Authentication required. Please log in again.");
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }

    // For other errors, throw the original error with message
    throw error;
  }
);

export default api;

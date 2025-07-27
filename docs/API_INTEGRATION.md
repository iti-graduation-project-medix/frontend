# API Integration

This document describes how the Dawaback frontend application interacts with the backend API, covering the structure, common practices, and error handling.

## 1. Overview

All communication with the backend API is centralized within the `src/api/` directory. We use `axios` as our HTTP client, configured with a base URL and interceptors for consistent request/response handling, especially for authentication.

## 2. Axios Instance Configuration

A custom `axios` instance (`src/api/axios.js`) is used to set up global configurations, such as the base URL and request/response interceptors. This ensures that every API call automatically includes necessary headers (e.g., Authorization token) and handles common error responses.

**`src/api/axios.js`**

```javascript
import axios from "axios";
import { toast } from "sonner";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Centralized error handling using sonner toasts
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    if (error.response?.status === 401) {
      // Handle unauthorized errors globally, e.g., redirect to login
      toast.error("Session expired. Please log in again.");
      // Optionally, clear local storage and redirect
      // localStorage.clear();
      // window.location.href = '/auth/login';
    } else if (error.response?.status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else if (error.response?.status >= 400 && error.response?.status < 500) {
      // Client-side errors
      toast.error(message);
    } else if (error.response?.status >= 500) {
      // Server-side errors
      toast.error("Server error. Please try again later.");
    } else {
      // Network errors, etc.
      toast.error("Network error. Please check your internet connection.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

## 3. Organizing API Calls

API calls are organized by feature or domain within the `src/api/` directory. Each file in this directory exports functions responsible for specific API interactions.

**Structure Example:**

```
src/api/
├── auth/
│   ├── ChangePassword.js
│   ├── ResetPassword.js
│   ├── SignIn.js
│   └── SignUp.js
├── deals.js
├── pharmacies.js
├── profile/
│   └── profile.js
└── axios.js          # The configured axios instance
```

**Example: `src/api/auth/SignIn.js`**

```javascript
import axiosInstance from "../axios";

export const signIn = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data; // Assuming data contains user info and token
};
```

**Example: `src/api/deals.js`**

```javascript
import axiosInstance from "./axios";

export const fetchDeals = async (params) => {
  const response = await axiosInstance.get("/deals", { params });
  return response.data;
};

export const createDeal = async (dealData) => {
  const response = await axiosInstance.post("/deals", dealData);
  return response.data;
};

// ... other deal-related API functions
```

## 4. How to Add a New API Endpoint

1.  **Determine Location**: If it's a new feature, consider creating a new file in `src/api/`. If it's related to an existing feature, add it to the corresponding file.
2.  **Import `axiosInstance`**: Ensure you import the configured `axiosInstance`.
3.  **Define Function**: Create an `async` function that makes the `axios` call (e.g., `get`, `post`, `put`, `delete`).
4.  **Handle Data**: Return `response.data` or handle the response as needed.

**Example (Hypothetical `src/api/products.js`):**

```javascript
import axiosInstance from "./axios";

export const getProductById = async (productId) => {
  const response = await axiosInstance.get(`/products/${productId}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axiosInstance.post("/products", productData);
  return response.data;
};
```

## 5. Error Handling

Frontend errors related to API calls are handled in two main places:

- **Global Interceptor (`axios.js`)**: Catches common HTTP errors (e.g., 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error) and displays a `sonner` toast notification. This provides immediate user feedback.
- **Zustand Stores / Component Logic**: For specific error handling or displaying errors within forms, the `catch` block in async actions (e.g., `login` action in `useAuth` store) can access the rejected error from the API call. The `ErrorHandler` utility (`src/utils/errorHandler.js`) can also be used for more specific error processing.

This robust API integration strategy ensures consistent, secure, and user-friendly interaction with the backend services.

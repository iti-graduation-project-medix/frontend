import { create } from "zustand";
import { signIn } from "../api/auth/SignIn";
import {
  resetPassword,
  confirmOtp,
  confirmPassword,
} from "../api/auth/ResetPassword";
import { changePassword } from "../api/auth/ChangePassword";
import { clearAllStores } from "../utils/stateManager";
import { ErrorHandler } from "../utils/errorHandler";
import { useUserDetails } from "./useUserDetails";

export const useAuth = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  // Login action
  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const response = await signIn(credentials);

      // Store user data and token
      const userData = response.data || response;
      const token = userData.token || userData.accessToken;

      // Reset user details store to clear previous user's data
      const { resetUserDetails } = useUserDetails.getState();
      if (resetUserDetails) {
        resetUserDetails();
      }

      // Save to localStorage - store the full user object, not just the ID
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", JSON.stringify(token));

      set({
        user: userData,
        token: token,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      });

      // Show success toast
      ErrorHandler.handleSuccess("Login successful! Welcome back.");

      return response;
    } catch (error) {
      const errorResult = ErrorHandler.handleApiError(error, "login");

      set({
        isLoading: false,
        error: errorResult.message,
        isAuthenticated: false,
      });

      throw error;
    }
  },

  // Reset Password action
  resetPassword: async (data) => {
    set({ isLoading: true, error: null });
    try {
      if (data.email) sessionStorage.setItem("resetEmail", data.email);
      const response = await resetPassword(data);
      set({ isLoading: false, error: null });
      ErrorHandler.handleSuccess(
        "Password reset instructions sent to your email"
      );
      return response;
    } catch (error) {
      const errorResult = ErrorHandler.handleApiError(error, "reset-password");
      set({
        isLoading: false,
        error: errorResult.message,
      });
      throw error;
    }
  },

  // Confirm OTP action
  confirmOtp: async (data) => {
    set({ isLoading: true, error: null });
    try {
      if (data.email) sessionStorage.setItem("resetEmail", data.email);
      const response = await confirmOtp(data);
      set({ isLoading: false, error: null });
      ErrorHandler.handleSuccess("OTP has been successfully verified!");
      return response;
    } catch (error) {
      const errorResult = ErrorHandler.handleApiError(error, "confirm-otp");
      set({
        isLoading: false,
        error: errorResult.message,
      });
      throw error;
    }
  },

  // Confirm Password action
  confirmPassword: async (data) => {
    set({ isLoading: true, error: null });
    try {
      if (data.email) sessionStorage.setItem("resetEmail", data.email);
      const response = await confirmPassword(data);
      set({ isLoading: false, error: null });
      ErrorHandler.handleSuccess("Password has been successfully changed!");
      return response;
    } catch (error) {
      const errorResult = ErrorHandler.handleApiError(
        error,
        "confirm-password"
      );
      set({
        isLoading: false,
        error: errorResult.message,
      });
      throw error;
    }
  },

  // Change Password action
  changePassword: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const token = get().token;
      const response = await changePassword(data, token);
      set({ isLoading: false, error: null });
      ErrorHandler.handleSuccess("Password has been successfully changed!");
      return response;
    } catch (error) {
      const errorResult = ErrorHandler.handleApiError(error, "change-password");
      set({
        isLoading: false,
        error: errorResult.message,
      });
      throw error;
    }
  },

  // Logout action
  logout: () => {
    // Clear auth data
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Clear all other store data
    clearAllStores();

    // Reset user details store
    const { resetUserDetails } = useUserDetails.getState();
    if (resetUserDetails) {
      resetUserDetails();
    }

    set({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });

    ErrorHandler.handleSuccess("Logged out successfully");
  },

  // Initialize auth state from localStorage
  initializeAuth: () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (user && token) {
      try {
        set({
          user: JSON.parse(user),
          token: JSON.parse(token),
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Error parsing stored auth data:", error);
        // Clear corrupted data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

// Initialize auth state when the app loads
useAuth.getState().initializeAuth();

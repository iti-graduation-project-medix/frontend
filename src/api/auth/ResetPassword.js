import api from "../axios.js";

export const resetPassword = async (data) => {
  try {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Email not found. Please check your email address.");
    } else {
      throw new Error(
        error.response?.data?.message || "Failed to send reset instructions"
      );
    }
  }
};

export const confirmOtp = async (data) => {
  try {
    const response = await api.post("/auth/confirm-otp", data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error("Invalid or expired OTP. Please try again.");
    } else if (error.response?.status === 404) {
      throw new Error("User not found. Please check your email address.");
    } else {
      throw new Error(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
};

export const confirmPassword = async (data) => {
  try {
    const response = await api.post("/auth/confirm-password", data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(
        "OTP not verified or expired. Please verify your OTP first."
      );
    } else if (error.response?.status === 404) {
      throw new Error("User not found. Please check your email address.");
    } else {
      throw new Error(error.response?.data?.message || "Password reset failed");
    }
  }
};

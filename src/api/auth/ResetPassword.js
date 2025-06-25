import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const resetPassword = (data) =>
  axios.post(`${baseURL}/api/v1/auth/reset-password`, data);

export const confirmOtp = (data) =>
  axios.post(`${baseURL}/api/v1/auth/confirm-otp`, data);

export const confirmPassword = (data) =>
  axios.post(`${baseURL}/api/v1/auth/confirm-password`, data);

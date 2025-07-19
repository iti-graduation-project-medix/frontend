import api from "../axios.js";

export const signIn = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Email or password is incorrect");
    } else if (error.response?.status === 403) {
      // Check the specific error message from backend
      if (
        error.response?.data?.message &&
        error.response.data.message.includes("blocked")
      ) {
        throw new Error(
          "Your account has been blocked. Please contact support for assistance."
        );
      } else if (
        error.response?.data?.message &&
        error.response.data.message.includes("rejected")
      ) {
        throw new Error(
          "Your documents were rejected. Please contact support for assistance."
        );
      } else if (
        error.response?.data?.message &&
        error.response.data.message.includes("under review")
      ) {
        throw new Error(
          "Your documents are still under review. Please wait for admin approval."
        );
      } else if (
        error.response?.data?.message &&
        error.response.data.message.includes("admin verification")
      ) {
        throw new Error(
          "Your profile is pending admin verification. Please wait for approval."
        );
      } else {
        throw new Error(error.response?.data?.message || "Access denied");
      }
    } else if (error.response?.status === 404) {
      throw new Error("Email or password is incorrect");
    } else {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }
};

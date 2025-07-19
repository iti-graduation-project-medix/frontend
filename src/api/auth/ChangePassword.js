import api from "../axios.js";

export const changePassword = async (data, token) => {
  try {
    const response = await api.post("/auth/change-password", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Authentication required. Please log in again.");
    } else if (error.response?.status === 400) {
      if (
        error.response?.data?.message &&
        error.response.data.message.includes("incorrect")
      ) {
        throw new Error("Current password is incorrect.");
      } else if (
        error.response?.data?.message &&
        error.response.data.message.includes("match")
      ) {
        throw new Error("New passwords do not match.");
      } else {
        throw new Error(
          error.response?.data?.message || "Invalid request data"
        );
      }
    } else if (error.response?.status === 404) {
      throw new Error("User not found. Please log in again.");
    } else {
      throw new Error(
        error.response?.data?.message || "Failed to change password"
      );
    }
  }
};

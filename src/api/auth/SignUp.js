import api from "../axios.js";

export const signUp = async (formData) => {
  try {
    const response = await api.post("/auth/signup", formData, {
      headers: {
        // Remove Content-Type for FormData
        "Content-Type": undefined,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      // File upload errors
      if (
        error.response?.data?.message &&
        error.response.data.message.includes("Front ID card image is required")
      ) {
        throw new Error(
          "Front ID card image is required. Please upload the front side of your national ID."
        );
      } else if (
        error.response?.data?.message &&
        error.response.data.message.includes("Back ID card image is required")
      ) {
        throw new Error(
          "Back ID card image is required. Please upload the back side of your national ID."
        );
      } else if (
        error.response?.data?.message &&
        error.response.data.message.includes("Work ID image is required")
      ) {
        throw new Error(
          "Work ID image is required. Please upload your work ID card."
        );
      } else if (
        error.response?.data?.message &&
        error.response.data.message.includes("Failed to create user")
      ) {
        throw new Error(
          "Failed to create account. Please check your information and try again."
        );
      } else {
        throw new Error(
          error.response?.data?.message ||
            "Invalid request data. Please check your information."
        );
      }
    } else if (error.response?.status === 409) {
      // Duplicate user errors
      if (
        error.response?.data?.message &&
        error.response.data.message.includes("Email is already registered")
      ) {
        throw new Error(
          "Email is already registered. Please use a different email address."
        );
      } else if (
        error.response?.data?.message &&
        error.response.data.message.includes(
          "Phone number is already registered"
        )
      ) {
        throw new Error(
          "Phone number is already registered. Please use a different phone number."
        );
      } else if (
        error.response?.data?.message &&
        error.response.data.message.includes(
          "National ID is already registered"
        )
      ) {
        throw new Error(
          "National ID is already registered. Please check your ID number."
        );
      } else if (
        error.response?.data?.message &&
        error.response.data.message.includes("already exists")
      ) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(
          "Account already exists. Please check your information."
        );
      }
    } else if (error.response?.status === 422) {
      throw new Error(
        "Invalid data format. Please check your information and try again."
      );
    } else {
      throw new Error(
        error.response?.data?.message ||
          "Somthing went wrong. Please try again later."
      );
    }
  }
};

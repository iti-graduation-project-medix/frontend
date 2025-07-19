import api from "./axios.js";

export const requestContact = async (data) => {
  try {
    const response = await api.post("/contact-us", data);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error(
        "Invalid request data. Please check your information and try again."
      );
    } else if (error.response?.status === 409) {
      throw new Error("A contact request already exists for this information.");
    } else if (error.response?.status === 422) {
      throw new Error(
        "Invalid data format. Please check your information and try again."
      );
    } else {
      throw new Error(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    }
  }
};

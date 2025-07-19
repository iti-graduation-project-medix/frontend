import api from "./axios.js";

export const requestAdvertise = async (data) => {
  try {
    const response = await api.post("/advertisement-request", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to submit advertising request. Please try again."
    );
  }
};

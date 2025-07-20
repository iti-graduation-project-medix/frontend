import api from "../axios.js";

export const getUserDetails = async (id) => {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user details"
    );
  }
};

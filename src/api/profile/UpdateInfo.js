import api from "../axios.js";

export const UpdateInfo = async (id, data) => {
  try {
    const response = await api.patch(`/user/${id}/update`, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update user info"
    );
  }
};

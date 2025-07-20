import api from "../axios.js";

export const getUserDeals = async (queryParams = {}) => {
  try {
    const response = await api.get(`/user/deals`, { params: queryParams });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user deals"
    );
  }
};

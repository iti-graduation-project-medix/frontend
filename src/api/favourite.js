import api from "./axios.js";

// Get user favorites
export const getUserFavorites = async () => {
  try {
    const response = await api.get("/favorite");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch favorites"
    );
  }
};

// Add deal to favorites
export const addDealToFavorites = async (dealId) => {
  try {
    const response = await api.post(`/favorite/deal/${dealId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add deal to favorites"
    );
  }
};

// Add pharmacy to favorites
export const addPharmacyToFavorites = async (pharmacyId) => {
  try {
    const response = await api.post(`/favorite/pharmacy/${pharmacyId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add pharmacy to favorites"
    );
  }
};

// Remove pharmacy from favorites
export const removePharmacyFromFavorites = async (pharmacyId) => {
  try {
    const response = await api.delete(`/favorite/pharmacy/${pharmacyId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to remove pharmacy from favorites"
    );
  }
};

// Remove deal from favorites
export const removeDealFromFavorites = async (dealId) => {
  try {
    const response = await api.delete(`/favorite/deal/${dealId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to remove deal from favorites"
    );
  }
};

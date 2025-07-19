import api from "../axios.js";

// Get user pharmacies
export const getPharmacies = async (token, user) => {
  try {
    const response = await api.get(`/pharmacies/user/${user}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch pharmacies"
    );
  }
};

// Create new pharmacy
export const createPharmacy = async (pharmacyData, token) => {
  try {
    const isFormData = pharmacyData instanceof FormData;
    const response = await api.post("/pharmacies", pharmacyData, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create pharmacy"
    );
  }
};

// Update pharmacy
export const updatePharmacy = async (pharmacyId, pharmacyData, token) => {
  try {
    const isFormData = pharmacyData instanceof FormData;
    const response = await api.patch(
      `/pharmacies/${pharmacyId}`,
      pharmacyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update pharmacy"
    );
  }
};

// Delete pharmacy
export const deletePharmacy = async (pharmacyId, token) => {
  try {
    const response = await api.delete(`/pharmacies/${pharmacyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete pharmacy"
    );
  }
};

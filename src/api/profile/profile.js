import api from "../axios.js";

export const getPharmacistDetails = async (id, token) => {
  try {
    const response = await api.get(`/auth/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch pharmacist details"
    );
  }
};

export const getUserDetailsById = async (id, token) => {
  try {
    const response = await api.get(`/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user details"
    );
  }
};

export const updateUserProfileImage = async (file, token) => {
  const formData = new FormData();
  formData.append("image", file);
  try {
    const response = await api.patch("/user/update-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Please upload image with size less than 2MB"
    );
  }
};

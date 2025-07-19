import api from "./axios.js";

// API utility to fetch all ads
export async function getAllAds() {
  try {
    const response = await api.get("/advertisement");
    if (
      response.data &&
      response.data.success &&
      response.data.data &&
      Array.isArray(response.data.data.ads)
    ) {
      return response.data.data.ads;
    }
    throw new Error(response.data?.message || "Failed to fetch ads");
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch ads");
  }
}

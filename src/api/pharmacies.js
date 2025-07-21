import api from "./axios.js";

export async function getPharmaciesForSale(params = {}) {
  try {
    const response = await api.get("/pharmacies/for-sale", { params });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch pharmacies for sale"
    );
  }
}

export async function getPharmacyById(id) {
  try {
    const response = await api.get(`/pharmacies/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch pharmacy details"
    );
  }
}

export async function listPharmaciesForSale(id, saleData) {
  try {
    const formData = new FormData();
    formData.append("pharmacyPrice", saleData.pharmacyPrice);
    formData.append("monthlySales", saleData.monthlySales);
    formData.append("saleType", saleData.saleType);

    if (saleData.medicinesList) {
      formData.append("file", saleData.medicinesList);
    }

    const response = await api.patch(
      `/pharmacies/${id}/list-for-sale`,
      formData,
      {
        headers: {
          // Remove Content-Type for FormData
          "Content-Type": undefined,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to list pharmacy for sale"
    );
  }
}

export async function unlistPharmacyFromSale(id) {
  try {
    const response = await api.patch(`/pharmacies/${id}/unlist-from-sale`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to unlist pharmacy from sale"
    );
  }
}

export async function unlistPharmacyFromSaleJson(id) {
  try {
    const response = await api.patch(`/pharmacies/${id}`, { isForSale: false });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to unlist pharmacy from sale"
    );
  }
}

export async function getRelatedPharmacies(id, params = {}) {
  try {
    const response = await api.get(`/pharmacies/${id}/related`, { params });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch related pharmacies"
    );
  }
}

export async function markPharmacyAsSold(id) {
  try {
    const response = await api.patch(`/pharmacies/${id}/mark-as-sold`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to mark pharmacy as sold"
    );
  }
}

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

function getAuthHeaders() {
  let token = localStorage.getItem("token");
  if (token) token = JSON.parse(token);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPharmaciesForSale(params = {}) {
  const url = new URL(`${baseURL}/pharmacies/for-sale`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "")
      url.searchParams.append(key, value);
  });
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Failed to fetch pharmacies for sale");
  return res.json();
}

export async function getPharmacyById(id) {
  const url = `${baseURL}/pharmacies/${id}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Failed to fetch pharmacy details");
  return res.json();
}

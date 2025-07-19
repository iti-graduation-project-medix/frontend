import api from "./axios.js";

export async function subscribeToPlan({ planName, planType, token }) {
  try {
    const response = await api.post(
      "/paymob/subscribe",
      {
        planName,
        planType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error subscribing to plan:", error);
    throw new Error(error.response?.data?.message || "Subscription failed");
  }
}

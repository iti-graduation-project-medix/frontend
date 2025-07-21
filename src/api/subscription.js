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

export async function getCurrentSubscription(token) {
  try {
    const response = await api.get("/user/current-subscription", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current subscription:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch subscription");
  }
}

export async function getUserSubscriptions(token) {
  try {
    const response = await api.get("/user/user-subscriptions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch user subscriptions");
  }
}

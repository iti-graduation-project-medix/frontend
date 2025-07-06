/**
 * Subscribe a user to a plan
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.planName // 'regular' or 'premium'
 * @param {string} params.planType // 'monthly' or 'yearly'
 * @returns {Promise<Object>} response data
 */
export async function subscribeToPlan({ userId, planName, planType }) {
  const response = await fetch("https://dawaback.com/api/v1/paymob/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      planName,
      planType,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Subscription failed");
  }

  return await response.json();
}

import { create } from "zustand";
import { subscribeToPlan, getCurrentSubscription, getUserSubscriptions } from "@/api/subscription";

export const useSubscribe = create((set, get) => ({
  loading: false,
  error: null,
  success: false,
  response: null,
  currentSubscription: null,
  subscriptionLoading: false,
  userSubscriptions: [],
  subscriptionsLoading: false,

  // subscribe action
  subscribe: async ({ planName, planType, token }) => {
    set({ loading: true, error: null, success: false, response: null });
    try {
      let finalToken = token;
      if (!finalToken) {
        try {
          const storedToken = localStorage.getItem("token");
          finalToken = storedToken ? JSON.parse(storedToken) : null;
        } catch { }
      }

      if (!finalToken) {
        throw new Error("No authentication token found");
      }

      const res = await subscribeToPlan({
        planName,
        planType,
        token: finalToken,
      });
      set({ loading: false, success: true, response: res });
      return res;
    } catch (err) {
      set({
        loading: false,
        error: err.message || "حدث خطأ أثناء الاشتراك",
        success: false,
      });
      throw err;
    }
  },

  // fetch current subscription
  fetchCurrentSubscription: async (token) => {
    if (get().subscriptionLoading) return; // Prevent duplicate fetches
    set({ subscriptionLoading: true, error: null });
    try {
      let finalToken = token;
      if (!finalToken) {
        try {
          const storedToken = localStorage.getItem("token");
          finalToken = storedToken ? JSON.parse(storedToken) : null;
        } catch { }
      }

      if (!finalToken) {
        throw new Error("No authentication token found");
      }

      const res = await getCurrentSubscription(finalToken);
      let subscription = res.data;
      // Force to { status: false } if null or not subscribed
      if (!subscription || subscription.status !== true) {
        subscription = { status: false };
      }
      set({
        subscriptionLoading: false,
        currentSubscription: subscription,
        error: null
      });
      return subscription;
    } catch (err) {
      set({
        subscriptionLoading: false,
        error: err.message || "Failed to fetch subscription",
        currentSubscription: { status: false }, // Set to falsy subscription to prevent infinite loading
      });
    }
  },

  // fetch user subscriptions history
  fetchUserSubscriptions: async (token) => {
    set({ subscriptionsLoading: true, error: null });
    try {
      let finalToken = token;
      if (!finalToken) {
        try {
          const storedToken = localStorage.getItem("token");
          finalToken = storedToken ? JSON.parse(storedToken) : null;
        } catch { }
      }

      if (!finalToken) {
        throw new Error("No authentication token found");
      }

      const res = await getUserSubscriptions(finalToken);
      set({
        subscriptionsLoading: false,
        userSubscriptions: res.data || [],
        error: null
      });
      return res.data;
    } catch (err) {
      set({
        subscriptionsLoading: false,
        error: err.message || "Failed to fetch user subscriptions",
        userSubscriptions: [],
      });
      throw err;
    }
  },

  // reset state if needed
  reset: () =>
    set({
      loading: false,
      error: null,
      success: false,
      response: null,
      currentSubscription: null,
      subscriptionLoading: false,
      userSubscriptions: [],
      subscriptionsLoading: false
    }),
}));

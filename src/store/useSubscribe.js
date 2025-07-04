import { create } from "zustand";
import { subscribeToPlan } from "@/api/subscription";

export const useSubscribe = create((set) => ({
  loading: false,
  error: null,
  success: false,
  response: null,

  // subscribe action
  subscribe: async ({ userId, planName, planType, token }) => {
    set({ loading: true, error: null, success: false, response: null });
    try {
      let finalToken = token;
      if (!finalToken) {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          finalToken = user?.token;
        } catch {}
      }
      const res = await subscribeToPlan({
        userId,
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

  // reset state if needed
  reset: () =>
    set({ loading: false, error: null, success: false, response: null }),
}));

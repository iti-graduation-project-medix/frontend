import { create } from 'zustand';
import { getUserDetailsById } from '../api/profile/profile';

export const useUserDetails = create((set, get) => ({
    userDetails: null,
    isLoading: false,
    error: null,

    fetchUserDetails: async (id, token) => {
        if (!id || !token) {
            set({ error: 'Missing user ID or authentication token', isLoading: false });
            return;
        }
        if (get().isLoading) {
            return;
        }
        set({ isLoading: true, error: null });
        try {
            const data = await getUserDetailsById(id, token);
            set({
                userDetails: data.user || data,
                isLoading: false,
                error: null,
            });
            return data;
        } catch (error) {
            set({
                isLoading: false,
                error: error.message || 'Failed to fetch user details',
            });
        }
    },

    clearError: () => set({ error: null }),
    resetUserDetails: () => set({ userDetails: null, isLoading: false, error: null }),
})); 
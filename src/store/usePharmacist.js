import { create } from 'zustand';
import { getPharmacistDetails } from '../api/profile/profile';

export const usePharmacist = create((set, get) => ({
  pharmacistDetails: null,
  isLoading: false,
  error: null,

  // Get pharmacist details action
  fetchPharmacistDetails: async (id, token) => {
    if (!token) {
      throw new Error('No authentication token available');
    }

    set({ isLoading: true, error: null });
    
    try {
      const response = await getPharmacistDetails(id, token);
      
      set({
        pharmacistDetails: response.data || response,
        isLoading: false,
        error: null,
      });
      
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch pharmacist details',
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Reset pharmacist state
  resetPharmacist: () => {
    set({
      pharmacistDetails: null,
      isLoading: false,
      error: null,
    });
  },
})); 
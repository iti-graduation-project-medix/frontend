import { create } from 'zustand';
import { signIn } from '../api/auth/SignIn';

export const useAuth = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  // Login action
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await signIn(credentials);
      
      // Store user data and token
      const userData = response.user || response;
      const token = response.token || response.accessToken;
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData.data.id));
      localStorage.setItem('token', JSON.stringify(userData.data.token));
      
      set({
        user: userData,
        token: token,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      });
      
      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || 'Login failed',
        isAuthenticated: false,
      });
      throw error;
    }
  },

  // Logout action
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    set({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });
  },

  // Initialize auth state from localStorage
  initializeAuth: () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      set({
        user: JSON.parse(user),
        token: JSON.parse(token),
        isAuthenticated: true,
      });
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
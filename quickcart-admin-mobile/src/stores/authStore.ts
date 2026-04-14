// QuickCart Admin — Auth Store (Zustand)

import { create } from 'zustand';
import { storage, STORAGE_KEYS } from '../utils/storage';
import authService, { LoginResponse } from '../services/authService';

interface AuthState {
  token: string | null;
  user: LoginResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: storage.getString(STORAGE_KEYS.AUTH_TOKEN) || null,
  user: null,
  isAuthenticated: !!storage.getString(STORAGE_KEYS.AUTH_TOKEN),
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ username, password });
      storage.set(STORAGE_KEYS.AUTH_TOKEN, response.token);
      storage.set(STORAGE_KEYS.ADMIN_USERNAME, username);
      storage.set(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());

      set({
        token: response.token,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || 'Invalid credentials',
      });
      return false;
    }
  },

  logout: () => {
    storage.delete(STORAGE_KEYS.AUTH_TOKEN);
    storage.delete(STORAGE_KEYS.ADMIN_USERNAME);
    storage.delete(STORAGE_KEYS.LAST_ACTIVITY);
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  checkAuth: async () => {
    const token = storage.getString(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      set({ isAuthenticated: false, token: null, user: null });
      return false;
    }

    try {
      const { valid, user } = await authService.verifyToken();
      if (valid && user) {
        set({ isAuthenticated: true, token, user });
        return true;
      } else {
        get().logout();
        return false;
      }
    } catch {
      // If verify fails (e.g., no endpoint), assume token is valid if it exists
      set({ isAuthenticated: true, token });
      return true;
    }
  },

  clearError: () => set({ error: null }),
}));

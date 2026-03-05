import { create } from 'zustand';
import { Storage } from '@utils/storage';
import { STORAGE_KEYS } from '@utils/constants';
import { User } from '@services/authService';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface AuthState {
  // Data
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasOnboarded: boolean;

  // Loading
  isLoading: boolean;
  isProfileComplete: boolean;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setHasOnboarded: (value: boolean) => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => void;
}

// ──────────────────────────────────────────
//  Store
// ──────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  token: null,
  isAuthenticated: false,
  hasOnboarded: false,
  isLoading: true,
  isProfileComplete: false,

  // Set user only
  setUser: (user: User) => {
    Storage.setObject(STORAGE_KEYS.USER_DATA, user);
    set({
      user,
      isProfileComplete: Boolean(user.name && user.phone),
    });
  },

  // Set token only
  setToken: (token: string) => {
    Storage.setString(STORAGE_KEYS.AUTH_TOKEN, token);
    set({ token, isAuthenticated: true });
  },

  // Full login
  login: (user: User, token: string) => {
    Storage.setString(STORAGE_KEYS.AUTH_TOKEN, token);
    Storage.setObject(STORAGE_KEYS.USER_DATA, user);
    set({
      user,
      token,
      isAuthenticated: true,
      isProfileComplete: Boolean(user.name && user.phone),
    });
  },

  // Logout
  logout: () => {
    Storage.delete(STORAGE_KEYS.AUTH_TOKEN);
    Storage.delete(STORAGE_KEYS.USER_DATA);
    Storage.delete(STORAGE_KEYS.CART_DATA);
    Storage.delete(STORAGE_KEYS.WISHLIST_DATA);
    Storage.delete(STORAGE_KEYS.SELECTED_ADDRESS);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isProfileComplete: false,
    });
  },

  // Onboarding
  setHasOnboarded: (value: boolean) => {
    Storage.setBoolean(STORAGE_KEYS.HAS_ONBOARDED, value);
    set({ hasOnboarded: value });
  },

  // Loading
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  // Hydrate from MMKV on app startup
  hydrate: () => {
    const token = Storage.getString(STORAGE_KEYS.AUTH_TOKEN) ?? null;
    const user = Storage.getObject<User>(STORAGE_KEYS.USER_DATA);
    const hasOnboarded = Storage.getBoolean(STORAGE_KEYS.HAS_ONBOARDED);

    set({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isProfileComplete: Boolean(user?.name && user?.phone),
      hasOnboarded,
      isLoading: false,
    });
  },
}));

export default useAuthStore;

// QuickCart Admin — MMKV Storage Wrapper

import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'quickcart-admin-storage',
});

// String
export const setString = (key: string, value: string) => storage.set(key, value);
export const getString = (key: string) => storage.getString(key);

// Boolean
export const setBoolean = (key: string, value: boolean) => storage.set(key, value);
export const getBoolean = (key: string) => storage.getBoolean(key);

// Number
export const setNumber = (key: string, value: number) => storage.set(key, value);
export const getNumber = (key: string) => storage.getNumber(key);

// Object (JSON)
export const setObject = <T>(key: string, value: T) => {
  storage.set(key, JSON.stringify(value));
};

export const getObject = <T>(key: string): T | null => {
  const value = storage.getString(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

// Delete
export const remove = (key: string) => storage.delete(key);
export const clearAll = () => storage.clearAll();

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  ADMIN_USERNAME: 'admin_username',
  VIEW_MODE: 'view_mode',         // grid | list
  AUTO_REFRESH: 'auto_refresh',   // interval in seconds
  LAST_ACTIVITY: 'last_activity', // timestamp for inactivity check
  DRAFT_PRODUCT: 'draft_product',
  DRAFT_OFFER: 'draft_offer',
} as const;

import AsyncStorage from '@react-native-async-storage/async-storage';

// ──────────────────────────────────────────
//  In-memory cache backed by AsyncStorage
//  Keeps the same synchronous API so every
//  existing consumer works unchanged.
// ──────────────────────────────────────────

const STORAGE_PREFIX = 'quickcart:';
const _cache: Record<string, string> = {};
let _hydrated = false;

/** Call once at app launch (before first read). */
export async function hydrateStorage(): Promise<void> {
  if (_hydrated) return;
  try {
    const keys = await AsyncStorage.getAllKeys();
    for (const k of keys) {
      const v = await AsyncStorage.getItem(k);
      if (v !== null) _cache[k] = v;
    }
  } catch {
    // Silently continue — cache stays empty
  }
  _hydrated = true;
}

// ──────────────────────────────────────────
//  Low-level "storage" shim (for files that
//  import { storage } from '@utils/storage')
// ──────────────────────────────────────────

export const storage = {
  getString(key: string): string | undefined {
    return _cache[STORAGE_PREFIX + key];
  },

  getBoolean(key: string): boolean | undefined {
    const v = _cache[STORAGE_PREFIX + key];
    if (v === undefined) return undefined;
    return v === 'true';
  },

  getNumber(key: string): number | undefined {
    const v = _cache[STORAGE_PREFIX + key];
    if (v === undefined) return undefined;
    return Number(v);
  },

  set(key: string, value: string | boolean | number): void {
    const k = STORAGE_PREFIX + key;
    const v = String(value);
    _cache[k] = v;
    AsyncStorage.setItem(k, v).catch(() => {});
  },

  delete(key: string): void {
    const k = STORAGE_PREFIX + key;
    delete _cache[k];
    AsyncStorage.removeItem(k).catch(() => {});
  },

  contains(key: string): boolean {
    return (STORAGE_PREFIX + key) in _cache;
  },

  clearAll(): void {
    const prefixed = Object.keys(_cache).filter((k) => k.startsWith(STORAGE_PREFIX));
    for (const k of prefixed) delete _cache[k];
    Promise.all(prefixed.map((k) => AsyncStorage.removeItem(k))).catch(() => {});
  },

  getAllKeys(): string[] {
    return Object.keys(_cache)
      .filter((k) => k.startsWith(STORAGE_PREFIX))
      .map((k) => k.slice(STORAGE_PREFIX.length));
  },
};

// ──────────────────────────────────────────
//  Typed Getters / Setters (high-level API)
// ──────────────────────────────────────────

export const Storage = {
  // String
  getString(key: string): string | undefined {
    return storage.getString(key);
  },

  setString(key: string, value: string): void {
    storage.set(key, value);
  },

  // Boolean
  getBoolean(key: string): boolean {
    return storage.getBoolean(key) ?? false;
  },

  setBoolean(key: string, value: boolean): void {
    storage.set(key, value);
  },

  // Number
  getNumber(key: string): number {
    return storage.getNumber(key) ?? 0;
  },

  setNumber(key: string, value: number): void {
    storage.set(key, value);
  },

  // JSON objects
  getObject<T>(key: string): T | null {
    try {
      const raw = storage.getString(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setObject<T>(key: string, value: T): void {
    storage.set(key, JSON.stringify(value));
  },

  // Array helpers
  getArray<T>(key: string): T[] {
    return this.getObject<T[]>(key) ?? [];
  },

  setArray<T>(key: string, value: T[]): void {
    this.setObject(key, value);
  },

  pushToArray<T>(key: string, item: T, maxLength?: number): void {
    const arr = this.getArray<T>(key);
    const filtered = arr.filter((existing) => JSON.stringify(existing) !== JSON.stringify(item));
    filtered.unshift(item);
    const trimmed = maxLength ? filtered.slice(0, maxLength) : filtered;
    this.setArray(key, trimmed);
  },

  removeFromArray<T>(key: string, predicate: (item: T) => boolean): void {
    const arr = this.getArray<T>(key);
    this.setArray(key, arr.filter((item) => !predicate(item)));
  },

  // Deletion
  delete(key: string): void {
    storage.delete(key);
  },

  has(key: string): boolean {
    return storage.contains(key);
  },

  clearAll(): void {
    storage.clearAll();
  },

  // Get all keys
  getAllKeys(): string[] {
    return storage.getAllKeys();
  },
};

export default Storage;

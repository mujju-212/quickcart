import { create } from 'zustand';
import { Product } from '@services/productService';
import { Storage } from '@utils/storage';
import { STORAGE_KEYS } from '@utils/constants';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface WishlistState {
  items: Product[];
  productIds: Set<number>;
  count: number;

  // Actions
  setWishlist: (items: Product[]) => void;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  toggleItem: (product: Product) => void;
  clearAll: () => void;
  isInWishlist: (productId: number) => boolean;
}

// ──────────────────────────────────────────
//  Store
// ──────────────────────────────────────────

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  productIds: new Set<number>(),
  count: 0,

  setWishlist: (items: Product[]) => {
    const ids = new Set(items.map((i) => i.id));
    set({ items, productIds: ids, count: items.length });
  },

  addItem: (product: Product) => {
    const state = get();
    if (state.productIds.has(product.id)) return;
    const items = [product, ...state.items];
    const ids = new Set(state.productIds);
    ids.add(product.id);
    set({ items, productIds: ids, count: items.length });
  },

  removeItem: (productId: number) => {
    const state = get();
    const items = state.items.filter((i) => i.id !== productId);
    const ids = new Set(state.productIds);
    ids.delete(productId);
    set({ items, productIds: ids, count: items.length });
  },

  toggleItem: (product: Product) => {
    const state = get();
    if (state.productIds.has(product.id)) {
      state.removeItem(product.id);
    } else {
      state.addItem(product);
    }
  },

  clearAll: () => {
    set({ items: [], productIds: new Set(), count: 0 });
  },

  isInWishlist: (productId: number) => {
    return get().productIds.has(productId);
  },
}));

export default useWishlistStore;

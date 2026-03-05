import { create } from 'zustand';
import { CartItem, CartData } from '@services/cartService';
import { Storage } from '@utils/storage';
import { STORAGE_KEYS, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, HANDLING_FEE } from '@utils/constants';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  handlingFee: number;
  total: number;
  savings: number;

  // Coupon
  couponCode: string | null;
  couponDiscount: number;

  // Actions
  setCart: (data: CartData) => void;
  addItem: (item: CartItem) => void;
  updateItemQty: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;

  // Selectors
  getItemQuantity: (productId: number) => number;
  isInCart: (productId: number) => boolean;
}

// ──────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────

function recalculateTotals(items: CartItem[], couponDiscount: number) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = items.reduce((sum, item) => {
    const original = item.original_price ?? item.price;
    return sum + (original - item.price) * item.quantity;
  }, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const handlingFee = items.length > 0 ? HANDLING_FEE : 0;
  const total = Math.max(0, subtotal + deliveryFee + handlingFee - couponDiscount);

  return {
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal,
    deliveryFee,
    handlingFee,
    total,
    savings: savings + couponDiscount,
  };
}

// ──────────────────────────────────────────
//  Store
// ──────────────────────────────────────────

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  itemCount: 0,
  subtotal: 0,
  deliveryFee: 0,
  handlingFee: 0,
  total: 0,
  savings: 0,
  couponCode: null,
  couponDiscount: 0,

  setCart: (data: CartData) => {
    const couponDiscount = get().couponDiscount;
    const totals = recalculateTotals(data.items, couponDiscount);
    set({ items: data.items, ...totals });
  },

  addItem: (item: CartItem) => {
    const items = [...get().items];
    const idx = items.findIndex((i) => i.product_id === item.product_id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + item.quantity };
    } else {
      items.push(item);
    }
    const totals = recalculateTotals(items, get().couponDiscount);
    set({ items, ...totals });
  },

  updateItemQty: (productId: number, quantity: number) => {
    let items = [...get().items];
    if (quantity <= 0) {
      items = items.filter((i) => i.product_id !== productId);
    } else {
      const idx = items.findIndex((i) => i.product_id === productId);
      if (idx >= 0) items[idx] = { ...items[idx], quantity };
    }
    const totals = recalculateTotals(items, get().couponDiscount);
    set({ items, ...totals });
  },

  removeItem: (productId: number) => {
    const items = get().items.filter((i) => i.product_id !== productId);
    const totals = recalculateTotals(items, get().couponDiscount);
    set({ items, ...totals });
  },

  clearCart: () => {
    set({
      items: [],
      itemCount: 0,
      subtotal: 0,
      deliveryFee: 0,
      handlingFee: 0,
      total: 0,
      savings: 0,
      couponCode: null,
      couponDiscount: 0,
    });
  },

  applyCoupon: (code: string, discount: number) => {
    const totals = recalculateTotals(get().items, discount);
    set({ couponCode: code, couponDiscount: discount, ...totals });
  },

  removeCoupon: () => {
    const totals = recalculateTotals(get().items, 0);
    set({ couponCode: null, couponDiscount: 0, ...totals });
  },

  getItemQuantity: (productId: number) => {
    return get().items.find((i) => i.product_id === productId)?.quantity ?? 0;
  },

  isInCart: (productId: number) => {
    return get().items.some((i) => i.product_id === productId);
  },
}));

export default useCartStore;

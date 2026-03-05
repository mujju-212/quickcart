import api, { ApiResponse } from './api';
import { Product } from './productService';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  original_price?: number;
  size: string;
  image_url?: string;
  stock: number;
  category_name?: string;
}

export interface CartData {
  items: CartItem[];
  item_count: number;
  subtotal: number;
  delivery_fee: number;
  handling_fee: number;
  total: number;
  savings: number;
}

// ──────────────────────────────────────────
//  Endpoints
// ──────────────────────────────────────────

export async function getCart(phone: string): Promise<CartData> {
  const { data } = await api.get('/cart/', { params: { phone } });
  return data;
}

export async function addToCart(
  phone: string,
  productId: number,
  quantity: number = 1,
): Promise<ApiResponse> {
  const { data } = await api.post('/cart/add', {
    phone,
    product_id: productId,
    quantity,
  });
  return data;
}

export async function updateCartItem(
  phone: string,
  productId: number,
  quantity: number,
): Promise<ApiResponse> {
  const { data } = await api.put('/cart/update', {
    phone,
    product_id: productId,
    quantity,
  });
  return data;
}

export async function removeFromCart(
  phone: string,
  productId: number,
): Promise<ApiResponse> {
  const { data } = await api.delete('/cart/remove', {
    data: { phone, product_id: productId },
  });
  return data;
}

export async function clearCart(phone: string): Promise<ApiResponse> {
  const { data } = await api.delete('/cart/clear', { params: { phone } });
  return data;
}

const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

export default cartService;

import api, { ApiResponse } from './api';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  name?: string;
  image_url?: string;
  size?: string;
}

export interface OrderTimelineEntry {
  status: string;
  timestamp: string;
  notes?: string;
}

export interface Order {
  id: number;
  user_id: number;
  items: OrderItem[];
  delivery_address: string;
  total: number;
  delivery_fee: number;
  handling_fee: number;
  coupon_code?: string;
  discount_amount?: number;
  status: string;
  payment_status: string;
  payment_method: string;
  timeline?: OrderTimelineEntry[];
  created_at: string;
  updated_at?: string;
}

export interface CreateOrderPayload {
  items: { product_id: number; quantity: number }[];
  delivery_address: string;
  total: number;
  delivery_fee?: number;
  handling_fee?: number;
  coupon_code?: string;
  payment_status?: string;
  payment_method?: string;
}

export interface OrderStats {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
}

// ──────────────────────────────────────────
//  Endpoints
// ──────────────────────────────────────────

export async function getMyOrders(): Promise<Order[]> {
  const { data } = await api.get('/orders/');
  return data.orders ?? data;
}

export async function getOrderById(orderId: number): Promise<Order> {
  const { data } = await api.get(`/orders/${orderId}`);
  return data.order ?? data;
}

export async function createOrder(payload: CreateOrderPayload): Promise<ApiResponse<Order>> {
  const { data } = await api.post('/orders/create', payload);
  return data;
}

export async function getOrderStats(): Promise<OrderStats> {
  const { data } = await api.get('/orders/stats');
  return data;
}

const orderService = {
  getMyOrders,
  getOrderById,
  createOrder,
  getOrderStats,
};

export default orderService;

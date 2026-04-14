// QuickCart Admin — Order Service

import api from './api';
import { OrderStatus, PAGE_SIZE } from '../utils/constants';

export interface Order {
  id: number;
  user_id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  payment_method: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderTimeline {
  id: number;
  order_id: number;
  status: OrderStatus;
  note?: string;
  created_at: string;
}

export interface OrdersParams {
  status?: OrderStatus | 'all';
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
}

const orderService = {
  /**
   * Get paginated order list with filters
   */
  getOrders: async (params: OrdersParams = {}) => {
    const { status, page = 1, limit = PAGE_SIZE, search, sort } = params;
    const queryParams: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    if (status && status !== 'all') queryParams.status = status;
    if (search) queryParams.search = search;
    if (sort) queryParams.sort = sort;

    const response = await api.get('/orders', { params: queryParams });
    return response.data;
  },

  /**
   * Get single order detail
   */
  getOrder: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data.order || response.data;
  },

  /**
   * Update order status
   */
  updateStatus: async (id: number, status: OrderStatus, note?: string) => {
    const response = await api.put(`/orders/${id}/status`, { status, note });
    return response.data;
  },

  /**
   * Get order timeline / history
   */
  getTimeline: async (id: number): Promise<OrderTimeline[]> => {
    const response = await api.get(`/orders/${id}/timeline`);
    return response.data.timeline || response.data || [];
  },

  /**
   * Cancel / delete order
   */
  cancelOrder: async (id: number, reason?: string) => {
    const response = await api.delete(`/orders/${id}`, { data: { reason } });
    return response.data;
  },

  /**
   * Get order stats (counts by status)
   */
  getStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data;
  },
};

export type OrderFilters = OrdersParams;
export { orderService };
export default orderService;

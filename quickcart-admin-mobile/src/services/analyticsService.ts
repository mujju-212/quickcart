// QuickCart Admin — Analytics Service

import api from './api';

export interface DashboardOverview {
  total_orders: number;
  total_revenue: number;
  total_users: number;
  total_products: number;
  orders_today: number;
  revenue_today: number;
  new_users_today: number;
  low_stock_count: number;
  orders_change_pct: number;
  revenue_change_pct: number;
  users_change_pct: number;
  products_change_pct: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
}

export interface TopProduct {
  id: number;
  name: string;
  image_url?: string;
  units_sold: number;
  revenue: number;
  category_name?: string;
}

export interface CategoryPerformance {
  category_id: number;
  category_name: string;
  total_revenue: number;
  total_units: number;
  order_count: number;
}

const analyticsService = {
  /**
   * Get dashboard overview stats
   */
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await api.get('/analytics/overview');
    return response.data;
  },

  /**
   * Get revenue data for chart
   */
  getRevenue: async (days: number = 30): Promise<RevenueDataPoint[]> => {
    const response = await api.get('/analytics/revenue', { params: { days } });
    return response.data.revenue || response.data || [];
  },

  /**
   * Get orders grouped by status
   */
  getOrdersByStatus: async (): Promise<OrdersByStatus[]> => {
    const response = await api.get('/analytics/orders-by-status');
    return response.data.orders || response.data || [];
  },

  /**
   * Get top selling products
   */
  getTopProducts: async (limit: number = 10): Promise<TopProduct[]> => {
    const response = await api.get('/analytics/top-products', { params: { limit } });
    return response.data.products || response.data || [];
  },

  /**
   * Get category performance
   */
  getCategoryPerformance: async (): Promise<CategoryPerformance[]> => {
    const response = await api.get('/analytics/category-performance');
    return response.data.categories || response.data || [];
  },

  /**
   * Get daily stats for a date range
   */
  getDailyStats: async (days: number = 7) => {
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
    const response = await api.get('/analytics/daily-stats', { params: { start, end } });
    return response.data;
  },
};

export { analyticsService };
export default analyticsService;

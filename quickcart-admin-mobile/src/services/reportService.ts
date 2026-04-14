// QuickCart Admin — Report Service

import api from './api';

export interface SalesReport {
  total_revenue: number;
  average_daily: number;
  peak_day: { date: string; revenue: number };
  previous_period_change: number;
  daily_data: { date: string; revenue: number; orders: number }[];
}

export interface InventoryReport {
  total_products: number;
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
  total_inventory_value: number;
  products: { id: number; name: string; stock: number; price: number; category: string }[];
}

export interface CustomerReport {
  total_customers: number;
  new_customers: number;
  returning_customers: number;
  avg_order_value: number;
  top_customers: { id: number; name: string; orders: number; total_spent: number }[];
}

const reportService = {
  /**
   * Get sales report
   */
  getSalesReport: async (start: string, end: string): Promise<SalesReport> => {
    const response = await api.get('/reports/sales', {
      params: { start, end, format: 'json' },
    });
    return response.data;
  },

  /**
   * Get inventory report
   */
  getInventoryReport: async (): Promise<InventoryReport> => {
    const response = await api.get('/reports/inventory');
    return response.data;
  },

  /**
   * Get customer report
   */
  getCustomerReport: async (start: string, end: string): Promise<CustomerReport> => {
    const response = await api.get('/reports/customers', { params: { start, end } });
    return response.data;
  },

  /**
   * Export report as CSV
   */
  exportCSV: async (type: 'sales' | 'inventory' | 'customers', start?: string, end?: string) => {
    const response = await api.get('/reports/export', {
      params: { type, format: 'csv', start, end },
      responseType: 'blob',
    });
    return response.data;
  },
};

export { reportService };
export default reportService;

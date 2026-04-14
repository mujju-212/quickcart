// QuickCart Admin — Customer Service

import api from './api';
import { PAGE_SIZE } from '../utils/constants';

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role: string;
  total_orders?: number;
  total_spent?: number;
  avg_order_value?: number;
  created_at: string;
  updated_at?: string;
}

export interface CustomerDetail extends Customer {
  addresses: CustomerAddress[];
  recent_orders: any[];
}

export interface CustomerAddress {
  id: number;
  label: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export interface CustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'newest' | 'most_orders' | 'highest_spend';
}

const customerService = {
  /**
   * Get paginated customer list
   */
  getCustomers: async (params: CustomersParams = {}) => {
    const { page = 1, limit = PAGE_SIZE, search, sort } = params;
    const queryParams: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };
    if (search) queryParams.search = search;
    if (sort) queryParams.sort = sort;

    const response = await api.get('/users', { params: queryParams });
    return response.data;
  },

  /**
   * Get single customer detail
   */
  getCustomer: async (id: number): Promise<CustomerDetail> => {
    const response = await api.get(`/users/${id}`);
    return response.data.user || response.data;
  },

  /**
   * Get customer's orders
   */
  getCustomerOrders: async (id: number) => {
    const response = await api.get(`/users/${id}/orders`);
    return response.data;
  },
};

export type CustomerFilters = CustomersParams;
export { customerService };
export default customerService;

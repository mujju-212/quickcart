// useCustomers — React Query hooks for customer management

import { useQuery } from '@tanstack/react-query';
import { customerService, CustomerFilters } from '../services/customerService';

export function useCustomers(filters: CustomerFilters = {}) {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => customerService.getCustomers(filters),
    staleTime: 60_000,
  });
}

export function useCustomer(customerId: number) {
  return useQuery({
    queryKey: ['customers', customerId],
    queryFn: () => customerService.getCustomer(customerId),
    enabled: !!customerId,
  });
}

export function useCustomerOrders(customerId: number) {
  return useQuery({
    queryKey: ['customers', customerId, 'orders'],
    queryFn: () => customerService.getCustomerOrders(customerId),
    enabled: !!customerId,
  });
}

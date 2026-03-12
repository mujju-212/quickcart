// useOrders — React Query hooks for order management

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, OrderFilters } from '../services/orderService';
import { REFRESH_INTERVALS, OrderStatus } from '../utils/constants';

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => orderService.getOrders(filters),
    refetchInterval: REFRESH_INTERVALS.ORDERS,
    staleTime: 15_000,
  });
}

export function useOrder(orderId: number) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => orderService.getOrder(orderId),
    enabled: !!orderId,
  });
}

export function useOrderTimeline(orderId: number) {
  return useQuery({
    queryKey: ['orders', orderId, 'timeline'],
    queryFn: () => orderService.getTimeline(orderId),
    enabled: !!orderId,
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: ['orders', 'stats'],
    queryFn: orderService.getStats,
    staleTime: 30_000,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status, note }: { orderId: number; status: OrderStatus; note?: string }) =>
      orderService.updateStatus(orderId, status, note),
    onSuccess: (_data: unknown, variables: { orderId: number; status: OrderStatus; note?: string }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: number; reason: string }) =>
      orderService.cancelOrder(orderId, reason),
    onSuccess: (_data: unknown, variables: { orderId: number; reason: string }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

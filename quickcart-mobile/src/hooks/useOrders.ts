import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@utils/constants';
import orderService, { Order, CreateOrderPayload } from '@services/orderService';
import { haptics } from '@utils/haptics';

/**
 * Fetch the authenticated user's order history.
 */
export function useOrders() {
  return useQuery<Order[]>({
    queryKey: QUERY_KEYS.orders,
    queryFn: orderService.getMyOrders,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch a single order by ID.
 */
export function useOrder(orderId: number) {
  return useQuery<Order>({
    queryKey: QUERY_KEYS.order(orderId),
    queryFn: () => orderService.getOrderById(orderId),
    enabled: orderId > 0,
    staleTime: 30 * 1000,
  });
}

/**
 * Create a new order.
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderService.createOrder(payload),
    onSuccess: () => {
      haptics.success();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@utils/constants';
import cartService, { CartData } from '@services/cartService';
import { useAuthStore } from '@stores/authStore';
import { useCartStore } from '@stores/cartStore';
import { haptics } from '@utils/haptics';

/**
 * Fetch the current user's cart and keep the Zustand store in sync.
 */
export function useCart() {
  const phone = useAuthStore((s) => s.user?.phone ?? '');
  const setCart = useCartStore((s) => s.setCart);

  return useQuery<CartData>({
    queryKey: QUERY_KEYS.cart,
    queryFn: async () => {
      const data = await cartService.getCart(phone);
      setCart(data);
      return data;
    },
    enabled: phone.length > 0,
    staleTime: 30 * 1000, // 30s – carts change frequently
  });
}

/**
 * Add an item to the cart.
 */
export function useAddToCart() {
  const queryClient = useQueryClient();
  const phone = useAuthStore((s) => s.user?.phone ?? '');

  return useMutation({
    mutationFn: ({ productId, quantity = 1 }: { productId: number; quantity?: number }) =>
      cartService.addToCart(phone, productId, quantity),
    onSuccess: () => {
      haptics.press();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
    },
  });
}

/**
 * Update item quantity.
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const phone = useAuthStore((s) => s.user?.phone ?? '');

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartService.updateCartItem(phone, productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
    },
  });
}

/**
 * Remove an item from the cart.
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const phone = useAuthStore((s) => s.user?.phone ?? '');

  return useMutation({
    mutationFn: (productId: number) => cartService.removeFromCart(phone, productId),
    onSuccess: () => {
      haptics.tap();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
    },
  });
}

/**
 * Clear the cart entirely.
 */
export function useClearCart() {
  const queryClient = useQueryClient();
  const phone = useAuthStore((s) => s.user?.phone ?? '');
  const clearStore = useCartStore((s) => s.clearCart);

  return useMutation({
    mutationFn: () => cartService.clearCart(phone),
    onSuccess: () => {
      clearStore();
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cart });
    },
  });
}

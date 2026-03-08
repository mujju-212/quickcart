import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AnimatedRN, { FadeInUp, FadeOutLeft, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowRight, Trash2 } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { Header, EmptyState } from '@components/common';
import { CartItem } from '@components/cart';
import { CartSummary } from '@components/cart';
import { CouponInput } from '@components/cart';
import { Button } from '@components/ui';
import { useUpdateCartItem, useRemoveFromCart, useClearCart } from '@hooks/useCart';
import { useCartStore } from '@stores/cartStore';
import { triggerHaptic } from '@utils/haptics';
import { formatPrice } from '@utils/helpers';

// ──────────────────────────────────────────
//  Cart Tab Screen
// ──────────────────────────────────────────

export default function CartScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    couponDiscount,
    total,
    couponCode,
    applyCoupon: storeApplyCoupon,
    removeCoupon: storeRemoveCoupon,
  } = useCartStore();

  const updateCartItem = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Sync with server if needed
    await new Promise((r) => setTimeout(r, 500));
    setRefreshing(false);
  }, []);

  const handleQuantityChange = useCallback(
    (productId: string | number, quantity: number) => {
      const numId = typeof productId === 'string' ? Number(productId) : productId;
      if (quantity <= 0) {
        removeFromCartMutation.mutate(numId);
      } else {
        updateCartItem.mutate({ productId: numId, quantity });
      }
    },
    [updateCartItem, removeFromCartMutation]
  );

  const handleRemove = useCallback(
    (productId: string | number) => {
      const numId = typeof productId === 'string' ? Number(productId) : productId;
      removeFromCartMutation.mutate(numId);
    },
    [removeFromCartMutation]
  );

  const handleClearCart = useCallback(() => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearCartMutation.mutate();
            triggerHaptic('success');
          },
        },
      ]
    );
  }, [clearCartMutation]);

  const handleApplyCoupon = useCallback(
    async (code: string): Promise<boolean> => {
      // In a real app, validate coupon server-side
      storeApplyCoupon(code, 0);
      return true;
    },
    [storeApplyCoupon]
  );

  const handleRemoveCoupon = useCallback(() => {
    storeRemoveCoupon();
  }, [storeRemoveCoupon]);

  const handleCheckout = useCallback(() => {
    router.push('/checkout/address-select');
    triggerHaptic('selection');
  }, [router]);

  // ── Empty State ──
  if (items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <Header title="My Cart" />
        <EmptyState
          preset="cart"
          actionLabel="Start Shopping"
          onAction={() => router.push('/(tabs)')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      {/* Header */}
      <Header
        title="My Cart"
        subtitle={`${itemCount} item${itemCount > 1 ? 's' : ''}`}
        rightActions={
          <TouchableOpacity onPress={handleClearCart}>
            <Trash2 size={20} color={colors.error} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id || item.product_id)}
        renderItem={({ item, index }) => (
          <AnimatedRN.View
            entering={FadeInUp.delay(index * 60).springify()}
            exiting={FadeOutLeft.springify()}
            layout={Layout.springify()}
          >
            <CartItem
              item={item}
              onUpdateQuantity={handleQuantityChange}
              onRemove={() => handleRemove(item.id || item.product_id)}
            />
          </AnimatedRN.View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListFooterComponent={
          <View style={styles.footerSection}>
            {/* Coupon */}
            <CouponInput
              onApply={handleApplyCoupon}
              onRemove={handleRemoveCoupon}
              appliedCode={couponCode ?? undefined}
              discountAmount={couponDiscount}
            />

            {/* Order Summary */}
            <CartSummary
              itemCount={itemCount}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              discount={couponDiscount}
              couponCode={couponCode ?? undefined}
              total={total}
            />
          </View>
        }
      />

      {/* Checkout Footer */}
      <View style={[styles.checkoutBar, { paddingBottom: bottom + spacing.sm }]}>
        <View style={styles.checkoutLeft}>
          <Text style={styles.checkoutLabel}>Total</Text>
          <Text style={styles.checkoutTotal}>{formatPrice(total)}</Text>
        </View>
        <Button
          title="Checkout"
          onPress={handleCheckout}
          icon={<ArrowRight size={18} color={colors.white} />}
          iconPosition="right"
          style={styles.checkoutBtn}
        />
      </View>
    </View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  footerSection: {
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  checkoutBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  checkoutLeft: {
    gap: 2,
  },
  checkoutLabel: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  checkoutTotal: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '900',
  },
  checkoutBtn: {
    minWidth: 140,
  },
});

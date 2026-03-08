import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AnimatedRN, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  CreditCard,
  Banknote,
  Wallet,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  MapPin,
} from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { Header } from '@components/common';
import { Button } from '@components/ui';
import { useCartStore } from '@stores/cartStore';
import { useLocationStore } from '@stores/locationStore';
import { useCreateOrder } from '@hooks/useOrders';
import { formatPrice } from '@utils/helpers';
import { triggerHaptic } from '@utils/haptics';
import { PAYMENT_METHODS } from '@utils/constants';

// ──────────────────────────────────────────
//  Icon Map
// ──────────────────────────────────────────
const ICON_MAP: Record<string, React.ReactNode> = {
  cod: <Banknote size={24} color={colors.success} />,
  upi: <Smartphone size={24} color={colors.info} />,
  card: <CreditCard size={24} color={colors.primary} />,
  wallet: <Wallet size={24} color={colors.warning} />,
};

// ──────────────────────────────────────────
//  Checkout — Payment Method
// ──────────────────────────────────────────

export default function PaymentScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  const cartItems = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const deliveryFee = useCartStore((s) => s.deliveryFee);
  const discount = useCartStore((s) => s.couponDiscount);
  const grandTotal = useCartStore((s) => s.total);
  const couponCode = useCartStore((s) => s.couponCode);
  const clearCart = useCartStore((s) => s.clearCart);

  const selectedAddress = useLocationStore((s) => s.selectedAddress);
  const createOrderMutation = useCreateOrder();

  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [isPlacing, setIsPlacing] = useState(false);

  const handleSelectMethod = useCallback((method: string) => {
    setSelectedMethod(method);
    triggerHaptic('selection');
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    if (!selectedAddress) {
      Alert.alert('Address Required', 'Please select a delivery address first.');
      router.back();
      return;
    }

    setIsPlacing(true);
    triggerHaptic('impact');

    try {
      const deliveryAddr = [
          selectedAddress.name,
          selectedAddress.address_line_1,
          selectedAddress.address_line_2,
          selectedAddress.city,
          selectedAddress.state,
          selectedAddress.postal_code,
        ]
          .filter(Boolean)
          .join(', ');

      const orderData = {
        items: cartItems.map((item: any) => ({
          product_id: item.product_id || item.id,
          quantity: item.quantity,
        })),
        delivery_address: deliveryAddr,
        payment_method: selectedMethod,
        coupon_code: couponCode || undefined,
        total: grandTotal,
        delivery_fee: deliveryFee,
      };

      const result: any = await createOrderMutation.mutateAsync(orderData);

      // Clear cart on success
      clearCart();
      triggerHaptic('success');

      // Navigate to confirmation
      router.replace({
        pathname: '/checkout/confirmation',
        params: {
          orderId: result?.order_id || result?.id || 'new',
          total: grandTotal.toString(),
          method: selectedMethod,
        },
      });
    } catch (error: any) {
      Alert.alert(
        'Order Failed',
        error?.message || 'Failed to place order. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsPlacing(false);
    }
  }, [
    selectedAddress,
    cartItems,
    selectedMethod,
    couponCode,
    subtotal,
    deliveryFee,
    discount,
    grandTotal,
    createOrderMutation,
    clearCart,
    router,
  ]);

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Header title="Payment" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Indicator */}
        <AnimatedRN.View entering={FadeInUp.springify()} style={styles.stepIndicator}>
          <View style={[styles.step, styles.stepDone]}>
            <Text style={styles.stepNumDone}>✓</Text>
          </View>
          <View style={[styles.stepLine, styles.stepLineDone]} />
          <View style={[styles.step, styles.stepActive]}>
            <Text style={styles.stepNumActive}>2</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.step}>
            <Text style={styles.stepNum}>3</Text>
          </View>
        </AnimatedRN.View>

        {/* Delivery Address Preview */}
        {selectedAddress && (
          <AnimatedRN.View entering={FadeInUp.delay(80).springify()} style={styles.section}>
            <Text style={styles.sectionTitle}>Delivering to</Text>
            <View style={styles.addressPreview}>
              <MapPin size={16} color={colors.primary} />
              <View style={styles.addressInfo}>
                <Text style={styles.addressName}>{selectedAddress.name || selectedAddress.address_type}</Text>
                <Text style={styles.addressText} numberOfLines={2}>
                  {selectedAddress.address_line_1}, {selectedAddress.city} -{' '}
                  {selectedAddress.postal_code}
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </AnimatedRN.View>
        )}

        {/* Payment Methods */}
        <AnimatedRN.View entering={FadeInUp.delay(160).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {PAYMENT_METHODS.map((method, index) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodSelected,
                !method.enabled && styles.methodDisabled,
              ]}
              onPress={() => method.enabled && handleSelectMethod(method.id)}
              activeOpacity={method.enabled ? 0.7 : 1}
            >
              <View style={styles.methodRow}>
                {/* Radio */}
                <View
                  style={[
                    styles.radio,
                    selectedMethod === method.id && styles.radioActive,
                  ]}
                >
                  {selectedMethod === method.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>

                {/* Icon */}
                <View style={styles.methodIcon}>
                  {ICON_MAP[method.id] || <CreditCard size={24} color={colors.textTertiary} />}
                </View>

                {/* Label */}
                <View style={styles.methodInfo}>
                  <Text
                    style={[
                      styles.methodName,
                      !method.enabled && styles.methodNameDisabled,
                    ]}
                  >
                    {method.label}
                  </Text>
                  {method.description && (
                    <Text style={styles.methodDesc}>{method.description}</Text>
                  )}
                </View>

                {/* Coming Soon */}
                {!method.enabled && (
                  <View style={styles.comingSoon}>
                    <Text style={styles.comingSoonText}>Soon</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </AnimatedRN.View>

        {/* Order Summary */}
        <AnimatedRN.View entering={FadeInUp.delay(240).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Items ({cartItems.length})
              </Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text
                style={[
                  styles.summaryValue,
                  deliveryFee === 0 && styles.freeText,
                ]}
              >
                {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
              </Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={[styles.summaryValue, styles.discountText]}>
                  -{formatPrice(discount)}
                </Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(grandTotal)}</Text>
            </View>
          </View>
        </AnimatedRN.View>

        {/* Security Badge */}
        <AnimatedRN.View entering={FadeInUp.delay(320).springify()} style={styles.securityBadge}>
          <ShieldCheck size={16} color={colors.success} />
          <Text style={styles.securityText}>
            Your payment information is secure and encrypted
          </Text>
        </AnimatedRN.View>
      </ScrollView>

      {/* Place Order Button */}
      <AnimatedRN.View
        entering={FadeInDown.springify()}
        style={[styles.bottomBar, { paddingBottom: bottom + spacing.sm }]}
      >
        <View style={styles.bottomLeft}>
          <Text style={styles.bottomLabel}>Total Amount</Text>
          <Text style={styles.bottomTotal}>{formatPrice(grandTotal)}</Text>
        </View>
        <Button
          title={isPlacing ? 'Placing Order...' : 'Place Order'}
          onPress={handlePlaceOrder}
          loading={isPlacing}
          disabled={isPlacing}
          style={styles.placeBtn}
          icon={<ChevronRight size={18} color={colors.black} />}
          iconPosition="right"
        />
      </AnimatedRN.View>
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
  content: {
    padding: spacing.md,
    paddingBottom: 120,
  },

  // Steps
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grey100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: {
    backgroundColor: colors.primary,
  },
  stepDone: {
    backgroundColor: colors.success,
  },
  stepNum: {
    ...typography.labelMedium,
    color: colors.textTertiary,
  },
  stepNumActive: {
    ...typography.labelMedium,
    color: colors.black,
    fontWeight: '700',
  },
  stepNumDone: {
    ...typography.labelMedium,
    color: colors.white,
    fontWeight: '700',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.grey200,
  },
  stepLineDone: {
    backgroundColor: colors.success,
  },

  // Section
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  // Address preview
  addressPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.sm,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    ...typography.bodyMedium,
    color: colors.text,
    fontWeight: '600',
  },
  addressText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  changeText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },

  // Payment methods
  methodCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  methodSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  methodDisabled: {
    opacity: 0.5,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.grey300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.grey50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    ...typography.bodyMedium,
    color: colors.text,
    fontWeight: '600',
  },
  methodNameDisabled: {
    color: colors.textTertiary,
  },
  methodDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  comingSoon: {
    backgroundColor: colors.grey100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  comingSoonText: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '600',
  },

  // Order summary
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.bodyMedium,
    color: colors.text,
    fontWeight: '600',
  },
  freeText: {
    color: colors.success,
    fontWeight: '700',
  },
  discountText: {
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    ...typography.h5,
    color: colors.text,
  },
  totalValue: {
    ...typography.h4,
    color: colors.primary,
  },

  // Security
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  securityText: {
    ...typography.caption,
    color: colors.textTertiary,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
  bottomLeft: {
    flex: 1,
  },
  bottomLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  bottomTotal: {
    ...typography.h4,
    color: colors.text,
  },
  placeBtn: {
    minWidth: 160,
  },
});

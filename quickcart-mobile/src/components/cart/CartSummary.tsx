import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ShoppingBag, Truck, Tag, Receipt } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { formatPrice } from '@utils/helpers';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '@utils/constants';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  couponCode?: string;
  total: number;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function CartSummary({
  itemCount,
  subtotal,
  deliveryFee,
  discount = 0,
  couponCode,
  total,
  style,
}: CartSummaryProps) {
  const isFreeDelivery = deliveryFee === 0 && subtotal > 0;
  const amountForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;

  return (
    <Animated.View entering={FadeInUp.delay(150).springify()} style={[styles.container, style]}>
      <Text style={styles.title}>Order Summary</Text>

      {/* Free delivery progress hint */}
      {!isFreeDelivery && subtotal > 0 && amountForFreeDelivery > 0 && (
        <View style={styles.hintRow}>
          <Truck size={14} color={colors.info} />
          <Text style={styles.hintText}>
            Add {formatPrice(amountForFreeDelivery)} more for free delivery
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      {/* Row: Items */}
      <View style={styles.row}>
        <View style={styles.rowLabelWrap}>
          <ShoppingBag size={14} color={colors.textTertiary} />
          <Text style={styles.rowLabel}>
            Items ({itemCount})
          </Text>
        </View>
        <Text style={styles.rowValue}>{formatPrice(subtotal)}</Text>
      </View>

      {/* Row: Delivery */}
      <View style={styles.row}>
        <View style={styles.rowLabelWrap}>
          <Truck size={14} color={colors.textTertiary} />
          <Text style={styles.rowLabel}>Delivery</Text>
        </View>
        {isFreeDelivery ? (
          <View style={styles.freeBadge}>
            <Text style={styles.freeText}>FREE</Text>
          </View>
        ) : (
          <Text style={styles.rowValue}>{formatPrice(deliveryFee)}</Text>
        )}
      </View>

      {/* Row: Discount (conditional) */}
      {discount > 0 && (
        <View style={styles.row}>
          <View style={styles.rowLabelWrap}>
            <Tag size={14} color={colors.success} />
            <Text style={[styles.rowLabel, { color: colors.success }]}>
              Discount {couponCode ? `(${couponCode})` : ''}
            </Text>
          </View>
          <Text style={[styles.rowValue, { color: colors.success }]}>
            -{formatPrice(discount)}
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      {/* Total */}
      <View style={styles.row}>
        <View style={styles.rowLabelWrap}>
          <Receipt size={16} color={colors.textPrimary} />
          <Text style={styles.totalLabel}>Total</Text>
        </View>
        <Text style={styles.totalValue}>{formatPrice(total)}</Text>
      </View>

      {/* Savings note */}
      {(discount > 0 || isFreeDelivery) && (
        <View style={styles.savingsRow}>
          <Text style={styles.savingsText}>
            You save {formatPrice(discount + (isFreeDelivery ? DELIVERY_FEE : 0))} on this order 🎉
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.infoLight,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
    gap: 6,
  },
  hintText: {
    ...typography.caption,
    color: colors.info,
    fontWeight: '600',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  rowLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  rowValue: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  freeBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  freeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.success,
  },
  totalLabel: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  totalValue: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  savingsRow: {
    marginTop: spacing.xs,
    alignItems: 'center',
  },
  savingsText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
});

export default CartSummary;

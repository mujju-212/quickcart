import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { ShoppingCart, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { formatPrice } from '@utils/helpers';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface CartFooterProps {
  itemCount: number;
  total: number;
  onCheckout: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function CartFooter({
  itemCount,
  total,
  onCheckout,
  disabled = false,
  style,
}: CartFooterProps) {
  const { bottom } = useSafeAreaInsets();

  if (itemCount === 0) return null;

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(18)}
      style={[styles.container, { paddingBottom: bottom + spacing.sm }, style]}
    >
      {/* Left: Total info */}
      <View style={styles.totalWrap}>
        <Text style={styles.totalLabel}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Text>
        <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
      </View>

      {/* Right: Checkout button */}
      <TouchableOpacity
        style={[styles.checkoutBtn, disabled && styles.checkoutBtnDisabled]}
        onPress={onCheckout}
        disabled={disabled}
        activeOpacity={0.85}
      >
        <Text style={styles.checkoutText}>Checkout</Text>
        <ArrowRight size={18} color={colors.white} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Mini Cart Footer (for non-cart screens)
// ──────────────────────────────────────────

interface MiniCartBarProps {
  itemCount: number;
  total: number;
  onPress: () => void;
  style?: ViewStyle;
}

export function MiniCartBar({ itemCount, total, onPress, style }: MiniCartBarProps) {
  const { bottom } = useSafeAreaInsets();

  if (itemCount === 0) return null;

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(18)}
      style={[
        styles.miniBar,
        { paddingBottom: bottom + spacing.xs },
        style,
      ]}
    >
      <TouchableOpacity
        style={styles.miniInner}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.miniLeft}>
          <View style={styles.miniCartIcon}>
            <ShoppingCart size={16} color={colors.white} />
            <View style={styles.miniCountBadge}>
              <Text style={styles.miniCountText}>{itemCount}</Text>
            </View>
          </View>
          <Text style={styles.miniTotal}>{formatPrice(total)}</Text>
        </View>
        <View style={styles.miniRight}>
          <Text style={styles.miniViewCart}>View Cart</Text>
          <ArrowRight size={16} color={colors.white} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
  totalWrap: {},
  totalLabel: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  totalAmount: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.md,
    gap: 6,
    ...shadows.md,
  },
  checkoutBtnDisabled: {
    backgroundColor: colors.textDisabled,
  },
  checkoutText: {
    ...typography.labelLarge,
    color: colors.white,
    fontWeight: '700',
  },

  // Mini Bar
  miniBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  miniInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.lg,
  },
  miniLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  miniCartIcon: {
    position: 'relative',
  },
  miniCountBadge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: colors.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  miniCountText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.white,
  },
  miniTotal: {
    ...typography.labelMedium,
    color: colors.white,
    fontWeight: '700',
  },
  miniRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniViewCart: {
    ...typography.labelSmall,
    color: colors.white,
    fontWeight: '600',
  },
});

export default CartFooter;

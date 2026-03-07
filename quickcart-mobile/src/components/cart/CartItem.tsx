import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Trash2 } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { formatPrice, calculateDiscount } from '@utils/helpers';
import { QuantitySelector } from '@components/product';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface CartItemData {
  id: string | number;
  product_id: string | number;
  name: string;
  image_url?: string;
  price: number;
  original_price?: number;
  quantity: number;
  size?: string;
  stock?: number;
}

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (productId: string | number, qty: number) => void;
  onRemove: (productId: string | number) => void;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function CartItem({ item, onUpdateQuantity, onRemove, style }: CartItemProps) {
  const discount = item.original_price
    ? calculateDiscount(item.original_price, item.price)
    : 0;
  const lineTotal = item.price * item.quantity;

  const handleQtyChange = useCallback(
    (qty: number) => {
      if (qty <= 0) {
        onRemove(item.product_id);
      } else {
        onUpdateQuantity(item.product_id, qty);
      }
    },
    [item.product_id, onUpdateQuantity, onRemove]
  );

  return (
    <Animated.View
      entering={FadeInRight.springify().damping(18)}
      exiting={FadeOutLeft.duration(250)}
      layout={Layout.springify()}
      style={[styles.card, style]}
    >
      {/* Product Image */}
      <Image
        source={{ uri: item.image_url || 'https://via.placeholder.com/100' }}
        style={styles.image}
      />

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>

        {item.size && (
          <Text style={styles.size}>{item.size}</Text>
        )}

        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
          {item.original_price && item.original_price > item.price && (
            <>
              <Text style={styles.originalPrice}>
                {formatPrice(item.original_price)}
              </Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{discount}% off</Text>
              </View>
            </>
          )}
        </View>

        {/* Quantity + Line Total */}
        <View style={styles.bottomRow}>
          <QuantitySelector
            value={item.quantity}
            onChange={handleQtyChange}
            min={0}
            max={item.stock ?? 10}
            compact
          />
          <Text style={styles.lineTotal}>{formatPrice(lineTotal)}</Text>
        </View>
      </View>

      {/* Delete */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onRemove(item.product_id)}
        hitSlop={8}
      >
        <Trash2 size={16} color={colors.error} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  info: {
    flex: 1,
    marginLeft: spacing.sm,
    justifyContent: 'space-between',
  },
  name: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    fontWeight: '600',
    lineHeight: 18,
  },
  size: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  price: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  originalPrice: {
    ...typography.caption,
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: borderRadius.xs,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  lineTotal: {
    ...typography.labelMedium,
    color: colors.primary,
    fontWeight: '700',
  },
  deleteBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    padding: 4,
  },
});

export default CartItem;

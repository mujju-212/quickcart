import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { formatPrice } from '@utils/helpers';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface OrderItemData {
  id: string | number;
  product_id?: string | number;
  name: string;
  image_url?: string;
  price: number;
  quantity: number;
  size?: string;
}

interface OrderItemsProps {
  items: OrderItemData[];
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Single Item Row
// ──────────────────────────────────────────

function OrderItemRow({ item }: { item: OrderItemData }) {
  return (
    <View style={styles.row}>
      <Image
        source={{ uri: item.image_url || 'https://via.placeholder.com/60' }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        {item.size && <Text style={styles.size}>Size: {item.size}</Text>}
        <Text style={styles.qty}>Qty: {item.quantity}</Text>
      </View>
      <Text style={styles.price}>{formatPrice(item.price * item.quantity)}</Text>
    </View>
  );
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function OrderItems({ items, style }: OrderItemsProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>
        Items ({items.length})
      </Text>

      {items.map((item, i) => (
        <React.Fragment key={item.id || i}>
          <OrderItemRow item={item} />
          {i < items.length - 1 && <View style={styles.divider} />}
        </React.Fragment>
      ))}
    </View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  info: {
    flex: 1,
    marginLeft: spacing.sm,
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
  qty: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  price: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
});

export default OrderItems;

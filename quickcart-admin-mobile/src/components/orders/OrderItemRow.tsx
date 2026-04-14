// OrderItemRow — Single item row within an order detail

import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatPrice } from '../../utils/helpers';

interface OrderItem {
  product_id: number;
  product_name: string;
  image_url?: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderItemRowProps {
  item: OrderItem;
}

export default function OrderItemRow({ item }: OrderItemRowProps) {
  return (
    <View style={styles.row}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <MaterialCommunityIcons name="package-variant" size={20} color={colors.text.disabled} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{item.product_name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
          <Text style={styles.qty}>× {item.quantity}</Text>
        </View>
      </View>

      <Text style={styles.total}>{formatPrice(item.total)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  placeholder: {
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.body,
    color: colors.text.primary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  price: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  qty: {
    ...typography.small,
    color: colors.text.secondary,
    fontFamily: 'Inter_600SemiBold',
  },
  total: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    fontFamily: 'Inter_700Bold',
    marginLeft: spacing.sm,
  },
});

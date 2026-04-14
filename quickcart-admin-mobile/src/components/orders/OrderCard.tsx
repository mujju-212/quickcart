// OrderCard — Compact order summary card for list views

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StatusBadge from '../common/StatusBadge';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { formatPrice, formatOrderId, formatDateTime } from '../../utils/helpers';

interface OrderCardProps {
  order: {
    order_id: number;
    customer_name: string;
    total_amount: number;
    status: string;
    created_at: string;
    item_count: number;
    payment_method?: string;
  };
  onPress: () => void;
}

export default function OrderCard({ order, onPress }: OrderCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.topRow}>
        <View style={styles.idRow}>
          <Text style={styles.orderId}>{formatOrderId(order.order_id)}</Text>
          <StatusBadge status={order.status} type="order" />
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text.disabled} />
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="account-outline" size={14} color={colors.text.tertiary} />
          <Text style={styles.infoText} numberOfLines={1}>{order.customer_name}</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="clock-outline" size={14} color={colors.text.tertiary} />
          <Text style={styles.infoText}>{formatDateTime(order.created_at)}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.items}>{order.item_count} item{order.item_count !== 1 ? 's' : ''}</Text>
        {order.payment_method && (
          <Text style={styles.payment}>{order.payment_method}</Text>
        )}
        <Text style={styles.amount}>{formatPrice(order.total_amount)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  orderId: {
    ...typography.bodyMedium,
    color: colors.primary[700],
    fontFamily: 'Inter_700Bold',
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
  },
  items: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  payment: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginLeft: spacing.md,
    textTransform: 'uppercase',
  },
  amount: {
    ...typography.bodyMedium,
    color: colors.text.primary,
    fontFamily: 'Inter_700Bold',
    marginLeft: 'auto',
  },
});

// RecentOrdersList — Quick snapshot of latest orders on dashboard

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StatusBadge from '../common/StatusBadge';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatPrice, formatOrderId, timeAgo } from '../../utils/helpers';

interface RecentOrder {
  order_id: number;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface RecentOrdersListProps {
  data: RecentOrder[];
  onOrderPress?: (orderId: number) => void;
  onViewAll?: () => void;
}

export default function RecentOrdersList({ data, onOrderPress, onViewAll }: RecentOrdersListProps) {
  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Orders</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} style={styles.viewAll}>
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color={colors.primary[600]} />
          </TouchableOpacity>
        )}
      </View>

      {data.slice(0, 5).map((order) => (
        <TouchableOpacity
          key={order.order_id}
          style={styles.row}
          onPress={() => onOrderPress?.(order.order_id)}
          activeOpacity={0.7}
        >
          <View style={styles.leftCol}>
            <Text style={styles.orderId}>{formatOrderId(order.order_id)}</Text>
            <Text style={styles.customer} numberOfLines={1}>{order.customer_name}</Text>
          </View>
          <View style={styles.rightCol}>
            <Text style={styles.amount}>{formatPrice(order.total_amount)}</Text>
            <StatusBadge status={order.status} type="order" />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.cardTitle,
    color: colors.text.primary,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    ...typography.caption,
    color: colors.primary[600],
    fontFamily: 'Inter_600SemiBold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  leftCol: {
    flex: 1,
  },
  orderId: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  customer: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: 1,
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
});

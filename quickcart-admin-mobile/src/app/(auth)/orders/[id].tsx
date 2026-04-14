// Order Detail Screen

import React, { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOrder, useOrderTimeline, useUpdateOrderStatus, useCancelOrder } from '../../../hooks/useOrders';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { StatusBadge } from '../../../components/common';
import { SkeletonCard } from '../../../components/common/Skeleton';
import OrderTimeline from '../../../components/orders/OrderTimeline';
import OrderItemRow from '../../../components/orders/OrderItemRow';
import StatusUpdateSheet from '../../../components/orders/StatusUpdateSheet';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, borderRadius } from '../../../theme/spacing';
import { formatPrice, formatDate, formatOrderId, formatPhone } from '../../../utils/helpers';
import { OrderStatus } from '../../../utils/constants';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = Number(id);

  const { data: order, isLoading, refetch, isRefetching } = useOrder(orderId);
  const timeline = useOrderTimeline(orderId);
  const updateStatus = useUpdateOrderStatus();
  const cancelOrder = useCancelOrder();
  const [statusSheetOpen, setStatusSheetOpen] = useState(false);

  const handleStatusUpdate = (newStatus: string, note?: string) => {
    updateStatus.mutate(
      { orderId, status: newStatus as OrderStatus, note },
      {
        onSuccess: () => {
          setStatusSheetOpen(false);
          refetch();
          timeline.refetch();
        },
        onError: (err: any) => Alert.alert('Error', err?.message || 'Failed to update status'),
      }
    );
  };

  const handleCancel = () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: () =>
          cancelOrder.mutate({ orderId, reason: 'Cancelled by admin' }, {
            onSuccess: () => { refetch(); timeline.refetch(); },
            onError: (err: any) => Alert.alert('Error', err?.message || 'Failed to cancel'),
          }),
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SkeletonCard style={{ height: 120, margin: spacing.md }} />
        <SkeletonCard style={{ height: 200, margin: spacing.md }} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, styles.center]}>
        <MaterialCommunityIcons name="alert-circle" size={48} color={colors.text.disabled} />
        <Text style={styles.notFoundText}>Order not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary[600]]} />
        }
      >
        {/* Order header */}
        <Card>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.orderId}>{formatOrderId(order.id)}</Text>
              <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
            </View>
            <StatusBadge status={order.status} type="order" />
          </View>
        </Card>

        {/* Customer info */}
        <Card title="Customer">
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account" size={16} color={colors.text.tertiary} />
            <Text style={styles.infoText}>{order.customer_name || '—'}</Text>
          </View>
          {order.customer_email && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="email-outline" size={16} color={colors.text.tertiary} />
              <Text style={styles.infoText}>{order.customer_email}</Text>
            </View>
          )}
          {order.customer_phone && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="phone-outline" size={16} color={colors.text.tertiary} />
              <Text style={styles.infoText}>{formatPhone(order.customer_phone)}</Text>
            </View>
          )}
        </Card>

        {/* Delivery address */}
        {order.delivery_address && (
          <Card title="Delivery Address">
            <Text style={styles.addressText}>{order.delivery_address}</Text>
          </Card>
        )}

        {/* Order items */}
        <Card title={`Items (${order.items?.length || 0})`}>
          {order.items?.map((item: any, idx: number) => (
            <OrderItemRow key={idx} item={item} />
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatPrice(order.subtotal || order.total)}</Text>
          </View>
          {(order.discount ?? 0) > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={[styles.totalValue, { color: colors.status.delivered }]}>
                -{formatPrice(order.discount)}
              </Text>
            </View>
          )}
          {order.delivery_fee > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Delivery</Text>
              <Text style={styles.totalValue}>{formatPrice(order.delivery_fee)}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.grandLabel}>Total</Text>
            <Text style={styles.grandValue}>{formatPrice(order.total)}</Text>
          </View>
        </Card>

        {/* Payment info */}
        <Card title="Payment">
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="credit-card-outline" size={16} color={colors.text.tertiary} />
            <Text style={styles.infoText}>
              {order.payment_method || 'N/A'} — {order.payment_status || 'pending'}
            </Text>
          </View>
        </Card>

        {/* Timeline */}
        <Card title="Order Timeline">
          {timeline.isLoading ? (
            <SkeletonCard style={{ height: 120 }} />
          ) : (
            <OrderTimeline events={timeline.data || []} />
          )}
        </Card>

        {/* Actions */}
        {order.status !== 'cancelled' && order.status !== 'delivered' && (
          <View style={styles.actionRow}>
            <Button
              title="Update Status"
              onPress={() => setStatusSheetOpen(true)}
              icon="swap-horizontal"
              style={{ flex: 1 }}
            />
            <Button
              title="Cancel"
              variant="danger"
              onPress={handleCancel}
              icon="close-circle-outline"
              loading={cancelOrder.isPending}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </ScrollView>

      {/* Status update sheet */}
      <StatusUpdateSheet
        visible={statusSheetOpen}
        currentStatus={order.status}
        onClose={() => setStatusSheetOpen(false)}
        onUpdate={handleStatusUpdate}
        loading={updateStatus.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing['3xl'],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: colors.text.primary,
  },
  orderDate: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  notFoundText: {
    ...typography.body,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  addressText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    ...typography.body,
    color: colors.text.tertiary,
  },
  totalValue: {
    ...typography.body,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.primary,
  },
  grandLabel: {
    ...typography.bodyMedium,
    fontFamily: 'Inter_700Bold',
    color: colors.text.primary,
  },
  grandValue: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: colors.primary[700],
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});

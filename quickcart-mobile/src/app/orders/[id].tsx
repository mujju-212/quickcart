import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import AnimatedRN, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Package,
  MapPin,
  CreditCard,
  Phone,
  RotateCcw,
  XCircle,
  Star,
  Copy,
  CheckCircle2,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { Header, ErrorState } from '@components/common';
import { OrderTimeline, OrderItems, buildTimelineSteps } from '@components/order';
import { Button, Badge } from '@components/ui';
import { Skeleton } from '@components/ui';
import { useOrder } from '@hooks/useOrders';
import { useCartStore } from '@stores/cartStore';
import { formatPrice, formatDate, formatTime } from '@utils/helpers';
import { triggerHaptic } from '@utils/haptics';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from '@utils/constants';

// ──────────────────────────────────────────
//  Order Detail Screen
// ──────────────────────────────────────────

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top } = useSafeAreaInsets();

  const { data: order, isLoading, error, refetch, isRefetching } = useOrder(Number(id));
  const addItem = useCartStore((s) => s.addItem);

  const status = (order?.status || 'pending').toLowerCase();
  const statusLabel = ORDER_STATUS_LABELS[status] || status;
  const statusColor = ORDER_STATUS_COLORS[status] || colors.textSecondary;

  const handleCopyId = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(order?.id?.toString() || id || '');
      triggerHaptic('success');
      Alert.alert('Copied!', 'Order ID copied to clipboard');
    } catch {}
  }, [order, id]);

  const handleReorder = useCallback(() => {
    if (!order?.items?.length) return;
    Alert.alert(
      'Reorder',
      'Add all items from this order to your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add to Cart',
          onPress: () => {
            order.items.forEach((item: any) => {
              addItem({
                id: item.product_id || item.id,
                product_id: item.product_id || item.id,
                name: item.product_name || item.name,
                price: item.price,
                image_url: item.image || item.product_image,
                quantity: item.quantity,
                size: item.size || '',
                stock: item.stock || 99,
              });
            });
            triggerHaptic('success');
            router.push('/(tabs)/cart');
          },
        },
      ]
    );
  }, [order, addItem, router]);

  const handleCancelOrder = useCallback(() => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Cancel Order',
          style: 'destructive',
          onPress: () => {
            triggerHaptic('warning');
            // API call would go here
            Alert.alert('Order Cancelled', 'Your order has been cancelled.');
            refetch();
          },
        },
      ]
    );
  }, [refetch]);

  // Loading
  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <Header title="Order Details" />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Skeleton width="50%" height={20} style={{ marginBottom: 8 }} />
            <Skeleton width="30%" height={16} style={{ marginBottom: 12 }} />
            <Skeleton width="100%" height={80} style={{ marginBottom: 8 }} />
            <Skeleton width="100%" height={80} />
          </View>
          <View style={styles.card}>
            <Skeleton width="40%" height={16} style={{ marginBottom: 8 }} />
            <Skeleton width="100%" height={120} />
          </View>
        </ScrollView>
      </View>
    );
  }

  // Error
  if (error || !order) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <Header title="Order Details" />
        <ErrorState
          preset="generic"
          title="Could not load order"
          message="Please try again"
          onRetry={refetch}
        />
      </View>
    );
  }

  const canCancel = ['pending', 'confirmed'].includes(status);

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Header title="Order Details" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Order Header Card */}
        <AnimatedRN.View entering={FadeInUp.springify()} style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.idRow}>
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <TouchableOpacity onPress={handleCopyId} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Copy size={14} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.orderDate}>
                {formatDate(order.created_at)} · {formatTime(order.created_at)}
              </Text>
            </View>
            <Badge
              label={statusLabel}
              variant={
                status === 'delivered'
                  ? 'success'
                  : status === 'cancelled'
                  ? 'error'
                  : status === 'shipped' || status === 'out_for_delivery'
                  ? 'info'
                  : 'warning'
              }
            />
          </View>

          {/* Items count + total */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.summaryTotal}>
              {formatPrice(order.total || 0)}
            </Text>
          </View>
        </AnimatedRN.View>

        {/* Order Timeline */}
        <AnimatedRN.View entering={FadeInUp.delay(100).springify()} style={styles.card}>
          <Text style={styles.cardTitle}>Order Status</Text>
          <OrderTimeline steps={buildTimelineSteps(status)} />
        </AnimatedRN.View>

        {/* Order Items */}
        <AnimatedRN.View entering={FadeInUp.delay(200).springify()} style={styles.card}>
          <Text style={styles.cardTitle}>Items Ordered</Text>
          <OrderItems items={(order.items || []).map((item, idx) => ({ id: idx, ...item, name: item.name || 'Product' }))} />
        </AnimatedRN.View>

        {/* Delivery Address */}
        {order.delivery_address && (() => {
          let addr: any = {};
          try { addr = typeof order.delivery_address === 'string' ? JSON.parse(order.delivery_address) : order.delivery_address; } catch { addr = { address_line1: order.delivery_address }; }
          return (
          <AnimatedRN.View entering={FadeInUp.delay(300).springify()} style={styles.card}>
            <View style={styles.cardTitleRow}>
              <MapPin size={18} color={colors.primary} />
              <Text style={styles.cardTitle}>Delivery Address</Text>
            </View>
            {addr.name && (
            <Text style={styles.addressName}>
              {addr.name}
            </Text>
            )}
            <Text style={styles.addressText}>
              {addr.address_line1 || addr.address_line_1 || ''}
              {(addr.address_line2 || addr.address_line_2)
                ? `, ${addr.address_line2 || addr.address_line_2}`
                : ''}
            </Text>
            {(addr.city || addr.state) && (
            <Text style={styles.addressText}>
              {addr.city}, {addr.state} -{' '}
              {addr.pincode || addr.postal_code || ''}
            </Text>
            )}
            {addr.phone && (
              <View style={styles.phoneRow}>
                <Phone size={14} color={colors.textTertiary} />
                <Text style={styles.phoneText}>
                  {addr.phone}
                </Text>
              </View>
            )}
          </AnimatedRN.View>
          );
        })()}

        {/* Payment Info */}
        <AnimatedRN.View entering={FadeInUp.delay(400).springify()} style={styles.card}>
          <View style={styles.cardTitleRow}>
            <CreditCard size={18} color={colors.primary} />
            <Text style={styles.cardTitle}>Payment Summary</Text>
          </View>

          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Subtotal</Text>
            <Text style={styles.payValue}>
              {formatPrice((order.total || 0) - (order.delivery_fee || 0) - (order.handling_fee || 0) + (order.discount_amount || 0))}
            </Text>
          </View>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Delivery Fee</Text>
            <Text
              style={[
                styles.payValue,
                (order.delivery_fee || 0) === 0 && styles.freeText,
              ]}
            >
              {(order.delivery_fee || 0) === 0
                ? 'FREE'
                : formatPrice(order.delivery_fee)}
            </Text>
          </View>
          {(order.discount_amount || 0) > 0 && (
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>Discount</Text>
              <Text style={[styles.payValue, styles.discountText]}>
                -{formatPrice(order.discount_amount || 0)}
              </Text>
            </View>
          )}
          <View style={styles.payDivider} />
          <View style={styles.payRow}>
            <Text style={styles.payTotalLabel}>Total Paid</Text>
            <Text style={styles.payTotalValue}>
              {formatPrice(order.total || 0)}
            </Text>
          </View>
          <Text style={styles.payMethod}>
            Paid via{' '}
            {order.payment_method === 'cod'
              ? 'Cash on Delivery'
              : order.payment_method || 'Online'}
          </Text>
        </AnimatedRN.View>

        {/* Action Buttons */}
        <AnimatedRN.View entering={FadeInUp.delay(500).springify()} style={styles.actionsCard}>
          <Button
            title="Reorder"
            onPress={handleReorder}
            variant="outline"
            icon={<RotateCcw size={16} color={colors.primary} />}
            style={styles.actionBtn}
          />

          {status === 'delivered' && (
            <Button
              title="Write Review"
              onPress={() =>
                router.push({
                  pathname: '/review/write',
                  params: { orderId: order.id },
                })
              }
              variant="outline"
              icon={<Star size={16} color={colors.primary} />}
              style={styles.actionBtn}
            />
          )}

          {canCancel && (
            <Button
              title="Cancel Order"
              onPress={handleCancelOrder}
              variant="outline"
              icon={<XCircle size={16} color={colors.error} />}
              style={StyleSheet.flatten([styles.actionBtn, styles.cancelBtn])}
              textStyle={{ color: colors.error }}
            />
          )}
        </AnimatedRN.View>

        {/* Help */}
        <AnimatedRN.View entering={FadeInUp.delay(600).springify()} style={styles.helpSection}>
          <TouchableOpacity
            style={styles.helpBtn}
            onPress={() => router.push('/help')}
          >
            <Text style={styles.helpText}>Need help with this order?</Text>
          </TouchableOpacity>
        </AnimatedRN.View>
      </ScrollView>
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
    paddingBottom: spacing.xxl,
  },

  // Card
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  cardTitle: {
    ...typography.h5,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  orderId: {
    ...typography.h5,
    color: colors.text,
  },
  orderDate: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Summary
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  summaryLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  summaryTotal: {
    ...typography.h4,
    color: colors.primary,
  },

  // Address
  addressName: {
    ...typography.bodyMedium,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  addressText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  phoneText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },

  // Payment
  payRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  payLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  payValue: {
    ...typography.bodyMedium,
    color: colors.text,
    fontWeight: '600',
  },
  freeText: {
    color: colors.success,
  },
  discountText: {
    color: colors.success,
  },
  payDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  payTotalLabel: {
    ...typography.h5,
    color: colors.text,
  },
  payTotalValue: {
    ...typography.h4,
    color: colors.primary,
  },
  payMethod: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },

  // Actions
  actionsCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    minWidth: 120,
  },
  cancelBtn: {
    borderColor: colors.error,
  },

  // Help
  helpSection: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  helpBtn: {
    padding: spacing.sm,
  },
  helpText: {
    ...typography.bodyMedium,
    color: colors.primary,
    fontWeight: '600',
  },
});

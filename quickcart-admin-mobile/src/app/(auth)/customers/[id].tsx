// Customer Detail Screen

import React from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import { Text, Avatar, Divider } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCustomer, useCustomerOrders } from '../../../hooks/useCustomers';
import Card from '../../../components/common/Card';
import CustomerStats from '../../../components/customers/CustomerStats';
import OrderCard from '../../../components/orders/OrderCard';
import { SkeletonCard } from '../../../components/common/Skeleton';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, borderRadius } from '../../../theme/spacing';
import { formatDate } from '../../../utils/helpers';

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const userId = Number(id);

  const { data: customer, isLoading, isRefetching, refetch } = useCustomer(userId);
  const { data: ordersData, isLoading: loadingOrders } = useCustomerOrders(userId);

  const orders = (ordersData as any)?.orders || ordersData || [];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SkeletonCard style={{ height: 120, margin: spacing.md }} />
        <SkeletonCard style={{ height: 80, margin: spacing.md }} />
        <SkeletonCard style={{ height: 200, margin: spacing.md }} />
      </View>
    );
  }

  if (!customer) {
    return (
      <View style={[styles.container, styles.center]}>
        <MaterialCommunityIcons name="account-question" size={48} color={colors.text.disabled} />
        <Text style={styles.notFoundText}>Customer not found</Text>
      </View>
    );
  }

  const initials = (customer.name || 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[colors.primary[600]]} />
      }
    >
      {/* Profile header */}
      <Card style={styles.profileCard}>
        <View style={styles.profileRow}>
          <Avatar.Text size={60} label={initials} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="email-outline" size={14} color={colors.text.tertiary} />
              <Text style={styles.infoText}>{customer.email}</Text>
            </View>
            {customer.phone && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="phone-outline" size={14} color={colors.text.tertiary} />
                <Text style={styles.infoText}>{customer.phone}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar-outline" size={14} color={colors.text.tertiary} />
              <Text style={styles.infoText}>Member since {formatDate(customer.created_at)}</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Stats */}
      <CustomerStats
        totalOrders={customer.total_orders || 0}
        totalSpent={customer.total_spent || 0}
        averageOrder={customer.avg_order_value || 0}
        memberSince={customer.created_at ? formatDate(customer.created_at) : 'N/A'}
      />

      {/* Addresses */}
      {customer.addresses && customer.addresses.length > 0 && (
        <Card title="Addresses">
          {customer.addresses.map((addr: any, i: number) => (
            <View key={i} style={styles.addressItem}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color={colors.primary[600]} />
              <View style={{ flex: 1, marginLeft: spacing.xs }}>
                {addr.label && <Text style={styles.addressLabel}>{addr.label}</Text>}
                <Text style={styles.addressText}>
                  {[addr.address_line, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}
                </Text>
              </View>
            </View>
          ))}
        </Card>
      )}

      {/* Recent orders */}
      <Card title={`Recent Orders (${orders.length})`}>
        {loadingOrders ? (
          <SkeletonCard style={{ height: 60 }} />
        ) : orders.length === 0 ? (
          <Text style={styles.noOrders}>No orders yet</Text>
        ) : (
          orders.slice(0, 10).map((order: any) => (
            <TouchableOpacity
              key={order.order_id}
              onPress={() => router.push(`/(auth)/orders/${order.order_id}`)}
              activeOpacity={0.7}
            >
              <OrderCard order={order} onPress={() => router.push(`/(auth)/orders/${order.order_id}`)} />
            </TouchableOpacity>
          ))
        )}
      </Card>
    </ScrollView>
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
    paddingBottom: spacing['3xl'],
  },
  profileCard: {
    margin: spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    backgroundColor: colors.primary[600],
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  customerName: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  infoText: {
    ...typography.small,
    color: colors.text.secondary,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  addressLabel: {
    ...typography.caption,
    color: colors.primary[600],
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  addressText: {
    ...typography.small,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  noOrders: {
    ...typography.body,
    color: colors.text.disabled,
    textAlign: 'center',
    padding: spacing.lg,
  },
  notFoundText: {
    ...typography.body,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
});

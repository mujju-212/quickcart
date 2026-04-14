// CustomerStats — Quick stat row for customer detail view

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatPrice } from '../../utils/helpers';

interface CustomerStatsProps {
  totalOrders: number;
  totalSpent: number;
  averageOrder: number;
  memberSince: string;
}

export default function CustomerStats({ totalOrders, totalSpent, averageOrder, memberSince }: CustomerStatsProps) {
  const stats = [
    { icon: 'package-variant' as const, label: 'Orders', value: String(totalOrders), color: colors.primary[600] },
    { icon: 'cash-multiple' as const, label: 'Spent', value: formatPrice(totalSpent), color: colors.status.delivered },
    { icon: 'chart-line' as const, label: 'Avg Order', value: formatPrice(averageOrder), color: colors.accent },
    { icon: 'calendar-check' as const, label: 'Member Since', value: memberSince, color: colors.status.confirmed },
  ];

  return (
    <View style={styles.container}>
      {stats.map((s, i) => (
        <View key={i} style={styles.statBox}>
          <View style={[styles.iconBox, { backgroundColor: `${s.color}15` }]}>
            <MaterialCommunityIcons name={s.icon} size={18} color={s.color} />
          </View>
          <Text style={styles.value} numberOfLines={1}>{s.value}</Text>
          <Text style={styles.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: colors.text.primary,
    textAlign: 'center',
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: colors.text.tertiary,
    marginTop: 1,
  },
});

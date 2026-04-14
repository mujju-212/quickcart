// OrdersChart — Horizontal bar chart of orders by status

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface OrdersByStatus {
  status: string;
  count: number;
}

interface OrdersChartProps {
  data: OrdersByStatus[];
}

const statusColorMap: Record<string, string> = {
  pending: colors.status.pending,
  confirmed: colors.status.confirmed,
  processing: colors.status.processing,
  shipped: colors.status.shipped,
  delivered: colors.status.delivered,
  cancelled: colors.status.cancelled,
};

export default function OrdersChart({ data }: OrdersChartProps) {
  if (!data || data.length === 0) return null;

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders by Status</Text>

      {data.map((item) => {
        const barWidth = (item.count / maxCount) * 100;
        const barColor = statusColorMap[item.status.toLowerCase()] || colors.text.disabled;

        return (
          <View key={item.status} style={styles.row}>
            <View style={styles.labelCol}>
              <View style={[styles.dot, { backgroundColor: barColor }]} />
              <Text style={styles.label} numberOfLines={1}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
            <View style={styles.barCol}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${barWidth}%`, backgroundColor: barColor }]} />
              </View>
              <Text style={styles.count}>{item.count}</Text>
            </View>
          </View>
        );
      })}
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
  title: {
    ...typography.cardTitle,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  labelCol: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
  },
  barCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.background.tertiary,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  count: {
    ...typography.small,
    color: colors.text.secondary,
    fontFamily: 'Inter_600SemiBold',
    width: 30,
    textAlign: 'right',
  },
});

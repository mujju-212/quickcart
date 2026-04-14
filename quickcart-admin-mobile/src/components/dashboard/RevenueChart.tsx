// RevenueChart — Line chart showing revenue over time

import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatPrice } from '../../utils/helpers';

const screenWidth = Dimensions.get('window').width;

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
  period: string;
}

export default function RevenueChart({ data, period }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No revenue data available</Text>
      </View>
    );
  }

  // Take last N labels (max 7 labels shown)
  const step = Math.max(1, Math.floor(data.length / 7));
  const labels = data.filter((_, i) => i % step === 0).map((d) => {
    const date = new Date(d.date);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });
  const values = data.map((d) => d.revenue);

  const totalRevenue = values.reduce((sum, v) => sum + v, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Revenue Trend</Text>
        <Text style={styles.total}>{formatPrice(totalRevenue)}</Text>
      </View>
      <Text style={styles.periodLabel}>Last {period}</Text>

      <LineChart
        data={{
          labels,
          datasets: [{ data: values.length > 0 ? values : [0] }],
        }}
        width={screenWidth - spacing.lg * 2 - spacing.md * 2}
        height={200}
        yAxisLabel="₹"
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: colors.white,
          backgroundGradientFrom: colors.white,
          backgroundGradientTo: colors.white,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(30, 64, 175, ${opacity})`,
          labelColor: () => colors.text.tertiary,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: colors.primary[600],
          },
          propsForBackgroundLines: {
            strokeDasharray: '4 4',
            stroke: colors.divider,
          },
        }}
        bezier
        style={styles.chart}
        withInnerLines
        withOuterLines={false}
        fromZero
      />
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
  },
  title: {
    ...typography.cardTitle,
    color: colors.text.primary,
  },
  total: {
    ...typography.sectionTitle,
    color: colors.primary[600],
  },
  periodLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  chart: {
    borderRadius: borderRadius.md,
    marginLeft: -spacing.sm,
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.disabled,
  },
});

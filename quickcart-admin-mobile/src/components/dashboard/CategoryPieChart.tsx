// CategoryPieChart — Pie chart for category performance

import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const screenWidth = Dimensions.get('window').width;

interface CategoryData {
  category_name: string;
  total_revenue: number;
  order_count: number;
}

interface CategoryPieChartProps {
  data: CategoryData[];
}

const chartColors = colors.chart;

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (!data || data.length === 0) return null;

  const pieData = data.slice(0, 6).map((item, index) => ({
    name: item.category_name.length > 10 
      ? item.category_name.substring(0, 10) + '…' 
      : item.category_name,
    sales: item.total_revenue,
    color: chartColors[index % chartColors.length],
    legendFontColor: colors.text.secondary,
    legendFontSize: 11,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales by Category</Text>
      <PieChart
        data={pieData}
        width={screenWidth - spacing.lg * 2 - spacing.md * 2}
        height={180}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="sales"
        backgroundColor="transparent"
        paddingLeft="10"
        absolute={false}
      />

      {/* Legend below chart */}
      <View style={styles.legend}>
        {data.slice(0, 6).map((item, index) => (
          <View key={item.category_name} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: chartColors[index % chartColors.length] }]} />
            <Text style={styles.legendText} numberOfLines={1}>
              {item.category_name}
            </Text>
            <Text style={styles.legendCount}>{item.order_count} orders</Text>
          </View>
        ))}
      </View>
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
    marginBottom: spacing.sm,
  },
  legend: {
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  legendText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
  },
  legendCount: {
    ...typography.small,
    color: colors.text.tertiary,
  },
});

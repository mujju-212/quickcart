// Reports Screen — Reports hub with date range, export, sections

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../../services/reportService';
import { analyticsService } from '../../services/analyticsService';
import Card from '../../components/common/Card';
import ReportCard from '../../components/reports/ReportCard';
import DateRangePicker from '../../components/reports/DateRangePicker';
import ExportButton from '../../components/reports/ExportButton';
import StatCard from '../../components/common/StatCard';
import { SkeletonCard } from '../../components/common/Skeleton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatPrice, formatNumber } from '../../utils/helpers';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.md * 3) / 2;

export default function ReportsScreen() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: summary, isLoading: loadingSummary, refetch: refetchSummary } = useQuery({
    queryKey: ['report-summary', dateRange],
    queryFn: () => analyticsService.getOverview(),
  });

  const { data: salesReport, isLoading: loadingSales } = useQuery({
    queryKey: ['sales-report', dateRange],
    queryFn: () => reportService.getSalesReport(dateRange.startDate, dateRange.endDate),
  });

  const { data: productReport } = useQuery({
    queryKey: ['product-report', dateRange],
    queryFn: () => reportService.getInventoryReport(),
  });

  const stats = (summary as any) || {};
  const isLoading = loadingSummary;

  const handleDateChange = (range: { startDate: string; endDate: string }) => {
    setDateRange(range);
  };

  const handleExportSales = async (format: string) => {
    try {
      const csvData = await reportService.exportCSV('sales', dateRange.startDate, dateRange.endDate);
      return csvData;
    } catch (e: any) {
      throw new Error(e?.message || 'Export failed');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={refetchSummary}
          colors={[colors.primary[600]]}
        />
      }
    >
      {/* Page header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Reports & Analytics</Text>
        <Text style={styles.pageSubtitle}>Business insights at a glance</Text>
      </View>

      {/* Date range picker */}
      <Card style={styles.dateCard}>
        <DateRangePicker
          value={{ start: dateRange.startDate, end: dateRange.endDate }}
          onChange={(range) => handleDateChange({ startDate: range.start, endDate: range.end })}
        />
      </Card>

      {/* Summary stats */}
      {isLoading ? (
        <View style={styles.statGrid}>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} style={styles.statSkeleton} />)}
        </View>
      ) : (
        <View style={styles.statGrid}>
          <StatCard
            title="Total Revenue"
            value={formatPrice(stats.total_revenue || stats.totalRevenue || 0)}
            icon="currency-inr"
            iconColor={colors.status.delivered}
            style={{ width: CARD_WIDTH }}
          />
          <StatCard
            title="Total Orders"
            value={formatNumber(stats.total_orders || stats.totalOrders || 0)}
            icon="shopping"
            iconColor={colors.primary[600]}
            style={{ width: CARD_WIDTH }}
          />
          <StatCard
            title="Avg Order Value"
            value={formatPrice(stats.avg_order_value || stats.avgOrderValue || 0)}
            icon="chart-line"
            iconColor="#8B5CF6"
            style={{ width: CARD_WIDTH }}
          />
          <StatCard
            title="Total Customers"
            value={formatNumber(stats.total_customers || stats.totalCustomers || 0)}
            icon="account-group"
            iconColor="#F59E0B"
            style={{ width: CARD_WIDTH }}
          />
        </View>
      )}

      <Divider style={styles.divider} />

      {/* Report sections */}
      <Text style={styles.sectionTitle}>Report Sections</Text>

      <ReportCard
        icon="cash-register"
        iconColor={colors.status.delivered}
        title="Sales Report"
        description="Revenue, orders, and transaction breakdown"
        onPress={() => {}}
      />

      <ReportCard
        icon="package-variant-closed"
        iconColor={colors.primary[600]}
        title="Product Performance"
        description="Best sellers, stock movement, category analysis"
        onPress={() => {}}
      />

      <ReportCard
        icon="account-multiple"
        iconColor="#8B5CF6"
        title="Customer Insights"
        description="Acquisition, retention, and lifetime value"
        onPress={() => {}}
      />

      <ReportCard
        icon="chart-timeline-variant"
        iconColor="#F59E0B"
        title="Trend Analysis"
        description="Daily, weekly, monthly revenue and order trends"
        badge="New"
        onPress={() => {}}
      />

      <Divider style={styles.divider} />

      {/* Export section */}
      <Text style={styles.sectionTitle}>Export Data</Text>

      <Card style={styles.exportCard}>
        <View style={styles.exportRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.exportTitle}>Sales Report</Text>
            <Text style={styles.exportDesc}>
              {dateRange.startDate} to {dateRange.endDate}
            </Text>
          </View>
          <ExportButton
            onExportCSV={() => handleExportSales('csv')}
          />
        </View>
      </Card>

      <Card style={styles.exportCard}>
        <View style={styles.exportRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.exportTitle}>Product Report</Text>
            <Text style={styles.exportDesc}>All products performance data</Text>
          </View>
          <ExportButton
            onExportCSV={async () => {
              await reportService.getInventoryReport();
            }}
          />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingBottom: spacing['3xl'],
  },
  pageHeader: {
    padding: spacing.md,
    paddingBottom: spacing.xs,
  },
  pageTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: colors.text.primary,
  },
  pageSubtitle: {
    ...typography.body,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  dateCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  statSkeleton: {
    width: CARD_WIDTH,
    height: 90,
  },
  divider: {
    marginVertical: spacing.lg,
    marginHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: colors.text.primary,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  exportCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  exportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exportTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  exportDesc: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: 2,
  },
});

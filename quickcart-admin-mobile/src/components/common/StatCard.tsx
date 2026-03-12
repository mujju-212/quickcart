// StatCard — Dashboard metric card with value, label, trend, and icon

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
  iconBgColor?: string;
  trend?: { value: number; isPositive: boolean };
  subtitle?: string;
  style?: ViewStyle;
}

export default function StatCard({
  title,
  value,
  icon,
  iconColor = colors.primary[600],
  iconBgColor = colors.primary[100],
  trend,
  subtitle,
  style,
}: StatCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: iconBgColor }]}>
          <MaterialCommunityIcons name={icon} size={22} color={iconColor} />
        </View>
        {trend && (
          <View style={[styles.trendBadge, trend.isPositive ? styles.trendUp : styles.trendDown]}>
            <MaterialCommunityIcons
              name={trend.isPositive ? 'trending-up' : 'trending-down'}
              size={12}
              color={trend.isPositive ? '#16A34A' : '#DC2626'}
            />
            <Text style={[styles.trendText, { color: trend.isPositive ? '#16A34A' : '#DC2626' }]}>
              {Math.abs(trend.value)}%
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    gap: 2,
  },
  trendUp: { backgroundColor: '#DCFCE7' },
  trendDown: { backgroundColor: '#FEE2E2' },
  trendText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  value: {
    ...typography.statNumber,
    color: colors.text.primary,
  },
  title: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  subtitle: {
    ...typography.small,
    color: colors.text.disabled,
    marginTop: 2,
  },
});

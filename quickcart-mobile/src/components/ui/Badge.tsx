import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

type BadgeVariant = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'discount' | 'neutral';
type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  text?: string;
  label?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function Badge({
  text,
  label,
  variant = 'primary',
  size = 'sm',
  icon,
  style,
  textStyle,
}: BadgeProps) {
  const displayText = text ?? label ?? '';
  const colorMap = variantColors[variant];
  const sizeStyle = sizeMap[size];

  return (
    <View style={[styles.badge, colorMap.container, sizeStyle.container, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.text, colorMap.text, sizeStyle.text, textStyle]} numberOfLines={1}>
        {displayText}
      </Text>
    </View>
  );
}

// ──────────────────────────────────────────
//  Dot Badge (notification indicator)
// ──────────────────────────────────────────

interface DotBadgeProps {
  count?: number;
  visible?: boolean;
  style?: ViewStyle;
}

export function DotBadge({ count, visible = true, style }: DotBadgeProps) {
  if (!visible) return null;

  if (count && count > 0) {
    return (
      <View style={[styles.countBadge, style]}>
        <Text style={styles.countText}>{count > 99 ? '99+' : count}</Text>
      </View>
    );
  }

  return <View style={[styles.dot, style]} />;
}

// ──────────────────────────────────────────
//  Variant Colors
// ──────────────────────────────────────────

const variantColors: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: { backgroundColor: colors.primaryLight },
    text: { color: colors.primaryDark },
  },
  success: {
    container: { backgroundColor: colors.successLight },
    text: { color: colors.success },
  },
  error: {
    container: { backgroundColor: colors.errorLight },
    text: { color: colors.error },
  },
  warning: {
    container: { backgroundColor: colors.warningLight },
    text: { color: colors.warning },
  },
  info: {
    container: { backgroundColor: colors.infoLight },
    text: { color: colors.info },
  },
  discount: {
    container: { backgroundColor: colors.discount },
    text: { color: colors.white },
  },
  neutral: {
    container: { backgroundColor: colors.surface },
    text: { color: colors.textSecondary },
  },
};

const sizeMap: Record<BadgeSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { paddingHorizontal: spacing.sm, paddingVertical: 2 },
    text: { fontSize: 10, fontWeight: '700' },
  },
  md: {
    container: { paddingHorizontal: spacing.md, paddingVertical: spacing.xxs },
    text: { fontSize: 12, fontWeight: '600' },
  },
};

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 3,
  },
  text: {
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    position: 'absolute',
    top: -2,
    right: -2,
  },
  countBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    position: 'absolute',
    top: -6,
    right: -8,
  },
  countText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});

export default Badge;

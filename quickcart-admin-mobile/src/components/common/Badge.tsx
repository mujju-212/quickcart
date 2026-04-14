// Badge — Small chip for counts, status labels, tags

import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  style?: ViewStyle;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  primary: { bg: colors.primary[100], text: colors.primary[700], dot: colors.primary[600] },
  success: { bg: '#DCFCE7', text: '#166534', dot: '#22C55E' },
  warning: { bg: '#FEF9C3', text: '#854D0E', dot: '#EAB308' },
  error: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
  info: { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
  neutral: { bg: colors.background.tertiary, text: colors.text.secondary, dot: colors.text.disabled },
};

export default function Badge({ label, variant = 'primary', size = 'md', dot = false, style }: BadgeProps) {
  const scheme = variantColors[variant];

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: scheme.bg },
        size === 'sm' ? styles.sm : styles.md,
        style,
      ]}
    >
      {dot && <View style={[styles.dot, { backgroundColor: scheme.dot }]} />}
      <Text
        style={[
          size === 'sm' ? styles.textSm : styles.textMd,
          { color: scheme.text },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  md: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  textSm: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textMd: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.3,
  },
});

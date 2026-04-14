// ReportCard — Summary card for report section

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

interface ReportCardProps {
  title: string;
  description: string;
  icon: string;
  iconColor?: string;
  onPress: () => void;
  badge?: string;
}

export default function ReportCard({
  title,
  description,
  icon,
  iconColor = colors.primary[600],
  onPress,
  badge,
}: ReportCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconBox, { backgroundColor: `${iconColor}15` }]}>
        <MaterialCommunityIcons name={icon as any} size={24} color={iconColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
      </View>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text.disabled} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.bodyMedium,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.primary,
  },
  description: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    marginRight: spacing.xs,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: colors.primary[700],
  },
});

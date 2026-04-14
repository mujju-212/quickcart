// QuickActionGrid — Grid of shortcut actions on dashboard

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface QuickAction {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  bgColor: string;
  badge?: number;
}

interface QuickActionGridProps {
  actions: QuickAction[];
  onAction: (id: string) => void;
}

export default function QuickActionGrid({ actions, onAction }: QuickActionGridProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.item}
            onPress={() => onAction(action.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, { backgroundColor: action.bgColor }]}>
              <MaterialCommunityIcons name={action.icon} size={22} color={action.color} />
              {action.badge !== undefined && action.badge > 0 && (
                <View style={styles.badgeWrap}>
                  <Text style={styles.badgeText}>{action.badge > 99 ? '99+' : action.badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.label} numberOfLines={2}>{action.label}</Text>
          </TouchableOpacity>
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
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  item: {
    width: '22%',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    position: 'relative',
  },
  badgeWrap: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.status.cancelled,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  label: {
    ...typography.small,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

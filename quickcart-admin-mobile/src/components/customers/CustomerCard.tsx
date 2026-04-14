// CustomerCard — Customer summary card for list view

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { formatPhone, formatPrice } from '../../utils/helpers';

interface CustomerCardProps {
  customer: {
    user_id: number;
    full_name: string;
    email: string;
    phone?: string;
    total_orders?: number;
    total_spent?: number;
    created_at?: string;
  };
  onPress: () => void;
}

export default function CustomerCard({ customer, onPress }: CustomerCardProps) {
  const initials = customer.full_name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Avatar.Text
        size={44}
        label={initials}
        style={styles.avatar}
        labelStyle={styles.avatarLabel}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{customer.full_name}</Text>
        <Text style={styles.email} numberOfLines={1}>{customer.email}</Text>
        <View style={styles.metaRow}>
          {customer.phone && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="phone-outline" size={12} color={colors.text.tertiary} />
              <Text style={styles.metaText}>{formatPhone(customer.phone)}</Text>
            </View>
          )}
          {customer.total_orders !== undefined && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="package-variant" size={12} color={colors.text.tertiary} />
              <Text style={styles.metaText}>{customer.total_orders} orders</Text>
            </View>
          )}
        </View>
      </View>
      {customer.total_spent !== undefined && (
        <View style={styles.spentCol}>
          <Text style={styles.spentAmount}>{formatPrice(customer.total_spent)}</Text>
          <Text style={styles.spentLabel}>Spent</Text>
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
    padding: spacing.sm + 2,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  avatar: {
    backgroundColor: colors.primary[100],
  },
  avatarLabel: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: colors.primary[700],
  },
  info: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  email: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  spentCol: {
    alignItems: 'flex-end',
    marginRight: spacing.xs,
  },
  spentAmount: {
    ...typography.bodyMedium,
    fontFamily: 'Inter_700Bold',
    color: colors.primary[700],
  },
  spentLabel: {
    fontSize: 10,
    color: colors.text.disabled,
  },
});

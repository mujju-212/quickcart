import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MapPin, Edit3, Trash2, Check } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { Badge } from '@components/ui';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface AddressData {
  id: string | number;
  label?: string; // "Home", "Office", etc.
  full_name?: string;
  phone?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

interface AddressCardProps {
  address: AddressData;
  selected?: boolean;
  selectable?: boolean;
  onSelect?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  index?: number;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function AddressCard({
  address,
  selected = false,
  selectable = false,
  onSelect,
  onEdit,
  onDelete,
  index = 0,
  style,
}: AddressCardProps) {
  const fullAddress = [
    address.address_line1,
    address.address_line2,
    `${address.city}, ${address.state} – ${address.pincode}`,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Animated.View entering={FadeInUp.delay(index * 60).springify()}>
      <TouchableOpacity
        activeOpacity={selectable ? 0.7 : 1}
        onPress={() => selectable && onSelect?.(address.id)}
        style={[
          styles.card,
          selected && styles.cardSelected,
          style,
        ]}
      >
        {/* Selection indicator */}
        {selectable && (
          <View style={[styles.radio, selected && styles.radioSelected]}>
            {selected && <Check size={12} color={colors.white} />}
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Label + Default Badge */}
          <View style={styles.labelRow}>
            <MapPin size={14} color={colors.primary} />
            <Text style={styles.label}>
              {address.label || 'Address'}
            </Text>
            {address.is_default && (
              <Badge label="Default" variant="primary" size="sm" />
            )}
          </View>

          {/* Name + Phone */}
          {(address.full_name || address.phone) && (
            <Text style={styles.meta}>
              {[address.full_name, address.phone].filter(Boolean).join(' • ')}
            </Text>
          )}

          {/* Full address */}
          <Text style={styles.address} numberOfLines={3}>
            {fullAddress}
          </Text>
        </View>

        {/* Actions */}
        {(onEdit || onDelete) && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => onEdit(address.id)}
                hitSlop={8}
              >
                <Edit3 size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
            {onDelete && !address.is_default && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => onDelete(address.id)}
                hitSlop={8}
              >
                <Trash2 size={16} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  label: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  address: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginLeft: spacing.sm,
  },
  actionBtn: {
    padding: 4,
  },
});

export default AddressCard;

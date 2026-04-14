// BannerCard — Banner summary card with image preview and active toggle

import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Switch } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Badge from '../common/Badge';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

interface Banner {
  banner_id: number;
  title: string;
  subtitle?: string;
  image_url?: string;
  link_type?: string;
  link_value?: string;
  position?: number;
  is_active: boolean;
}

interface BannerCardProps {
  banner: Banner;
  onPress: () => void;
  onToggle?: (active: boolean) => void;
}

export default function BannerCard({ banner, onPress, onToggle }: BannerCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Image preview */}
      {banner.image_url ? (
        <Image source={{ uri: banner.image_url }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <MaterialCommunityIcons name="image-outline" size={32} color={colors.text.disabled} />
        </View>
      )}

      {/* Position badge */}
      {banner.position !== undefined && (
        <View style={styles.positionBadge}>
          <Text style={styles.positionText}>#{banner.position}</Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>{banner.title}</Text>
            {banner.subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>{banner.subtitle}</Text>
            )}
          </View>
          <Badge
            label={banner.is_active ? 'Active' : 'Inactive'}
            variant={banner.is_active ? 'success' : 'neutral'}
          />
        </View>

        {/* Link info */}
        {banner.link_type && (
          <View style={styles.linkRow}>
            <MaterialCommunityIcons name="link-variant" size={14} color={colors.text.tertiary} />
            <Text style={styles.linkText}>
              {banner.link_type}: {banner.link_value || '—'}
            </Text>
          </View>
        )}

        {/* Toggle */}
        {onToggle && (
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Active</Text>
            <Switch
              value={banner.is_active}
              onValueChange={onToggle}
              trackColor={{ false: colors.background.tertiary, true: colors.primary[200] }}
              thumbColor={banner.is_active ? colors.primary[600] : colors.text.disabled}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  image: {
    width: '100%',
    height: 140,
  },
  placeholder: {
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positionBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  positionText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  body: {
    padding: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.bodyMedium,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: 1,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
  },
  linkText: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  toggleLabel: {
    ...typography.bodyMedium,
    color: colors.text.secondary,
  },
});

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { PackageOpen, Search, ShoppingCart, Heart, ClipboardList } from 'lucide-react-native';
import { Button } from '@components/ui';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing } from '@theme/spacing';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

type EmptyPreset = 'cart' | 'orders' | 'wishlist' | 'search' | 'products' | 'generic';

interface EmptyStateProps {
  preset?: EmptyPreset;
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Preset Config
// ──────────────────────────────────────────

const presets: Record<EmptyPreset, { icon: React.ReactNode; title: string; message: string }> = {
  cart: {
    icon: <ShoppingCart size={56} color={colors.textTertiary} strokeWidth={1.2} />,
    title: 'Your cart is empty',
    message: 'Looks like you haven\'t added anything to your cart yet. Start shopping!',
  },
  orders: {
    icon: <ClipboardList size={56} color={colors.textTertiary} strokeWidth={1.2} />,
    title: 'No orders yet',
    message: 'Your order history will appear here once you make a purchase.',
  },
  wishlist: {
    icon: <Heart size={56} color={colors.textTertiary} strokeWidth={1.2} />,
    title: 'Your wishlist is empty',
    message: 'Save items you love to your wishlist and come back to them anytime.',
  },
  search: {
    icon: <Search size={56} color={colors.textTertiary} strokeWidth={1.2} />,
    title: 'No results found',
    message: 'Try searching with different keywords or browse our categories.',
  },
  products: {
    icon: <PackageOpen size={56} color={colors.textTertiary} strokeWidth={1.2} />,
    title: 'No products found',
    message: 'There are no products matching your criteria right now.',
  },
  generic: {
    icon: <PackageOpen size={56} color={colors.textTertiary} strokeWidth={1.2} />,
    title: 'Nothing here',
    message: 'This section is empty at the moment.',
  },
};

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function EmptyState({
  preset = 'generic',
  title,
  message,
  icon,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  const config = presets[preset];

  return (
    <Animated.View
      entering={FadeInUp.duration(400).springify().damping(16)}
      style={[styles.container, style]}
    >
      <View style={styles.iconWrap}>
        {icon ?? config.icon}
      </View>

      <Text style={styles.title}>{title ?? config.title}</Text>
      <Text style={styles.message}>{message ?? config.message}</Text>

      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          variant="primary"
          size="md"
          onPress={onAction}
          style={{ marginTop: spacing.lg }}
        />
      )}
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;

import React from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar, Platform, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ArrowLeft, ShoppingCart, Bell, Search, Heart } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing } from '@theme/spacing';
import { DotBadge } from '@components/ui';
import { useCartStore } from '@stores/cartStore';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showCart?: boolean;
  showSearch?: boolean;
  showWishlist?: boolean;
  showNotification?: boolean;
  rightActions?: React.ReactNode;
  onSearchPress?: () => void;
  transparent?: boolean;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function Header({
  title,
  subtitle,
  showBack = false,
  showCart = false,
  showSearch = false,
  showWishlist = false,
  showNotification = false,
  rightActions,
  onSearchPress,
  transparent = false,
  style,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cartCount = useCartStore((s) => s.itemCount);

  const bgColor = transparent ? 'transparent' : colors.white;

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.xs, backgroundColor: bgColor },
        !transparent && styles.border,
        style,
      ]}
    >
      {/* Left Section */}
      <View style={styles.left}>
        {showBack && (
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={styles.iconBtn}
          >
            <ArrowLeft size={22} color={colors.textPrimary} />
          </Pressable>
        )}
      </View>

      {/* Center / Title */}
      <View style={styles.center}>
        {title && (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right Section */}
      <View style={styles.right}>
        {showSearch && (
          <Pressable
            onPress={onSearchPress ?? (() => router.push('/search'))}
            hitSlop={10}
            style={styles.iconBtn}
          >
            <Search size={20} color={colors.textPrimary} />
          </Pressable>
        )}

        {showWishlist && (
          <Pressable
            onPress={() => router.push('/wishlist')}
            hitSlop={10}
            style={styles.iconBtn}
          >
            <Heart size={20} color={colors.textPrimary} />
          </Pressable>
        )}

        {showNotification && (
          <Pressable
            onPress={() => router.push('/notifications')}
            hitSlop={10}
            style={styles.iconBtn}
          >
            <Bell size={20} color={colors.textPrimary} />
            <DotBadge visible={false} />
          </Pressable>
        )}

        {showCart && (
          <Pressable
            onPress={() => router.push('/cart')}
            hitSlop={10}
            style={styles.iconBtn}
          >
            <ShoppingCart size={20} color={colors.textPrimary} />
            <DotBadge count={cartCount} visible={cartCount > 0} />
          </Pressable>
        )}

        {rightActions}
      </View>
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    minHeight: 56,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: {
    width: 44,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 44,
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: -2,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xxs,
  },
});

export default Header;

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import AnimatedRN, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  User,
  Package,
  Heart,
  MapPin,
  Tag,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShoppingCart,
  FileText,
  Star,
  Shield,
} from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { useAuthStore } from '@stores/authStore';
import { useAuth } from '@hooks/useAuth';
import { triggerHaptic } from '@utils/haptics';
import { getInitials, getGreeting } from '@utils/helpers';

// ──────────────────────────────────────────
//  Account Tab Screen
// ──────────────────────────────────────────

type MenuItem = {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  route?: string;
  badge?: string;
  onPress?: () => void;
  color?: string;
};

export default function AccountScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { logout } = useAuth();

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          triggerHaptic('success');
          router.replace('/(auth)/login');
        },
      },
    ]);
  }, [logout, router]);

  // ── Menu Sections ──
  const orderSection: MenuItem[] = [
    {
      icon: <Package size={20} color={colors.info} />,
      label: 'My Orders',
      subtitle: 'Track, return or reorder',
      route: '/orders',
    },
    {
      icon: <Heart size={20} color={colors.error} />,
      label: 'Wishlist',
      subtitle: 'Your favourite items',
      route: '/wishlist',
    },
    {
      icon: <Star size={20} color={colors.warning} />,
      label: 'My Reviews',
      subtitle: 'Your ratings & reviews',
      route: '/reviews',
    },
  ];

  const accountSection: MenuItem[] = [
    {
      icon: <MapPin size={20} color={colors.success} />,
      label: 'Addresses',
      subtitle: 'Manage delivery addresses',
      route: '/addresses',
    },
    {
      icon: <Tag size={20} color={colors.primary} />,
      label: 'Offers & Coupons',
      subtitle: 'Available deals for you',
      route: '/offers',
    },
    {
      icon: <Bell size={20} color={colors.info} />,
      label: 'Notifications',
      route: '/notifications',
    },
  ];

  const supportSection: MenuItem[] = [
    {
      icon: <HelpCircle size={20} color={colors.textSecondary} />,
      label: 'Help & Support',
      route: '/help',
    },
    {
      icon: <Shield size={20} color={colors.textSecondary} />,
      label: 'Privacy Policy',
      route: '/privacy',
    },
    {
      icon: <FileText size={20} color={colors.textSecondary} />,
      label: 'Terms of Service',
      route: '/terms',
    },
    {
      icon: <Settings size={20} color={colors.textSecondary} />,
      label: 'Settings',
      route: '/settings',
    },
  ];

  const renderSection = (title: string, items: MenuItem[], index: number) => (
    <AnimatedRN.View
      key={title}
      entering={FadeInUp.delay(100 + index * 80).springify()}
      style={styles.section}
    >
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>
        {items.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, i < items.length - 1 && styles.menuItemBorder]}
            onPress={() => {
              if (item.onPress) {
                item.onPress();
              } else if (item.route) {
                router.push(item.route as any);
              }
            }}
            activeOpacity={0.6}
          >
            <View style={styles.menuIconWrap}>{item.icon}</View>
            <View style={styles.menuContent}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.subtitle && (
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              )}
            </View>
            {item.badge && (
              <View style={styles.menuBadge}>
                <Text style={styles.menuBadgeText}>{item.badge}</Text>
              </View>
            )}
            <ChevronRight size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>
    </AnimatedRN.View>
  );

  return (
    <ScrollView
      style={[styles.container, { paddingTop: top }]}
      contentContainerStyle={{ paddingBottom: bottom + spacing.xxl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <AnimatedRN.View entering={FadeInUp.springify()} style={styles.profileWrap}>
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => router.push('/profile-edit')}
          activeOpacity={0.7}
        >
          <View style={styles.avatarCircle}>
            {user?.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {getInitials(user?.name || 'User')}
              </Text>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || 'Guest User'}
            </Text>
            {user?.phone && (
              <Text style={styles.userMeta}>+91 {user.phone}</Text>
            )}
            {user?.email && (
              <Text style={styles.userMeta}>{user.email}</Text>
            )}
          </View>
          <ChevronRight size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </AnimatedRN.View>

      {/* Quick Stats */}
      <AnimatedRN.View entering={FadeInUp.delay(50).springify()} style={styles.statsRow}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => router.push('/orders')}
        >
          <Package size={22} color={colors.primary} />
          <Text style={styles.statLabel}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => router.push('/wishlist')}
        >
          <Heart size={22} color={colors.error} />
          <Text style={styles.statLabel}>Wishlist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => router.push('/offers')}
        >
          <Tag size={22} color={colors.success} />
          <Text style={styles.statLabel}>Offers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => router.push('/addresses')}
        >
          <MapPin size={22} color={colors.info} />
          <Text style={styles.statLabel}>Addresses</Text>
        </TouchableOpacity>
      </AnimatedRN.View>

      {/* Menu Sections */}
      {renderSection('My Activity', orderSection, 0)}
      {renderSection('Account', accountSection, 1)}
      {renderSection('More', supportSection, 2)}

      {/* Logout */}
      {isAuthenticated && (
        <AnimatedRN.View entering={FadeInUp.delay(350).springify()} style={styles.logoutWrap}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={20} color={colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </AnimatedRN.View>
      )}

      {/* App Version */}
      <Text style={styles.version}>QuickCart v1.0.0</Text>
    </ScrollView>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileWrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 56,
    height: 56,
  },
  avatarText: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
    gap: 1,
  },
  greeting: {
    ...typography.caption,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  userName: {
    ...typography.h4,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  userMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.labelSmall,
    color: colors.textTertiary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  menuItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  menuSubtitle: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 1,
  },
  menuBadge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  menuBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
    fontSize: 11,
  },
  logoutWrap: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  logoutText: {
    ...typography.labelMedium,
    color: colors.error,
    fontWeight: '700',
  },
  version: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});

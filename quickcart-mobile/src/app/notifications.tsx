import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import AnimatedRN, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Bell,
  Package,
  Tag,
  CheckCircle,
  AlertCircle,
  Info,
  Megaphone,
} from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { Header, EmptyState } from '@components/common';
import { formatRelativeTime } from '@utils/helpers';

// ──────────────────────────────────────────
//  Mock data (would come from API/push service)
// ──────────────────────────────────────────
const SAMPLE_NOTIFICATIONS = [
  {
    id: '1',
    type: 'order',
    title: 'Order Shipped!',
    body: 'Your order #1234 has been shipped and is on its way.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    data: { orderId: '1234' },
  },
  {
    id: '2',
    type: 'offer',
    title: '🎉 Flash Sale!',
    body: 'Get up to 50% off on electronics. Use code FLASH50.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
  },
  {
    id: '3',
    type: 'order',
    title: 'Order Delivered',
    body: 'Your order #1230 has been delivered successfully.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    data: { orderId: '1230' },
  },
  {
    id: '4',
    type: 'info',
    title: 'Welcome to QuickCart!',
    body: 'Thanks for joining. Enjoy ₹100 off on your first order!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    read: true,
  },
];

const ICON_MAP: Record<string, { icon: React.ReactNode; bg: string }> = {
  order: {
    icon: <Package size={20} color={colors.info} />,
    bg: colors.infoLight,
  },
  offer: {
    icon: <Tag size={20} color={colors.primary} />,
    bg: colors.primaryLight,
  },
  success: {
    icon: <CheckCircle size={20} color={colors.success} />,
    bg: colors.successLight,
  },
  alert: {
    icon: <AlertCircle size={20} color={colors.error} />,
    bg: colors.errorLight,
  },
  info: {
    icon: <Info size={20} color={colors.info} />,
    bg: colors.infoLight,
  },
};

// ──────────────────────────────────────────
//  Notifications Screen
// ──────────────────────────────────────────

export default function NotificationsScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  // In production, fetch from API or local storage
  const notifications = SAMPLE_NOTIFICATIONS;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handlePress = useCallback(
    (notification: any) => {
      // Navigate based on type
      if (notification.type === 'order' && notification.data?.orderId) {
        router.push({
          pathname: '/orders/[id]',
          params: { id: notification.data.orderId },
        });
      } else if (notification.type === 'offer') {
        router.push('/offers');
      }
    },
    [router]
  );

  const renderNotification = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      const iconConfig = ICON_MAP[item.type] || ICON_MAP.info;

      return (
        <AnimatedRN.View entering={FadeInUp.delay(index * 50).springify()}>
          <TouchableOpacity
            style={[
              styles.notifCard,
              !item.read && styles.notifUnread,
            ]}
            onPress={() => handlePress(item)}
            activeOpacity={0.7}
          >
            {/* Unread dot */}
            {!item.read && <View style={styles.unreadDot} />}

            {/* Icon */}
            <View
              style={[
                styles.notifIcon,
                { backgroundColor: iconConfig.bg },
              ]}
            >
              {iconConfig.icon}
            </View>

            {/* Content */}
            <View style={styles.notifContent}>
              <Text
                style={[
                  styles.notifTitle,
                  !item.read && styles.notifTitleBold,
                ]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text style={styles.notifBody} numberOfLines={2}>
                {item.body}
              </Text>
              <Text style={styles.notifTime}>
                {formatRelativeTime(item.timestamp)}
              </Text>
            </View>
          </TouchableOpacity>
        </AnimatedRN.View>
      );
    },
    [handlePress]
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Header
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} new` : undefined}
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            preset="generic"
            title="No notifications"
            message="You're all caught up! We'll notify you about orders and offers."
          />
        }
      />
    </View>
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
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },

  // Notification card
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xs,
    gap: spacing.sm,
    ...shadows.sm,
    position: 'relative',
  },
  notifUnread: {
    backgroundColor: colors.primaryLight,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: 2,
  },
  notifTitleBold: {
    fontWeight: '700',
  },
  notifBody: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  notifTime: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 4,
  },
});

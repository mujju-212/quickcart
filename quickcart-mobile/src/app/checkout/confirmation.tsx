import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AnimatedRN, {
  FadeInUp,
  FadeInDown,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  CheckCircle2,
  Package,
  MapPin,
  CreditCard,
  Home,
  ClipboardList,
} from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { Button } from '@components/ui';
import { formatPrice } from '@utils/helpers';
import { triggerHaptic } from '@utils/haptics';

// ──────────────────────────────────────────
//  Checkout — Order Confirmation
// ──────────────────────────────────────────

export default function ConfirmationScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const { orderId, total, method } = useLocalSearchParams<{
    orderId: string;
    total: string;
    method: string;
  }>();

  // Celebration animation
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    triggerHaptic('success');
    scale.value = withDelay(
      200,
      withSequence(
        withTiming(1.2, { duration: 400 }),
        withTiming(1, { duration: 200 })
      )
    );
    rotate.value = withDelay(
      200,
      withSequence(
        withTiming(-5, { duration: 100 }),
        withTiming(5, { duration: 100 }),
        withTiming(-3, { duration: 80 }),
        withTiming(3, { duration: 80 }),
        withTiming(0, { duration: 60 })
      )
    );
  }, []);

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const paymentLabel =
    method === 'cod'
      ? 'Cash on Delivery'
      : method === 'upi'
      ? 'UPI'
      : method === 'card'
      ? 'Card Payment'
      : method === 'wallet'
      ? 'Wallet'
      : 'Online Payment';

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      {/* Step Indicator */}
      <AnimatedRN.View entering={FadeInUp.springify()} style={styles.stepIndicator}>
        <View style={[styles.step, styles.stepDone]}>
          <Text style={styles.stepNumDone}>✓</Text>
        </View>
        <View style={[styles.stepLine, styles.stepLineDone]} />
        <View style={[styles.step, styles.stepDone]}>
          <Text style={styles.stepNumDone}>✓</Text>
        </View>
        <View style={[styles.stepLine, styles.stepLineDone]} />
        <View style={[styles.step, styles.stepDone]}>
          <Text style={styles.stepNumDone}>✓</Text>
        </View>
      </AnimatedRN.View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Animation */}
        <View style={styles.successSection}>
          <AnimatedRN.View style={[styles.checkCircle, checkmarkStyle]}>
            <CheckCircle2 size={64} color={colors.success} strokeWidth={2.5} />
          </AnimatedRN.View>

          <AnimatedRN.Text
            entering={FadeInUp.delay(400).springify()}
            style={styles.successTitle}
          >
            Order Placed! 🎉
          </AnimatedRN.Text>

          <AnimatedRN.Text
            entering={FadeInUp.delay(500).springify()}
            style={styles.successSubtitle}
          >
            Your order has been placed successfully.{'\n'}
            Thank you for shopping with QuickCart!
          </AnimatedRN.Text>
        </View>

        {/* Order Info Card */}
        <AnimatedRN.View entering={FadeInUp.delay(600).springify()} style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Package size={20} color={colors.primary} />
            <Text style={styles.orderTitle}>Order Details</Text>
          </View>

          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Order ID</Text>
            <Text style={styles.orderValue}>#{orderId || 'N/A'}</Text>
          </View>

          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Amount Paid</Text>
            <Text style={[styles.orderValue, styles.amountText]}>
              {formatPrice(parseFloat(total || '0'))}
            </Text>
          </View>

          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Payment</Text>
            <Text style={styles.orderValue}>{paymentLabel}</Text>
          </View>

          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          </View>
        </AnimatedRN.View>

        {/* Timeline Preview */}
        <AnimatedRN.View entering={FadeInUp.delay(700).springify()} style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>What's Next?</Text>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotActive]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Order Confirmed</Text>
              <Text style={styles.timelineDesc}>
                Your order has been received
              </Text>
            </View>
          </View>

          <View style={styles.timelineConnector} />

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Processing</Text>
              <Text style={styles.timelineDesc}>
                We're preparing your items
              </Text>
            </View>
          </View>

          <View style={styles.timelineConnector} />

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Out for Delivery</Text>
              <Text style={styles.timelineDesc}>
                On the way to your address
              </Text>
            </View>
          </View>

          <View style={styles.timelineConnector} />

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Delivered</Text>
              <Text style={styles.timelineDesc}>
                Enjoy your purchase!
              </Text>
            </View>
          </View>
        </AnimatedRN.View>

        {/* Estimated Delivery */}
        <AnimatedRN.View entering={FadeInUp.delay(800).springify()} style={styles.estimateCard}>
          <MapPin size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.estimateTitle}>Estimated Delivery</Text>
            <Text style={styles.estimateText}>3–5 business days</Text>
          </View>
        </AnimatedRN.View>
      </ScrollView>

      {/* Action Buttons */}
      <AnimatedRN.View
        entering={FadeInDown.delay(900).springify()}
        style={[styles.bottomBar, { paddingBottom: bottom + spacing.sm }]}
      >
        <Button
          title="Track Order"
          onPress={() =>
            router.replace({
              pathname: '/orders/[id]',
              params: { id: orderId || '' },
            })
          }
          variant="outline"
          style={styles.trackBtn}
          icon={<ClipboardList size={18} color={colors.primary} />}
        />
        <Button
          title="Continue Shopping"
          onPress={() => router.replace('/(tabs)')}
          style={styles.shopBtn}
          icon={<Home size={18} color={colors.black} />}
        />
      </AnimatedRN.View>
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
  content: {
    padding: spacing.md,
    paddingBottom: 120,
  },

  // Steps
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grey100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDone: {
    backgroundColor: colors.success,
  },
  stepNumDone: {
    ...typography.labelMedium,
    color: colors.white,
    fontWeight: '700',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.grey200,
  },
  stepLineDone: {
    backgroundColor: colors.success,
  },

  // Success
  successSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  checkCircle: {
    marginBottom: spacing.md,
  },
  successTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
  },
  successSubtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 22,
  },

  // Order card
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderTitle: {
    ...typography.h5,
    color: colors.text,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  orderValue: {
    ...typography.bodyMedium,
    color: colors.text,
    fontWeight: '600',
  },
  amountText: {
    ...typography.h5,
    color: colors.primary,
  },
  statusBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  statusText: {
    ...typography.labelSmall,
    color: colors.success,
    fontWeight: '700',
  },

  // Timeline
  timelineCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  timelineTitle: {
    ...typography.h5,
    color: colors.text,
    marginBottom: spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.grey200,
    borderWidth: 2,
    borderColor: colors.grey300,
  },
  timelineDotActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  timelineConnector: {
    width: 2,
    height: 20,
    backgroundColor: colors.grey200,
    marginLeft: 5,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    ...typography.bodyMedium,
    color: colors.text,
    fontWeight: '600',
  },
  timelineDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  // Estimate
  estimateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  estimateTitle: {
    ...typography.bodyMedium,
    color: colors.text,
    fontWeight: '600',
  },
  estimateText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
  trackBtn: {
    flex: 1,
  },
  shopBtn: {
    flex: 1,
  },
});

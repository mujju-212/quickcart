import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  MapPin,
  XCircle,
} from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { formatDate, formatTime } from '@utils/helpers';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface TimelineStep {
  status: string;
  label: string;
  date?: string;
  completed: boolean;
  active: boolean;
  cancelled?: boolean;
}

interface OrderTimelineProps {
  steps: TimelineStep[];
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Icon Map
// ──────────────────────────────────────────

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  out_for_delivery: MapPin,
  delivered: CheckCircle,
  cancelled: XCircle,
};

// ──────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────

/** Generate timeline steps from an order status */
export function buildTimelineSteps(
  currentStatus: string,
  timestamps?: Record<string, string>
): TimelineStep[] {
  const isCancelled = currentStatus?.toLowerCase() === 'cancelled';

  const ORDER_FLOW: Array<{ status: string; label: string }> = [
    { status: 'pending', label: 'Order Placed' },
    { status: 'confirmed', label: 'Confirmed' },
    { status: 'processing', label: 'Processing' },
    { status: 'shipped', label: 'Shipped' },
    { status: 'out_for_delivery', label: 'Out for Delivery' },
    { status: 'delivered', label: 'Delivered' },
  ];

  const currentIdx = ORDER_FLOW.findIndex(
    (s) => s.status === currentStatus?.toLowerCase()
  );

  const steps: TimelineStep[] = ORDER_FLOW.map((step, i) => ({
    status: step.status,
    label: step.label,
    date: timestamps?.[step.status],
    completed: i <= currentIdx && !isCancelled,
    active: i === currentIdx && !isCancelled,
    cancelled: false,
  }));

  if (isCancelled) {
    steps.push({
      status: 'cancelled',
      label: 'Cancelled',
      date: timestamps?.cancelled,
      completed: false,
      active: true,
      cancelled: true,
    });
  }

  return steps;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function OrderTimeline({ steps, style }: OrderTimelineProps) {
  return (
    <View style={[styles.container, style]}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const Icon = STATUS_ICONS[step.status] || Clock;

        const iconColor = step.cancelled
          ? colors.error
          : step.completed || step.active
          ? colors.success
          : colors.textDisabled;

        const lineColor =
          step.completed && !isLast ? colors.success : colors.border;

        return (
          <View key={step.status} style={styles.stepRow}>
            {/* Left: Icon + Line */}
            <View style={styles.iconCol}>
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: step.cancelled
                      ? colors.errorLight
                      : step.completed || step.active
                      ? colors.successLight
                      : colors.surface,
                    borderColor: iconColor,
                  },
                ]}
              >
                <Icon size={14} color={iconColor} />
              </View>
              {!isLast && (
                <View style={[styles.line, { backgroundColor: lineColor }]} />
              )}
            </View>

            {/* Right: Label + Date */}
            <View style={styles.labelCol}>
              <Text
                style={[
                  styles.stepLabel,
                  (step.completed || step.active) && styles.stepLabelActive,
                  step.cancelled && styles.stepLabelCancelled,
                ]}
              >
                {step.label}
              </Text>
              {step.date && (
                <Text style={styles.stepDate}>
                  {formatDate(step.date)} • {formatTime(step.date)}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 52,
  },
  iconCol: {
    alignItems: 'center',
    width: 36,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  labelCol: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.md,
  },
  stepLabel: {
    ...typography.bodyMedium,
    color: colors.textDisabled,
    fontWeight: '500',
  },
  stepLabelActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  stepLabelCancelled: {
    color: colors.error,
    fontWeight: '700',
  },
  stepDate: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },
});

export default OrderTimeline;

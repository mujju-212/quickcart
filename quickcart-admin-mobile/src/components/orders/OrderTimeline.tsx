// OrderTimeline — Visual timeline of order status changes

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatDateTime } from '../../utils/helpers';

interface TimelineEvent {
  status: string;
  created_at: string;
  note?: string;
}

interface OrderTimelineProps {
  events: TimelineEvent[];
}

const statusIconMap: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  pending: 'clock-outline',
  confirmed: 'check-circle-outline',
  processing: 'cog-outline',
  shipped: 'truck-outline',
  delivered: 'package-variant-closed',
  cancelled: 'close-circle-outline',
};

const statusColorMap: Record<string, string> = {
  pending: colors.status.pending,
  confirmed: colors.status.confirmed,
  processing: colors.status.processing,
  shipped: colors.status.shipped,
  delivered: colors.status.delivered,
  cancelled: colors.status.cancelled,
};

export default function OrderTimeline({ events }: OrderTimelineProps) {
  if (!events || events.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Timeline</Text>

      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const statusKey = event.status.toLowerCase();
        const iconName = statusIconMap[statusKey] || 'circle-outline';
        const iconColor = statusColorMap[statusKey] || colors.text.disabled;

        return (
          <View key={index} style={styles.row}>
            {/* Left line + icon */}
            <View style={styles.lineCol}>
              <View style={[styles.iconCircle, { borderColor: iconColor }]}>
                <MaterialCommunityIcons name={iconName} size={16} color={iconColor} />
              </View>
              {!isLast && <View style={styles.connector} />}
            </View>

            {/* Right content */}
            <View style={[styles.content, !isLast && { paddingBottom: spacing.md }]}>
              <Text style={styles.status}>
                {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
              </Text>
              <Text style={styles.timestamp}>{formatDateTime(event.created_at)}</Text>
              {event.note && <Text style={styles.note}>{event.note}</Text>}
            </View>
          </View>
        );
      })}
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
  row: {
    flexDirection: 'row',
  },
  lineCol: {
    width: 36,
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    zIndex: 1,
  },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: colors.divider,
    marginTop: -2,
  },
  content: {
    flex: 1,
    marginLeft: spacing.sm,
    paddingTop: 4,
  },
  status: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  timestamp: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  note: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
});

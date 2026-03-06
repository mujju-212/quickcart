import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { WifiOff, ServerCrash, AlertTriangle } from 'lucide-react-native';
import { Button } from '@components/ui';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing } from '@theme/spacing';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

type ErrorPreset = 'network' | 'server' | 'generic' | 'notFound';

interface ErrorStateProps {
  preset?: ErrorPreset;
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Preset Config
// ──────────────────────────────────────────

const presets: Record<ErrorPreset, { icon: React.ReactNode; title: string; message: string }> = {
  network: {
    icon: <WifiOff size={56} color={colors.error} strokeWidth={1.2} />,
    title: 'No Internet Connection',
    message: 'Please check your network connection and try again.',
  },
  server: {
    icon: <ServerCrash size={56} color={colors.error} strokeWidth={1.2} />,
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again in a moment.',
  },
  notFound: {
    icon: <AlertTriangle size={56} color={colors.warning} strokeWidth={1.2} />,
    title: 'Not Found',
    message: 'The page or item you\'re looking for could not be found.',
  },
  generic: {
    icon: <AlertTriangle size={56} color={colors.error} strokeWidth={1.2} />,
    title: 'Oops! Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
  },
};

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function ErrorState({
  preset = 'generic',
  title,
  message,
  icon,
  onRetry,
  retryLabel = 'Try Again',
  style,
}: ErrorStateProps) {
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

      {onRetry && (
        <Button
          title={retryLabel}
          variant="outline"
          size="md"
          onPress={onRetry}
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
    backgroundColor: colors.errorLight,
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

export default ErrorState;

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@theme/colors';
import { borderRadius } from '@theme/spacing';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

interface SkeletonGroupProps {
  lines?: number;
  lineHeight?: number;
  lineSpacing?: number;
  lastLineWidth?: string;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Skeleton Block
// ──────────────────────────────────────────

export function Skeleton({
  width,
  height,
  borderRadius: br = borderRadius.sm,
  style,
}: SkeletonProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,    // infinite
      true,  // reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.4, 0.9]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: br,
          backgroundColor: colors.border,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

// ──────────────────────────────────────────
//  Skeleton Text Lines
// ──────────────────────────────────────────

export function SkeletonLines({
  lines = 3,
  lineHeight = 12,
  lineSpacing = 8,
  lastLineWidth = '60%',
  style,
}: SkeletonGroupProps) {
  return (
    <View style={style}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? lastLineWidth : '100%'}
          height={lineHeight}
          style={i < lines - 1 ? { marginBottom: lineSpacing } : undefined}
        />
      ))}
    </View>
  );
}

// ──────────────────────────────────────────
//  Product Card Skeleton
// ──────────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <View style={styles.productCard}>
      <Skeleton width="100%" height={140} borderRadius={borderRadius.md} />
      <View style={styles.productCardBody}>
        <Skeleton width="70%" height={12} style={{ marginBottom: 6 }} />
        <Skeleton width="45%" height={14} style={{ marginBottom: 6 }} />
        <Skeleton width="30%" height={10} />
      </View>
    </View>
  );
}

// ──────────────────────────────────────────
//  Banner Skeleton
// ──────────────────────────────────────────

export function BannerSkeleton() {
  return (
    <Skeleton
      width="100%"
      height={160}
      borderRadius={borderRadius.lg}
    />
  );
}

// ──────────────────────────────────────────
//  Category Row Skeleton
// ──────────────────────────────────────────

export function CategoryRowSkeleton() {
  return (
    <View style={styles.categoryRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <View key={i} style={styles.categoryItem}>
          <Skeleton width={56} height={56} borderRadius={28} />
          <Skeleton width={48} height={10} style={{ marginTop: 6 }} />
        </View>
      ))}
    </View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  productCard: {
    width: 160,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  productCardBody: {
    padding: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  categoryItem: {
    alignItems: 'center',
  },
});

export default Skeleton;

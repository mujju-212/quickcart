// Skeleton — Animated loading placeholder

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius } from '../../theme/spacing';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadiusVal?: number;
  style?: ViewStyle;
}

export default function Skeleton({
  width,
  height,
  borderRadiusVal = borderRadius.md,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius: borderRadiusVal,
          backgroundColor: colors.background.tertiary,
          opacity,
        },
        style,
      ]}
    />
  );
}

// Preset skeletons
export function SkeletonLine({ width = '100%', height = 14 }: { width?: number | string; height?: number }) {
  return <Skeleton width={width} height={height} borderRadiusVal={borderRadius.xs} />;
}

export function SkeletonCard({ style }: { style?: ViewStyle } = {}) {
  return (
    <Animated.View style={[skeletonStyles.card, style]}>
      <Skeleton width={48} height={48} borderRadiusVal={borderRadius.md} />
      <Animated.View style={skeletonStyles.lines}>
        <SkeletonLine width="60%" height={16} />
        <SkeletonLine width="40%" height={12} />
      </Animated.View>
    </Animated.View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: 12,
  },
  lines: {
    flex: 1,
    gap: 8,
  },
});

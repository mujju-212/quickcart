import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '@theme/colors';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
  animationDelay?: number;
  padding?: number;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function Card({
  children,
  onPress,
  style,
  elevation = 'sm',
  animate = false,
  animationDelay = 0,
  padding = spacing.md,
}: CardProps) {
  const shadowStyle = elevation !== 'none' ? shadows[elevation] : {};

  const content = (
    <View style={[styles.card, shadowStyle, { padding }, style]}>
      {children}
    </View>
  );

  const wrapped = onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {content}
    </TouchableOpacity>
  ) : (
    content
  );

  if (animate) {
    return (
      <Animated.View entering={FadeInDown.delay(animationDelay).duration(400).springify()}>
        {wrapped}
      </Animated.View>
    );
  }

  return wrapped;
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
});

export default Card;

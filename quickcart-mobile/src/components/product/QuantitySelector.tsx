import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { hapticPresets } from '@utils/haptics';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

export interface QuantitySelectorProps {
  quantity?: number;
  value?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onChange?: (qty: number) => void;
  onRemove?: () => void;
  min?: number;
  max?: number;
  compact?: boolean;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function QuantitySelector({
  quantity: quantityProp,
  value,
  onIncrement,
  onDecrement,
  onChange,
  onRemove,
  min = 1,
  max = 10,
  compact = false,
}: QuantitySelectorProps) {
  const quantity = quantityProp ?? value ?? min;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = (action: () => void) => {
    scale.value = withSpring(0.9, { damping: 12 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 12 });
    }, 100);
    hapticPresets.tap();
    action();
  };

  const handleIncrement = () => {
    if (onChange) onChange(quantity + 1);
    else onIncrement?.();
  };

  const handleDecrement = () => {
    if (onChange) onChange(quantity - 1);
    else onDecrement?.();
  };

  const isMin = quantity <= min;
  const isMax = quantity >= max;

  const buttonSize = compact ? 28 : 34;
  const iconSize = compact ? 14 : 16;

  return (
    <Animated.View style={[styles.container, compact && styles.containerCompact, animatedStyle]}>
      {/* Decrement / Delete */}
      <Pressable
        onPress={() => {
          if (isMin && onRemove) {
            handlePress(onRemove);
          } else if (!isMin) {
            handlePress(handleDecrement);
          }
        }}
        disabled={isMin && !onRemove}
        style={[
          styles.button,
          { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
          isMin && !onRemove && styles.buttonDisabled,
          isMin && onRemove && styles.buttonDanger,
        ]}
      >
        {isMin && onRemove ? (
          <Trash2 size={iconSize} color={colors.error} />
        ) : (
          <Minus
            size={iconSize}
            color={isMin ? colors.textTertiary : colors.textPrimary}
          />
        )}
      </Pressable>

      {/* Quantity */}
      <Text style={[styles.quantity, compact && styles.quantityCompact]}>
        {quantity}
      </Text>

      {/* Increment */}
      <Pressable
        onPress={() => !isMax && handlePress(handleIncrement)}
        disabled={isMax}
        style={[
          styles.button,
          styles.buttonPrimary,
          { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
          isMax && styles.buttonDisabled,
        ]}
      >
        <Plus
          size={iconSize}
          color={isMax ? colors.textTertiary : colors.white}
        />
      </Pressable>
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Add-to-Cart Button (when quantity is 0)
// ──────────────────────────────────────────

interface AddToCartButtonProps {
  onPress: () => void;
  compact?: boolean;
}

export function AddToCartButton({ onPress, compact = false }: AddToCartButtonProps) {
  return (
    <Pressable
      onPress={() => {
        hapticPresets.press();
        onPress();
      }}
      style={[styles.addBtn, compact && styles.addBtnCompact]}
    >
      <Text style={[styles.addBtnText, compact && styles.addBtnTextCompact]}>ADD</Text>
    </Pressable>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xxs,
    paddingVertical: spacing.xxs,
  },
  containerCompact: {
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.4,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  buttonDanger: {
    backgroundColor: colors.errorLight,
    borderColor: colors.errorLight,
  },
  quantity: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    minWidth: 32,
  },
  quantityCompact: {
    minWidth: 24,
    fontSize: 13,
  },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnCompact: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
  },
  addBtnText: {
    ...typography.labelMedium,
    color: colors.white,
    fontWeight: '700',
  },
  addBtnTextCompact: {
    fontSize: 11,
  },
});

export default QuantitySelector;

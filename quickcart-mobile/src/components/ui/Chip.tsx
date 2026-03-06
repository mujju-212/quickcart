import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { X } from 'lucide-react-native';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  icon?: React.ReactNode;
  variant?: 'filled' | 'outlined';
  size?: 'sm' | 'md';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function Chip({
  label,
  selected = false,
  onPress,
  onRemove,
  icon,
  variant = 'outlined',
  size = 'md',
  disabled = false,
  style,
  textStyle,
}: ChipProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const isOutlined = variant === 'outlined';
  const sizeStyle = sizeMap[size];

  const containerColors = selected
    ? {
        backgroundColor: colors.primaryLight,
        borderColor: colors.primary,
      }
    : isOutlined
    ? {
        backgroundColor: 'transparent',
        borderColor: colors.border,
      }
    : {
        backgroundColor: colors.surface,
        borderColor: colors.surface,
      };

  const textColor = selected
    ? colors.primaryDark
    : colors.textSecondary;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.chip,
          sizeStyle.container,
          containerColors,
          disabled && styles.disabled,
          style,
        ]}
      >
        {icon && <>{icon}</>}

        <Text
          style={[
            styles.label,
            sizeStyle.text,
            { color: textColor },
            icon ? { marginLeft: 4 } : undefined,
            textStyle,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>

        {onRemove && (
          <Pressable
            onPress={onRemove}
            hitSlop={8}
            style={styles.removeBtn}
          >
            <X size={size === 'sm' ? 12 : 14} color={textColor} />
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Chip Group (for filter bars)
// ──────────────────────────────────────────

interface ChipGroupProps {
  items: { key: string; label: string; icon?: React.ReactNode }[];
  selectedKeys: string[];
  onSelect: (key: string) => void;
  multiSelect?: boolean;
  style?: ViewStyle;
}

export function ChipGroup({
  items,
  selectedKeys,
  onSelect,
  multiSelect = false,
  style,
}: ChipGroupProps) {
  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.chipGroup, style]}
    >
      {items.map((item) => (
        <Chip
          key={item.key}
          label={item.label}
          icon={item.icon}
          selected={selectedKeys.includes(item.key)}
          onPress={() => onSelect(item.key)}
          style={{ marginRight: spacing.sm }}
        />
      ))}
    </Animated.ScrollView>
  );
}

// ──────────────────────────────────────────
//  Size Map
// ──────────────────────────────────────────

const sizeMap: Record<'sm' | 'md', { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.sm,
    },
    text: { fontSize: 11, fontWeight: '600' },
  },
  md: {
    container: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    text: { fontSize: 13, fontWeight: '500' },
  },
};

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  label: {
    letterSpacing: 0.2,
  },
  removeBtn: {
    marginLeft: 4,
    padding: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  chipGroup: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
});

export default Chip;

import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { Search, X, Mic } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  onFocus?: () => void;
  showMic?: boolean;
  autoFocus?: boolean;
  containerStyle?: ViewStyle;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onClear,
  onFocus,
  showMic = false,
  autoFocus = false,
  placeholder = 'Search products...',
  containerStyle,
  ...rest
}: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const borderColor = useSharedValue<string>(colors.border);

  const animatedBorder = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  const handleFocus = () => {
    setFocused(true);
    borderColor.value = withTiming(colors.primary, { duration: 200 });
    onFocus?.();
  };

  const handleBlur = () => {
    setFocused(false);
    borderColor.value = withTiming(colors.border, { duration: 200 });
  };

  const handleClear = () => {
    onChangeText('');
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      style={[styles.container, animatedBorder, containerStyle]}
    >
      <Search size={18} color={focused ? colors.primary : colors.textTertiary} />

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        {...rest}
      />

      {value.length > 0 && (
        <Pressable onPress={handleClear} hitSlop={10} style={styles.clearBtn}>
          <X size={16} color={colors.textSecondary} />
        </Pressable>
      )}

      {showMic && value.length === 0 && (
        <Pressable hitSlop={10} style={styles.micBtn}>
          <Mic size={18} color={colors.textTertiary} />
        </Pressable>
      )}
    </Animated.View>
  );
}

// ──────────────────────────────────────────
//  Tappable Search Bar (navigates to search screen)
// ──────────────────────────────────────────

interface TappableSearchBarProps {
  onPress: () => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function TappableSearchBar({
  onPress,
  placeholder = 'Search products...',
  style,
}: TappableSearchBarProps) {
  return (
    <Pressable onPress={onPress} style={[styles.container, styles.tappable, style]}>
      <Search size={18} color={colors.textTertiary} />
      <Animated.Text style={styles.placeholderText}>{placeholder}</Animated.Text>
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
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  input: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  micBtn: {
    padding: 4,
    marginLeft: spacing.xxs,
  },
  tappable: {
    backgroundColor: colors.surface,
  },
  placeholderText: {
    ...typography.bodyMedium,
    color: colors.textTertiary,
    marginLeft: spacing.sm,
  },
});

export default SearchBar;

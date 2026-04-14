// Input — Text input with label, error, and icon support

import React, { forwardRef } from 'react';
import { StyleSheet, View, TextInput, TextInputProps, ViewStyle, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode | string;
  rightIcon?: React.ReactNode | string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

const renderIcon = (icon: React.ReactNode | string, color: string = colors.text.tertiary): React.ReactNode => {
  if (typeof icon === 'string') {
    return <MaterialCommunityIcons name={icon as any} size={20} color={color} />;
  }
  return icon;
};

const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, leftIcon, rightIcon, onRightIconPress, containerStyle, style, ...props }, ref) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.inputWrapper, error && styles.inputError]}>
          {leftIcon && <View style={styles.iconLeft}>{renderIcon(leftIcon)}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              leftIcon ? { paddingLeft: 0 } : undefined,
              rightIcon ? { paddingRight: 0 } : undefined,
              style,
            ]}
            placeholderTextColor={colors.text.disabled}
            {...props}
          />
          {rightIcon && (
            onRightIconPress ? (
              <TouchableOpacity style={styles.iconRight} onPress={onRightIconPress} activeOpacity={0.7}>
                {renderIcon(rightIcon)}
              </TouchableOpacity>
            ) : (
              <View style={styles.iconRight}>{renderIcon(rightIcon)}</View>
            )
          )}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';
export default Input;

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
  },
  inputError: {
    borderColor: colors.status.cancelled,
  },
  input: {
    flex: 1,
    ...typography.inputText,
    color: colors.text.primary,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xs,
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.status.cancelled,
    marginTop: spacing.xs,
  },
});

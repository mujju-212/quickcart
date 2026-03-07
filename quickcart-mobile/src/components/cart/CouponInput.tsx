import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { Tag, X, Check } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { triggerHaptic } from '@utils/haptics';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface CouponInputProps {
  /** Called with the coupon code  */
  onApply: (code: string) => Promise<boolean>;
  /** Called to remove coupon */
  onRemove: () => void;
  /** Currently applied coupon code */
  appliedCode?: string;
  /** Applied discount amount */
  discountAmount?: number;
  style?: ViewStyle;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function CouponInput({
  onApply,
  onRemove,
  appliedCode,
  discountAmount,
  style,
}: CouponInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = useCallback(async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError('Enter a coupon code');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const valid = await onApply(trimmed);
      if (valid) {
        triggerHaptic('success');
        setCode('');
      } else {
        setError('Invalid or expired coupon');
        triggerHaptic('error');
      }
    } catch {
      setError('Failed to validate coupon');
      triggerHaptic('error');
    } finally {
      setLoading(false);
    }
  }, [code, onApply]);

  const handleRemove = useCallback(() => {
    onRemove();
    triggerHaptic('selection');
  }, [onRemove]);

  // ── Applied State ──
  if (appliedCode) {
    return (
      <Animated.View
        entering={FadeInUp.springify()}
        exiting={FadeOutUp.duration(200)}
        style={[styles.appliedContainer, style]}
      >
        <View style={styles.appliedLeft}>
          <View style={styles.tagCircle}>
            <Check size={12} color={colors.white} />
          </View>
          <View>
            <Text style={styles.appliedCode}>{appliedCode}</Text>
            {discountAmount != null && discountAmount > 0 && (
              <Text style={styles.appliedSavings}>
                Saving ₹{discountAmount}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={handleRemove} hitSlop={8}>
          <X size={18} color={colors.error} />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // ── Input State ──
  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputRow}>
        <Tag size={16} color={colors.textTertiary} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Enter coupon code"
          placeholderTextColor={colors.textTertiary}
          value={code}
          onChangeText={(t) => {
            setCode(t.toUpperCase());
            if (error) setError('');
          }}
          autoCapitalize="characters"
          returnKeyType="done"
          onSubmitEditing={handleApply}
        />
        <TouchableOpacity
          style={[
            styles.applyBtn,
            (!code.trim() || loading) && styles.applyBtnDisabled,
          ]}
          onPress={handleApply}
          disabled={!code.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.applyText}>APPLY</Text>
          )}
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
    </View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {},
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: spacing.sm,
    height: 48,
  },
  input: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  applyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
  },
  applyBtnDisabled: {
    backgroundColor: colors.textDisabled,
  },
  applyText: {
    ...typography.labelSmall,
    color: colors.white,
    fontWeight: '800',
    letterSpacing: 1,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: 4,
    marginLeft: spacing.sm,
  },

  // Applied
  appliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.successLight,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.success,
  },
  appliedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tagCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appliedCode: {
    ...typography.labelMedium,
    color: colors.success,
    fontWeight: '800',
    letterSpacing: 1,
  },
  appliedSavings: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
});

export default CouponInput;

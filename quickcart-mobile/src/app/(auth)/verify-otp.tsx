import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import AnimatedRN, { FadeInUp, FadeIn, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { Button } from '@components/ui';
import { useAuth } from '@hooks/useAuth';
import { triggerHaptic } from '@utils/haptics';

const OTP_LENGTH = 6;
const RESEND_TIMER = 30; // seconds

// ──────────────────────────────────────────
//  OTP Verification Screen
// ──────────────────────────────────────────

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const { mode, identifier } = useLocalSearchParams<{ mode: 'phone' | 'email'; identifier: string }>();
  const { verifyOtp, sendOtp, isLoading, error: authError } = useAuth();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [timer, setTimer] = useState(RESEND_TIMER);
  const [error, setError] = useState('');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // ── Countdown timer ──
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // ── Auto-submit when all digits filled ──
  useEffect(() => {
    const code = otp.join('');
    if (code.length === OTP_LENGTH && !otp.includes('')) {
      handleVerify(code);
    }
  }, [otp]);

  const handleChange = useCallback(
    (text: string, index: number) => {
      // Accept only digits
      const digit = text.replace(/\D/g, '');
      if (!digit && text !== '') return;

      const newOtp = [...otp];

      if (digit.length > 1) {
        // Paste handling — fill as many boxes as possible
        const chars = digit.slice(0, OTP_LENGTH).split('');
        chars.forEach((c, i) => {
          if (index + i < OTP_LENGTH) newOtp[index + i] = c;
        });
        setOtp(newOtp);
        const nextIdx = Math.min(index + chars.length, OTP_LENGTH - 1);
        inputRefs.current[nextIdx]?.focus();
        return;
      }

      newOtp[index] = digit;
      setOtp(newOtp);
      setError('');

      if (digit && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (e.nativeEvent.key === 'Backspace') {
        if (!otp[index] && index > 0) {
          const newOtp = [...otp];
          newOtp[index - 1] = '';
          setOtp(newOtp);
          inputRefs.current[index - 1]?.focus();
        } else {
          const newOtp = [...otp];
          newOtp[index] = '';
          setOtp(newOtp);
        }
      }
    },
    [otp]
  );

  const handleVerify = useCallback(
    async (code?: string) => {
      const otpCode = code || otp.join('');
      if (otpCode.length < OTP_LENGTH) {
        setError('Enter all 6 digits');
        triggerHaptic('error');
        return;
      }

      const result = await verifyOtp(identifier!, otpCode, mode);

      if (result?.token) {
        triggerHaptic('success');
        // If new user, go to complete profile; otherwise go to tabs
        if (result.isNewUser) {
          router.replace({
            pathname: '/(auth)/complete-profile',
            params: { mode, identifier },
          });
        } else {
          router.replace('/(tabs)');
        }
      } else {
        setError(authError || 'Invalid OTP. Please try again.');
        triggerHaptic('error');
      }
    },
    [otp, mode, identifier, verifyOtp, authError, router]
  );

  const handleResend = useCallback(async () => {
    if (timer > 0) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    inputRefs.current[0]?.focus();

    await sendOtp(identifier!, mode);
    setTimer(RESEND_TIMER);
    triggerHaptic('selection');
  }, [timer, mode, identifier, sendOtp]);

  const maskedIdentifier = mode === 'phone'
    ? `+91 ${identifier?.slice(0, 2)}****${identifier?.slice(-2)}`
    : `${identifier?.slice(0, 3)}***@${identifier?.split('@')[1] ?? ''}`;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: top + spacing.md, paddingBottom: bottom + spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Shield Icon */}
        <AnimatedRN.View entering={ZoomIn.delay(100).springify()} style={styles.iconWrap}>
          <View style={styles.shieldCircle}>
            <ShieldCheck size={32} color={colors.textPrimary} />
          </View>
        </AnimatedRN.View>

        {/* Title */}
        <AnimatedRN.View entering={FadeInUp.delay(200).springify()}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.identifier}>{maskedIdentifier}</Text>
          </Text>
        </AnimatedRN.View>

        {/* OTP Boxes */}
        <AnimatedRN.View
          entering={FadeInUp.delay(300).springify()}
          style={styles.otpRow}
        >
          {Array.from({ length: OTP_LENGTH }).map((_, i) => {
            const isFocused = focusedIndex === i;
            const hasValue = !!otp[i];
            return (
              <TextInput
                key={i}
                ref={(ref) => { inputRefs.current[i] = ref; }}
                style={[
                  styles.otpBox,
                  isFocused && styles.otpBoxFocused,
                  hasValue && styles.otpBoxFilled,
                  error && styles.otpBoxError,
                ]}
                value={otp[i]}
                onChangeText={(t) => handleChange(t, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                onFocus={() => setFocusedIndex(i)}
                keyboardType="number-pad"
                maxLength={i === 0 ? OTP_LENGTH : 1}
                textContentType="oneTimeCode"
                autoComplete={i === 0 ? 'sms-otp' : 'off'}
                selectTextOnFocus
                caretHidden
              />
            );
          })}
        </AnimatedRN.View>

        {/* Error */}
        {(error || authError) && (
          <AnimatedRN.Text entering={FadeIn.duration(300)} style={styles.error}>
            {error || authError}
          </AnimatedRN.Text>
        )}

        {/* Verify Button */}
        <Button
          title="Verify"
          onPress={() => handleVerify()}
          loading={isLoading}
          fullWidth
          style={{ marginTop: spacing.lg }}
        />

        {/* Resend */}
        <View style={styles.resendWrap}>
          <Text style={styles.resendLabel}>Didn't receive the code?</Text>
          {timer > 0 ? (
            <Text style={styles.timerText}>
              Resend in <Text style={styles.timerBold}>0:{timer.toString().padStart(2, '0')}</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
              <RefreshCw size={14} color={colors.primary} />
              <Text style={styles.resendBtnText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Change number */}
        <TouchableOpacity onPress={() => router.back()} style={styles.changeWrap}>
          <Text style={styles.changeText}>
            Change {mode === 'phone' ? 'phone number' : 'email'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  shieldCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 22,
  },
  identifier: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: spacing.xl,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  otpBoxFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  otpBoxError: {
    borderColor: colors.error,
    backgroundColor: '#FFF5F5',
  },
  error: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontWeight: '600',
  },
  resendWrap: {
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: 6,
  },
  resendLabel: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  timerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  timerBold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  resendBtnText: {
    ...typography.labelMedium,
    color: colors.primary,
    fontWeight: '700',
  },
  changeWrap: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  changeText: {
    ...typography.bodySmall,
    color: colors.info,
    fontWeight: '600',
  },
});

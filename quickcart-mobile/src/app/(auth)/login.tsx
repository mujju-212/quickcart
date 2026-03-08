import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated as RNAnimated,
} from 'react-native';
import AnimatedRN, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Phone, Mail, ArrowRight, ShoppingCart } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { Input, Button } from '@components/ui';
import { useAuth } from '@hooks/useAuth';
import { triggerHaptic } from '@utils/haptics';
import { isValidPhone, isValidEmail } from '@utils/helpers';

// ──────────────────────────────────────────
//  Login Screen
// ──────────────────────────────────────────

export default function LoginScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const { sendOtp, isLoading, error: authError } = useAuth();

  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleContinue = useCallback(async () => {
    setError('');

    if (mode === 'phone') {
      if (!phone.trim()) {
        setError('Phone number is required');
        triggerHaptic('error');
        return;
      }
      if (!isValidPhone(phone)) {
        setError('Enter a valid 10-digit phone number');
        triggerHaptic('error');
        return;
      }
      const success = await sendOtp(phone, 'phone');
      if (success) {
        router.push({
          pathname: '/(auth)/verify-otp',
          params: { mode: 'phone', identifier: phone },
        });
      }
    } else {
      if (!email.trim()) {
        setError('Email is required');
        triggerHaptic('error');
        return;
      }
      if (!isValidEmail(email)) {
        setError('Enter a valid email address');
        triggerHaptic('error');
        return;
      }
      const success = await sendOtp(email, 'email');
      if (success) {
        router.push({
          pathname: '/(auth)/verify-otp',
          params: { mode: 'email', identifier: email },
        });
      }
    }
  }, [mode, phone, email, sendOtp, router]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: top + spacing.xxl, paddingBottom: bottom + spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo / Brand */}
        <AnimatedRN.View entering={FadeIn.duration(500)} style={styles.brandWrap}>
          <View style={styles.logoCircle}>
            <ShoppingCart size={36} color={colors.textPrimary} />
          </View>
          <Text style={styles.brandName}>QuickCart</Text>
          <Text style={styles.tagline}>Shop smarter, live better</Text>
        </AnimatedRN.View>

        {/* Form */}
        <AnimatedRN.View entering={FadeInUp.delay(200).springify()} style={styles.formWrap}>
          <Text style={styles.welcomeTitle}>Welcome</Text>
          <Text style={styles.welcomeSubtitle}>
            {mode === 'phone'
              ? 'Enter your phone number to continue'
              : 'Enter your email to continue'}
          </Text>

          {/* Mode Toggle */}
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'phone' && styles.modeBtnActive]}
              onPress={() => { setMode('phone'); setError(''); }}
            >
              <Phone size={16} color={mode === 'phone' ? colors.textPrimary : colors.textTertiary} />
              <Text style={[styles.modeText, mode === 'phone' && styles.modeTextActive]}>
                Phone
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeBtn, mode === 'email' && styles.modeBtnActive]}
              onPress={() => { setMode('email'); setError(''); }}
            >
              <Mail size={16} color={mode === 'email' ? colors.textPrimary : colors.textTertiary} />
              <Text style={[styles.modeText, mode === 'email' && styles.modeTextActive]}>
                Email
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input */}
          {mode === 'phone' ? (
            <Input
              label="Phone Number"
              placeholder="9876543210"
              value={phone}
              onChangeText={(t) => {
                setPhone(t.replace(/\D/g, ''));
                if (error) setError('');
              }}
              keyboardType="phone-pad"
              maxLength={10}
              leftIcon={<Text style={styles.countryCode}>+91</Text>}
              error={error || authError || undefined}
            />
          ) : (
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={(t) => {
                setEmail(t.trim());
                if (error) setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={18} color={colors.textTertiary} />}
              error={error || authError || undefined}
            />
          )}

          {/* Continue Button */}
          <Button
            title="Continue"
            onPress={handleContinue}
            loading={isLoading}
            fullWidth
            icon={<ArrowRight size={18} color={colors.white} />}
            iconPosition="right"
            style={{ marginTop: spacing.md }}
          />

          {/* Terms */}
          <Text style={styles.terms}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </AnimatedRN.View>
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
  brandWrap: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  brandName: {
    ...typography.h1,
    color: colors.textPrimary,
    fontWeight: '900',
  },
  tagline: {
    ...typography.bodyMedium,
    color: colors.textTertiary,
    marginTop: 4,
  },
  formWrap: {
    flex: 1,
  },
  welcomeTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  welcomeSubtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: spacing.lg,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: 6,
  },
  modeBtnActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  modeText: {
    ...typography.labelMedium,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  modeTextActive: {
    color: colors.textPrimary,
  },
  countryCode: {
    ...typography.labelMedium,
    color: colors.textSecondary,
    fontWeight: '700',
    marginRight: 4,
  },
  terms: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});

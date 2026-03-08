import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import AnimatedRN, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { User, Mail, Camera, CheckCircle } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { Input, Button } from '@components/ui';
import { useAuth } from '@hooks/useAuth';
import { triggerHaptic } from '@utils/haptics';
import { isValidEmail } from '@utils/helpers';

// ──────────────────────────────────────────
//  Complete Profile Screen
// ──────────────────────────────────────────

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const { mode: routeMode, identifier: routeIdentifier } = useLocalSearchParams<{ mode?: string; identifier?: string }>();
  const { completeProfile, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = useCallback((): boolean => {
    const errs: typeof errors = {};

    if (!name.trim()) {
      errs.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errs.email = 'Enter a valid email address';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [name, email]);

  const handleContinue = useCallback(async () => {
    if (!validate()) {
      triggerHaptic('error');
      return;
    }

    const method = (routeMode as 'phone' | 'email') || 'email';
    const identifier = routeIdentifier || email.trim().toLowerCase();
    const secondary = method === 'phone' ? email.trim().toLowerCase() : undefined;

    const success = await completeProfile(
      name.trim(),
      identifier,
      method,
      secondary,
    );

    if (success) {
      triggerHaptic('success');
      router.replace('/(tabs)');
    }
  }, [name, email, validate, completeProfile, router]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: top + spacing.xl, paddingBottom: bottom + spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <AnimatedRN.View entering={ZoomIn.delay(100).springify()} style={styles.avatarWrap}>
          <View style={styles.avatarCircle}>
            <User size={40} color={colors.textTertiary} />
          </View>
          <View style={styles.cameraBadge}>
            <Camera size={14} color={colors.white} />
          </View>
        </AnimatedRN.View>

        {/* Title */}
        <AnimatedRN.View entering={FadeInUp.delay(200).springify()}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Just a few details to personalise your experience
          </Text>
        </AnimatedRN.View>

        {/* Form */}
        <AnimatedRN.View entering={FadeInUp.delay(300).springify()} style={styles.formWrap}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
            }}
            autoCapitalize="words"
            leftIcon={<User size={18} color={colors.textTertiary} />}
            error={errors.name}
          />

          <Input
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={(t) => {
              setEmail(t.trim());
              if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={18} color={colors.textTertiary} />}
            error={errors.email}
          />
        </AnimatedRN.View>

        {/* Continue */}
        <AnimatedRN.View entering={FadeInUp.delay(400).springify()}>
          <Button
            title="Get Started"
            onPress={handleContinue}
            loading={isLoading}
            fullWidth
            icon={<CheckCircle size={18} color={colors.white} />}
            iconPosition="right"
            style={{ marginTop: spacing.lg }}
          />
        </AnimatedRN.View>

        {/* Skip hint */}
        <AnimatedRN.View entering={FadeInUp.delay(500).springify()}>
          <Text style={styles.skipHint}>
            You can update these details later in Settings
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
  avatarWrap: {
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
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
    marginBottom: spacing.xl,
  },
  formWrap: {
    gap: spacing.xs,
  },
  skipHint: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});

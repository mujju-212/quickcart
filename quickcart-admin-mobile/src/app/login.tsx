// Login Screen — Admin authentication

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuthStore } from '../stores/authStore';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: { email?: string; password?: string } = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    clearError();
    if (validate()) {
      await login(email.trim(), password);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <MaterialCommunityIcons name="shield-account" size={48} color={colors.white} />
            </View>
            <Text style={styles.appName}>QuickCart</Text>
            <Text style={styles.subtitle}>Admin Portal</Text>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>
            <Text style={styles.cardDesc}>Enter your admin credentials to continue</Text>

            {error && (
              <View style={styles.errorBanner}>
                <MaterialCommunityIcons name="alert-circle" size={16} color={colors.status.cancelled} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Input
              label="Email"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                if (formErrors.email) setFormErrors((p) => ({ ...p, email: undefined }));
              }}
              placeholder="admin@quickcart.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email-outline"
              error={formErrors.email}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                if (formErrors.password) setFormErrors((p) => ({ ...p, password: undefined }));
              }}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              leftIcon="lock-outline"
              rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              error={formErrors.password}
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              size="lg"
              style={styles.loginBtn}
            />
          </View>

          {/* Footer */}
          <Text style={styles.footer}>QuickCart Admin v1.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary[700],
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
  subtitle: {
    ...typography.body,
    color: colors.primary[200],
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  cardTitle: {
    ...typography.pageTitle,
    color: colors.text.primary,
    textAlign: 'center',
  },
  cardDesc: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#FEF2F2',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.small,
    color: colors.status.cancelled,
    flex: 1,
  },
  loginBtn: {
    marginTop: spacing.md,
  },
  footer: {
    ...typography.small,
    color: colors.primary[300],
    textAlign: 'center',
    marginTop: spacing['2xl'],
  },
});

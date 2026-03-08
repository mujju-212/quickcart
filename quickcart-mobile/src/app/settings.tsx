import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import AnimatedRN, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Bell,
  BellOff,
  Moon,
  Sun,
  Trash2,
  Info,
  Shield,
  FileText,
  HelpCircle,
  ChevronRight,
  LogOut,
  Globe,
  Smartphone,
} from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { Header } from '@components/common';
import { useAuthStore } from '@stores/authStore';
import { storage } from '@utils/storage';
import { triggerHaptic } from '@utils/haptics';
import { APP_VERSION } from '@utils/constants';

// ──────────────────────────────────────────
//  Settings Screen
// ──────────────────────────────────────────

export default function SettingsScreen() {
  const router = useRouter();
  const { top} = useSafeAreaInsets();
  const logout = useAuthStore((s) => s.logout);

  // Local toggle states (persisted via MMKV in production)
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // ──────────── handlers ──────────────

  const handleClearCache = useCallback(() => {
    Alert.alert(
      'Clear Cache',
      'This will remove cached images and data. Your account data is safe.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            triggerHaptic('success');
            // In production, clear image cache + react-query cache
          },
        },
      ]
    );
  }, []);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'This action is permanent. All your data, orders, and history will be erased.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: () => {
            triggerHaptic('error');
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  }, [logout, router]);

  const handleLogout = useCallback(() => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          triggerHaptic('press');
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }, [logout, router]);

  // ──────────── section renderer ──────────────

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const ToggleRow = ({
    icon,
    label,
    value,
    onToggle,
  }: {
    icon: React.ReactNode;
    label: string;
    value: boolean;
    onToggle: (v: boolean) => void;
  }) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        {icon}
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : colors.textTertiary}
      />
    </View>
  );

  const NavRow = ({
    icon,
    label,
    onPress,
    destructive,
  }: {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
    destructive?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={styles.rowLeft}>
        {icon}
        <Text style={[styles.rowLabel, destructive && styles.destructive]}>
          {label}
        </Text>
      </View>
      <ChevronRight size={18} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Header title="Settings" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Notifications ── */}
        <AnimatedRN.View entering={FadeInUp.delay(50).springify()}>
          <SectionHeader title="Notifications" />
          <View style={styles.card}>
            <ToggleRow
              icon={<Bell size={20} color={colors.info} />}
              label="Push Notifications"
              value={pushEnabled}
              onToggle={setPushEnabled}
            />
            <View style={styles.divider} />
            <ToggleRow
              icon={<Globe size={20} color={colors.success} />}
              label="Email Notifications"
              value={emailEnabled}
              onToggle={setEmailEnabled}
            />
            <View style={styles.divider} />
            <ToggleRow
              icon={<Smartphone size={20} color={colors.primary} />}
              label="SMS Notifications"
              value={smsEnabled}
              onToggle={setSmsEnabled}
            />
          </View>
        </AnimatedRN.View>

        {/* ── Appearance ── */}
        <AnimatedRN.View entering={FadeInUp.delay(100).springify()}>
          <SectionHeader title="Appearance" />
          <View style={styles.card}>
            <ToggleRow
              icon={
                darkMode ? (
                  <Moon size={20} color={colors.text} />
                ) : (
                  <Sun size={20} color={colors.primary} />
                )
              }
              label="Dark Mode"
              value={darkMode}
              onToggle={setDarkMode}
            />
          </View>
        </AnimatedRN.View>

        {/* ── Legal & Info ── */}
        <AnimatedRN.View entering={FadeInUp.delay(150).springify()}>
          <SectionHeader title="About" />
          <View style={styles.card}>
            <NavRow
              icon={<FileText size={20} color={colors.textSecondary} />}
              label="Terms of Service"
              onPress={() => Linking.openURL('https://quickcart.app/terms')}
            />
            <View style={styles.divider} />
            <NavRow
              icon={<Shield size={20} color={colors.textSecondary} />}
              label="Privacy Policy"
              onPress={() => Linking.openURL('https://quickcart.app/privacy')}
            />
            <View style={styles.divider} />
            <NavRow
              icon={<HelpCircle size={20} color={colors.textSecondary} />}
              label="Help & Support"
              onPress={() => router.push('/help')}
            />
          </View>
        </AnimatedRN.View>

        {/* ── Danger Zone ── */}
        <AnimatedRN.View entering={FadeInUp.delay(200).springify()}>
          <SectionHeader title="Data" />
          <View style={styles.card}>
            <NavRow
              icon={<Trash2 size={20} color={colors.textSecondary} />}
              label="Clear Cache"
              onPress={handleClearCache}
            />
            <View style={styles.divider} />
            <NavRow
              icon={<Trash2 size={20} color={colors.error} />}
              label="Delete Account"
              onPress={handleDeleteAccount}
              destructive
            />
          </View>
        </AnimatedRN.View>

        {/* ── Logout ── */}
        <AnimatedRN.View entering={FadeInUp.delay(250).springify()}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <LogOut size={20} color={colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </AnimatedRN.View>

        {/* ── Version ── */}
        <Text style={styles.version}>
          QuickCart v{APP_VERSION || '1.0.0'}
        </Text>
      </ScrollView>
    </View>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xxl * 2,
  },

  // Sections
  sectionHeader: {
    ...typography.labelLarge,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },

  // Rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    minHeight: 52,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  rowLabel: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  destructive: {
    color: colors.error,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 48,
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  logoutText: {
    ...typography.bodyLarge,
    color: colors.error,
    fontWeight: '600',
  },

  // Version
  version: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});

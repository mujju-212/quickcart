// Settings Screen — Admin preferences, app info, logout

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Linking } from 'react-native';
import { Text, Switch, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { storage, STORAGE_KEYS } from '../../utils/storage';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

function SettingRow({
  icon,
  iconColor,
  title,
  subtitle,
  right,
}: {
  icon: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.iconBox, { backgroundColor: (iconColor || colors.primary[600]) + '15' }]}>
        <MaterialCommunityIcons
          name={icon as any}
          size={20}
          color={iconColor || colors.primary[600]}
        />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Preferences state
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const savedAutoRefresh = storage.getString('pref_auto_refresh');
    const savedPush = storage.getString('pref_push_notifications');
    const savedCompact = storage.getString('pref_compact_view');
    if (savedAutoRefresh !== undefined) setAutoRefresh(savedAutoRefresh === 'true');
    if (savedPush !== undefined) setPushNotifications(savedPush === 'true');
    if (savedCompact !== undefined) setCompactView(savedCompact === 'true');
  }, []);

  const togglePref = (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    storage.set(key, String(value));
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'This will clear all cached data. You will need to re-fetch.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        onPress: () => {
          storage.delete('dashboard_cache');
          Alert.alert('Done', 'Cache cleared successfully');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Admin profile */}
      <Card style={styles.profileCard}>
        <View style={styles.profileRow}>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="shield-account" size={28} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminName}>{user?.name || 'Admin'}</Text>
            <Text style={styles.adminEmail}>{user?.email || 'admin@quickcart.in'}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>ADMINISTRATOR</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Preferences */}
      <Text style={styles.sectionTitle}>Preferences</Text>
      <Card>
        <SettingRow
          icon="refresh-auto"
          title="Auto Refresh"
          subtitle="Refresh dashboard data periodically"
          right={
            <Switch
              value={autoRefresh}
              onValueChange={(v) => togglePref('pref_auto_refresh', v, setAutoRefresh)}
              color={colors.primary[600]}
            />
          }
        />
        <Divider style={styles.rowDivider} />
        <SettingRow
          icon="bell-outline"
          iconColor="#F59E0B"
          title="Push Notifications"
          subtitle="Get notified about new orders"
          right={
            <Switch
              value={pushNotifications}
              onValueChange={(v) => togglePref('pref_push_notifications', v, setPushNotifications)}
              color={colors.primary[600]}
            />
          }
        />
        <Divider style={styles.rowDivider} />
        <SettingRow
          icon="view-compact-outline"
          title="Compact View"
          subtitle="Show more items per page"
          right={
            <Switch
              value={compactView}
              onValueChange={(v) => togglePref('pref_compact_view', v, setCompactView)}
              color={colors.primary[600]}
            />
          }
        />
      </Card>

      {/* Data Management */}
      <Text style={styles.sectionTitle}>Data Management</Text>
      <Card>
        <SettingRow
          icon="cached"
          iconColor="#8B5CF6"
          title="Clear Cache"
          subtitle="Remove locally cached data"
          right={
            <Button
              title="Clear"
              variant="outline"
              size="sm"
              onPress={handleClearCache}
            />
          }
        />
      </Card>

      {/* App Info */}
      <Text style={styles.sectionTitle}>About</Text>
      <Card>
        <SettingRow
          icon="information-outline"
          title="App Version"
          subtitle="1.0.0 (Build 1)"
        />
        <Divider style={styles.rowDivider} />
        <SettingRow
          icon="server-network"
          title="API Server"
          subtitle="quickcart-api-a09g.onrender.com"
        />
        <Divider style={styles.rowDivider} />
        <SettingRow
          icon="shield-check-outline"
          iconColor={colors.status.delivered}
          title="Security"
          subtitle="JWT Auth • 30 min inactivity timeout"
        />
      </Card>

      {/* Logout */}
      <View style={styles.logoutSection}>
        <Button
          title="Log Out"
          variant="danger"
          icon="logout"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        QuickCart Admin v1.0.0{'\n'}
        © 2025 QuickCart. All rights reserved.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingBottom: spacing['3xl'],
  },
  profileCard: {
    margin: spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminName: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: colors.text.primary,
  },
  adminEmail: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  roleText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: colors.primary[700],
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  settingSubtitle: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 1,
  },
  rowDivider: {
    marginLeft: 52,
  },
  logoutSection: {
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  logoutBtn: {
    width: '100%',
  },
  footer: {
    ...typography.caption,
    color: colors.text.disabled,
    textAlign: 'center',
    padding: spacing.lg,
    lineHeight: 18,
  },
});

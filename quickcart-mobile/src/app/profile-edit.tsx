import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AnimatedRN, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, User, Mail, Phone, Save, Check } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { shadows } from '@theme/shadows';
import { Header } from '@components/common';
import { Input, Button } from '@components/ui';
import { useAuthStore } from '@stores/authStore';
import authService from '@services/authService';
import { triggerHaptic } from '@utils/haptics';

// ──────────────────────────────────────────
//  Profile Edit Screen
// ──────────────────────────────────────────

export default function ProfileEditScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState<string | null>(user?.avatar_url || null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // ──────────── avatar picker ──────────────

  const pickAvatar = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'We need access to your photos to set a profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  }, []);

  // ──────────── save handler ──────────────

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.updateProfile({
        name: name.trim(),
        email: email.trim(),
        // In production, avatar would be uploaded to storage + URL sent
      });

      // Update local store
      if (user) {
        setUser({
          ...user,
          name: name.trim(),
          email: email.trim(),
          avatar_url: avatar || user.avatar_url,
        });
      }

      triggerHaptic('success');
      setSaved(true);

      // Show checkmark briefly, then go back
      setTimeout(() => {
        router.back();
      }, 1200);
    } catch (error: any) {
      Alert.alert('Update failed', error?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  }, [name, email, avatar, user, setUser, router]);

  // ──────────── initials fallback ──────────────

  const initials = (user?.name || 'U')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <Header title="Edit Profile" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Avatar Section ── */}
          <AnimatedRN.View
            entering={ZoomIn.springify()}
            style={styles.avatarSection}
          >
            <TouchableOpacity
              onPress={pickAvatar}
              activeOpacity={0.8}
              style={styles.avatarWrapper}
            >
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitials}>{initials}</Text>
                </View>
              )}

              {/* Camera badge */}
              <View style={styles.cameraBadge}>
                <Camera size={14} color={colors.white} />
              </View>
            </TouchableOpacity>

            <Text style={styles.changeText}>Tap to change photo</Text>
          </AnimatedRN.View>

          {/* ── Form Fields ── */}
          <AnimatedRN.View entering={FadeInUp.delay(100).springify()}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={styles.inputRow}>
                <User size={18} color={colors.textTertiary} />
                <Input
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                  containerStyle={styles.inputFlex}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </AnimatedRN.View>

          <AnimatedRN.View entering={FadeInUp.delay(150).springify()}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <View style={styles.inputRow}>
                <Mail size={18} color={colors.textTertiary} />
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  containerStyle={styles.inputFlex}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </AnimatedRN.View>

          <AnimatedRN.View entering={FadeInUp.delay(200).springify()}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <View style={styles.inputRow}>
                <Phone size={18} color={colors.textTertiary} />
                <View style={styles.phoneDisplay}>
                  <Text style={styles.phoneText}>
                    +91 {user?.phone || '••••••••••'}
                  </Text>
                  <Text style={styles.phoneHint}>
                    Cannot be changed here
                  </Text>
                </View>
              </View>
            </View>
          </AnimatedRN.View>

          {/* ── Save Button ── */}
          <AnimatedRN.View entering={FadeInUp.delay(250).springify()}>
            {saved ? (
              <View style={styles.savedContainer}>
                <AnimatedRN.View entering={ZoomIn.springify()}>
                  <View style={styles.savedBadge}>
                    <Check size={24} color={colors.white} />
                  </View>
                </AnimatedRN.View>
                <Text style={styles.savedText}>Profile Updated!</Text>
              </View>
            ) : (
              <Button
                title="Save Changes"
                onPress={handleSave}
                loading={loading}
                disabled={loading || !name.trim()}
                icon={<Save size={18} color={colors.text} />}
                style={styles.saveBtn}
              />
            )}
          </AnimatedRN.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  flex: { flex: 1 },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primaryDark,
  },
  avatarInitials: {
    ...typography.h1,
    color: colors.text,
    fontWeight: '700',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  changeText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Fields
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    ...typography.labelMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingLeft: spacing.md,
    gap: spacing.xs,
    ...shadows.sm,
  },
  inputFlex: {
    flex: 1,
    marginBottom: 0,
  },

  // Phone (read-only)
  phoneDisplay: {
    flex: 1,
    paddingVertical: spacing.md,
  },
  phoneText: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  phoneHint: {
    ...typography.caption,
    color: colors.textTertiary,
    marginTop: 2,
  },

  // Save
  saveBtn: {
    marginTop: spacing.lg,
  },

  // Saved state
  savedContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  savedBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedText: {
    ...typography.bodyLarge,
    color: colors.success,
    fontWeight: '600',
  },
});

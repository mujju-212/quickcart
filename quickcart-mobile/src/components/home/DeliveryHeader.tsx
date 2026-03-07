import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { MapPin, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing } from '@theme/spacing';
import { useLocationStore } from '@stores/locationStore';
import { useAuthStore } from '@stores/authStore';

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

interface DeliveryHeaderProps {
  style?: ViewStyle;
}

export function DeliveryHeader({ style }: DeliveryHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const deliveryLocation = useLocationStore((s) => s.deliveryLocation);
  const selectedAddress = useLocationStore((s) => s.selectedAddress);

  const greeting = getGreeting();
  const userName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xs }, style]}>
      {/* Left: Delivery Info */}
      <Pressable
        onPress={() => router.push('/addresses')}
        style={styles.locationBtn}
      >
        <View style={styles.iconWrap}>
          <MapPin size={18} color={colors.primary} />
        </View>
        <View style={styles.locationText}>
          <Text style={styles.greeting}>
            {greeting}, {userName}!
          </Text>
          <View style={styles.addressRow}>
            <Text style={styles.address} numberOfLines={1}>
              {deliveryLocation || 'Set delivery location'}
            </Text>
            <ChevronDown size={14} color={colors.textSecondary} />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

// ──────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.white,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  locationText: {
    flex: 1,
  },
  greeting: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginRight: 2,
    maxWidth: '85%',
  },
});

export default DeliveryHeader;

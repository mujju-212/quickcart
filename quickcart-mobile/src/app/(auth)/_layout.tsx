import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@theme/colors';

// ──────────────────────────────────────────
//  Auth Group Layout
//  Stack navigator for login / otp / profile
//  No header, gesture-to-go-back enabled
// ──────────────────────────────────────────

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="complete-profile" />
    </Stack>
  );
}

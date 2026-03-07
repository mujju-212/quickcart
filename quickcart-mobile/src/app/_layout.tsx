import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@theme/colors';
import { useAuthStore } from '@stores/authStore';
import { hydrateStorage } from '@utils/storage';

// ──────────────────────────────────────────
//  Keep splash visible until ready
// ──────────────────────────────────────────

SplashScreen.preventAutoHideAsync();

// ──────────────────────────────────────────
//  React Query client
// ──────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// ──────────────────────────────────────────
//  Auth guard — redirects based on auth state
//  Only navigates when `ready` is true (Stack mounted)
// ──────────────────────────────────────────

function useProtectedRoute(ready: boolean) {
  const router = useRouter();
  const segments = useSegments();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasOnboarded = useAuthStore((s) => s.hasOnboarded);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (!ready || isLoading) return; // Wait until navigator + auth are ready

    const inAuthGroup = segments[0] === '(auth)';
    const currentSegment = segments.join('/');

    if (!hasOnboarded) {
      if (currentSegment !== '(auth)/onboarding') {
        router.replace('/(auth)/onboarding');
      }
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [ready, isAuthenticated, hasOnboarded, isLoading, segments, router]);
}

// ──────────────────────────────────────────
//  Root Layout
// ──────────────────────────────────────────

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [appReady, setAppReady] = useState(false);

  // Load custom fonts from @expo-google-fonts packages
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
    'Inter-Medium': require('@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf'),
    'Inter-SemiBold': require('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
    'Inter-Bold': require('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf'),
    'PlusJakartaSans-Regular': require('@expo-google-fonts/plus-jakarta-sans/400Regular/PlusJakartaSans_400Regular.ttf'),
    'PlusJakartaSans-Medium': require('@expo-google-fonts/plus-jakarta-sans/500Medium/PlusJakartaSans_500Medium.ttf'),
    'PlusJakartaSans-SemiBold': require('@expo-google-fonts/plus-jakarta-sans/600SemiBold/PlusJakartaSans_600SemiBold.ttf'),
    'PlusJakartaSans-Bold': require('@expo-google-fonts/plus-jakarta-sans/700Bold/PlusJakartaSans_700Bold.ttf'),
  });

  // Hydrate storage + auth from AsyncStorage on mount
  useEffect(() => {
    hydrateStorage().then(() => hydrate());
  }, [hydrate]);

  // Track when fonts + auth hydration are done
  const fontsReady = fontsLoaded || !!fontError;
  const allReady = fontsReady && !isLoading;

  // Hide splash when ready
  useEffect(() => {
    if (allReady) {
      SplashScreen.hideAsync();
      // Small delay so the Stack has time to mount before navigation
      const t = setTimeout(() => setAppReady(true), 50);
      return () => clearTimeout(t);
    }
  }, [allReady]);

  // Auth guard — only fires once appReady (Stack mounted + loaded)
  useProtectedRoute(appReady);

  // ──────────────────────────────────────────
  //  ALWAYS render the <Stack> so the navigator
  //  mounts. Show a loading overlay when not ready.
  // ──────────────────────────────────────────

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />

          {/* Loading overlay — sits on top of the Stack */}
          {!allReady && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}

          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'slide_from_right',
            }}
          >
            {/* Group routes */}
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />

            {/* Modal-like screens */}
            <Stack.Screen
              name="product/[id]"
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen name="category/[id]" />

            {/* Checkout flow */}
            <Stack.Screen name="checkout/address-select" />
            <Stack.Screen name="checkout/payment" />
            <Stack.Screen
              name="checkout/confirmation"
              options={{
                animation: 'fade',
                gestureEnabled: false,
              }}
            />

            {/* Orders */}
            <Stack.Screen name="orders/index" />
            <Stack.Screen name="orders/[id]" />

            {/* Other screens */}
            <Stack.Screen name="wishlist" />
            <Stack.Screen name="addresses" />
            <Stack.Screen name="offers" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="profile-edit" />
            <Stack.Screen name="help" />
            <Stack.Screen
              name="review/write"
              options={{ animation: 'slide_from_bottom' }}
            />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});

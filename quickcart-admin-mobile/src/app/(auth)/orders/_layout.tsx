// Orders Stack Layout

import { Stack } from 'expo-router';
import { colors } from '../../../theme/colors';

export default function OrdersLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary[700] },
        headerTintColor: colors.white,
        headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 18 },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Orders' }} />
      <Stack.Screen name="[id]" options={{ title: 'Order Details' }} />
    </Stack>
  );
}

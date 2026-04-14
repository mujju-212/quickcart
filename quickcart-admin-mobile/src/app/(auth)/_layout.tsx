// Authenticated Layout — Drawer navigator for admin sections

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Text, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/authStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

function CustomDrawerContent(props: any) {
  const { user, logout } = useAuthStore();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      {/* Admin profile header */}
      <View style={styles.profileSection}>
        <Avatar.Icon
          size={52}
          icon="shield-account"
          style={styles.avatar}
          color={colors.white}
        />
        <Text style={styles.adminName}>{user?.name || 'Admin'}</Text>
        <Text style={styles.adminRole}>Administrator</Text>
      </View>

      {/* Nav items */}
      <View style={styles.navSection}>
        <DrawerItemList {...props} />
      </View>

      {/* Logout */}
      <View style={styles.logoutSection}>
        <DrawerItem
          label="Logout"
          icon={({ size }: { size: number }) => (
            <MaterialCommunityIcons name="logout" size={size} color={colors.status.cancelled} />
          )}
          labelStyle={styles.logoutLabel}
          onPress={logout}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function AuthLayout() {
  return (
    <Drawer
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary[700] },
        headerTintColor: colors.white,
        headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 18 },
        drawerActiveTintColor: colors.primary[600],
        drawerInactiveTintColor: colors.text.secondary,
        drawerLabelStyle: { fontFamily: 'Inter_500Medium', marginLeft: -16 },
        drawerItemStyle: { borderRadius: borderRadius.md },
      }}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="orders"
        options={{
          title: 'Orders',
          headerShown: false,
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="package-variant-closed" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="products"
        options={{
          title: 'Products',
          headerShown: false,
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="shopping" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="categories"
        options={{
          title: 'Categories',
          headerShown: false,
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="shape" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="customers"
        options={{
          title: 'Customers',
          headerShown: false,
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="offers"
        options={{
          title: 'Offers',
          headerShown: false,
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="tag-multiple" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="banners"
        options={{
          title: 'Banners',
          headerShown: false,
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="image-multiple" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="reviews"
        options={{
          title: 'Reviews',
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="star-half-full" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="reports"
        options={{
          title: 'Reports',
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="chart-box" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  profileSection: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.primary[700],
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.primary[500],
    marginBottom: spacing.sm,
  },
  adminName: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: colors.white,
  },
  adminRole: {
    ...typography.small,
    color: colors.primary[200],
    marginTop: 2,
  },
  navSection: {
    flex: 1,
    paddingTop: spacing.sm,
  },
  logoutSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    paddingVertical: spacing.xs,
  },
  logoutLabel: {
    fontFamily: 'Inter_500Medium',
    color: colors.status.cancelled,
    marginLeft: -16,
  },
});

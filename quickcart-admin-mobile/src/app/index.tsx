// Index — Redirect to login or dashboard based on auth state

import { Redirect } from 'expo-router';
import { useAuthStore } from '../stores/authStore';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return <Redirect href={isAuthenticated ? '/(auth)/dashboard' : '/login'} />;
}

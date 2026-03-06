import React, { useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@theme/colors';

// ──────────────────────────────────────────
//  Types
// ──────────────────────────────────────────

interface PullToRefreshProps {
  refreshing: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  showsVerticalScrollIndicator?: boolean;
}

// ──────────────────────────────────────────
//  Component
// ──────────────────────────────────────────

export function PullToRefresh({
  refreshing,
  onRefresh,
  children,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
}: PullToRefreshProps) {
  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary, colors.primaryDark]}
          progressBackgroundColor={colors.white}
        />
      }
    >
      {children}
    </ScrollView>
  );
}

// ──────────────────────────────────────────
//  Hook helper
// ──────────────────────────────────────────

export function useRefresh(refetchFn: () => Promise<any>) {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchFn();
    } finally {
      setRefreshing(false);
    }
  }, [refetchFn]);

  return { refreshing, onRefresh };
}

// ──────────────────────────────────────────
//  Styles
// ──────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PullToRefresh;

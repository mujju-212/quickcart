import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from 'react-native';
import AnimatedRN, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react-native';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';
import { spacing, borderRadius } from '@theme/spacing';
import { ProductGrid } from '@components/product';
import { EmptyState } from '@components/common';
import { useSearchProducts } from '@hooks/useProducts';
import { useDebounce } from '@hooks/useDebounce';
import { storage } from '@utils/storage';
import { STORAGE_KEYS, SEARCH_PLACEHOLDERS } from '@utils/constants';

const MAX_RECENT = 8;

// ──────────────────────────────────────────
//  Search Tab Screen
// ──────────────────────────────────────────

export default function SearchScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  const placeholderIdx = useRef(Math.floor(Math.random() * SEARCH_PLACEHOLDERS.length));

  // Load recent searches
  useEffect(() => {
    const recent = storage.getString(STORAGE_KEYS.RECENT_SEARCHES);
    if (recent) {
      try {
        setRecentSearches(JSON.parse(recent));
      } catch {}
    }
    // Auto-focus input
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  // Search products
  const {
    data: searchResults,
    isLoading,
    isFetching,
  } = useSearchProducts(debouncedQuery);

  useEffect(() => {
    if (debouncedQuery.length >= 2) setHasSearched(true);
  }, [debouncedQuery]);

  // Save to recent
  const saveRecentSearch = useCallback(
    (term: string) => {
      const cleaned = term.trim();
      if (!cleaned) return;
      const updated = [cleaned, ...recentSearches.filter((r) => r !== cleaned)].slice(
        0,
        MAX_RECENT
      );
      setRecentSearches(updated);
      storage.set(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
    },
    [recentSearches]
  );

  const clearRecent = useCallback(() => {
    setRecentSearches([]);
    storage.delete(STORAGE_KEYS.RECENT_SEARCHES);
  }, []);

  const handleSubmit = useCallback(() => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
      Keyboard.dismiss();
    }
  }, [query, saveRecentSearch]);

  const handleRecentPress = useCallback(
    (term: string) => {
      setQuery(term);
      setHasSearched(true);
      saveRecentSearch(term);
    },
    [saveRecentSearch]
  );

  const products = searchResults || [];
  const showResults = debouncedQuery.length >= 2;
  const showIdleState = !showResults && !hasSearched;

  // ── Trending (static for now) ──
  const trending = ['Smartphones', 'Headphones', 'Running Shoes', 'T-Shirts', 'Watches', 'Backpacks'];

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrap}>
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={SEARCH_PLACEHOLDERS[placeholderIdx.current]}
            placeholderTextColor={colors.textTertiary}
            returnKeyType="search"
            onSubmitEditing={handleSubmit}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setHasSearched(false); }}>
              <X size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {showResults ? (
        /* Search Results */
        <ProductGrid
          products={products}
          loading={isLoading || isFetching}
          emptyPreset="search"
        />
      ) : showIdleState ? (
        /* Idle: Recent + Trending */
        <FlatList
          data={[]}
          renderItem={() => null}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.idleContent}
          ListHeaderComponent={
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <AnimatedRN.View entering={FadeIn.duration(300)} style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    <TouchableOpacity onPress={clearRecent}>
                      <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                  </View>
                  {recentSearches.map((term, i) => (
                    <TouchableOpacity
                      key={`${term}-${i}`}
                      style={styles.recentItem}
                      onPress={() => handleRecentPress(term)}
                    >
                      <Clock size={16} color={colors.textTertiary} />
                      <Text style={styles.recentText} numberOfLines={1}>
                        {term}
                      </Text>
                      <ArrowRight size={14} color={colors.textTertiary} />
                    </TouchableOpacity>
                  ))}
                </AnimatedRN.View>
              )}

              {/* Trending */}
              <AnimatedRN.View entering={FadeInUp.delay(100).springify()} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <TrendingUp size={18} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Trending</Text>
                </View>
                <View style={styles.trendingWrap}>
                  {trending.map((term, i) => (
                    <TouchableOpacity
                      key={term}
                      style={styles.trendingChip}
                      onPress={() => handleRecentPress(term)}
                    >
                      <Text style={styles.trendingText}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </AnimatedRN.View>
            </>
          }
        />
      ) : (
        /* No results after search */
        !isLoading &&
        products.length === 0 && (
          <EmptyState
            preset="search"
            title="No results"
            message={`We couldn't find anything for "${debouncedQuery}"`}
          />
        )
      )}
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    height: 42,
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  cancelBtn: {
    paddingVertical: 6,
  },
  cancelText: {
    ...typography.labelMedium,
    color: colors.primary,
    fontWeight: '600',
  },
  idleContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: 6,
  },
  sectionTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    fontWeight: '700',
    flex: 1,
  },
  clearText: {
    ...typography.labelSmall,
    color: colors.error,
    fontWeight: '600',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  recentText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    flex: 1,
  },
  trendingWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  trendingChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trendingText: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});

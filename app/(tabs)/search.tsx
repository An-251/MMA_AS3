/*
 * PURPOSE: Search screen — user types a query, results appear after debounce.
 * Uses useDebounce to avoid firing API on every keystroke.
 * Falls back to showing trending when query is empty.
 */

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { MovieCard } from "../../components/MovieCard";
import { SearchBar } from "../../components/SearchBar";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import useDebounce from "../../hooks/useDebounce";
import useMovies from "../../hooks/useMovies";
import type { Movie } from "../../types/movie";

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 500);

  const { movies, isLoading, error, refresh } = useMovies(debouncedQuery);

  const handlePress = (movie: Movie) => {
    router.push(`/movie/${movie.id}`);
  };

  const isSearching = debouncedQuery.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      {/* Search Input */}
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search movies & shows..."
        autoFocus={false}
      />

      {/* Results label */}
      {isSearching && !isLoading && (
        <Text style={styles.resultsLabel}>
          {movies.length} result{movies.length !== 1 ? "s" : ""} for "{debouncedQuery}"
        </Text>
      )}

      {/* States */}
      {isLoading ? (
        <LoadingSpinner message={isSearching ? "Searching..." : "Loading trending..."} />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refresh} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => `search-${item.id}-${item.media_type}`}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MovieCard movie={item} onPress={handlePress} width={160} />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>
                {isSearching
                  ? `No results for "${debouncedQuery}"`
                  : "Start typing to search..."}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.extrabold,
    color: COLORS.textPrimary,
  },
  resultsLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.sm,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    paddingTop: SPACING.xxxl,
    gap: SPACING.md,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.size.md,
    textAlign: "center",
  },
});

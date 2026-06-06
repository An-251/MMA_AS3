/*
 * PURPOSE: Home screen — displays trending movies & TV shows (day).
 * Fetches via useMovies() with no query (trending mode).
 * Opens detail screen on card press.
 */

import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { MovieCard } from "../../components/MovieCard";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import useMovies from "../../hooks/useMovies";
import type { Movie } from "../../types/movie";

const NUM_COLUMNS = 2;
const CARD_PADDING = SPACING.lg * 2 + SPACING.md; // left + right margin + gap
const CARD_WIDTH_RATIO = (1 - (CARD_PADDING / 390)) / NUM_COLUMNS; // approx 390 screen width

export default function HomeScreen() {
  const router = useRouter();
  const { movies, isLoading, error, refresh } = useMovies();

  const handlePress = (movie: Movie) => {
    router.push(`/movie/${movie.id}`);
  };

  if (isLoading && movies.length === 0) {
    return <LoadingSpinner message="Loading trending..." />;
  }

  if (error && movies.length === 0) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎬 MovieApp</Text>
        <Text style={styles.headerSubtitle}>Trending Today</Text>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item) => `${item.id}-${item.media_type}`}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        renderItem={({ item, index }) => (
          <MovieCard
            movie={item}
            onPress={handlePress}
            width={160}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No trending content found.</Text>
          </View>
        }
      />
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
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.extrabold,
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
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
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.size.md,
  },
});

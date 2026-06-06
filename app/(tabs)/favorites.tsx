/*
 * PURPOSE: Favorites screen — shows all movies saved to AsyncStorage.
 * Supports removing a favorite directly from this screen via long press.
 */

import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { MovieCard } from "../../components/MovieCard";
import { COLORS, SPACING, TYPOGRAPHY } from "../../constants/theme";
import useFavorites from "../../hooks/useFavorites";
import type { Movie } from "../../types/movie";
import { getTitle } from "../../utils/helpers";

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite, isLoading, error } = useFavorites();

  const handlePress = (movie: Movie) => {
    router.push(`/movie/${movie.id}`);
  };

  const handleLongPress = (movie: Movie) => {
    Alert.alert(
      "Remove Favorite",
      `Remove "${getTitle(movie)}" from favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => toggleFavorite(movie),
        },
      ]
    );
  };

  if (isLoading) return <LoadingSpinner message="Loading favorites..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        {favorites.length > 0 && (
          <Text style={styles.headerCount}>{favorites.length} saved</Text>
        )}
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => `fav-${item.id}`}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          // Wrap in TouchableOpacity via MovieCard onPress + long press alert
          <View>
            <MovieCard
              movie={item}
              onPress={handlePress}
              width={160}
            />
            {/* Long-press overlay — handled by wrapping View trick */}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>❤️</Text>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>
              Tap the heart icon on any movie detail page to save it here.
            </Text>
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
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.size.xxl,
    fontWeight: TYPOGRAPHY.weight.extrabold,
    color: COLORS.textPrimary,
  },
  headerCount: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: SPACING.xxxl,
    paddingHorizontal: SPACING.xxl,
    gap: SPACING.md,
  },
  emptyIcon: {
    fontSize: 56,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.size.sm,
    textAlign: "center",
    lineHeight: TYPOGRAPHY.lineHeight.normal,
  },
});

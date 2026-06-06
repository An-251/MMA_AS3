/*
 * PURPOSE: Reusable card component for displaying a movie/show in a grid or list.
 * Shows: poster image, title, release year, rating badge.
 * Accepts onPress to navigate to the detail screen.
 *
 * Used by: app/(tabs)/index.tsx, app/(tabs)/search.tsx, app/(tabs)/favorites.tsx
 */

import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../constants/theme";
import type { Movie } from "../types/movie";
import { buildImageUrl } from "../services/api";
import { formatRating, getReleaseYear, getTitle } from "../utils/helpers";

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  width?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPress,
  width = 150,
}) => {
  const posterUrl = buildImageUrl(movie.poster_path, "w342");
  const title = getTitle(movie);
  const year = getReleaseYear(movie);
  const rating = formatRating(movie.vote_average);

  return (
    <TouchableOpacity
      style={[styles.container, { width }]}
      onPress={() => onPress(movie)}
      activeOpacity={0.75}
    >
      {/* Poster */}
      <View style={styles.posterWrapper}>
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl }}
            style={styles.poster}
            contentFit="cover"
            transition={300}
            placeholder={{ color: COLORS.shimmer }}
          />
        ) : (
          <View style={styles.posterFallback}>
            <Text style={styles.posterFallbackText}>No Image</Text>
          </View>
        )}

        {/* Rating badge */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingStar}>★</Text>
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.year}>{year}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  posterWrapper: {
    borderRadius: RADIUS.md,
    overflow: "hidden",
    aspectRatio: 2 / 3,
    backgroundColor: COLORS.shimmer,
    ...SHADOWS.md,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  posterFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.backgroundCard,
  },
  posterFallbackText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.size.xs,
  },
  ratingBadge: {
    position: "absolute",
    top: SPACING.xs,
    right: SPACING.xs,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    gap: 2,
  },
  ratingStar: {
    color: COLORS.star,
    fontSize: TYPOGRAPHY.size.xs,
  },
  ratingText: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  info: {
    marginTop: SPACING.sm,
    paddingHorizontal: 2,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    lineHeight: TYPOGRAPHY.lineHeight.tight,
    marginBottom: 2,
  },
  year: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.xs,
  },
});

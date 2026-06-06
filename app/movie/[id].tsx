/*
 * PURPOSE: Movie detail screen — full info for a single movie.
 * Fetches: movie detail + trailer video + reviews (parallel via useMovieDetail).
 * Features: backdrop image, genres, rating, runtime, overview,
 *           trailer link, reviews list, favorite toggle button.
 *
 * Route: /movie/[id]
 */

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  COLORS,
  RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from "../../constants/theme";
import useFavorites from "../../hooks/useFavorites";
import useMovieDetail from "../../hooks/useMovieDetail";
import { buildImageUrl } from "../../services/api";
import type { Review } from "../../types/movie";
import {
  formatCurrency,
  formatDate,
  formatRating,
  formatRuntime,
  truncate,
} from "../../utils/helpers";

export default function MovieDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);

  const { movie, trailer, reviews, isLoading, error } =
    useMovieDetail(movieId);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFavoriteToggle = () => {
    if (!movie) return;
    // Cast MovieDetail → Movie (MovieDetail extends Movie)
    toggleFavorite(movie);
  };

  const handleWatchTrailer = async () => {
    if (!trailer) return;
    const url = `https://www.youtube.com/watch?v=${trailer.key}`;
    await WebBrowser.openBrowserAsync(url);
  };

  if (isLoading) return <LoadingSpinner message="Loading movie..." />;
  if (error || !movie) {
    return (
      <ErrorMessage
        message={error ?? "Movie not found."}
        onRetry={() => router.back()}
      />
    );
  }

  const backdropUrl = buildImageUrl(movie.backdrop_path, "w780");
  const posterUrl = buildImageUrl(movie.poster_path, "w342");
  const rating = formatRating(movie.vote_average);
  const favorited = isFavorite(movie.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* ── Backdrop + Back + Favorite ─────────────────────── */}
        <View style={styles.backdropContainer}>
          {backdropUrl ? (
            <Image
              source={{ uri: backdropUrl }}
              style={styles.backdrop}
              contentFit="cover"
              transition={400}
            />
          ) : (
            <View style={[styles.backdrop, styles.backdropFallback]} />
          )}

          {/* Dark gradient overlay */}
          <View style={styles.backdropOverlay} />

          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* Favorite button */}
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={handleFavoriteToggle}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={favorited ? "heart" : "heart-outline"}
              size={24}
              color={favorited ? COLORS.primary : COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* ── Movie Info Card ─────────────────────────────────── */}
        <View style={styles.infoCard}>
          {/* Poster + Meta side-by-side */}
          <View style={styles.topRow}>
            <View style={styles.posterWrapper}>
              {posterUrl ? (
                <Image
                  source={{ uri: posterUrl }}
                  style={styles.poster}
                  contentFit="cover"
                  transition={300}
                />
              ) : (
                <View style={[styles.poster, styles.posterFallback]} />
              )}
            </View>

            <View style={styles.meta}>
              <Text style={styles.title}>{movie.title}</Text>

              {/* Rating row */}
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={COLORS.star} />
                <Text style={styles.ratingText}>{rating}</Text>
                <Text style={styles.voteCount}>
                  ({movie.vote_count.toLocaleString()} votes)
                </Text>
              </View>

              {/* Genres */}
              <View style={styles.genreRow}>
                {movie.genres.slice(0, 3).map((g) => (
                  <View key={g.id} style={styles.genreBadge}>
                    <Text style={styles.genreText}>{g.name}</Text>
                  </View>
                ))}
              </View>

              {/* Stats */}
              <Text style={styles.metaItem}>
                🕐 {formatRuntime(movie.runtime)}
              </Text>
              <Text style={styles.metaItem}>
                📅 {formatDate(movie.release_date)}
              </Text>
              <Text style={styles.metaItem}>
                💰 {formatCurrency(movie.budget)}
              </Text>
            </View>
          </View>

          {/* Tagline */}
          {!!movie.tagline && (
            <Text style={styles.tagline}>"{movie.tagline}"</Text>
          )}

          {/* Overview */}
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{movie.overview}</Text>

          {/* Trailer Button */}
          {trailer && (
            <>
              <Text style={styles.sectionTitle}>Trailer</Text>
              <TouchableOpacity
                style={styles.trailerBtn}
                onPress={handleWatchTrailer}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="play-circle"
                  size={20}
                  color={COLORS.textOnPrimary}
                />
                <Text style={styles.trailerBtnText}>
                  Watch: {truncate(trailer.name, 40)}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>
                Reviews ({reviews.length})
              </Text>
              {reviews.slice(0, 5).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── ReviewCard sub-component ─────────────────────────────────────────────────

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <Text style={styles.reviewAuthor}>{review.author}</Text>
      {review.author_details.rating !== null && (
        <View style={styles.reviewRating}>
          <Ionicons name="star" size={12} color={COLORS.star} />
          <Text style={styles.reviewRatingText}>
            {review.author_details.rating}
          </Text>
        </View>
      )}
    </View>
    <Text style={styles.reviewDate}>{formatDate(review.created_at)}</Text>
    <Text style={styles.reviewContent}>{truncate(review.content, 300)}</Text>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },

  // Backdrop
  backdropContainer: {
    height: 220,
    position: "relative",
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  backdropFallback: {
    backgroundColor: COLORS.backgroundCard,
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  backBtn: {
    position: "absolute",
    top: SPACING.lg,
    left: SPACING.lg,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: RADIUS.full,
    padding: SPACING.sm,
  },
  favoriteBtn: {
    position: "absolute",
    top: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: RADIUS.full,
    padding: SPACING.sm,
  },

  // Info card
  infoCard: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: -RADIUS.xl,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  topRow: {
    flexDirection: "row",
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  posterWrapper: {
    ...SHADOWS.md,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    width: 110,
    aspectRatio: 2 / 3,
    flexShrink: 0,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  posterFallback: {
    backgroundColor: COLORS.shimmer,
  },
  meta: {
    flex: 1,
    gap: SPACING.sm,
    paddingTop: SPACING.xs,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    lineHeight: TYPOGRAPHY.lineHeight.tight,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    color: COLORS.star,
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  voteCount: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.size.xs,
  },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },
  genreBadge: {
    backgroundColor: COLORS.primary + "22",
    borderColor: COLORS.primary + "55",
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  genreText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  metaItem: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.sm,
  },

  // Tagline
  tagline: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.size.sm,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: SPACING.lg,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
  },

  // Overview
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  overview: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.md,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed,
  },

  // Trailer button
  trailerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  trailerBtnText: {
    color: COLORS.textOnPrimary,
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },

  // Reviews
  reviewCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  reviewAuthor: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  reviewRatingText: {
    color: COLORS.star,
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  reviewDate: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.size.xs,
    marginBottom: SPACING.sm,
  },
  reviewContent: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.size.sm,
    lineHeight: TYPOGRAPHY.lineHeight.normal,
  },
});

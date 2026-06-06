/*
 * PURPOSE: Fetch full movie detail + videos + reviews for the detail screen.
 * Runs 3 parallel API calls via Promise.all for performance.
 *
 * Used by: app/movie/[id].tsx
 */

import { useEffect, useState } from "react";
import {
  fetchMovieDetail,
  fetchMovieReviews,
  fetchMovieVideos,
} from "../services/api";
import type { MovieDetail, Review, Video } from "../types/movie";

interface UseMovieDetailResult {
  movie: MovieDetail | null;
  trailer: Video | null;
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

const useMovieDetail = (movieId: number): UseMovieDetailResult => {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Parallel fetch for speed
        const [detail, videoData, reviewData] = await Promise.all([
          fetchMovieDetail(movieId),
          fetchMovieVideos(movieId),
          fetchMovieReviews(movieId),
        ]);

        setMovie(detail);

        // Pick official YouTube trailer first, fallback to first video
        const officialTrailer = videoData.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube" && v.official
        );
        const anyTrailer =
          officialTrailer ??
          videoData.results.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          ) ??
          videoData.results[0] ??
          null;

        setTrailer(anyTrailer);
        setReviews(reviewData.results);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load movie details.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [movieId]);

  return { movie, trailer, reviews, isLoading, error };
};

export default useMovieDetail;

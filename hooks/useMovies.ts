/*
 * PURPOSE: Business logic for fetching movies.
 * Handles two modes:
 *   1. Trending — called with no query (Home screen)
 *   2. Search   — called with a query string (Search screen)
 *
 * Exposes: { movies, isLoading, error, refresh }
 *
 * Used by: app/(tabs)/index.tsx, app/(tabs)/search.tsx
 */

import { useCallback, useEffect, useState } from "react";
import { fetchTrending, searchMovies } from "../services/api";
import type { Movie } from "../types/movie";

interface UseMoviesResult {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * @param query - If provided, performs a search. If empty, fetches trending.
 */
const useMovies = (query: string = ""): UseMoviesResult => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = useCallback(async () => {
    // Don't fetch if search query is too short
    if (query.trim().length === 1) return;

    setIsLoading(true);
    setError(null);

    try {
      if (query.trim().length === 0) {
        // Mode 1: Trending
        const data = await fetchTrending("day");
        // Filter out "person" media type — only movies & TV
        const filtered = data.results.filter(
          (item) => item.media_type !== "person"
        );
        setMovies(filtered);
      } else {
        // Mode 2: Search
        const data = await searchMovies(query.trim());
        setMovies(data.results);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load movies.";
      setError(message);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  return { movies, isLoading, error, refresh: loadMovies };
};

export default useMovies;

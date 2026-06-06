/*
 * PURPOSE: Manage favorite movies with AsyncStorage persistence.
 * Data survives app restarts.
 *
 * Exposes:
 *   favorites    - list of saved Movie objects
 *   isFavorite   - check if a movie is saved
 *   toggleFavorite - add if not saved, remove if saved
 *   isLoading    - true while reading from storage
 *   error        - non-null if storage fails
 *
 * Used by: app/(tabs)/favorites.tsx, app/movie/[id].tsx
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import type { Movie } from "../types/movie";

const STORAGE_KEY = "asm3_favorites";

interface UseFavoritesResult {
  favorites: Movie[];
  isFavorite: (movieId: number) => boolean;
  toggleFavorite: (movie: Movie) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const useFavorites = (): UseFavoritesResult => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load from AsyncStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: Movie[] = JSON.parse(raw);
          setFavorites(parsed);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load favorites.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Persist updated list to AsyncStorage
  const persist = async (updated: Movie[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Check if a movie is in favorites
  const isFavorite = useCallback(
    (movieId: number): boolean => {
      return favorites.some((m) => m.id === movieId);
    },
    [favorites]
  );

  // Add or remove from favorites
  const toggleFavorite = useCallback(
    async (movie: Movie): Promise<void> => {
      setError(null);
      try {
        let updated: Movie[];
        if (isFavorite(movie.id)) {
          // Remove
          updated = favorites.filter((m) => m.id !== movie.id);
        } else {
          // Add — prepend so newest appears first
          updated = [movie, ...favorites];
        }
        setFavorites(updated);
        await persist(updated);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to update favorites.";
        setError(message);
      }
    },
    [favorites, isFavorite]
  );

  return { favorites, isFavorite, toggleFavorite, isLoading, error };
};

export default useFavorites;

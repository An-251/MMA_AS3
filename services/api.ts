/*
 * PURPOSE: Axios instance configured for TMDB API.
 * - baseURL from EXPO_PUBLIC_TMDB_BASE_URL
 * - API key auto-injected via request interceptor
 * - All TMDB endpoint functions exported from here
 *
 * Endpoints used:
 *   GET /trending/all/{time_window}
 *   GET /search/movie
 *   GET /movie/{movie_id}
 *   GET /movie/{movie_id}/videos
 *   GET /movie/{movie_id}/reviews
 */

import axios from "axios";
import type {
  Movie,
  MovieDetail,
  ReviewResponse,
  TmdbListResponse,
  VideoResponse,
} from "../types/movie";

// ─── Env vars ─────────────────────────────────────────────────────────────────

const BASE_URL = process.env.EXPO_PUBLIC_TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
const API_KEY  = process.env.EXPO_PUBLIC_TMDB_API_KEY  ?? "";
const IMAGE_BASE_URL = process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE_URL ?? "https://image.tmdb.org/t/p";

// ─── Axios Instance ───────────────────────────────────────────────────────────

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Inject API key into every request as query param
tmdbApi.interceptors.request.use((config) => {
  config.params = {
    api_key: API_KEY,
    language: "en-US",
    ...config.params,
  };
  return config;
});

// ─── Image URL Helper ─────────────────────────────────────────────────────────

/**
 * Build a full TMDB image URL from a path and size.
 * @param path   - e.g. "/abc123.jpg" from API response
 * @param size   - e.g. "w342", "w500", "original"
 */
export const buildImageUrl = (
  path: string | null,
  size: string = "w342"
): string | null => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// ─── Endpoint Functions ───────────────────────────────────────────────────────

/**
 * GET /trending/all/{time_window}
 */
export const fetchTrending = async (
  timeWindow: "day" | "week" = "day"
): Promise<TmdbListResponse<Movie>> => {
  const response = await tmdbApi.get<TmdbListResponse<Movie>>(
    `/trending/all/${timeWindow}`
  );
  return response.data;
};

/**
 * GET /search/movie
 */
export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<TmdbListResponse<Movie>> => {
  const response = await tmdbApi.get<TmdbListResponse<Movie>>("/search/movie", {
    params: { query, page, include_adult: false },
  });
  return response.data;
};

/**
 * GET /movie/{movie_id}
 */
export const fetchMovieDetail = async (
  movieId: number
): Promise<MovieDetail> => {
  const response = await tmdbApi.get<MovieDetail>(`/movie/${movieId}`);
  return response.data;
};

/**
 * GET /movie/{movie_id}/videos
 */
export const fetchMovieVideos = async (
  movieId: number
): Promise<VideoResponse> => {
  const response = await tmdbApi.get<VideoResponse>(`/movie/${movieId}/videos`);
  return response.data;
};

/**
 * GET /movie/{movie_id}/reviews
 */
export const fetchMovieReviews = async (
  movieId: number,
  page: number = 1
): Promise<ReviewResponse> => {
  const response = await tmdbApi.get<ReviewResponse>(
    `/movie/${movieId}/reviews`,
    { params: { page } }
  );
  return response.data;
};

export default tmdbApi;

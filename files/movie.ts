/*
 * PURPOSE: Shared TypeScript types/interfaces for the entire app.
 * Used by: services, hooks, components, screens.
 */

export interface Movie {
  id: number;
  title: string;
  name?: string;               // TV shows use `name` instead of `title`
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  first_air_date?: string;     // TV shows
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  media_type?: "movie" | "tv" | "person";
  popularity: number;
}

export interface MovieDetail extends Movie {
  genres: Genre[];
  runtime: number | null;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;  // "YouTube" | "Vimeo"
  type: string;  // "Trailer" | "Teaser" | "Clip" etc.
  official: boolean;
}

export interface VideoResponse {
  id: number;
  results: Video[];
}

export interface TmdbListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Review {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  url: string;
}

export interface ReviewResponse {
  id: number;
  page: number;
  results: Review[];
  total_pages: number;
  total_results: number;
}

/*
 * PURPOSE: Pure utility/helper functions shared across the app.
 * No side effects, no imports from services or hooks.
 */

/**
 * Extract display title from a Movie object.
 * Movies use `title`, TV shows use `name`.
 */
export const getTitle = (item: { title?: string; name?: string }): string => {
  return item.title ?? item.name ?? "Untitled";
};

/**
 * Extract release year from a Movie object.
 * Movies use `release_date`, TV shows use `first_air_date`.
 */
export const getReleaseYear = (item: {
  release_date?: string;
  first_air_date?: string;
}): string => {
  const date = item.release_date ?? item.first_air_date ?? "";
  return date ? date.substring(0, 4) : "N/A";
};

/**
 * Format a vote_average (0–10) to one decimal place string.
 * e.g. 7.456 → "7.5"
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

/**
 * Truncate a string to maxLength, adding "..." if truncated.
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + "...";
};

/**
 * Format a date string to "Month DD, YYYY".
 * e.g. "2023-07-15" → "Jul 15, 2023"
 */
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Format runtime minutes to "Xh Ym".
 * e.g. 137 → "2h 17m"
 */
export const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

/**
 * Format a large number with commas.
 * e.g. 1500000 → "$1,500,000"
 */
export const formatCurrency = (amount: number): string => {
  if (!amount || amount === 0) return "N/A";
  return "$" + amount.toLocaleString("en-US");
};

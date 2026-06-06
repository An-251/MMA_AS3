/*
 * PURPOSE: Central design system — colors, spacing, typography.
 * All components and screens must reference these constants.
 * NO hardcoded style values anywhere else in the project.
 */

export const COLORS = {
  // Brand
  primary: "#E50914",         // Netflix-style red
  primaryDark: "#B20710",
  primaryLight: "#FF3D47",

  // Backgrounds
  background: "#0D0D0D",
  backgroundCard: "#1A1A1A",
  backgroundInput: "#1E1E1E",
  backgroundModal: "#242424",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#A0A0A0",
  textMuted: "#606060",
  textOnPrimary: "#FFFFFF",

  // UI Elements
  border: "#2A2A2A",
  divider: "#2A2A2A",
  overlay: "rgba(0,0,0,0.6)",
  star: "#F5C518",            // IMDb yellow for ratings
  success: "#46D369",
  warning: "#F5A623",
  danger: "#E50914",

  // Tab bar
  tabActive: "#E50914",
  tabInactive: "#606060",
  tabBackground: "#111111",

  // Skeleton / placeholder
  shimmer: "#2A2A2A",
  shimmerHighlight: "#3A3A3A",

  transparent: "transparent",
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const TYPOGRAPHY = {
  // Font sizes
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  // Font weights (React Native accepts these as string literals)
  weight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },
  // Line heights
  lineHeight: {
    tight: 18,
    normal: 22,
    relaxed: 26,
    loose: 32,
  },
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
} as const;

// TMDB image sizes
export const IMAGE_SIZES = {
  poster: {
    sm: "w185",
    md: "w342",
    lg: "w500",
    original: "original",
  },
  backdrop: {
    sm: "w300",
    md: "w780",
    lg: "w1280",
    original: "original",
  },
} as const;

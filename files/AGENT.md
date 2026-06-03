# AGENT.md — Asm3_SE182260_MovieApp

## Project Overview
Movie browsing app built with **Expo SDK 54** + **Expo Router v6** + **TypeScript**.
Data source: [TMDB API](https://www.themoviedb.org/documentation/api).

---

## Coding Standards

### Language & Tooling
- **TypeScript strict mode** — no `any` unless absolutely necessary; prefer `unknown`.
- **Functional components only** — no class components.
- **Named exports** for components; **default exports** for screens (Expo Router requires it).
- Arrow functions for component definitions.

### Folder Structure (FLAT — no `src/`)
```
Asm3_SE182260_MovieApp/
├── app/                  # Expo Router screens & layouts (file-based routing)
│   ├── (tabs)/           # Bottom tab group
│   │   ├── _layout.tsx
│   │   ├── index.tsx     # Home / Trending
│   │   ├── search.tsx
│   │   └── favorites.tsx
│   ├── movie/
│   │   └── [id].tsx      # Movie detail dynamic route
│   └── _layout.tsx       # Root layout
├── components/           # Reusable UI components
├── constants/            # theme.ts, images.ts
├── hooks/                # Custom React hooks (business logic)
├── services/             # API layer (Axios instance + endpoint fns)
├── types/                # Shared TypeScript interfaces
└── utils/                # Pure helper functions
```

### Naming Conventions
| Item | Convention | Example |
|------|-----------|---------|
| Files | `camelCase.ts` | `useMovies.ts` |
| Components | `PascalCase.tsx` | `MovieCard.tsx` |
| Screens | `camelCase.tsx` | `index.tsx`, `search.tsx` |
| Interfaces | `PascalCase` | `Movie`, `MovieDetail` |
| Constants | `UPPER_SNAKE_CASE` | `COLORS`, `SPACING` |
| Hook return values | descriptive | `{ movies, isLoading, error }` |

### Styles
- **NO hardcoded style values** — always reference `constants/theme.ts`.
- Use `StyleSheet.create()` for all styles.
- One `StyleSheet` per file, named `styles`, at the bottom of the file.

### Error Handling
- All async functions must have `try/catch/finally`.
- Hooks expose an `error: string | null` state.
- Screens show a user-friendly error message when `error !== null`.

### Comments
- Every file starts with a `/* PURPOSE: ... */` block comment.
- Complex logic gets inline `//` comments.
- No commented-out dead code in commits.

### Environment Variables
- All TMDB config lives in `.env` with `EXPO_PUBLIC_` prefix.
- Access via `process.env.EXPO_PUBLIC_*` — never hardcode URLs or keys.

### Navigation
- Use `useRouter()` for programmatic navigation.
- Use `useLocalSearchParams()` to read dynamic route params.
- Pass only primitive params (IDs) via route; fetch full data in the destination screen.

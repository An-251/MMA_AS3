# Phase 1 Complete — Project Scaffolding

## Folder Structure Created
```
Asm3_SE182260_MovieApp/
├── AGENT.md              ✅ Coding standards & conventions
├── .env                  ✅ Environment variables template
├── .env.example          ✅ Safe-to-commit env template
├── app/
│   ├── (tabs)/           ✅ Tab group directory
│   └── movie/            ✅ Dynamic route directory
├── components/           ✅
├── constants/            ✅
├── hooks/                ✅
├── services/             ✅
├── types/
│   └── movie.ts          ✅ All shared TypeScript interfaces
└── utils/                ✅
```

## Terminal Commands to Run

### Step 1 — Install axios
```bash
npx expo install axios
```

### Step 2 — AsyncStorage (already in package.json — just reinstall if needed)
```bash
npx expo install @react-native-async-storage/async-storage
```

### Step 3 — Install all dependencies (run once after cloning)
```bash
npm install
```

## .env — Fill In Your API Key
Open `.env` and replace `your_tmdb_api_key_here` with your real TMDB API key:
```
EXPO_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
EXPO_PUBLIC_TMDB_API_KEY=<YOUR_KEY_HERE>
EXPO_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```
Get a free key at: https://www.themoviedb.org/settings/api

## Notes
- `axios` is NOT yet in the provided `package.json` → must install.
- `@react-native-async-storage/async-storage@2.2.0` IS already listed → just `npm install`.
- `@expo/vector-icons` is already available → will be used for tab icons in Phase 5.

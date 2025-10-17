### MovieRate AI Dev Quick Guide

Goal: React 18 + Vite SPA integrating TMDb (remote) + optional local json-server mock (`db.json`). Core domains: Auth (TMDb OAuth → session), Movies (search/discover/details/media), Favorites (remote + local count), UI routing/layout.

Core entry & layout
1. Mount in `src/main.jsx` → `<App />` (defines `<Routes/>`).
2. `layouts/SharedLayout.jsx` wraps routed pages and renders `Navbar` (auth-aware) + `<Outlet/>`.

Routing (React Router v6)
Top pages in `src/pages/`: `/` (trending via `trendingService.js`), `/movies` (search & discover w/ URL params `query`, `page`, filters), `/movie/:movieId` (details + nested `cast`, `reviews`), `/favorites` (auth), `/profile` (auth), `/login`, fallback `*`.
Pattern: keep search/pagination state in URL using `useSearchParams`; always update both `query` and `page` together to avoid stale results.

Auth & state
`contexts/AuthContext.jsx` uses `useReducer` with `AUTH_ACTIONS` for deterministic transitions. Session + user cached in `localStorage` (keys: `tmdb_session_id`, `tmdb_user_data`). On init it (a) restores session, (b) fetches account details if missing, (c) fetches favorites count (`favoritesService`). Use `useAuth()` hook for: `login(sessionId[,user])`, `logout()`, `updateUser(partial)`, derived flags `isAuthenticated`, `loading`, `error`.

Service layer (all Axios, base config in `config/axios.js` with TMDb bearer)
Return transformed objects, never raw Axios response. Examples:
`moviesService.searchMoviesService(query,page)` → `{ totalCount,totalPages,results,page }`
`authService.getFavoriteMovies(sessionId,page)` similar shape.
Error handling is caller responsibility: wrap in try/catch and surface `error.message`.

Favorites flow
UI button (`components/FavoriteButton.jsx`) calls add/remove via authService toggle endpoints; count persisted via `favoritesService` (updates after auth init/login). Ensure session + account id exist before POST; otherwise short-circuit with user feedback.

Async UI pattern
Local component state: `isLoading` + `error`. Skeleton: set loading true → await service → set data → catch set error → finally set loading false. Spinner: `<Oval />` from `react-loader-spinner`.

Filtering & discover
Movies discover (`discoverMoviesService`) builds TMDb params (e.g. `with_genres`, date range, vote average) + enforces `vote_count.gte = 10`. Log statements (console) already in place—retain or convert to debug flag if adding more.

Account-dependent endpoints
Require `sessionId` + `user.id`; always retrieve via `useAuth()` rather than reading storage directly. Guard unauthorized actions early in the component.

Pagination
Use `react-paginate`; keep current page in URL; on param change trigger fetch; clear results list (or show loading) to avoid flashing stale data.

Styling & components
CSS Modules per component (`ComponentName.module.css`). Import as `styles` and use descriptive class names. Avoid global leakage—do not add global CSS unless in `index.css`.

Common pitfalls (avoid)
1. Bypassing service layer (keep transformations consistent).
2. Mutating auth state outside reducer (use exposed methods only).
3. Forgetting to reset `page` to 1 when `query` or filters change.
4. Using favorites without ensuring session (add guard & optional redirect to `/login`).

Dev workflow
Run both: `npm run dev` (Vite) + `npm run db` (mock) when you need local JSON data latency simulation (350ms). Lint with `npm run lint` before commit. No tests currently—add lightweight service-level tests if extending logic substantially.

Extending guidelines
Add new remote calls inside `services/` returning plain JS objects. Reflect new auth-dependent data via context only after successful fetch. For new pages, add route in `App.jsx`, keep data-fetch side effects inside `useEffect` keyed by URL params.

Security & keys
Bearer token central; do not inline keys in components. For new authenticated endpoints pass `session_id` param as shown in `authService`.

Ask for clarification if adding: complex caching, code-splitting, or error boundaries (not yet implemented) to align with future direction.

Finish changes by validating build (`npm run build`) and lint.

```

```

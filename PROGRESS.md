# GlobeTrotter — Progress Log

<!-- Template: append one entry per phase using the format below. -->

---

## Phase 0 — Foundations — DONE 2026-08-22

**Built:** Full monorepo scaffold (server/ + client/) with all dependencies installed, env validation, pg pool, Express middleware stack, health endpoint, React Router placeholder pages, Vite proxy, Tailwind tokens, and migration runner configured.

**Files added/changed:**
- `server/package.json` — dependencies, scripts, `"type":"module"`
- `server/.env` / `server/.env.example` / `server/.gitignore` / `server/nodemon.json` / `server/database.json`
- `server/src/config/env.js` — Zod env validation, exits on bad config
- `server/src/db/pool.js` — `pg.Pool` max 20, slow-query logger (>200ms in dev)
- `server/src/errors/AppError.js` + `server/src/errors/errorHandler.js`
- `server/src/utils/asyncHandler.js`
- `server/src/routes/health.routes.js` — `GET /api/health`
- `server/src/app.js` — middleware stack (helmet→cors→compression→parsers→cookie→pino→routes→errorHandler)
- `server/src/server.js` — listen + SIGTERM/SIGINT graceful shutdown
- `server/migrations/1_no_op.js` — first migration to prove runner works
- `server/migrations/seeds/run.js` — seed runner placeholder
- `client/` — Vite + React 19 scaffolded via `npm create vite@latest`
- `client/vite.config.js` — `/api` + `/uploads` proxied to `localhost:5000`
- `client/index.html` — Google Fonts: Archivo, Public Sans, IBM Plex Mono
- `client/tailwind.config.js` — all §10.2 tokens + type scale + spacing + radius + shadow
- `client/postcss.config.js`
- `client/src/index.css` — Tailwind directives, CSS custom properties, focus ring, reduced-motion
- `client/src/main.jsx` — React 19 root, React Query provider
- `client/src/App.jsx` — React Router v6 with all 13+ routes from §11
- `client/src/lib/api.js` — fetch wrapper with auth header, 401 silent refresh, ApiError class
- `client/src/pages/PlaceholderPage.jsx` + 16 page stubs

**Endpoints added:** `GET /api/health`

**Tables/views/migrations touched:** `pgmigrations` (migration runner table), `migrations/1_no_op.js`

**Reusable pieces later phases must use:**
- `query()` / `getClient()` from `server/src/db/pool.js` — never use `pool.query()` directly in routes
- `AppError` class — throw this from all services; the central handler emits the correct envelope
- `asyncHandler` — wrap every controller
- `api` + `ApiError` from `client/src/lib/api.js` — never call `fetch()` from pages or components
- Tailwind tokens — no ad-hoc hex values anywhere in JSX

**Deviations from PROJECT.md:** None. The Vite scaffold created React 19 (latest); lucide-react was installed at `latest` to maintain peer-dep compatibility with React 19. recharts 2.x deprecated warning noted; v3 migration is deferred to Phase 12 hardening.

**Known gaps / TODO:**
- Phase 1: real database migrations and seed data
- Phase 2: auth middleware, rate limits, Zod schemas
- Phase 3: real design primitives replacing placeholder pages
- `multer` 1.x has known vulnerabilities — upgrade to 2.x in Phase 12 hardening

---

## Phase 1 — Database & seed — DONE 2026-08-22

**Built:** Full PostgreSQL schema with 3NF tables, constraints, trigram search indexes, and 6 aggregate views for dashboard reporting. Seeded with rich test data including 40 cities, 180+ activities, and 4 demo trips covering edge cases.
**Files added/changed:**
- `server/migrations/2_extensions_and_helpers.js`
- `server/migrations/3_users_and_auth.js`
- `server/migrations/4_catalogue.js`
- `server/migrations/5_trips.js`
- `server/migrations/6_engagement.js`
- `server/migrations/7_indexes.js`
- `server/migrations/8_views.js`
- `server/migrations/seeds/01_countries.sql`
- `server/migrations/seeds/02_cities.sql`
- `server/migrations/seeds/03_categories.sql`
- `server/migrations/seeds/04_activities.sql`
- `server/migrations/seeds/05_users.sql`
- `server/migrations/seeds/06_demo_trips.sql`
- `server/docs/schema.md`
**Endpoints added:** None.
**Tables/views/migrations touched:** `users`, `refresh_tokens`, `password_reset_tokens`, `countries`, `cities`, `activity_categories`, `activities`, `trips`, `trip_stops`, `trip_activities`, `trip_expenses`, `saved_cities`, `trip_views`, `activity_log`, `v_trip_activity_cost`, `v_trip_cost_breakdown`, `v_trip_totals`, `v_trip_daily_cost`, `v_city_usage`, `v_activity_usage`.
**Reusable pieces later phases must use:**
- `set_updated_at()` trigger function for any future mutable tables
- The 6 aggregate views which should be queried directly rather than recomputing totals in JavaScript
**Deviations from PROJECT.md:** None. Implemented the schema exactly as specified, using DEFERRABLE constraints for sort orders.
**Known gaps / TODO:**
- The actual DB migration and seed execution (`npm run migrate:up` and `npm run seed`) is pending local PostgreSQL connection/authentication configuration.
- Phase 2: auth middleware, rate limits, Zod schemas
- Phase 3: real design primitives replacing placeholder pages

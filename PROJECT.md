# GlobeTrotter — Project Context

> **Agent instructions:** Read this entire file before executing any task. This file is the single
> source of truth for scope, schema, contracts, security, and visual design.
> `PHASES.md` is the execution order. `PROGRESS.md` is the running log of what already exists.
> Never contradict this file. If something here is ambiguous, ask before assuming.

---

## 1. What we are building

**GlobeTrotter** is a multi-city travel planning web application. A user signs up, creates a trip,
adds cities as ordered stops with arrival/departure dates, attaches activities to each stop,
sees an automatic budget breakdown, views the plan as a day-wise timeline or calendar, and
publishes a read-only public link that anyone can view and copy into their own account.

**Primary user:** an individual planning a 2–6 city trip who wants one place to hold the route,
the plan, and the money.

**The one job of the product:** turn a vague list of cities into a dated, costed, shareable itinerary.

---

## 2. Hard requirements (non-negotiable)

| # | Requirement | How it is satisfied | Verified in |
|---|---|---|---|
| R1 | Strong relational database design | Normalised 3NF schema, FK constraints, CHECK constraints, indexes, views (§5) | Phase 1 |
| R2 | PostgreSQL as the database | PostgreSQL 15+, accessed via `pg` with parameterised SQL and migrations | Phase 0–1 |
| R3 | Minimal third-party APIs | **Zero external API calls in the core product.** See §3.3 | Phase 12 |
| R4 | No static JSON — everything dynamic | All UI data comes from the DB through REST endpoints. No hardcoded arrays in the frontend. See §15 | Phase 12 |
| R5 | Input validation (email + password especially) | Shared Zod schemas, enforced **server-side always**, mirrored client-side. See §7 | Phase 2 |
| R6 | Interactive, navigable, non-generic UI | Fixed design system in §10, full navigation map in §11, no dead ends | Phase 3+ |
| R7 | MERN-family stack | React + Express + Node, with **PostgreSQL instead of MongoDB** (PERN), because R2 requires SQL | Phase 0 |
| R8 | Scalable + secure | Stateless API, pooling, pagination, indexes, JWT + refresh rotation, RBAC, rate limits. See §8, §9 | Phase 2, 12 |

---

## 3. Locked tech stack

### 3.1 Backend
| Concern | Choice |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Express 4 |
| DB driver | `pg` (node-postgres) with a shared connection **Pool** |
| Migrations | `node-pg-migrate` — plain SQL up/down files, checked into git |
| Validation | `zod` |
| Auth | `jsonwebtoken` (access) + rotating refresh token stored hashed in DB |
| Hashing | `bcrypt`, cost factor 12 |
| Security middleware | `helmet`, `cors` (allowlist), `express-rate-limit`, `cookie-parser`, `compression` |
| Logging | `pino` + `pino-http` |
| Uploads | `multer` → local `/uploads` folder, served statically. No cloud storage. |

**No ORM.** Repositories write explicit parameterised SQL. This is deliberate: the schema quality
is part of the grade, and raw SQL makes it visible.

### 3.2 Frontend
| Concern | Choice |
|---|---|
| Build | Vite + React 18 + JavaScript (JSX) |
| Routing | `react-router-dom` v6 |
| Server state | `@tanstack/react-query` |
| Forms | `react-hook-form` + `@hookform/resolvers` + `zod` |
| Styling | Tailwind CSS, configured with the tokens in §10 — **no other UI kit** |
| Icons | `lucide-react` only |
| Charts | `recharts` |
| Drag & reorder | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Dates | `date-fns` |

### 3.3 Third-party API policy (R3)

**The product must run fully offline apart from its own API.** Explicitly:

- **No maps API, no geocoding API, no places API.** City latitude/longitude live in our own
  `cities` table from seed data. Any map-like visual is drawn from our own coordinates.
- **No currency/FX API.** All money is stored and displayed in a single base currency (`USD`) with
  the currency code kept on the row so the schema can support more later.
- **No email provider.** Password reset generates a token row in the DB. In development the reset
  link is returned in the API response and logged to the server console. This is documented
  behaviour, not a bug — it keeps the flow demoable with zero external dependencies.
- **No image API.** Seed data stores plain image URLs as strings. User uploads go to local disk.
- Client libraries (Recharts, dnd-kit, date-fns) are **not** third-party APIs. They are fine.

---

## 4. System architecture

```
┌──────────────────────────────────────────────────────────────┐
│ Browser — React SPA (Vite)                                   │
│  pages/ → components/ → hooks/ (React Query) → lib/api.js    │
│  Access token in memory · refresh token in httpOnly cookie   │
└───────────────────────────┬──────────────────────────────────┘
                            │ HTTPS  /api/*   JSON
┌───────────────────────────▼──────────────────────────────────┐
│ Express API (stateless — any instance can serve any request) │
│                                                              │
│  middleware:  helmet → cors → rateLimit → parsers → logger   │
│               → authenticate → authorize → validate(zod)     │
│                                                              │
│  routes/  →  controllers/  →  services/  →  repositories/    │
│              (HTTP only)     (business +    (SQL only)       │
│                               ownership)                     │
│                                                              │
│  errors bubble to one central error handler → §6.3 envelope  │
└───────────────────────────┬──────────────────────────────────┘
                            │ pg Pool (parameterised SQL)
┌───────────────────────────▼──────────────────────────────────┐
│ PostgreSQL 15 — tables, CHECK constraints, indexes, views    │
└──────────────────────────────────────────────────────────────┘
```

**Layer rules the agent must follow:**
- A controller never writes SQL. A repository never touches `req`/`res`.
- Every service method that touches a trip takes `userId` and asserts ownership before acting.
- Cross-table writes (create stop + shift sort orders, copy trip) run inside a transaction.

---

## 5. Database design

### 5.1 Conventions
- `snake_case`, plural table names, singular column names.
- Primary keys: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` (`pgcrypto` extension).
- Every table has `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`.
- Mutable tables also have `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`, maintained by a single
  shared trigger function `set_updated_at()`.
- Money: `NUMERIC(12,2)`. Currency: `CHAR(3) NOT NULL DEFAULT 'USD'`. **Never** use float for money.
- Enums are modelled as `TEXT` + `CHECK (col IN (...))` — easier to extend than native enum types.
- Emails are stored lowercased; enforced by `CHECK (email = lower(email))`.
- Soft delete only on `users` (`deleted_at`). Everything else hard-deletes via `ON DELETE CASCADE`.

### 5.2 Entity relationships

```
countries ─1:N─ cities ─1:N─ activities ─N:1─ activity_categories
                  │                │
                  │                └──────────────┐
                  │                               │
users ─1:N─ trips ─1:N─ trip_stops ─1:N─ trip_activities
  │           │              (city_id ─┘)
  │           ├─1:N─ trip_expenses
  │           └─1:N─ trip_views
  ├─1:N─ refresh_tokens
  ├─1:N─ password_reset_tokens
  ├─N:M─ cities  (via saved_cities)
  └─1:N─ activity_log
```

### 5.3 Table specifications

**`users`** — accounts and profile
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| email | TEXT NOT NULL | `UNIQUE`, `CHECK (email = lower(email))`, `CHECK (position('@' in email) > 1)` |
| password_hash | TEXT NOT NULL | bcrypt |
| full_name | TEXT NOT NULL | `CHECK (char_length(full_name) BETWEEN 2 AND 80)` |
| avatar_url | TEXT NULL | |
| city | TEXT NULL | user's home city, free text |
| language_pref | TEXT NOT NULL DEFAULT 'en' | `CHECK (language_pref IN ('en','hi','fr','es','de'))` |
| role | TEXT NOT NULL DEFAULT 'user' | `CHECK (role IN ('user','admin'))` |
| last_login_at | TIMESTAMPTZ NULL | powers admin engagement stats |
| deleted_at | TIMESTAMPTZ NULL | soft delete; excluded from all auth lookups |
| created_at / updated_at | TIMESTAMPTZ | |

**`refresh_tokens`** — one row per issued refresh token (rotation + revocation)
`id`, `user_id → users ON DELETE CASCADE`, `token_hash TEXT NOT NULL` (SHA-256 of the token),
`expires_at TIMESTAMPTZ NOT NULL`, `revoked_at TIMESTAMPTZ NULL`, `user_agent TEXT`, `ip TEXT`, `created_at`.

**`password_reset_tokens`**
`id`, `user_id → users CASCADE`, `token_hash TEXT NOT NULL`, `expires_at TIMESTAMPTZ NOT NULL`
(30 minutes), `used_at TIMESTAMPTZ NULL`, `created_at`.

**`countries`**
`id`, `name TEXT NOT NULL UNIQUE`, `iso2 CHAR(2) NOT NULL UNIQUE`, `region TEXT NOT NULL`
(`CHECK` in `'Asia','Europe','Africa','North America','South America','Oceania','Middle East'`),
`currency_code CHAR(3) NOT NULL`, `created_at`.

**`cities`**
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| country_id | UUID NOT NULL → countries RESTRICT | |
| name | TEXT NOT NULL | `UNIQUE (country_id, name)` |
| description | TEXT NOT NULL | 1–2 sentences, shown on city cards |
| image_url | TEXT NOT NULL | |
| latitude | NUMERIC(9,6) NOT NULL | `CHECK BETWEEN -90 AND 90` |
| longitude | NUMERIC(9,6) NOT NULL | `CHECK BETWEEN -180 AND 180` |
| cost_index | NUMERIC(5,2) NOT NULL | 100 = baseline; `CHECK > 0` |
| avg_daily_cost | NUMERIC(12,2) NOT NULL | used for budget estimates on stops |
| popularity_score | INTEGER NOT NULL DEFAULT 0 | `CHECK >= 0`, drives "popular cities" |
| timezone | TEXT NOT NULL | IANA string |

**`activity_categories`**
`id`, `name TEXT NOT NULL UNIQUE`, `slug TEXT NOT NULL UNIQUE`, `icon TEXT NOT NULL` (lucide icon name).
Seed: Sightseeing, Food & Drink, Adventure, Culture, Nightlife, Relaxation.

**`activities`**
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| city_id | UUID NOT NULL → cities CASCADE | |
| category_id | UUID NOT NULL → activity_categories RESTRICT | |
| name | TEXT NOT NULL | `UNIQUE (city_id, name)` |
| description | TEXT NOT NULL | |
| image_url | TEXT NOT NULL | |
| avg_cost | NUMERIC(12,2) NOT NULL | `CHECK >= 0` |
| currency | CHAR(3) NOT NULL DEFAULT 'USD' | |
| duration_minutes | INTEGER NOT NULL | `CHECK BETWEEN 15 AND 1440` |
| popularity_score | INTEGER NOT NULL DEFAULT 0 | |

**`trips`**
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID NOT NULL → users CASCADE | |
| name | TEXT NOT NULL | `CHECK (char_length(name) BETWEEN 3 AND 120)` |
| description | TEXT NULL | max 1000 chars |
| start_date | DATE NOT NULL | |
| end_date | DATE NOT NULL | `CHECK (end_date >= start_date)` |
| cover_photo_url | TEXT NULL | |
| budget_limit | NUMERIC(12,2) NULL | optional cap; drives over-budget alerts |
| currency | CHAR(3) NOT NULL DEFAULT 'USD' | |
| visibility | TEXT NOT NULL DEFAULT 'private' | `CHECK IN ('private','public')` |
| share_slug | TEXT NULL UNIQUE | 10-char nanoid, generated on first publish, never reused |
| copied_from_trip_id | UUID NULL → trips ON DELETE SET NULL | provenance for "Copy Trip" |
| created_at / updated_at | | |

**`trip_stops`** — one city leg of a trip
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| trip_id | UUID NOT NULL → trips CASCADE | |
| city_id | UUID NOT NULL → cities RESTRICT | |
| arrival_date | DATE NOT NULL | |
| departure_date | DATE NOT NULL | `CHECK (departure_date >= arrival_date)` |
| sort_order | INTEGER NOT NULL | `CHECK >= 0`, `UNIQUE (trip_id, sort_order) DEFERRABLE INITIALLY DEFERRED` |
| transport_cost | NUMERIC(12,2) NOT NULL DEFAULT 0 | cost of getting *to* this stop |
| accommodation_cost | NUMERIC(12,2) NOT NULL DEFAULT 0 | total for the stay |
| notes | TEXT NULL | |

Application-level rules the DB cannot express cheaply: stop dates must fall inside the trip's
date range, and stops must not overlap each other. Enforce both in the service layer and return
a 422 with a clear message. *(Optional hardening: a `btree_gist` EXCLUDE constraint on
`(trip_id WITH =, daterange(arrival_date, departure_date, '[]') WITH &&)` — add only if time allows.)*

**`trip_activities`** — an activity scheduled inside a stop
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| trip_stop_id | UUID NOT NULL → trip_stops CASCADE | |
| activity_id | UUID NULL → activities ON DELETE SET NULL | null when the user typed a custom activity |
| custom_title | TEXT NULL | `CHECK (activity_id IS NOT NULL OR custom_title IS NOT NULL)` |
| scheduled_date | DATE NOT NULL | must lie within the parent stop's range (service-enforced) |
| start_time | TIME NULL | |
| duration_minutes | INTEGER NOT NULL DEFAULT 60 | `CHECK > 0` |
| cost | NUMERIC(12,2) NOT NULL DEFAULT 0 | `CHECK >= 0`, copied from `activities.avg_cost` then editable |
| currency | CHAR(3) NOT NULL DEFAULT 'USD' | |
| sort_order | INTEGER NOT NULL | ordering within a day |
| notes | TEXT NULL | |

**`trip_expenses`** — costs that are not activities (meals, misc, extra transport)
`id`, `trip_id → trips CASCADE`, `trip_stop_id → trip_stops ON DELETE SET NULL` (nullable),
`category TEXT NOT NULL CHECK IN ('transport','stay','activities','meals','misc')`,
`label TEXT NOT NULL`, `amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0)`,
`currency CHAR(3) DEFAULT 'USD'`, `incurred_on DATE NULL`, `created_at`.

**`saved_cities`** — user wishlist (N:M)
`user_id → users CASCADE`, `city_id → cities CASCADE`, `created_at`,
`PRIMARY KEY (user_id, city_id)`.

**`trip_views`** — public share analytics
`id`, `trip_id → trips CASCADE`, `viewer_hash TEXT NOT NULL` (SHA-256 of IP + UA + date salt,
so no raw IP is stored), `viewed_at TIMESTAMPTZ DEFAULT now()`.

**`activity_log`** — admin engagement feed
`id`, `user_id → users ON DELETE SET NULL`, `action TEXT NOT NULL`
(`signup`, `login`, `trip_created`, `trip_published`, `trip_copied`, `stop_added`, `activity_added`),
`entity_type TEXT NULL`, `entity_id UUID NULL`, `created_at`.

### 5.4 Indexes (create these explicitly — do not rely on defaults)

```
users              (lower(email)) UNIQUE WHERE deleted_at IS NULL
refresh_tokens     (user_id), (token_hash) UNIQUE, (expires_at)
cities             (country_id), (popularity_score DESC), (name)
                   GIN (name gin_trgm_ops)            -- pg_trgm; fallback: plain (lower(name))
activities         (city_id), (category_id), (avg_cost), (popularity_score DESC)
                   GIN (name gin_trgm_ops)
trips              (user_id, created_at DESC), (share_slug) UNIQUE,
                   (visibility) WHERE visibility = 'public'
trip_stops         (trip_id, sort_order), (city_id)
trip_activities    (trip_stop_id, scheduled_date, sort_order), (activity_id)
trip_expenses      (trip_id, category)
trip_views         (trip_id, viewed_at DESC)
activity_log       (created_at DESC), (user_id, created_at DESC)
```

### 5.5 Views (the budget screen reads these, it does not recompute in JS)

- **`v_trip_activity_cost`** — per trip: `SUM(trip_activities.cost)` joined through stops.
- **`v_trip_cost_breakdown`** — per `(trip_id, category)`: activities from `trip_activities`,
  transport and stay from `trip_stops`, meals/misc from `trip_expenses`, unioned into one shape
  `(trip_id, category, total)`.
- **`v_trip_totals`** — per trip: `total_cost`, `duration_days`, `cost_per_day`, `stop_count`,
  `activity_count`, `budget_limit`, `is_over_budget`.
- **`v_trip_daily_cost`** — per `(trip_id, day)`: cost for that calendar day; the timeline uses it
  to flag over-average days.
- **`v_city_usage`** / **`v_activity_usage`** — counts for the admin dashboard's top lists.

### 5.6 Seed data (must exist before any UI work — see Phase 1)

Minimum volumes so the app never looks empty: **12 countries · 40 cities · 6 categories ·
180+ activities (4–6 per city) · 3 users (1 admin, 2 regular) · 4 fully-built demo trips**
(one private draft, one published public trip, one past trip, one over-budget trip).
Seeds are idempotent SQL, re-runnable with `npm run seed`.

---

## 6. API contract

Base path `/api`. All requests and responses are JSON except file uploads.

### 6.1 Endpoints

**Auth** — `/api/auth`
| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/signup` | – | create account, return access token + set refresh cookie |
| POST | `/login` | – | authenticate |
| POST | `/refresh` | cookie | rotate refresh token, issue new access token |
| POST | `/logout` | cookie | revoke current refresh token, clear cookie |
| POST | `/forgot-password` | – | always 200 (no user enumeration); dev returns reset link |
| POST | `/reset-password` | – | consume token, set new password, revoke all refresh tokens |
| GET | `/me` | access | current user |

**Users** — `/api/users`
`GET /me` · `PATCH /me` (name, city, language, avatar_url) · `PATCH /me/password`
(requires current password) · `DELETE /me` (soft delete + revoke tokens) ·
`GET /me/saved-cities` · `POST /me/saved-cities` · `DELETE /me/saved-cities/:cityId`

**Catalogue** (public reads)
`GET /api/countries` ·
`GET /api/cities?q=&countryId=&region=&maxCostIndex=&sort=popularity|name|cost&page=&limit=` ·
`GET /api/cities/:id` · `GET /api/cities/popular?limit=6` ·
`GET /api/activity-categories` ·
`GET /api/activities?q=&cityId=&categoryId=&maxCost=&maxDuration=&sort=&page=&limit=` ·
`GET /api/activities/:id`

**Trips** — `/api/trips` (all require auth + ownership)
| Method | Path | Purpose |
|---|---|---|
| GET | `/` | `?status=upcoming\|ongoing\|past&q=&page=` — trip cards with stop count and total cost |
| POST | `/` | create |
| GET | `/:id` | full nested trip: stops → activities, plus totals |
| PATCH | `/:id` | update fields |
| DELETE | `/:id` | delete (cascades) |
| POST | `/:id/cover` | multipart image upload |
| GET | `/:id/budget` | breakdown by category, per-day series, over-budget flags |
| GET | `/:id/calendar` | day-by-day array from trip start to end |
| POST | `/:id/share` | `{ visibility }` → publish/unpublish, returns `share_slug` |
| POST | `/:id/copy` | duplicate a trip the user can see into their account (transaction) |

**Stops & scheduled activities**
`POST /api/trips/:tripId/stops` · `PATCH /api/stops/:id` · `DELETE /api/stops/:id` ·
`PATCH /api/trips/:tripId/stops/reorder` (body: ordered array of stop ids) ·
`POST /api/stops/:stopId/activities` · `PATCH /api/trip-activities/:id` ·
`DELETE /api/trip-activities/:id` · `PATCH /api/stops/:stopId/activities/reorder`

**Expenses**
`GET|POST /api/trips/:tripId/expenses` · `PATCH|DELETE /api/expenses/:id`

**Public**
`GET /api/public/trips/:slug` — read-only itinerary, no auth, records a `trip_views` row.

**Admin** (`role = 'admin'` only)
`GET /api/admin/stats/overview` (users, trips, published trips, avg stops/trip, signups last 30d) ·
`GET /api/admin/stats/top-cities?limit=10` · `GET /api/admin/stats/top-activities?limit=10` ·
`GET /api/admin/stats/trips-over-time?days=30` · `GET /api/admin/users?q=&page=` ·
`PATCH /api/admin/users/:id` (role, suspend) · `GET /api/admin/trips?page=`

### 6.2 Success envelope
```json
{ "data": { }, "meta": { "page": 1, "limit": 20, "total": 132 } }
```
`meta` is present only on paginated collections. Default `limit` 20, max 100.

### 6.3 Error envelope
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Check the highlighted fields.",
  "details": [{ "field": "email", "message": "Enter a valid email address." }] } }
```
Codes: `VALIDATION_ERROR` 422 · `UNAUTHORIZED` 401 · `FORBIDDEN` 403 · `NOT_FOUND` 404 ·
`CONFLICT` 409 · `RATE_LIMITED` 429 · `INTERNAL` 500.
Stack traces are never sent to the client.

---

## 7. Validation rules (R5)

Zod schemas live in `server/src/validation/` and are the **only** place validation is written.
A `validate(schema)` middleware parses `body`/`query`/`params` and throws `VALIDATION_ERROR`.
The frontend imports equivalent schemas so the same messages appear inline before submit —
but the server never trusts the client.

**Email**
- trimmed, lowercased before validation and before storage
- `z.string().email()` plus a stricter regex: `^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$`
- max 254 chars; no consecutive dots; no leading/trailing dot in the local part
- signup returns `409 CONFLICT` with "That email is already registered." — login errors stay generic

**Password**
- 8–72 characters (bcrypt truncates past 72)
- at least one uppercase, one lowercase, one digit, one special character
- rejected if it contains the email local part or the string "password"
- a live strength meter on the signup form shows which of the five rules are met
- confirm-password must match; never logged, never returned, never stored in plain text

**Everything else**
| Field | Rule |
|---|---|
| Trip name | 3–120 chars, trimmed, required |
| Trip dates | valid ISO dates, `end >= start`, span ≤ 365 days |
| Stop dates | inside the trip range, no overlap with sibling stops |
| Activity date | inside its parent stop's range |
| Money fields | numeric, `>= 0`, ≤ 1,000,000, max 2 decimals |
| UUID params | `z.string().uuid()` — a malformed id is 422, not a 500 |
| Pagination | `page >= 1`, `limit` 1–100, coerced from string |
| Search `q` | ≤ 100 chars, trimmed; empty string treated as absent |
| Uploads | jpeg/png/webp only, ≤ 2 MB, extension re-derived from sniffed MIME type |

---

## 8. Security model (R8)

**Authentication**
- Access token: JWT, 15-minute expiry, held in React memory only (never `localStorage`).
- Refresh token: 7-day opaque random string, sent as `httpOnly` + `sameSite=strict` +
  `secure` (prod) cookie, stored **hashed** in `refresh_tokens`.
- Rotation on every refresh: old row is revoked, new row issued. If a revoked token is presented,
  revoke that user's whole token family and force re-login.
- Passwords: bcrypt cost 12. Reset tokens hashed, single-use, 30-minute expiry.

**Authorisation**
- `authenticate` populates `req.user`; `authorize('admin')` guards admin routes.
- **Every** trip-scoped service call verifies `trip.user_id === req.user.id` before reading or
  writing, and returns `404` (not `403`) for other people's private trips so ids can't be probed.
- Public trips are readable only through `/api/public/trips/:slug`, which selects a
  restricted column set and never exposes `user_id` or owner email.

**Transport & injection**
- All SQL is parameterised (`$1, $2`). String concatenation into SQL is forbidden.
- `helmet` for headers; CORS allowlist from `CORS_ORIGIN` env (no `*` when credentials are used).
- Rate limits: 5 attempts / 15 min on `/auth/login`, `/auth/signup`, `/auth/forgot-password`
  (keyed by IP + email); 100 req / 15 min globally per IP.
- `express.json({ limit: '100kb' })`; multer size and MIME limits on uploads.
- Output is escaped by React; no `dangerouslySetInnerHTML` anywhere.
- Secrets only in `.env`, never committed; `.env.example` documents every key.

**Data protection**
- No raw IP addresses stored — `trip_views` keeps a salted hash.
- Account deletion soft-deletes the user, hard-deletes their trips, and revokes all tokens.

---

## 9. Scalability (R8)

- **Stateless API** — no server-side sessions, so instances scale horizontally behind a load balancer.
- **Connection pooling** — one shared `pg.Pool` (`max: 20`), never a client per request.
- **Pagination everywhere** — no endpoint returns an unbounded list, including admin tables.
- **Indexes** for every filter, sort, and join column (§5.4); `EXPLAIN ANALYZE` the trip detail
  and city search queries in Phase 12 and record the timings.
- **No N+1 queries** — a full trip loads in ≤ 3 queries (trip + stops joined to cities +
  activities joined to catalogue), assembled in JS. Aggregates come from views, not loops.
- **Transactions** for multi-row writes: reorder, copy trip, delete stop with resequencing.
- **Caching** — a tiny in-memory TTL cache (60 s) for `/cities/popular` and
  `/activity-categories`, written behind a `cache.get/set` interface so Redis can replace it
  with no call-site changes.
- **Frontend** — route-level code splitting via `React.lazy`, React Query caching with
  `staleTime`, debounced (300 ms) search inputs, `loading="lazy"` on images.
- **Graceful shutdown** — drain the pool on `SIGTERM`; `/api/health` returns DB status for probes.

---

## 10. Design system (R6)

### 10.1 Direction

**"Departure board."** The visual language comes from printed rail atlases and airport
departure displays: deep atlas navy panels, cool paper grey, one amber signal colour, hairline
rules, and monospaced figures for every date, time, duration and price. It is a planning
instrument, not a lifestyle brochure.

Deliberately **not** doing: cream + terracotta editorial, purple/indigo gradients, glassmorphism,
dark-mode-with-neon-accent, or a centered hero with three feature cards.

### 10.2 Tokens (put these in `tailwind.config.js` and CSS variables — no ad-hoc hex anywhere)

```
--navy-900  #0A1A2F   nav bar, board panels, headings on light
--navy-700  #1D3557   secondary surfaces on dark, hover state of navy
--paper     #EDEFF2   app background (cool grey, never cream)
--surface   #FFFFFF   cards, inputs, sheets
--line      #D5DAE1   1px hairlines, table rules, dividers
--muted     #5C6B7F   secondary text, labels, placeholders
--signal    #E3A008   primary action, active route, "today" marker
--signal-so #FDF3DC   signal at 12% — selected rows, chip backgrounds
--sea       #2A9D8F   secondary/positive: under budget, confirmed
--alert     #C1443B   destructive, over budget
```
Contrast floor: body text ≥ 4.5:1. Amber is a **background/marker** colour — never amber text
on white; amber buttons use `--navy-900` text.

### 10.3 Type

| Role | Face | Usage |
|---|---|---|
| Display | **Archivo** 600–700, tight tracking | page titles, city names, stop headers |
| Body | **Public Sans** 400/500 | paragraphs, labels, buttons |
| Data | **IBM Plex Mono** 500 | dates, times, durations, prices, city codes, stat numbers |

Scale: 32 / 24 / 20 / 16 / 14 / 12 px. Line height 1.5 body, 1.2 display.
All prices and dates use `tabular-nums` so columns align.

### 10.4 Layout & components

- Content max-width 1180 px, 24 px gutters, 8 px spacing grid.
- Persistent top nav (navy, 56 px): wordmark left, `Dashboard · My Trips · Explore` centre,
  avatar menu right. Inside a trip, a second bar shows the trip name plus tabs
  `Build · Itinerary · Calendar · Budget`.
- Radius: 6 px cards and inputs, 4 px buttons, pills only for filter chips.
- Elevation: hairline borders do the work. One soft shadow (`0 8px 24px rgba(10,26,47,.12)`)
  reserved for modals and popovers.
- Every list has three designed states: **loading** (skeleton rows, never a spinner-only screen),
  **empty** (one sentence + the action that fixes it), **error** (what failed + retry).
- Buttons: primary = amber fill, navy text. Secondary = white fill, navy border.
  Ghost = text only. Destructive = alert border, alert text, fill on hover.
- Focus ring visible on every interactive element: 2 px `--signal` offset 2 px.

### 10.5 Signature element — the Route Rail

A horizontal strip pinned under the trip header on every trip screen: each stop rendered as a
board cell with a 3-letter city code (derived from the city name), the date range in mono, and
the leg cost; cells joined by a hairline rail with a filled amber node for the stop currently in
view. It doubles as navigation — clicking a cell scrolls to that stop. This is the one bold
element; everything else stays quiet. Reuse the same component on the builder, itinerary,
calendar and public share pages so the app feels like one product.

### 10.6 Motion
One staggered fade-up (60 ms apart, 200 ms) when the Route Rail mounts. 120 ms hover and
press transitions. Nothing else. Everything wrapped in `@media (prefers-reduced-motion: reduce)`.

### 10.7 Copy rules
Sentence case. Active verbs on buttons, and the same verb through the flow ("Publish" →
"Published"). Errors say what happened and what to do. Empty states invite an action:
"No stops yet. Add your first city to start the route."

### 10.8 Responsive
Breakpoints 640 / 1024. Below 1024 the Route Rail scrolls horizontally, trip tabs become a
scrollable row, tables become stacked cards, and the nav collapses to a sheet.
Everything must be usable at 375 px wide.

---

## 11. Screens → routes (all 13 from the brief)

| # | Screen | Route | Auth | Notes |
|---|---|---|---|---|
| 1 | Login / Signup | `/login`, `/signup`, `/forgot-password`, `/reset-password/:token` | public | inline validation, strength meter |
| 2 | Dashboard | `/` | user | upcoming trips, popular cities, budget highlight, "Plan a new trip" |
| 3 | Create Trip | `/trips/new` | user | name, dates, description, cover upload, budget limit |
| 4 | My Trips | `/trips` | user | filter upcoming/ongoing/past, search, card actions |
| 5 | Itinerary Builder | `/trips/:id/build` | owner | add stops, drag-reorder, attach activities |
| 6 | Itinerary View | `/trips/:id` | owner | day-wise/city-grouped toggle, print-friendly |
| 7 | City Search | `/explore/cities` | user | q + country/region/cost filters, "Add to trip" |
| 8 | Activity Search | `/explore/activities` | user | category/cost/duration filters, add to a stop |
| 9 | Budget | `/trips/:id/budget` | owner | pie by category, bar by day, per-day average, alerts |
| 10 | Calendar / Timeline | `/trips/:id/calendar` | owner | month grid + vertical timeline toggle |
| 11 | Public itinerary | `/s/:slug` | public | read-only, "Copy this trip", copy-link + share buttons |
| 12 | Profile / Settings | `/profile` | user | profile, password, language, saved cities, delete account |
| 13 | Admin dashboard | `/admin` | admin | overview stats, top cities/activities, users table |

**Navigation guarantee:** every screen is reachable in ≤ 2 clicks from the dashboard, every
screen has a labelled way back, and no page is a dead end.

---

## 12. Roles & permissions

| Action | Guest | User | Owner | Admin |
|---|---|---|---|---|
| Browse cities / activities | ✕ | ✓ | ✓ | ✓ |
| View a public trip via slug | ✓ | ✓ | ✓ | ✓ |
| Create / edit / delete own trip | ✕ | ✓ | ✓ | ✓ |
| View or edit someone else's private trip | ✕ | ✕ | ✕ | ✕ (read-only in admin list) |
| Copy a visible trip | ✕ | ✓ | ✓ | ✓ |
| Platform stats, user management | ✕ | ✕ | ✕ | ✓ |

---

## 13. Conventions for the agent

- **Files:** components `PascalCase.jsx`, hooks `useThing.js`, everything else `camelCase.js`,
  SQL migrations `NNN_description.sql`.
- **Backend module shape:** `routes/x.routes.js` → `controllers/x.controller.js` →
  `services/x.service.js` → `repositories/x.repo.js`.
- **Async:** every controller wrapped in an `asyncHandler`; no unhandled promise rejections.
- **Errors:** throw `new AppError(code, message, status, details)`; never `res.status(500).send(err)`.
- **Frontend data:** one `useQuery`/`useMutation` hook per endpoint in `hooks/`, called from pages.
  Components never call `fetch` directly.
- **Comments:** only where a decision is non-obvious (a constraint, a transaction, a tricky query).
- **Definition of done for any task:** it runs, the happy path works in the browser, invalid input
  is rejected with a readable message, loading and empty states render, and it is responsive at 375 px.

---

## 14. Demo script (build toward this)

1. Sign up with a deliberately bad password → validation rules light up one by one.
2. Land on the dashboard, seeded with popular cities and a highlighted trip.
3. Create "Europe Summer" (12 days) → add Paris, Amsterdam, Prague as stops → drag to reorder.
4. Open Activity Search, filter Food & Drink under $50, add three activities to Paris.
5. Budget screen: breakdown pie, per-day bars, over-budget day flagged in red.
6. Calendar screen: the same trip as a month grid, drag an activity to another day.
7. Publish → open the public link in an incognito window → "Copy this trip" into the second account.
8. Log in as admin → top cities, top activities, signups over time, all live from the DB.
9. Show `psql` — the same numbers, with the schema and constraints behind them.

---

## 15. Anti-requirements — do not do these

- ❌ No static JSON or hardcoded arrays feeding the UI. **No `mockData.js`, no `cities.json`,
  no `const POPULAR = [...]` in a component.** The only place fixed data may live is
  `server/migrations/seeds/*.sql`, which loads it into PostgreSQL. If a screen needs data that
  no endpoint provides, build the endpoint.
- ❌ No third-party API calls (§3.3).
- ❌ No MongoDB, no ORM, no alternative styling library, no component kit.
- ❌ No secrets, tokens or connection strings in the repo or in the frontend bundle.
- ❌ No `localStorage` for tokens. No `SELECT *` in a repository. No string-built SQL.
- ❌ No spinner-only screens, no `alert()`, no unlabelled icon buttons, no lorem ipsum.
- ❌ No generic AI-template styling: no purple gradients, no glassmorphism, no emoji as icons,
  no cream + terracotta, no `rounded-3xl shadow-2xl` on everything.
- ❌ Do not expand scope beyond this document. If a phase needs something that is not specified
  here, ask instead of inventing it.

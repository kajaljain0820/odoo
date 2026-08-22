# GlobeTrotter — Build Phases

> **Agent protocol — follow this exactly:**
> 1. Read `PROJECT.md` in full before touching code. It is the spec.
> 2. Read `PROGRESS.md` to learn what already exists. Never rebuild what is marked done.
> 3. Work on **one phase at a time, in order**. Do not start a phase until the previous one's
>    acceptance criteria pass.
> 4. At the end of a phase, append an entry to `PROGRESS.md` using the template at the bottom of
>    this file. That log is how later phases inherit context.
> 5. If a phase requires a decision that `PROJECT.md` does not cover, stop and ask.
>
> **Prerequisite:** the repo scaffold, dependencies, `.env` files and npm scripts already exist.
> Phase 0 starts from that point.

---

## Phase map

| Phase | Name | Outcome | Depends on |
|---|---|---|---|
| 0 | Foundations | Server boots, DB connects, migration runner works, React shell renders | scaffold |
| 1 | Database & seed | Full schema, indexes, views, realistic seed data in PostgreSQL | 0 |
| 2 | Auth & validation | Signup, login, refresh, reset; Zod layer; security middleware | 1 |
| 3 | Design system & app shell | Tokens, nav, layout, protected routes, auth screens wired | 2 |
| 4 | Trips CRUD | Create Trip, My Trips, dashboard skeleton | 3 |
| 5 | Catalogue | City Search and Activity Search, backed by real queries | 4 |
| 6 | Itinerary Builder | Stops, ordering, scheduled activities | 5 |
| 7 | Itinerary View | Day-wise / city-grouped read view, Route Rail | 6 |
| 8 | Budget | Breakdown views, charts, per-day alerts, expenses | 7 |
| 9 | Calendar / Timeline | Month grid, timeline, drag-to-reschedule | 8 |
| 10 | Share & copy | Public itinerary page, publish toggle, Copy Trip | 9 |
| 11 | Profile & admin | Settings, saved cities, admin analytics | 10 |
| 12 | Hardening & demo | No-static-JSON audit, security pass, performance, polish | 11 |

Phases 0–7 are the demoable core. If time runs short, 11 (admin) is the first thing to cut —
it is marked optional in the brief. Never cut Phase 12.

---

## Phase 0 — Foundations

**Goal:** a running skeleton on both sides, with nothing hardcoded and no feature logic yet.

**Tasks**
1. `server/src/config/env.js` — load and **validate** env vars with Zod at boot
   (`PORT, DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, CORS_ORIGIN, NODE_ENV, UPLOAD_DIR`).
   Exit with a readable message if any is missing.
2. `server/src/db/pool.js` — single `pg.Pool` (`max: 20`), plus a `query(text, params)` helper that
   logs slow queries (> 200 ms) in development.
3. `server/src/app.js` — Express app with middleware in the order given in `PROJECT.md` §4.
   `server/src/server.js` — listen, and drain the pool on `SIGTERM`/`SIGINT`.
4. `AppError` class + central error handler emitting the §6.3 envelope. `asyncHandler` wrapper.
5. `GET /api/health` → `{ status, db: 'up'|'down', uptime }` by running `SELECT 1`.
6. Configure `node-pg-migrate` (`npm run migrate:up|down|create`) and prove it with one no-op migration.
7. Frontend: React Router with placeholder pages for every route in `PROJECT.md` §11,
   `lib/api.js` (fetch wrapper: base URL, credentials, JSON, error normalisation),
   React Query provider, Vite dev proxy for `/api`.

**Acceptance**
- `npm run dev` starts both apps; `/api/health` returns `db: 'up'`.
- Every route in §11 renders a placeholder without a console error.
- Deleting a required env var produces a clear startup failure, not a stack trace.

---

## Phase 1 — Database & seed

**Context:** the pool, migration runner and health check from Phase 0 exist. No tables yet.

**Goal:** the complete schema from `PROJECT.md` §5, live in PostgreSQL, with data rich enough that
every later screen looks real.

**Tasks**
1. Migration `001_extensions_and_helpers` — `pgcrypto`, `pg_trgm`, and the shared
   `set_updated_at()` trigger function.
2. Migration `002_users_and_auth` — `users`, `refresh_tokens`, `password_reset_tokens`
   + constraints, indexes, `updated_at` triggers.
3. Migration `003_catalogue` — `countries`, `cities`, `activity_categories`, `activities`.
4. Migration `004_trips` — `trips`, `trip_stops`, `trip_activities`, `trip_expenses`.
   Include the deferrable `UNIQUE (trip_id, sort_order)` so reordering works inside a transaction.
5. Migration `005_engagement` — `saved_cities`, `trip_views`, `activity_log`.
6. Migration `006_indexes` — every index listed in §5.4, including the GIN trigram indexes.
7. Migration `007_views` — `v_trip_activity_cost`, `v_trip_cost_breakdown`, `v_trip_totals`,
   `v_trip_daily_cost`, `v_city_usage`, `v_activity_usage`.
8. Seeds in `server/migrations/seeds/`, run by `npm run seed`, idempotent
   (`ON CONFLICT DO NOTHING` / deterministic UUIDs):
   `01_countries.sql` (12) · `02_cities.sql` (40, spread across regions, with real coordinates,
   cost index and avg daily cost) · `03_categories.sql` (6) · `04_activities.sql` (180+, 4–6 per
   city, varied cost and duration) · `05_users.sql` (admin + 2 users, bcrypt hashes generated once
   and pasted in) · `06_demo_trips.sql` (4 trips with stops, activities and expenses: a private
   draft, a published public trip, a completed past trip, an over-budget trip).
9. Write `docs/schema.md`: the ERD as text plus one line per table explaining why it exists.

**Acceptance**
- `npm run migrate:down` then `migrate:up` then `seed` rebuilds everything from empty with no error.
- `SELECT * FROM v_trip_totals` returns sane totals for all 4 demo trips.
- Inserting a stop whose `departure_date < arrival_date`, a trip whose `end_date < start_date`,
  a duplicate email, or a mixed-case email is rejected by the database.
- `EXPLAIN` on a city name search shows the trigram index being used.

---

## Phase 2 — Auth & validation

**Context:** schema and seed data exist. `users`, `refresh_tokens`, `password_reset_tokens` are
populated with three known accounts. No API endpoints beyond `/health`.

**Goal:** the complete auth surface from `PROJECT.md` §6.1, with §7 validation and §8 security.

**Tasks**
1. `validation/` — Zod schemas for signup, login, forgot, reset, and a `validate(schema, source)`
   middleware. Encode the full email and password rules from §7, with the exact user-facing messages.
2. `utils/password.js` (bcrypt 12), `utils/tokens.js` (sign access JWT, generate + SHA-256 hash
   refresh and reset tokens).
3. `auth.repo.js` — user lookup by email excluding soft-deleted, insert user, token insert/find/revoke,
   revoke-all-for-user.
4. `auth.service.js` — signup, login, refresh **with rotation and reuse detection**, logout,
   forgot (always succeeds, dev returns the link), reset (single-use, revokes all sessions).
   Write an `activity_log` row for signup and login; update `users.last_login_at`.
5. `middleware/authenticate.js` (Bearer access token → `req.user`) and
   `middleware/authorize.js` (role check).
6. `middleware/rateLimit.js` — the auth limiter and the global limiter from §8.
7. Wire `helmet`, `cors` allowlist, `cookie-parser`, body size limit, `pino-http`.
8. `GET /api/auth/me` and `GET/PATCH /api/users/me`, `PATCH /api/users/me/password`,
   `DELETE /api/users/me`.

**Acceptance**
- Signup rejects `test@test`, `a@b.c` with a 1-char TLD, and `Password1` (no special character),
  each with a field-level message.
- Login with a wrong password and login with an unknown email return the **same** generic error.
- Six rapid login attempts return `429 RATE_LIMITED`.
- Calling `/refresh` twice with the same refresh token revokes the family and forces re-login.
- No response body anywhere contains `password_hash`.

---

## Phase 3 — Design system & app shell

**Context:** auth endpoints work and can be exercised with curl. The frontend is still placeholders.

**Goal:** the visual identity from `PROJECT.md` §10 exists as reusable primitives, and a logged-in
user can move around the app.

**Tasks**
1. `tailwind.config.js` — every token from §10.2, the type scale, and the three font families
   loaded via `<link>` in `index.html` (Archivo, Public Sans, IBM Plex Mono).
2. `components/ui/` primitives, each with all states (default, hover, focus, disabled, error):
   `Button`, `Input`, `PasswordInput` (with the five-rule strength meter), `Select`, `Textarea`,
   `DateRangeInput`, `Card`, `Badge`, `Chip`, `Modal`, `Drawer`, `Tabs`, `Toast`, `Skeleton`,
   `EmptyState`, `ErrorState`, `Pagination`, `Money` and `DateText` (mono, tabular figures).
3. `components/layout/` — `TopNav`, `PageHeader`, `AppLayout`, `AuthLayout`, mobile nav sheet.
4. `context/AuthContext.jsx` — access token in memory, silent refresh on mount and on 401,
   `login/logout/signup` actions, `<ProtectedRoute>` and `<AdminRoute>`.
5. Build the real auth screens: login, signup, forgot password, reset password — inline validation
   from the shared schemas, server errors mapped to fields, success toasts, links between them.
6. A `/styleguide` route (dev only) rendering every primitive in every state. This is the fastest
   way to catch inconsistency later.

**Acceptance**
- A user can sign up, land authenticated, refresh the page and stay logged in, and log out.
- No colour or font-size appears in JSX outside the Tailwind tokens.
- Keyboard tab order works and the focus ring is visible on every control.
- The whole shell is usable at 375 px wide.

---

## Phase 4 — Trips CRUD

**Context:** design primitives, layout, auth guards and the trips tables all exist. `AppLayout`
and the UI kit are the building blocks — do not create new one-off styles.

**Goal:** screens 2, 3 and 4 (Dashboard, Create Trip, My Trips) working end to end.

**Tasks**
1. Backend `trips` module: list (filters `upcoming|ongoing|past`, search, pagination, each card
   carrying `stop_count` and `total_cost` from `v_trip_totals`), create, read, update, delete,
   cover upload via multer.
2. Ownership guard in the service layer; other users' trips return 404.
3. Zod schemas for trip create/update including the date-span rules from §7.
4. Frontend hooks: `useTrips`, `useTrip`, `useCreateTrip`, `useUpdateTrip`, `useDeleteTrip`.
5. **Create Trip** — name, date range, description, budget limit, cover upload with preview;
   on save, route to the builder.
6. **My Trips** — status tabs, search, `TripCard` (cover, name, mono date range, stop count,
   total cost, over-budget badge), edit/view/delete with a confirm modal, empty state.
7. **Dashboard** — greeting with the user's name, next upcoming trip as a wide card with its
   Route Rail preview, recent trips row, popular cities row (from `/cities/popular`),
   a budget highlight stat, and "Plan a new trip" as the primary action.

**Acceptance**
- Create → appears in My Trips → edit persists → delete removes it and cascades in the DB.
- A trip with an end date before the start date is rejected with an inline message.
- Deleting the last trip shows the designed empty state, not a blank page.
- The dashboard renders entirely from API responses — grep for hardcoded arrays returns nothing.

---

## Phase 5 — Catalogue (City & Activity search)

**Context:** trips exist and can be opened. `cities` and `activities` are seeded but not yet
exposed to the UI.

**Goal:** screens 7 and 8, fast and filterable, with the "add to trip" path stubbed to the
builder that Phase 6 will finish.

**Tasks**
1. `cities` endpoints: list with `q` (trigram `ILIKE`), country, region, `maxCostIndex`, sort,
   pagination; detail (city + its activities); `popular`.
2. `activities` endpoints: list with `q`, `cityId`, `categoryId`, `maxCost`, `maxDuration`, sort,
   pagination; detail. `activity-categories` list, cached 60 s.
3. `countries` list for the filter dropdown.
4. **City Search** — search bar (300 ms debounce, query in the URL so results are shareable),
   filter sidebar collapsing to a drawer on mobile, result grid with image, country, mono cost
   index and avg daily cost, save-to-wishlist heart, "Add to trip" opening a trip picker modal.
5. **Activity Search** — category chips, cost and duration sliders, cards with image, mono
   duration and cost, quick-view drawer, "Add to stop" picker.
6. Both screens: skeleton loading, empty state that suggests clearing filters, error state with retry.

**Acceptance**
- Searching "par" returns Paris quickly and the URL reflects the query.
- Every filter combination returns correct rows, verified against the same SQL run in `psql`.
- No endpoint returns more than `limit` rows; the pagination control works at both ends.

---

## Phase 6 — Itinerary Builder

**Context:** trips, cities and activities all have working APIs and screens. This phase connects
them. The Route Rail component (§10.5) is introduced here and reused from now on.

**Goal:** screen 5 — the heart of the product.

**Tasks**
1. Backend stops: create, update, delete, reorder (transaction: rewrite `sort_order` for the whole
   trip). Validate stop dates against the trip range and against sibling stops; return 422 with a
   message naming the conflicting stop.
2. Backend trip activities: create (from catalogue or custom), update, delete, reorder within a day.
   Validate `scheduled_date` against the parent stop.
3. `GET /api/trips/:id` returns the full nested structure in ≤ 3 queries.
4. `RouteRail` component per §10.5 — city codes, mono date ranges, leg cost, active node.
5. Builder page: rail at the top; a `StopCard` per stop (city, editable dates, transport and
   accommodation cost, activity list, notes); "Add stop" opens the city picker; dnd-kit
   drag handles for stops and for activities inside a day; inline add of a custom activity.
6. Optimistic updates for reorder with rollback on failure; a per-stop subtotal that updates live.
7. Auto-derive a suggested arrival date for a new stop (previous stop's departure) — suggested in
   the form, never silently saved.

**Acceptance**
- Add 3 stops, reorder by drag, reload → the new order persists.
- A stop that overlaps another, or falls outside the trip dates, is refused with a clear message.
- Deleting a stop deletes its activities and resequences the remaining stops with no gap.
- Adding an activity from the catalogue copies its cost, and editing that cost does not change the
  catalogue row.

---

## Phase 7 — Itinerary View

**Context:** a trip can be fully built. `RouteRail` and the nested trip endpoint exist and are reused.

**Goal:** screen 6 — the read view a user reviews and prints.

**Tasks**
1. `GET /api/trips/:id/calendar` returning one entry per calendar day with its stop, activities and
   day cost (from `v_trip_daily_cost`).
2. Toggle between **day-wise** (chronological, day headers with date and running cost) and
   **grouped by city** (stop headers with their days nested).
3. Activity blocks: mono start time and duration, cost, category badge, notes; click to edit
   in a drawer without leaving the page.
4. Header summary strip: duration, stop count, activity count, total cost, over-budget badge.
5. A print stylesheet: hide nav and controls, black on white, page breaks between cities.

**Acceptance**
- Both view modes show identical data in different arrangements.
- A day with no activities renders a labelled free day, not an empty gap.
- `Ctrl+P` produces a clean one-column itinerary.

---

## Phase 8 — Budget & cost breakdown

**Context:** costs already live on `trip_stops` (transport, stay) and `trip_activities`. The views
from Phase 1 aggregate them. Nothing recomputes totals in JavaScript.

**Goal:** screen 9.

**Tasks**
1. `GET /api/trips/:id/budget` — category breakdown, per-day series, `total`, `cost_per_day`,
   `budget_limit`, `is_over_budget`, and the ids of days above 1.5× the daily average.
2. Expenses CRUD for meals/misc, optionally attached to a stop.
3. Budget page: total vs limit as a progress bar (sea under, alert over), Recharts pie by category
   and bar by day (both using the design tokens, no default chart palette), a per-stop cost table
   with mono figures, and an alert list naming the expensive days.
4. Inline editing of transport/stay per stop from this screen, invalidating the trip query.

**Acceptance**
- Totals match `SELECT * FROM v_trip_cost_breakdown` exactly for every demo trip.
- Adding a $200 expense updates the pie, the bar for that day, and the over-budget state.
- A trip with no costs shows a designed zero state, not a broken chart.

---

## Phase 9 — Calendar / Timeline

**Context:** the calendar endpoint from Phase 7 is already built. This phase is a second
presentation of it plus rescheduling.

**Goal:** screen 10.

**Tasks**
1. Month grid built with `date-fns` (no calendar library): days outside the trip are dimmed,
   each in-range day shows its city colour band, activity count and mono day cost.
2. Click a day → expandable panel listing that day's activities with quick edit and delete.
3. Drag an activity from one day to another → `PATCH /api/trip-activities/:id` with the new date;
   reject and roll back with a toast if the target day is outside the stop's range.
4. Vertical timeline toggle: a continuous rail of days, city change markers, "today" marked in amber.

**Acceptance**
- Dragging an activity to a valid day persists after reload; an invalid day is refused and reverts.
- A multi-month trip renders both months correctly with working navigation.

---

## Phase 10 — Share & copy

**Context:** the full private experience is complete. This phase adds the public surface, which
must expose no owner data.

**Goal:** screen 11.

**Tasks**
1. `POST /api/trips/:id/share` — set visibility, generate a 10-char `nanoid` slug on first publish,
   keep it stable afterwards; log `trip_published`.
2. `GET /api/public/trips/:slug` — no auth, restricted column set, 404 when private, inserts a
   `trip_views` row with the salted `viewer_hash`.
3. `POST /api/trips/:id/copy` — transaction: clone trip (+`copied_from_trip_id`), stops and
   activities, reset visibility to private, shift dates so day 1 lands on the copier's chosen
   start date; log `trip_copied`.
4. Public page `/s/:slug`: read-only itinerary with the Route Rail, cost summary, "Copy this trip"
   (routing guests to signup with a return URL), copy-link button, native share sheet fallback.
5. Share controls on the trip header: visibility toggle, link with copy button, view count.

**Acceptance**
- A private slug 404s in an incognito window; publishing makes it load with no owner email anywhere
  in the JSON.
- Copy creates an independent trip — editing the copy does not touch the original.
- Unpublishing immediately breaks the public link.

---

## Phase 11 — Profile, saved cities & admin

**Context:** all traveller-facing features are done. `activity_log`, `trip_views`, `v_city_usage`
and `v_activity_usage` have been collecting data since Phase 1.

**Goal:** screens 12 and 13.

**Tasks**
1. Profile page: editable name, home city, avatar upload, language preference; change password
   (requires current); saved cities grid with remove and "Add to a trip"; delete account behind a
   type-to-confirm modal.
2. Saved cities endpoints wired to the heart control already present on City Search.
3. Admin endpoints from §6.1, all paginated, all guarded by `authorize('admin')`.
4. Admin dashboard: stat tiles (users, trips, published trips, avg stops per trip, signups last
   30 days), a signups/trips line chart, top-10 cities and activities tables, a users table with
   search and role toggle, a recent-activity feed from `activity_log`.

**Acceptance**
- A non-admin hitting `/admin` or an admin endpoint gets 403 and a friendly redirect.
- Every admin number is reproducible by running the same SQL in `psql`.
- Deleting an account soft-deletes the user, removes their trips, and invalidates their tokens.

---

## Phase 12 — Hardening, audit & demo prep

**Context:** feature-complete. Nothing new is built here; this phase is where the hard
requirements are proven.

**Tasks**
1. **Static-data audit (R4).** Grep the whole `client/` tree for `.json` imports, `const ... = [`
   literals used as content, and any placeholder strings. Every hit is either deleted or replaced
   by an endpoint. Record the result in `docs/audit.md`.
2. **Third-party audit (R3).** Grep for `fetch(`/`axios` targeting anything outside our own API.
   List every dependency in `docs/audit.md` and justify it as a client library, not an API.
3. **Security pass (R8).** Confirm: parameterised SQL everywhere, no token in `localStorage`,
   helmet on, CORS allowlisted, rate limits live, uploads MIME-and-size checked, no stack traces
   in production responses, `.env` untracked and `.env.example` complete. Try 5 deliberate abuses
   (SQL injection in `q`, IDOR on another user's trip id, XSS in a trip name, oversized upload,
   expired token) and note each result.
4. **Performance (R8).** `EXPLAIN ANALYZE` the trip detail, city search and budget queries; add any
   missing index; verify the full trip loads in ≤ 3 queries; check the production bundle is
   code-split; run a Lighthouse pass and fix anything under 85.
5. **Validation sweep (R5).** Submit every form empty, over-length, and with hostile input; confirm
   each returns a field-level message and never a 500.
6. **UI consistency (R6).** Walk all 13 screens against §10: fonts, tokens, radii, focus rings,
   loading/empty/error states, mono figures, and mobile at 375 px. Fix drift.
7. **Navigation sweep.** Confirm the ≤ 2-click guarantee and that no screen is a dead end.
8. **README** with setup, env table, scripts, schema diagram, feature list mapped to the 13
   screens, and the demo credentials.
9. Rebuild the database from scratch (`migrate:down → up → seed`) and rehearse the §14 demo script
   end to end on the clean data.

**Acceptance**
- `docs/audit.md` shows zero static content sources and zero external API calls.
- All 13 screens work on a freshly seeded database.
- The demo script runs start to finish without a single console error.

---

## PROGRESS.md entry template

Append this after finishing each phase so later phases inherit accurate context.

```markdown
## Phase N — <name> — DONE <date>

**Built:** <2–4 lines: what now exists and works>
**Files added/changed:** <paths, grouped by server/client>
**Endpoints added:** <method + path list>
**Tables/views/migrations touched:** <names>
**Reusable pieces later phases must use:** <components, hooks, services>
**Deviations from PROJECT.md:** <none, or exactly what changed and why>
**Known gaps / TODO:** <anything deliberately deferred, and to which phase>
```

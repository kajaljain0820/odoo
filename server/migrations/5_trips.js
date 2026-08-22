/**
 * 5_trips
 * Tables: trips, trip_stops, trip_activities, trip_expenses
 *
 * Key design decisions:
 * - trip_stops.sort_order uses DEFERRABLE INITIALLY DEFERRED so a full reorder
 *   transaction can temporarily violate uniqueness mid-batch and commit cleanly.
 * - trip_activities.sort_order is also DEFERRABLE for the same reason (reorder
 *   within a day uses a transaction to rewrite all sort_orders).
 * - trip_activities.activity_id is nullable: NULL when the user typed a custom
 *   activity. The CHECK ensures at least one of activity_id or custom_title exists.
 * - Stop date vs trip date validation is service-layer only (the DB cannot cheaply
 *   join parent trip dates inside a stop CHECK constraint).
 */

export const up = (pgm) => {
  // ── trips ──────────────────────────────────────────────────────────────────
  pgm.sql(`
    CREATE TABLE trips (
      id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id             UUID         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
      name                TEXT         NOT NULL,
      description         TEXT         NULL,
      start_date          DATE         NOT NULL,
      end_date            DATE         NOT NULL,
      cover_photo_url     TEXT         NULL,
      budget_limit        NUMERIC(12,2) NULL,
      currency            CHAR(3)      NOT NULL DEFAULT 'USD',
      visibility          TEXT         NOT NULL DEFAULT 'private',
      share_slug          TEXT         NULL,
      copied_from_trip_id UUID         NULL REFERENCES trips (id) ON DELETE SET NULL,
      created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
      updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),

      CONSTRAINT trips_name_length   CHECK (char_length(name) BETWEEN 3 AND 120),
      CONSTRAINT trips_desc_length   CHECK (description IS NULL OR char_length(description) <= 1000),
      CONSTRAINT trips_date_order    CHECK (end_date >= start_date),
      CONSTRAINT trips_budget_pos    CHECK (budget_limit IS NULL OR budget_limit >= 0),
      CONSTRAINT trips_visibility    CHECK (visibility IN ('private','public')),
      CONSTRAINT trips_slug_unique   UNIQUE (share_slug)
    )
  `);

  pgm.sql(`
    CREATE TRIGGER set_trips_updated_at
      BEFORE UPDATE ON trips
      FOR EACH ROW EXECUTE FUNCTION set_updated_at()
  `);

  // ── trip_stops ─────────────────────────────────────────────────────────────
  pgm.sql(`
    CREATE TABLE trip_stops (
      id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
      trip_id             UUID          NOT NULL REFERENCES trips (id) ON DELETE CASCADE,
      city_id             UUID          NOT NULL REFERENCES cities (id) ON DELETE RESTRICT,
      arrival_date        DATE          NOT NULL,
      departure_date      DATE          NOT NULL,
      sort_order          INTEGER       NOT NULL,
      transport_cost      NUMERIC(12,2) NOT NULL DEFAULT 0,
      accommodation_cost  NUMERIC(12,2) NOT NULL DEFAULT 0,
      notes               TEXT          NULL,
      created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
      updated_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),

      CONSTRAINT ts_date_order     CHECK (departure_date >= arrival_date),
      CONSTRAINT ts_sort_order_pos CHECK (sort_order >= 0),
      CONSTRAINT ts_transport_pos  CHECK (transport_cost >= 0),
      CONSTRAINT ts_accom_pos      CHECK (accommodation_cost >= 0),

      -- DEFERRABLE so the reorder transaction can shift all sort_orders atomically
      CONSTRAINT ts_sort_order_unique UNIQUE (trip_id, sort_order) DEFERRABLE INITIALLY DEFERRED
    )
  `);

  pgm.sql(`
    CREATE TRIGGER set_trip_stops_updated_at
      BEFORE UPDATE ON trip_stops
      FOR EACH ROW EXECUTE FUNCTION set_updated_at()
  `);

  // ── trip_activities ────────────────────────────────────────────────────────
  pgm.sql(`
    CREATE TABLE trip_activities (
      id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
      trip_stop_id     UUID          NOT NULL REFERENCES trip_stops (id) ON DELETE CASCADE,
      activity_id      UUID          NULL  REFERENCES activities (id) ON DELETE SET NULL,
      custom_title     TEXT          NULL,
      scheduled_date   DATE          NOT NULL,
      start_time       TIME          NULL,
      duration_minutes INTEGER       NOT NULL DEFAULT 60,
      cost             NUMERIC(12,2) NOT NULL DEFAULT 0,
      currency         CHAR(3)       NOT NULL DEFAULT 'USD',
      sort_order       INTEGER       NOT NULL DEFAULT 0,
      notes            TEXT          NULL,
      created_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
      updated_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),

      CONSTRAINT ta_activity_or_title CHECK (activity_id IS NOT NULL OR custom_title IS NOT NULL),
      CONSTRAINT ta_duration_pos      CHECK (duration_minutes > 0),
      CONSTRAINT ta_cost_pos          CHECK (cost >= 0),
      CONSTRAINT ta_sort_order_pos    CHECK (sort_order >= 0),

      -- DEFERRABLE for same-day reorder transactions
      CONSTRAINT ta_sort_order_unique UNIQUE (trip_stop_id, scheduled_date, sort_order)
        DEFERRABLE INITIALLY DEFERRED
    )
  `);

  pgm.sql(`
    CREATE TRIGGER set_trip_activities_updated_at
      BEFORE UPDATE ON trip_activities
      FOR EACH ROW EXECUTE FUNCTION set_updated_at()
  `);

  // ── trip_expenses ──────────────────────────────────────────────────────────
  pgm.sql(`
    CREATE TABLE trip_expenses (
      id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
      trip_id      UUID          NOT NULL REFERENCES trips (id) ON DELETE CASCADE,
      trip_stop_id UUID          NULL  REFERENCES trip_stops (id) ON DELETE SET NULL,
      category     TEXT          NOT NULL,
      label        TEXT          NOT NULL,
      amount       NUMERIC(12,2) NOT NULL,
      currency     CHAR(3)       NOT NULL DEFAULT 'USD',
      incurred_on  DATE          NULL,
      created_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),

      CONSTRAINT te_category CHECK (
        category IN ('transport','stay','activities','meals','misc')
      ),
      CONSTRAINT te_amount_pos CHECK (amount >= 0)
    )
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS trip_expenses CASCADE`);
  pgm.sql(`DROP TABLE IF EXISTS trip_activities CASCADE`);
  pgm.sql(`DROP TABLE IF EXISTS trip_stops CASCADE`);
  pgm.sql(`DROP TABLE IF EXISTS trips CASCADE`);
};

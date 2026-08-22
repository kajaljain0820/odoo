/**
 * 7_indexes
 * All remaining indexes from §5.4 not already created inline in previous migrations.
 * GIN trigram indexes were already created in 4_catalogue.js alongside the tables.
 * This migration adds all composite, partial, and foreign-key indexes.
 */

export const up = (pgm) => {
  // ── users ──────────────────────────────────────────────────────────────────
  // (users_email_active_unique partial index was already created in 3_users_and_auth.js)

  // ── refresh_tokens ─────────────────────────────────────────────────────────
  pgm.sql(`CREATE INDEX IF NOT EXISTS rt_user_id     ON refresh_tokens (user_id)`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS rt_expires_at  ON refresh_tokens (expires_at)`);
  // token_hash has a UNIQUE constraint which already creates an index

  // ── countries ──────────────────────────────────────────────────────────────
  // iso2 and name have UNIQUE constraints; no extra index needed

  // ── cities ─────────────────────────────────────────────────────────────────
  pgm.sql(`CREATE INDEX IF NOT EXISTS cities_country_id       ON cities (country_id)`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS cities_popularity_desc  ON cities (popularity_score DESC)`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS cities_name             ON cities (name)`);
  // GIN trigram already created in 4_catalogue.js

  // ── activities ─────────────────────────────────────────────────────────────
  pgm.sql(`CREATE INDEX IF NOT EXISTS activities_city_id           ON activities (city_id)`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS activities_category_id       ON activities (category_id)`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS activities_avg_cost          ON activities (avg_cost)`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS activities_popularity_desc   ON activities (popularity_score DESC)`);
  // GIN trigram already created in 4_catalogue.js

  // ── trips ──────────────────────────────────────────────────────────────────
  pgm.sql(`CREATE INDEX IF NOT EXISTS trips_user_created ON trips (user_id, created_at DESC)`);
  // share_slug has a UNIQUE constraint (already an index)
  pgm.sql(`
    CREATE INDEX IF NOT EXISTS trips_public
      ON trips (visibility)
      WHERE visibility = 'public'
  `);

  // ── trip_stops ─────────────────────────────────────────────────────────────
  pgm.sql(`CREATE INDEX IF NOT EXISTS ts_trip_sort ON trip_stops (trip_id, sort_order)`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS ts_city_id  ON trip_stops (city_id)`);

  // ── trip_activities ────────────────────────────────────────────────────────
  pgm.sql(`
    CREATE INDEX IF NOT EXISTS ta_stop_date_order
      ON trip_activities (trip_stop_id, scheduled_date, sort_order)
  `);
  pgm.sql(`CREATE INDEX IF NOT EXISTS ta_activity_id ON trip_activities (activity_id)`);

  // ── trip_expenses ──────────────────────────────────────────────────────────
  pgm.sql(`CREATE INDEX IF NOT EXISTS te_trip_category ON trip_expenses (trip_id, category)`);

  // ── trip_views ─────────────────────────────────────────────────────────────
  pgm.sql(`CREATE INDEX IF NOT EXISTS tv_trip_viewed ON trip_views (trip_id, viewed_at DESC)`);

  // ── activity_log ───────────────────────────────────────────────────────────
  pgm.sql(`CREATE INDEX IF NOT EXISTS al_created_at      ON activity_log (created_at DESC)`);
  pgm.sql(`CREATE INDEX IF NOT EXISTS al_user_created_at ON activity_log (user_id, created_at DESC)`);
};

export const down = (pgm) => {
  const indexes = [
    'rt_user_id', 'rt_expires_at',
    'cities_country_id', 'cities_popularity_desc', 'cities_name',
    'activities_city_id', 'activities_category_id', 'activities_avg_cost', 'activities_popularity_desc',
    'trips_user_created', 'trips_public',
    'ts_trip_sort', 'ts_city_id',
    'ta_stop_date_order', 'ta_activity_id',
    'te_trip_category',
    'tv_trip_viewed',
    'al_created_at', 'al_user_created_at',
  ];
  for (const idx of indexes) {
    pgm.sql(`DROP INDEX IF EXISTS ${idx}`);
  }
};

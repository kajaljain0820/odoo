/**
 * 6_engagement
 * Tables: saved_cities, trip_views, activity_log
 *
 * - saved_cities: N:M join between users and cities (user wishlist / hearts)
 * - trip_views: public share analytics; viewer_hash is SHA-256(IP+UA+date) —
 *   no raw IP stored, satisfies data protection requirement
 * - activity_log: admin engagement feed; user_id is nullable (ON DELETE SET NULL)
 *   so log entries survive account deletion
 */

export const up = (pgm) => {
  // ── saved_cities ───────────────────────────────────────────────────────────
  pgm.sql(`
    CREATE TABLE saved_cities (
      user_id    UUID        NOT NULL REFERENCES users  (id) ON DELETE CASCADE,
      city_id    UUID        NOT NULL REFERENCES cities (id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

      PRIMARY KEY (user_id, city_id)
    )
  `);

  // ── trip_views ─────────────────────────────────────────────────────────────
  pgm.sql(`
    CREATE TABLE trip_views (
      id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      trip_id     UUID        NOT NULL REFERENCES trips (id) ON DELETE CASCADE,
      viewer_hash TEXT        NOT NULL,
      viewed_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  // ── activity_log ───────────────────────────────────────────────────────────
  pgm.sql(`
    CREATE TABLE activity_log (
      id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id     UUID        NULL REFERENCES users (id) ON DELETE SET NULL,
      action      TEXT        NOT NULL,
      entity_type TEXT        NULL,
      entity_id   UUID        NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

      CONSTRAINT al_action CHECK (
        action IN ('signup','login','trip_created','trip_published','trip_copied','stop_added','activity_added')
      )
    )
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS activity_log CASCADE`);
  pgm.sql(`DROP TABLE IF EXISTS trip_views CASCADE`);
  pgm.sql(`DROP TABLE IF EXISTS saved_cities CASCADE`);
};

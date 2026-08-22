/**
 * 4_catalogue
 * Tables: countries, cities, activity_categories, activities
 * GIN trigram indexes on cities.name and activities.name for fast ILIKE search
 */

export const up = (pgm) => {
  // ── countries ──────────────────────────────────────────────────────────────
  pgm.sql(`
    CREATE TABLE countries (
      id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
      name          TEXT    NOT NULL,
      iso2          CHAR(2) NOT NULL,
      region        TEXT    NOT NULL,
      currency_code CHAR(3) NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

      CONSTRAINT countries_name_unique UNIQUE (name),
      CONSTRAINT countries_iso2_unique UNIQUE (iso2),
      CONSTRAINT countries_region CHECK (
        region IN ('Asia','Europe','Africa','North America','South America','Oceania','Middle East')
      )
    )
  `);

  // ── cities ─────────────────────────────────────────────────────────────────
  pgm.sql(`
    CREATE TABLE cities (
      id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
      country_id       UUID         NOT NULL REFERENCES countries (id) ON DELETE RESTRICT,
      name             TEXT         NOT NULL,
      description      TEXT         NOT NULL,
      image_url        TEXT         NOT NULL,
      latitude         NUMERIC(9,6) NOT NULL,
      longitude        NUMERIC(9,6) NOT NULL,
      cost_index       NUMERIC(5,2) NOT NULL,
      avg_daily_cost   NUMERIC(12,2) NOT NULL,
      popularity_score INTEGER      NOT NULL DEFAULT 0,
      timezone         TEXT         NOT NULL,
      created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),

      CONSTRAINT cities_name_country_unique UNIQUE (country_id, name),
      CONSTRAINT cities_latitude_range  CHECK (latitude  BETWEEN -90  AND  90),
      CONSTRAINT cities_longitude_range CHECK (longitude BETWEEN -180 AND 180),
      CONSTRAINT cities_cost_index_pos  CHECK (cost_index > 0),
      CONSTRAINT cities_avg_daily_pos   CHECK (avg_daily_cost >= 0),
      CONSTRAINT cities_popularity_pos  CHECK (popularity_score >= 0)
    )
  `);

  // GIN trigram index for fast city name search (powers /api/cities?q=)
  pgm.sql(`
    CREATE INDEX cities_name_trgm ON cities USING GIN (name gin_trgm_ops)
  `);

  // ── activity_categories ────────────────────────────────────────────────────
  pgm.sql(`
    CREATE TABLE activity_categories (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name       TEXT NOT NULL,
      slug       TEXT NOT NULL,
      icon       TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

      CONSTRAINT ac_name_unique UNIQUE (name),
      CONSTRAINT ac_slug_unique UNIQUE (slug)
    )
  `);

  // ── activities ─────────────────────────────────────────────────────────────
  pgm.sql(`
    CREATE TABLE activities (
      id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
      city_id           UUID         NOT NULL REFERENCES cities (id) ON DELETE CASCADE,
      category_id       UUID         NOT NULL REFERENCES activity_categories (id) ON DELETE RESTRICT,
      name              TEXT         NOT NULL,
      description       TEXT         NOT NULL,
      image_url         TEXT         NOT NULL,
      avg_cost          NUMERIC(12,2) NOT NULL,
      currency          CHAR(3)      NOT NULL DEFAULT 'USD',
      duration_minutes  INTEGER      NOT NULL,
      popularity_score  INTEGER      NOT NULL DEFAULT 0,
      created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),

      CONSTRAINT activities_name_city_unique UNIQUE (city_id, name),
      CONSTRAINT activities_avg_cost_pos     CHECK (avg_cost >= 0),
      CONSTRAINT activities_duration_range   CHECK (duration_minutes BETWEEN 15 AND 1440),
      CONSTRAINT activities_popularity_pos   CHECK (popularity_score >= 0)
    )
  `);

  // GIN trigram index for fast activity name search (powers /api/activities?q=)
  pgm.sql(`
    CREATE INDEX activities_name_trgm ON activities USING GIN (name gin_trgm_ops)
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS activities CASCADE`);
  pgm.sql(`DROP TABLE IF EXISTS activity_categories CASCADE`);
  pgm.sql(`DROP TABLE IF EXISTS cities CASCADE`);
  pgm.sql(`DROP TABLE IF EXISTS countries CASCADE`);
};

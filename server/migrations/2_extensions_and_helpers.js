/**
 * 2_extensions_and_helpers
 * - Enable pgcrypto  → gen_random_uuid() for every table PK
 * - Enable pg_trgm   → GIN trigram indexes for fast ILIKE search on city/activity names
 * - Create the shared set_updated_at() trigger function used by every mutable table
 */

export const up = (pgm) => {
  // Extensions
  pgm.sql(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
  pgm.sql(`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`);

  // Shared trigger function — called by per-table triggers to keep updated_at fresh
  pgm.sql(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP FUNCTION IF EXISTS set_updated_at() CASCADE`);
  pgm.sql(`DROP EXTENSION IF EXISTS "pg_trgm"`);
  pgm.sql(`DROP EXTENSION IF EXISTS "pgcrypto"`);
};

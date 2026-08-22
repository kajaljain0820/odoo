/**
 * 3_users_and_auth
 * Tables: users, refresh_tokens, password_reset_tokens
 * Constraints: email lowercased + position, full_name length, role/language enums
 * Soft-delete: deleted_at on users only (all other tables hard-delete via CASCADE)
 */

export const up = (pgm) => {
  // ── users ──────────────────────────────────────────────────────────────────
  pgm.sql(`
    CREATE TABLE users (
      id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      email           TEXT        NOT NULL,
      password_hash   TEXT        NOT NULL,
      full_name       TEXT        NOT NULL,
      avatar_url      TEXT        NULL,
      city            TEXT        NULL,
      language_pref   TEXT        NOT NULL DEFAULT 'en',
      role            TEXT        NOT NULL DEFAULT 'user',
      last_login_at   TIMESTAMPTZ NULL,
      deleted_at      TIMESTAMPTZ NULL,
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

      CONSTRAINT users_email_unique   UNIQUE (email),
      CONSTRAINT users_email_lower    CHECK  (email = lower(email)),
      CONSTRAINT users_email_has_at   CHECK  (position('@' IN email) > 1),
      CONSTRAINT users_email_length   CHECK  (char_length(email) <= 254),
      CONSTRAINT users_name_length    CHECK  (char_length(full_name) BETWEEN 2 AND 80),
      CONSTRAINT users_language_pref  CHECK  (language_pref IN ('en','hi','fr','es','de')),
      CONSTRAINT users_role           CHECK  (role IN ('user','admin'))
    )
  `);

  // Trigger: keep updated_at current on every UPDATE
  pgm.sql(`
    CREATE TRIGGER set_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION set_updated_at()
  `);

  // Partial unique index: enforce email uniqueness only for non-deleted accounts
  pgm.sql(`
    CREATE UNIQUE INDEX users_email_active_unique
      ON users (lower(email))
      WHERE deleted_at IS NULL
  `);

  // ── refresh_tokens ─────────────────────────────────────────────────────────
  pgm.sql(`
    CREATE TABLE refresh_tokens (
      id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id     UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
      token_hash  TEXT        NOT NULL,
      expires_at  TIMESTAMPTZ NOT NULL,
      revoked_at  TIMESTAMPTZ NULL,
      user_agent  TEXT        NULL,
      ip          TEXT        NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

      CONSTRAINT refresh_tokens_hash_unique UNIQUE (token_hash)
    )
  `);

  // ── password_reset_tokens ──────────────────────────────────────────────────
  pgm.sql(`
    CREATE TABLE password_reset_tokens (
      id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id     UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
      token_hash  TEXT        NOT NULL,
      expires_at  TIMESTAMPTZ NOT NULL,
      used_at     TIMESTAMPTZ NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

      CONSTRAINT prt_hash_unique UNIQUE (token_hash)
    )
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS password_reset_tokens CASCADE`);
  pgm.sql(`DROP TABLE IF EXISTS refresh_tokens CASCADE`);
  pgm.sql(`DROP TABLE IF EXISTS users CASCADE`);
};

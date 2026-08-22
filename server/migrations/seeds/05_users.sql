-- 05_users.sql
-- 3 users: 1 admin, 2 regular.
-- Passwords (bcrypt cost 12, generated once and hardcoded for idempotency):
--   admin@globetrotter.dev  →  Admin@1234
--   alice@example.com       →  Alice@1234
--   bob@example.com         →  Bob@1234
--
-- Idempotent: ON CONFLICT (email) DO NOTHING.

INSERT INTO users (id, email, password_hash, full_name, city, role, language_pref) VALUES

  -- Admin
  ('e1000000-0000-0000-0000-000000000001',
   'admin@globetrotter.dev',
   '$2b$12$hcxNIh5DcK7ZvcytS4Koi.b.D3DjxR007SmM4fSOo/Xlujr7Mrt.K',
   'GlobeTrotter Admin',
   'San Francisco',
   'admin',
   'en'),

  -- Regular user Alice (owns the demo trips)
  ('e1000000-0000-0000-0000-000000000002',
   'alice@example.com',
   '$2b$12$5j2q5NQebiF7dvxm4v4gVOBCxu9vylY9zPlOyZdH8o/qx9rRif6sy',
   'Alice Martin',
   'London',
   'user',
   'en'),

  -- Regular user Bob
  ('e1000000-0000-0000-0000-000000000003',
   'bob@example.com',
   '$2b$12$E6HJZENkfs/hxnHOnLVJ..NkZfU8ssGHp2fG5EsNc3WBlGsSEGtbm',
   'Bob Chen',
   'New York',
   'user',
   'en')

ON CONFLICT (email) DO NOTHING;

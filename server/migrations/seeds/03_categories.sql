-- 03_categories.sql
-- 6 activity categories using lucide-react icon names.
-- Idempotent: ON CONFLICT (slug) DO NOTHING.

INSERT INTO activity_categories (id, name, slug, icon) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Sightseeing',   'sightseeing',  'landmark'),
  ('c1000000-0000-0000-0000-000000000002', 'Food & Drink',  'food-drink',   'utensils'),
  ('c1000000-0000-0000-0000-000000000003', 'Adventure',     'adventure',    'mountain'),
  ('c1000000-0000-0000-0000-000000000004', 'Culture',       'culture',      'palette'),
  ('c1000000-0000-0000-0000-000000000005', 'Nightlife',     'nightlife',    'music'),
  ('c1000000-0000-0000-0000-000000000006', 'Relaxation',    'relaxation',   'waves')
ON CONFLICT (slug) DO NOTHING;

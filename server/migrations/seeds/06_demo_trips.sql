-- 06_demo_trips.sql
-- 4 fully-built demo trips for Alice (e1000000-...-002):
--
--   Trip 1: "Weekend in Paris"          private draft, 1 stop, Paris
--   Trip 2: "European Summer"           published/public, 3 stops: Paris→Amsterdam→Prague
--   Trip 3: "Japan Highlights"          completed past trip, 2 stops: Tokyo→Kyoto
--   Trip 4: "NYC Splurge"               over-budget, 1 stop: New York, budget_limit set low
--
-- All dates use past/future dates relative to 2026 for realism.
-- Idempotent: ON CONFLICT (id) DO NOTHING throughout (deterministic UUIDs).
-- ─────────────────────────────────────────────────────────────────────────────

-- ══════════════════════════════════════════════════════════════════════════════
-- TRIP 1 — "Weekend in Paris"  (private draft, upcoming)
-- ══════════════════════════════════════════════════════════════════════════════
INSERT INTO trips (id, user_id, name, description, start_date, end_date, budget_limit, currency, visibility)
VALUES (
  'f1000000-0000-0000-0000-000000000001',
  'e1000000-0000-0000-0000-000000000002',
  'Weekend in Paris',
  'A quick romantic getaway to the City of Light. Just two nights but packing in the essentials.',
  '2026-09-12', '2026-09-14',
  500.00, 'USD', 'private'
) ON CONFLICT (id) DO NOTHING;

-- Stop: Paris
INSERT INTO trip_stops (id, trip_id, city_id, arrival_date, departure_date, sort_order, transport_cost, accommodation_cost, notes)
VALUES (
  'f1000000-0000-0000-0001-000000000001',
  'f1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',   -- Paris
  '2026-09-12', '2026-09-14',
  0, 120.00, 180.00,
  'Eurostar from London. Hotel near the Marais.'
) ON CONFLICT (id) DO NOTHING;

-- Activities for Paris stop
INSERT INTO trip_activities (id, trip_stop_id, activity_id, scheduled_date, start_time, duration_minutes, cost, sort_order)
VALUES
  ('f1000000-0000-0000-0002-000000000001',
   'f1000000-0000-0000-0001-000000000001',
   'd100-0000-0000-0000-000000000001', -- Eiffel Tower Visit
   '2026-09-12', '10:00', 120, 28.00, 0),

  ('f1000000-0000-0000-0002-000000000002',
   'f1000000-0000-0000-0001-000000000001',
   'd100-0000-0000-0000-000000000003', -- Montmartre Food Walk
   '2026-09-12', '14:00', 180, 35.00, 1),

  ('f1000000-0000-0000-0002-000000000003',
   'f1000000-0000-0000-0001-000000000001',
   'd100-0000-0000-0000-000000000002', -- Louvre Museum
   '2026-09-13', '09:00', 240, 17.00, 0),

  ('f1000000-0000-0000-0002-000000000004',
   'f1000000-0000-0000-0001-000000000001',
   'd100-0000-0000-0000-000000000004', -- Notre-Dame Cathedral
   '2026-09-13', '14:30', 60, 0.00, 1)
ON CONFLICT (id) DO NOTHING;


-- ══════════════════════════════════════════════════════════════════════════════
-- TRIP 2 — "European Summer"  (published public, upcoming)
-- share_slug is stable once set — hardcoded here
-- ══════════════════════════════════════════════════════════════════════════════
INSERT INTO trips (id, user_id, name, description, start_date, end_date, budget_limit, currency, visibility, share_slug)
VALUES (
  'f1000000-0000-0000-0000-000000000002',
  'e1000000-0000-0000-0000-000000000002',
  'European Summer',
  'Three classic capitals in twelve days: the Eiffel Tower, Amsterdam canals, and Prague castle. Budget-conscious but not boring.',
  '2026-10-01', '2026-10-12',
  2200.00, 'USD', 'public', 'eursum2026'
) ON CONFLICT (id) DO NOTHING;

-- Stop 0: Paris
INSERT INTO trip_stops (id, trip_id, city_id, arrival_date, departure_date, sort_order, transport_cost, accommodation_cost)
VALUES (
  'f1000000-0000-0000-0001-000000000002',
  'f1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000001',   -- Paris
  '2026-10-01', '2026-10-04',
  0, 110.00, 360.00
) ON CONFLICT (id) DO NOTHING;

-- Stop 1: Amsterdam
INSERT INTO trip_stops (id, trip_id, city_id, arrival_date, departure_date, sort_order, transport_cost, accommodation_cost)
VALUES (
  'f1000000-0000-0000-0001-000000000003',
  'f1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000004',   -- Amsterdam
  '2026-10-04', '2026-10-08',
  1, 45.00, 480.00
) ON CONFLICT (id) DO NOTHING;

-- Stop 2: Prague
INSERT INTO trip_stops (id, trip_id, city_id, arrival_date, departure_date, sort_order, transport_cost, accommodation_cost)
VALUES (
  'f1000000-0000-0000-0001-000000000004',
  'f1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000006',   -- Prague
  '2026-10-08', '2026-10-12',
  2, 38.00, 320.00
) ON CONFLICT (id) DO NOTHING;

-- Activities — Paris leg
INSERT INTO trip_activities (id, trip_stop_id, activity_id, scheduled_date, start_time, duration_minutes, cost, sort_order)
VALUES
  ('f1000000-0000-0000-0002-000000000005',
   'f1000000-0000-0000-0001-000000000002',
   'd100-0000-0000-0000-000000000001', -- Eiffel Tower
   '2026-10-01', '10:00', 120, 28.00, 0),

  ('f1000000-0000-0000-0002-000000000006',
   'f1000000-0000-0000-0001-000000000002',
   'd100-0000-0000-0000-000000000002', -- Louvre
   '2026-10-02', '09:30', 240, 17.00, 0),

  ('f1000000-0000-0000-0002-000000000007',
   'f1000000-0000-0000-0001-000000000002',
   'd100-0000-0000-0000-000000000005', -- Seine River Dinner Cruise
   '2026-10-02', '19:00', 150, 95.00, 1),

  ('f1000000-0000-0000-0002-000000000008',
   'f1000000-0000-0000-0001-000000000002',
   'd100-0000-0000-0000-000000000003', -- Montmartre Food Walk
   '2026-10-03', '12:00', 180, 35.00, 0)
ON CONFLICT (id) DO NOTHING;

-- Activities — Amsterdam leg
INSERT INTO trip_activities (id, trip_stop_id, activity_id, scheduled_date, start_time, duration_minutes, cost, sort_order)
VALUES
  ('f1000000-0000-0000-0002-000000000009',
   'f1000000-0000-0000-0001-000000000003',
   'd100-0000-0000-0000-000000000015', -- Rijksmuseum
   '2026-10-05', '10:00', 180, 22.50, 0),

  ('f1000000-0000-0000-0002-000000000010',
   'f1000000-0000-0000-0001-000000000003',
   'd100-0000-0000-0000-000000000016', -- Anne Frank House
   '2026-10-05', '14:00', 90, 16.00, 1),

  ('f1000000-0000-0000-0002-000000000011',
   'f1000000-0000-0000-0001-000000000003',
   'd100-0000-0000-0000-000000000017', -- Canal Bike Tour
   '2026-10-06', '09:00', 120, 20.00, 0),

  ('f1000000-0000-0000-0002-000000000012',
   'f1000000-0000-0000-0001-000000000003',
   'd100-0000-0000-0000-000000000018', -- Stroopwafel & Cheese Tasting
   '2026-10-07', '11:00', 90, 30.00, 0)
ON CONFLICT (id) DO NOTHING;

-- Activities — Prague leg
INSERT INTO trip_activities (id, trip_stop_id, activity_id, scheduled_date, start_time, duration_minutes, cost, sort_order)
VALUES
  ('f1000000-0000-0000-0002-000000000013',
   'f1000000-0000-0000-0001-000000000004',
   'd100-0000-0000-0000-000000000024', -- Prague Castle
   '2026-10-09', '09:00', 240, 15.00, 0),

  ('f1000000-0000-0000-0002-000000000014',
   'f1000000-0000-0000-0001-000000000004',
   'd100-0000-0000-0000-000000000025', -- Old Town Square
   '2026-10-09', '15:00', 60, 0.00, 1),

  ('f1000000-0000-0000-0002-000000000015',
   'f1000000-0000-0000-0001-000000000004',
   'd100-0000-0000-0000-000000000026', -- Czech Beer Tour
   '2026-10-10', '16:00', 120, 28.00, 0),

  ('f1000000-0000-0000-0002-000000000016',
   'f1000000-0000-0000-0001-000000000004',
   'd100-0000-0000-0000-000000000028', -- Jazz Boat
   '2026-10-11', '19:00', 150, 70.00, 0)
ON CONFLICT (id) DO NOTHING;

-- Expenses for European Summer
INSERT INTO trip_expenses (id, trip_id, trip_stop_id, category, label, amount, incurred_on)
VALUES
  ('f1000000-0000-0000-0003-000000000001',
   'f1000000-0000-0000-0000-000000000002',
   'f1000000-0000-0000-0001-000000000002',
   'meals', 'Café breakfasts in Paris', 42.00, '2026-10-01'),

  ('f1000000-0000-0000-0003-000000000002',
   'f1000000-0000-0000-0000-000000000002',
   'f1000000-0000-0000-0001-000000000003',
   'meals', 'Dinners in Amsterdam', 75.00, '2026-10-05'),

  ('f1000000-0000-0000-0003-000000000003',
   'f1000000-0000-0000-0000-000000000002',
   'f1000000-0000-0000-0001-000000000004',
   'misc', 'Souvenirs & postcards', 35.00, '2026-10-10')
ON CONFLICT (id) DO NOTHING;

-- Trip view record for the public trip
INSERT INTO trip_views (id, trip_id, viewer_hash, viewed_at)
VALUES
  ('f1000000-0000-0000-0004-000000000001',
   'f1000000-0000-0000-0000-000000000002',
   'a7f3c2e1d4b89065f23a1c9e7b452310d8f6a0e1234567890abcdef01234567',
   '2026-10-02 14:23:00+00'),

  ('f1000000-0000-0000-0004-000000000002',
   'f1000000-0000-0000-0000-000000000002',
   'b8e4d3f2a5c91176g34b2d0f8c563421e9g7b1f2345678901bcdef012345678',
   '2026-10-03 09:11:00+00')
ON CONFLICT (id) DO NOTHING;


-- ══════════════════════════════════════════════════════════════════════════════
-- TRIP 3 — "Japan Highlights"  (completed past trip)
-- ══════════════════════════════════════════════════════════════════════════════
INSERT INTO trips (id, user_id, name, description, start_date, end_date, budget_limit, currency, visibility)
VALUES (
  'f1000000-0000-0000-0000-000000000003',
  'e1000000-0000-0000-0000-000000000002',
  'Japan Highlights',
  'First time in Japan: ten days split between the electric capital and the ancient former imperial city.',
  '2026-03-15', '2026-03-24',
  3000.00, 'USD', 'private'
) ON CONFLICT (id) DO NOTHING;

-- Stop 0: Tokyo
INSERT INTO trip_stops (id, trip_id, city_id, arrival_date, departure_date, sort_order, transport_cost, accommodation_cost, notes)
VALUES (
  'f1000000-0000-0000-0001-000000000005',
  'f1000000-0000-0000-0000-000000000003',
  'b1000000-0000-0000-0000-000000000008',   -- Tokyo
  '2026-03-15', '2026-03-20',
  0, 900.00, 750.00,
  'Shinjuku area hotel. JR Pass covers all intercity trains.'
) ON CONFLICT (id) DO NOTHING;

-- Stop 1: Kyoto
INSERT INTO trip_stops (id, trip_id, city_id, arrival_date, departure_date, sort_order, transport_cost, accommodation_cost, notes)
VALUES (
  'f1000000-0000-0000-0001-000000000006',
  'f1000000-0000-0000-0000-000000000003',
  'b1000000-0000-0000-0000-000000000009',   -- Kyoto
  '2026-03-20', '2026-03-24',
  1, 0.00, 720.00,
  'Ryokan in Gion district. Shinkansen covered by JR Pass.'
) ON CONFLICT (id) DO NOTHING;

-- Activities — Tokyo
INSERT INTO trip_activities (id, trip_stop_id, activity_id, scheduled_date, start_time, duration_minutes, cost, sort_order)
VALUES
  ('f1000000-0000-0000-0002-000000000017',
   'f1000000-0000-0000-0001-000000000005',
   'd100-0000-0000-0000-000000000029', -- Senso-ji Temple
   '2026-03-15', '10:00', 90, 0.00, 0),

  ('f1000000-0000-0000-0002-000000000018',
   'f1000000-0000-0000-0001-000000000005',
   'd100-0000-0000-0000-000000000030', -- Tsukiji Breakfast
   '2026-03-16', '08:00', 90, 25.00, 0),

  ('f1000000-0000-0000-0002-000000000019',
   'f1000000-0000-0000-0001-000000000005',
   'd100-0000-0000-0000-000000000031', -- teamLab Borderless
   '2026-03-16', '14:00', 180, 32.00, 1),

  ('f1000000-0000-0000-0002-000000000020',
   'f1000000-0000-0000-0001-000000000005',
   'd100-0000-0000-0000-000000000034', -- Tokyo Skytree
   '2026-03-17', '10:00', 90, 22.00, 0),

  ('f1000000-0000-0000-0002-000000000021',
   'f1000000-0000-0000-0001-000000000005',
   'd100-0000-0000-0000-000000000032', -- Ramen Tasting
   '2026-03-18', '19:00', 120, 30.00, 0),

  ('f1000000-0000-0000-0002-000000000022',
   'f1000000-0000-0000-0001-000000000005',
   'd100-0000-0000-0000-000000000033', -- Shibuya Crossing
   '2026-03-19', '20:00', 180, 40.00, 0)
ON CONFLICT (id) DO NOTHING;

-- Activities — Kyoto
INSERT INTO trip_activities (id, trip_stop_id, activity_id, scheduled_date, start_time, duration_minutes, cost, sort_order)
VALUES
  ('f1000000-0000-0000-0002-000000000023',
   'f1000000-0000-0000-0001-000000000006',
   'd100-0000-0000-0000-000000000035', -- Fushimi Inari
   '2026-03-20', '07:00', 120, 0.00, 0),

  ('f1000000-0000-0000-0002-000000000024',
   'f1000000-0000-0000-0001-000000000006',
   'd100-0000-0000-0000-000000000036', -- Arashiyama Bamboo Grove
   '2026-03-21', '08:00', 90, 0.00, 0),

  ('f1000000-0000-0000-0002-000000000025',
   'f1000000-0000-0000-0001-000000000006',
   'd100-0000-0000-0000-000000000037', -- Tea Ceremony
   '2026-03-21', '14:00', 60, 35.00, 1),

  ('f1000000-0000-0000-0002-000000000026',
   'f1000000-0000-0000-0001-000000000006',
   'd100-0000-0000-0000-000000000038', -- Nishiki Market
   '2026-03-22', '11:00', 90, 20.00, 0),

  ('f1000000-0000-0000-0002-000000000027',
   'f1000000-0000-0000-0001-000000000006',
   'd100-0000-0000-0000-000000000169', -- Gion Night Walk
   '2026-03-22', '19:00', 60, 0.00, 1),

  ('f1000000-0000-0000-0002-000000000028',
   'f1000000-0000-0000-0001-000000000006',
   'd100-0000-0000-0000-000000000039', -- Ryokan Onsen Stay
   '2026-03-23', '15:00', 720, 180.00, 0)
ON CONFLICT (id) DO NOTHING;

-- Expenses for Japan trip
INSERT INTO trip_expenses (id, trip_id, trip_stop_id, category, label, amount, incurred_on)
VALUES
  ('f1000000-0000-0000-0003-000000000004',
   'f1000000-0000-0000-0000-000000000003',
   NULL,
   'transport', 'JR Pass (14-day)', 435.00, '2026-03-15'),

  ('f1000000-0000-0000-0003-000000000005',
   'f1000000-0000-0000-0000-000000000003',
   'f1000000-0000-0000-0001-000000000005',
   'meals', 'Tokyo restaurant meals', 120.00, '2026-03-17'),

  ('f1000000-0000-0000-0003-000000000006',
   'f1000000-0000-0000-0000-000000000003',
   'f1000000-0000-0000-0001-000000000006',
   'meals', 'Kyoto kaiseki & street food', 95.00, '2026-03-21'),

  ('f1000000-0000-0000-0003-000000000007',
   'f1000000-0000-0000-0000-000000000003',
   NULL,
   'misc', 'Souvenirs & omiyage gifts', 80.00, '2026-03-23')
ON CONFLICT (id) DO NOTHING;


-- ══════════════════════════════════════════════════════════════════════════════
-- TRIP 4 — "NYC Splurge"  (over-budget: total costs exceed budget_limit)
-- ══════════════════════════════════════════════════════════════════════════════
INSERT INTO trips (id, user_id, name, description, start_date, end_date, budget_limit, currency, visibility)
VALUES (
  'f1000000-0000-0000-0000-000000000004',
  'e1000000-0000-0000-0000-000000000002',
  'NYC Splurge',
  'Five days in New York living large — Broadway, fine dining, rooftop bars. Budget was aspirational.',
  '2026-11-10', '2026-11-14',
  800.00, 'USD', 'private'
) ON CONFLICT (id) DO NOTHING;

-- Stop: New York
INSERT INTO trip_stops (id, trip_id, city_id, arrival_date, departure_date, sort_order, transport_cost, accommodation_cost, notes)
VALUES (
  'f1000000-0000-0000-0001-000000000007',
  'f1000000-0000-0000-0000-000000000004',
  'b1000000-0000-0000-0000-000000000018',   -- New York
  '2026-11-10', '2026-11-14',
  0, 320.00, 720.00,
  'Midtown hotel. Return flight from Chicago included in transport cost.'
) ON CONFLICT (id) DO NOTHING;

-- Activities — over-budget NY trip
INSERT INTO trip_activities (id, trip_stop_id, activity_id, scheduled_date, start_time, duration_minutes, cost, sort_order)
VALUES
  ('f1000000-0000-0000-0002-000000000029',
   'f1000000-0000-0000-0001-000000000007',
   'd100-0000-0000-0000-000000000069', -- Top of the Rock
   '2026-11-10', '16:00', 90, 40.00, 0),

  ('f1000000-0000-0000-0002-000000000030',
   'f1000000-0000-0000-0001-000000000007',
   'd100-0000-0000-0000-000000000070', -- Met Museum
   '2026-11-11', '10:00', 240, 30.00, 0),

  ('f1000000-0000-0000-0002-000000000031',
   'f1000000-0000-0000-0001-000000000007',
   'd100-0000-0000-0000-000000000073', -- Jazz at the Blue Note
   '2026-11-11', '20:00', 150, 55.00, 1),

  ('f1000000-0000-0000-0002-000000000032',
   'f1000000-0000-0000-0001-000000000007',
   'd100-0000-0000-0000-000000000074', -- Statue of Liberty
   '2026-11-12', '09:00', 300, 25.00, 0),

  ('f1000000-0000-0000-0002-000000000033',
   'f1000000-0000-0000-0001-000000000007',
   'd100-0000-0000-0000-000000000071', -- Chelsea Market
   '2026-11-12', '14:00', 120, 35.00, 1),

  ('f1000000-0000-0000-0002-000000000034',
   'f1000000-0000-0000-0001-000000000007',
   'd100-0000-0000-0000-000000000072', -- Central Park Bike
   '2026-11-13', '10:00', 120, 15.00, 0),

  -- Custom activity (no catalogue activity_id) — Broadway show
  ('f1000000-0000-0000-0002-000000000035',
   'f1000000-0000-0000-0001-000000000007',
   NULL, -- custom
   '2026-11-13', '19:30', 150, 185.00, 1)
ON CONFLICT (id) DO NOTHING;

-- Update the custom activity with a custom_title (activity_id is NULL)
UPDATE trip_activities
  SET custom_title = 'Broadway Show: Hamilton'
WHERE id = 'f1000000-0000-0000-0002-000000000035'
  AND custom_title IS NULL;

-- Expenses for NYC Splurge
INSERT INTO trip_expenses (id, trip_id, trip_stop_id, category, label, amount, incurred_on)
VALUES
  ('f1000000-0000-0000-0003-000000000008',
   'f1000000-0000-0000-0000-000000000004',
   'f1000000-0000-0000-0001-000000000007',
   'meals', 'Fine dining & cocktail bars', 310.00, '2026-11-11'),

  ('f1000000-0000-0000-0003-000000000009',
   'f1000000-0000-0000-0000-000000000004',
   'f1000000-0000-0000-0001-000000000007',
   'misc', 'Shopping on 5th Avenue', 220.00, '2026-11-12'),

  ('f1000000-0000-0000-0003-000000000010',
   'f1000000-0000-0000-0000-000000000004',
   'f1000000-0000-0000-0001-000000000007',
   'meals', 'Brunch & street food', 85.00, '2026-11-13')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Activity log entries for the demo trips
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO activity_log (id, user_id, action, entity_type, entity_id, created_at)
VALUES
  ('f2000000-0000-0000-0000-000000000001',
   'e1000000-0000-0000-0000-000000000002',
   'signup', 'user', 'e1000000-0000-0000-0000-000000000002', '2026-01-15 10:00:00+00'),

  ('f2000000-0000-0000-0000-000000000002',
   'e1000000-0000-0000-0000-000000000002',
   'trip_created', 'trip', 'f1000000-0000-0000-0000-000000000001', '2026-08-01 12:00:00+00'),

  ('f2000000-0000-0000-0000-000000000003',
   'e1000000-0000-0000-0000-000000000002',
   'trip_created', 'trip', 'f1000000-0000-0000-0000-000000000002', '2026-08-05 14:00:00+00'),

  ('f2000000-0000-0000-0000-000000000004',
   'e1000000-0000-0000-0000-000000000002',
   'trip_published', 'trip', 'f1000000-0000-0000-0000-000000000002', '2026-08-06 09:00:00+00'),

  ('f2000000-0000-0000-0000-000000000005',
   'e1000000-0000-0000-0000-000000000002',
   'trip_created', 'trip', 'f1000000-0000-0000-0000-000000000003', '2026-02-01 11:00:00+00'),

  ('f2000000-0000-0000-0000-000000000006',
   'e1000000-0000-0000-0000-000000000002',
   'trip_created', 'trip', 'f1000000-0000-0000-0000-000000000004', '2026-08-10 16:00:00+00')
ON CONFLICT (id) DO NOTHING;

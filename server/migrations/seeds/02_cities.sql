-- 02_cities.sql
-- 40 cities: real coordinates, cost_index (100 = baseline USD ~$100/day),
-- avg_daily_cost in USD, popularity_score, IANA timezone.
-- Idempotent: ON CONFLICT (country_id, name) DO NOTHING.

INSERT INTO cities (id, country_id, name, description, image_url, latitude, longitude, cost_index, avg_daily_cost, popularity_score, timezone) VALUES

-- ── France (3 cities) ──────────────────────────────────────────────────────
('b1000000-0000-0000-0000-000000000001',
 'a1000000-0000-0000-0000-000000000001',
 'Paris',
 'The City of Light dazzles with iconic landmarks, world-class museums, and an unmatched café culture.',
 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
 48.856613, 2.352222, 145.00, 145.00, 98, 'Europe/Paris'),

('b1000000-0000-0000-0000-000000000002',
 'a1000000-0000-0000-0000-000000000001',
 'Nice',
 'A sun-drenched Riviera gem with a stunning coastline, vibrant old town, and easy access to Monaco.',
 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=800',
 43.710173, 7.262011, 130.00, 130.00, 72, 'Europe/Paris'),

('b1000000-0000-0000-0000-000000000003',
 'a1000000-0000-0000-0000-000000000001',
 'Lyon',
 'France''s gastronomic capital sits where the Rhône and Saône meet, with a UNESCO-listed old town.',
 'https://images.unsplash.com/photo-1618767689160-da3fb810aad5?w=800',
 45.764043, 4.835659, 115.00, 115.00, 58, 'Europe/Paris'),

-- ── Netherlands (2 cities) ─────────────────────────────────────────────────
('b1000000-0000-0000-0000-000000000004',
 'a1000000-0000-0000-0000-000000000002',
 'Amsterdam',
 'Canals, golden-age architecture, world-class museums, and a vibrant cycling culture define this Dutch capital.',
 'https://images.unsplash.com/photo-1512470604718-d55db9b08e64?w=800',
 52.370216, 4.895168, 140.00, 140.00, 92, 'Europe/Amsterdam'),

('b1000000-0000-0000-0000-000000000005',
 'a1000000-0000-0000-0000-000000000002',
 'Rotterdam',
 'Europe''s largest port city surprises visitors with bold modern architecture and a thriving food scene.',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
 51.924420, 4.477733, 120.00, 120.00, 48, 'Europe/Amsterdam'),

-- ── Czech Republic (2 cities) ──────────────────────────────────────────────
('b1000000-0000-0000-0000-000000000006',
 'a1000000-0000-0000-0000-000000000003',
 'Prague',
 'A perfectly preserved medieval old town, castle district, and legendary beer scene make Prague unmissable.',
 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800',
 50.075538, 14.437800, 90.00, 90.00, 88, 'Europe/Prague'),

('b1000000-0000-0000-0000-000000000007',
 'a1000000-0000-0000-0000-000000000003',
 'Brno',
 'The Czech Republic''s second city offers Baroque architecture, a thriving student scene, and fewer crowds.',
 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800',
 49.195061, 16.606836, 70.00, 70.00, 32, 'Europe/Prague'),

-- ── Japan (4 cities) ───────────────────────────────────────────────────────
('b1000000-0000-0000-0000-000000000008',
 'a1000000-0000-0000-0000-000000000004',
 'Tokyo',
 'A seamless blend of ultra-modern skyscrapers, ancient temples, and the world''s most diverse food scene.',
 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
 35.689487, 139.691711, 160.00, 160.00, 97, 'Asia/Tokyo'),

('b1000000-0000-0000-0000-000000000009',
 'a1000000-0000-0000-0000-000000000004',
 'Kyoto',
 'Thousands of temples, traditional ryokan inns, and the ethereal Arashiyama bamboo grove await.',
 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
 35.011636, 135.768029, 130.00, 130.00, 91, 'Asia/Tokyo'),

('b1000000-0000-0000-0000-000000000010',
 'a1000000-0000-0000-0000-000000000004',
 'Osaka',
 'Japan''s kitchen city is famous for street food, exuberant locals, Dotonbori neon, and Osaka Castle.',
 'https://images.unsplash.com/photo-1588928859693-e49b6ab68e40?w=800',
 34.693738, 135.502165, 140.00, 140.00, 85, 'Asia/Tokyo'),

('b1000000-0000-0000-0000-000000000011',
 'a1000000-0000-0000-0000-000000000004',
 'Hiroshima',
 'A city of resilience, the Peace Memorial Park and the haunting Atomic Bomb Dome attract visitors from around the world.',
 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
 34.385208, 132.455293, 100.00, 100.00, 65, 'Asia/Tokyo'),

-- ── Thailand (3 cities) ────────────────────────────────────────────────────
('b1000000-0000-0000-0000-000000000012',
 'a1000000-0000-0000-0000-000000000005',
 'Bangkok',
 'A frenetic city of floating markets, golden temples, world-class street food, and electric nightlife.',
 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=800',
 13.756331, 100.501762, 75.00, 75.00, 90, 'Asia/Bangkok'),

('b1000000-0000-0000-0000-000000000013',
 'a1000000-0000-0000-0000-000000000005',
 'Chiang Mai',
 'Northern Thailand''s cultural heart offers ancient walled city temples, elephant sanctuaries, and cool mountain air.',
 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
 18.788997, 98.985257, 55.00, 55.00, 76, 'Asia/Bangkok'),

('b1000000-0000-0000-0000-000000000014',
 'a1000000-0000-0000-0000-000000000005',
 'Phuket',
 'Crystal-clear Andaman waters, vibrant beach clubs, and a charming old town make Phuket irresistible.',
 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800',
 7.878978, 98.398392, 80.00, 80.00, 82, 'Asia/Bangkok'),

-- ── India (3 cities) ───────────────────────────────────────────────────────
('b1000000-0000-0000-0000-000000000015',
 'a1000000-0000-0000-0000-000000000006',
 'Mumbai',
 'India''s financial capital melds colonial-era grandeur, Bollywood glamour, and legendary street food.',
 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
 19.076090, 72.877426, 50.00, 50.00, 78, 'Asia/Kolkata'),

('b1000000-0000-0000-0000-000000000016',
 'a1000000-0000-0000-0000-000000000006',
 'Jaipur',
 'The Pink City dazzles with rose-hued palaces, bustling bazaars, and the majestic Amber Fort.',
 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800',
 26.912434, 75.787270, 40.00, 40.00, 72, 'Asia/Kolkata'),

('b1000000-0000-0000-0000-000000000017',
 'a1000000-0000-0000-0000-000000000006',
 'Goa',
 'Portuguese-flavoured beach paradise with palm-fringed coastline, spice markets, and vibrant nightlife.',
 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
 15.299326, 74.123996, 45.00, 45.00, 68, 'Asia/Kolkata'),

-- ── United States (5 cities) ───────────────────────────────────────────────
('b1000000-0000-0000-0000-000000000018',
 'a1000000-0000-0000-0000-000000000007',
 'New York',
 'The city that never sleeps: iconic skyline, world-class museums, Central Park, and endless neighborhoods.',
 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
 40.712776, -74.005974, 200.00, 200.00, 99, 'America/New_York'),

('b1000000-0000-0000-0000-000000000019',
 'a1000000-0000-0000-0000-000000000007',
 'Los Angeles',
 'Hollywood glamour, year-round sunshine, diverse food scenes, and stunning Pacific coastline.',
 'https://images.unsplash.com/photo-1580655653885-65763b2597d1?w=800',
 34.052235, -118.243683, 180.00, 180.00, 87, 'America/Los_Angeles'),

('b1000000-0000-0000-0000-000000000020',
 'a1000000-0000-0000-0000-000000000007',
 'Chicago',
 'The Windy City impresses with stunning architecture, deep-dish pizza, blues clubs, and Lake Michigan.',
 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
 41.878113, -87.629799, 160.00, 160.00, 75, 'America/Chicago'),

('b1000000-0000-0000-0000-000000000021',
 'a1000000-0000-0000-0000-000000000007',
 'New Orleans',
 'Jazz birthplace with Creole cuisine, exuberant Mardi Gras spirit, and a charming French Quarter.',
 'https://images.unsplash.com/photo-1569023538034-0af35c0b1f5a?w=800',
 29.951065, -90.071533, 130.00, 130.00, 63, 'America/Chicago'),

('b1000000-0000-0000-0000-000000000022',
 'a1000000-0000-0000-0000-000000000007',
 'San Francisco',
 'Fog-kissed hills, the Golden Gate Bridge, Alcatraz, sourdough bread, and a thriving tech culture.',
 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800',
 37.774929, -122.419416, 185.00, 185.00, 80, 'America/Los_Angeles'),

-- ── Mexico (3 cities) ──────────────────────────────────────────────────────
('b1000000-0000-0000-0000-000000000023',
 'a1000000-0000-0000-0000-000000000008',
 'Mexico City',
 'One of the world''s great megacities: ancient Aztec ruins, superb museums, and a world-beating food scene.',
 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800',
 19.432608, -99.133208, 70.00, 70.00, 77, 'America/Mexico_City'),

('b1000000-0000-0000-0000-000000000024',
 'a1000000-0000-0000-0000-000000000008',
 'Cancún',
 'Turquoise Caribbean waters, Mayan ruins at Chichén Itzá, and all-inclusive resort strips.',
 'https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=800',
 21.161908, -86.851524, 100.00, 100.00, 69, 'America/Cancun'),

('b1000000-0000-0000-0000-000000000025',
 'a1000000-0000-0000-0000-000000000008',
 'Oaxaca',
 'Artisan crafts, mezcal distilleries, ancestral Zapotec ruins, and some of Mexico''s finest cuisine.',
 'https://images.unsplash.com/photo-1590059913761-4dcaa70e79e9?w=800',
 17.059729, -96.722199, 55.00, 55.00, 55, 'America/Mexico_City'),

-- ── Brazil (3 cities) ──────────────────────────────────────────────────────
('b1000000-0000-0000-0000-000000000026',
 'a1000000-0000-0000-0000-000000000009',
 'Rio de Janeiro',
 'Christ the Redeemer, Copacabana Beach, Carnival fever, and the dramatic Sugarloaf Mountain.',
 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800',
 -22.906847, -43.172897, 95.00, 95.00, 88, 'America/Sao_Paulo'),

('b1000000-0000-0000-0000-000000000027',
 'a1000000-0000-0000-0000-000000000009',
 'São Paulo',
 'Brazil''s economic powerhouse with a world-class restaurant scene, contemporary art, and vibrant nightlife.',
 'https://images.unsplash.com/photo-1535551951406-a19828b0a76b?w=800',
 -23.550520, -46.633309, 90.00, 90.00, 65, 'America/Sao_Paulo'),

('b1000000-0000-0000-0000-000000000028',
 'a1000000-0000-0000-0000-000000000009',
 'Salvador',
 'The cradle of Afro-Brazilian culture: colonial Pelourinho district, candomblé music, and seafood moqueca.',
 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800',
 -12.977749, -38.501630, 60.00, 60.00, 44, 'America/Bahia'),

-- ── Morocco (3 cities) ────────────────────────────────────────────────────
('b1000000-0000-0000-0000-000000000029',
 'a1000000-0000-0000-0000-000000000010',
 'Marrakech',
 'Sensory overload in the best way: the Djemaa el-Fna square, labyrinthine medina, and luxuriant riads.',
 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800',
 31.628674, -7.992047, 65.00, 65.00, 84, 'Africa/Casablanca'),

('b1000000-0000-0000-0000-000000000030',
 'a1000000-0000-0000-0000-000000000010',
 'Fes',
 'The oldest of Morocco''s imperial cities, home to the world''s largest car-free urban area and ancient tanneries.',
 'https://images.unsplash.com/photo-1577147443647-81856d5151af?w=800',
 34.033333, -5.000000, 55.00, 55.00, 60, 'Africa/Casablanca'),

('b1000000-0000-0000-0000-000000000031',
 'a1000000-0000-0000-0000-000000000010',
 'Casablanca',
 'Morocco''s cosmopolitan business hub blends French Art Deco architecture with the vast Hassan II Mosque.',
 'https://images.unsplash.com/photo-1539035985090-e5b9f51c8be0?w=800',
 33.589886, -7.603869, 70.00, 70.00, 52, 'Africa/Casablanca'),

-- ── Australia (4 cities) ───────────────────────────────────────────────────
('b1000000-0000-0000-0000-000000000032',
 'a1000000-0000-0000-0000-000000000011',
 'Sydney',
 'Opera House sails, Bondi Beach surf, harbour bridge climbs, and a buzzing multicultural food scene.',
 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
 -33.868820, 151.209290, 175.00, 175.00, 93, 'Australia/Sydney'),

('b1000000-0000-0000-0000-000000000033',
 'a1000000-0000-0000-0000-000000000011',
 'Melbourne',
 'Australia''s coffee capital: laneway street art, world-class dining, AFL passion, and cultural festivals.',
 'https://images.unsplash.com/photo-1545044846-351ba102b6d5?w=800',
 -37.813629, 144.963058, 165.00, 165.00, 85, 'Australia/Melbourne'),

('b1000000-0000-0000-0000-000000000034',
 'a1000000-0000-0000-0000-000000000011',
 'Brisbane',
 'The gateway to Queensland''s Sunshine Coast and Gold Coast, with a warm climate and a relaxed riverside vibe.',
 'https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=800',
 -27.469771, 153.025131, 145.00, 145.00, 62, 'Australia/Brisbane'),

('b1000000-0000-0000-0000-000000000035',
 'a1000000-0000-0000-0000-000000000011',
 'Perth',
 'Isolated but stunning: pristine Indian Ocean beaches, world-class wine country, and effortless outdoor living.',
 'https://images.unsplash.com/photo-1559628233-100c798642d8?w=800',
 -31.950527, 115.860457, 155.00, 155.00, 50, 'Australia/Perth'),

-- ── UAE (3 cities) ────────────────────────────────────────────────────────
('b1000000-0000-0000-0000-000000000036',
 'a1000000-0000-0000-0000-000000000012',
 'Dubai',
 'Record-breaking architecture, luxury shopping, desert safaris, and world-class hospitality in the Gulf.',
 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
 25.204849, 55.270783, 220.00, 220.00, 95, 'Asia/Dubai'),

('b1000000-0000-0000-0000-000000000037',
 'a1000000-0000-0000-0000-000000000012',
 'Abu Dhabi',
 'The UAE capital impresses with the magnificent Sheikh Zayed Grand Mosque, Louvre Abu Dhabi, and the F1 circuit.',
 'https://images.unsplash.com/photo-1563188091-8b15a8ab71d7?w=800',
 24.453884, 54.377344, 200.00, 200.00, 75, 'Asia/Dubai'),

('b1000000-0000-0000-0000-000000000038',
 'a1000000-0000-0000-0000-000000000012',
 'Sharjah',
 'The UAE''s cultural capital: Islamic arts, heritage areas, and museums just 15 minutes from Dubai.',
 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
 25.346234, 55.420176, 140.00, 140.00, 35, 'Asia/Dubai'),

-- ── 2 bonus cities to reach 40 ────────────────────────────────────────────
('b1000000-0000-0000-0000-000000000039',
 'a1000000-0000-0000-0000-000000000006',
 'Delhi',
 'India''s sprawling capital pairs Mughal grandeur — the Red Fort, Humayun''s Tomb — with frenetic modernity.',
 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
 28.613939, 77.209021, 45.00, 45.00, 80, 'Asia/Kolkata'),

('b1000000-0000-0000-0000-000000000040',
 'a1000000-0000-0000-0000-000000000005',
 'Koh Samui',
 'Thailand''s island paradise: powdery white beaches, jungle waterfalls, and secluded luxury villas.',
 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800',
 9.512674, 100.062531, 70.00, 70.00, 66, 'Asia/Bangkok')

ON CONFLICT (country_id, name) DO NOTHING;

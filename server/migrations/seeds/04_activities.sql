-- 04_activities.sql
-- 180+ activities, 4-6 per city across all 40 cities and all 6 categories.
-- avg_cost in USD, duration_minutes, popularity_score (0-100).
-- Idempotent: ON CONFLICT (city_id, name) DO NOTHING.

-- Category ID shortcuts (used throughout):
--   c1 = Sightseeing  c2 = Food & Drink  c3 = Adventure
--   c4 = Culture      c5 = Nightlife     c6 = Relaxation

INSERT INTO activities (id, city_id, category_id, name, description, image_url, avg_cost, duration_minutes, popularity_score) VALUES

-- ── Paris ─────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000001',
 'Eiffel Tower Visit','Ascend the iron lattice icon for panoramic city views — book tickets early to skip the queue.',
 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600',28.00,120,99),

('d100-0000-0000-0000-000000000002','b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000004',
 'Louvre Museum','Home to the Mona Lisa and thousands of masterpieces spanning millennia of human art.',
 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600',17.00,240,97),

('d100-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000002',
 'Montmartre Food Walk','Crepes, macarons, and wine in the village-like hilltop neighbourhood beloved by artists.',
 'https://images.unsplash.com/photo-1587374174258-2d6f38a023a1?w=600',35.00,180,88),

('d100-0000-0000-0000-000000000004','b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000001',
 'Notre-Dame Cathedral','Gothic masterpiece on the Île de la Cité — currently being restored and partially open.',
 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600',0.00,60,90),

('d100-0000-0000-0000-000000000005','b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000005',
 'Seine River Dinner Cruise','Glide past illuminated monuments while enjoying a three-course French dinner.',
 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',95.00,150,82),

('d100-0000-0000-0000-000000000006','b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000006',
 'Luxembourg Gardens Stroll','Relax among manicured lawns, fountains, and chess players in this classic Parisian park.',
 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',0.00,90,75),

-- ── Nice ──────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000007','b1000000-0000-0000-0000-000000000002','c1000000-0000-0000-0000-000000000006',
 'Promenade des Anglais Stroll','Walk the legendary seafront boulevard with views of the azure Mediterranean.',
 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=600',0.00,90,87),

('d100-0000-0000-0000-000000000008','b1000000-0000-0000-0000-000000000002','c1000000-0000-0000-0000-000000000002',
 'Cours Saleya Market','Browse the vibrant flower and food market in the heart of the Vieux-Nice.',
 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=600',15.00,90,78),

('d100-0000-0000-0000-000000000009','b1000000-0000-0000-0000-000000000002','c1000000-0000-0000-0000-000000000001',
 'Castle Hill Panorama','Hike or take the free lift to the hilltop park for sweeping views of the bay and rooftops.',
 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=600',0.00,60,80),

('d100-0000-0000-0000-000000000010','b1000000-0000-0000-0000-000000000002','c1000000-0000-0000-0000-000000000003',
 'Day Trip to Monaco','Train 30 minutes along the Riviera to explore the casino, palace, and Formula 1 circuit.',
 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=600',12.00,360,72),

-- ── Lyon ──────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000011','b1000000-0000-0000-0000-000000000003','c1000000-0000-0000-0000-000000000002',
 'Les Halles de Lyon Paul Bocuse','Graze through France''s finest covered food market, a shrine to Lyonnaise gastronomy.',
 'https://images.unsplash.com/photo-1618767689160-da3fb810aad5?w=600',25.00,120,89),

('d100-0000-0000-0000-000000000012','b1000000-0000-0000-0000-000000000003','c1000000-0000-0000-0000-000000000001',
 'Vieux-Lyon Walking Tour','Explore UNESCO-listed Renaissance old town and its secret traboule passageways.',
 'https://images.unsplash.com/photo-1618767689160-da3fb810aad5?w=600',18.00,150,83),

('d100-0000-0000-0000-000000000013','b1000000-0000-0000-0000-000000000003','c1000000-0000-0000-0000-000000000004',
 'Musée des Confluences','Stunning science and society museum at the confluence of the Rhône and Saône.',
 'https://images.unsplash.com/photo-1618767689160-da3fb810aad5?w=600',12.00,180,70),

('d100-0000-0000-0000-000000000014','b1000000-0000-0000-0000-000000000003','c1000000-0000-0000-0000-000000000002',
 'Bouchon Dinner Experience','Classic Lyonnaise tavern meal: quenelles, andouillette, and praline tart.',
 'https://images.unsplash.com/photo-1618767689160-da3fb810aad5?w=600',45.00,120,85),

-- ── Amsterdam ─────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000015','b1000000-0000-0000-0000-000000000004','c1000000-0000-0000-0000-000000000004',
 'Rijksmuseum','Dutch Golden Age masterpieces including Rembrandt''s Night Watch and Vermeer''s Milkmaid.',
 'https://images.unsplash.com/photo-1512470604718-d55db9b08e64?w=600',22.50,180,95),

('d100-0000-0000-0000-000000000016','b1000000-0000-0000-0000-000000000004','c1000000-0000-0000-0000-000000000004',
 'Anne Frank House','Powerful hidden annex where Anne Frank wrote her famous diary during World War II.',
 'https://images.unsplash.com/photo-1512470604718-d55db9b08e64?w=600',16.00,90,93),

('d100-0000-0000-0000-000000000017','b1000000-0000-0000-0000-000000000004','c1000000-0000-0000-0000-000000000003',
 'Canal Bike Tour','Paddle along the UNESCO-listed canal ring and discover the city from the water.',
 'https://images.unsplash.com/photo-1512470604718-d55db9b08e64?w=600',20.00,120,85),

('d100-0000-0000-0000-000000000018','b1000000-0000-0000-0000-000000000004','c1000000-0000-0000-0000-000000000002',
 'Stroopwafel & Cheese Tasting','Sample Dutch classics: aged Gouda, stroopwafels, and raw herring at the Noordermarkt.',
 'https://images.unsplash.com/photo-1512470604718-d55db9b08e64?w=600',30.00,90,78),

('d100-0000-0000-0000-000000000019','b1000000-0000-0000-0000-000000000004','c1000000-0000-0000-0000-000000000005',
 'Leidseplein Nightlife Tour','Bar-hop around Amsterdam''s most vibrant square, from jazz cafés to craft beer bars.',
 'https://images.unsplash.com/photo-1512470604718-d55db9b08e64?w=600',50.00,240,76),

-- ── Rotterdam ─────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000020','b1000000-0000-0000-0000-000000000005','c1000000-0000-0000-0000-000000000001',
 'Erasmus Bridge Walk','Cross the iconic 800m cable-stayed bridge nicknamed "The Swan" over the Meuse river.',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',0.00,60,75),

('d100-0000-0000-0000-000000000021','b1000000-0000-0000-0000-000000000005','c1000000-0000-0000-0000-000000000001',
 'Cube Houses Tour','Visit Piet Blom''s tilted yellow cubes, one of which is open as a show house.',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',3.00,45,72),

('d100-0000-0000-0000-000000000022','b1000000-0000-0000-0000-000000000005','c1000000-0000-0000-0000-000000000002',
 'Markthal Food Experience','Explore Europe''s first indoor market with its breathtaking ceiling mural and 100+ vendors.',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',20.00,90,80),

('d100-0000-0000-0000-000000000023','b1000000-0000-0000-0000-000000000005','c1000000-0000-0000-0000-000000000004',
 'Boijmans van Beuningen Depot','The world''s first publicly accessible art storage depot with 151,000 artworks on display.',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',20.00,150,65),

-- ── Prague ────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000024','b1000000-0000-0000-0000-000000000006','c1000000-0000-0000-0000-000000000001',
 'Prague Castle Complex','Largest ancient castle in the world overlooking the city; includes St. Vitus Cathedral.',
 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=600',15.00,240,94),

('d100-0000-0000-0000-000000000025','b1000000-0000-0000-0000-000000000006','c1000000-0000-0000-0000-000000000001',
 'Old Town Square & Astronomical Clock','Watch the medieval clock''s hourly show in the heart of Old Town Prague.',
 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=600',0.00,60,91),

('d100-0000-0000-0000-000000000026','b1000000-0000-0000-0000-000000000006','c1000000-0000-0000-0000-000000000002',
 'Czech Beer & Trdelník Tour','Sample Pilsner Urquell at its source and eat chimney cake fresh from the fire.',
 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=600',28.00,120,88),

('d100-0000-0000-0000-000000000027','b1000000-0000-0000-0000-000000000006','c1000000-0000-0000-0000-000000000001',
 'Charles Bridge at Sunrise','Walk the 14th-century Gothic bridge before the crowds arrive for the best photos.',
 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=600',0.00,45,89),

('d100-0000-0000-0000-000000000028','b1000000-0000-0000-0000-000000000006','c1000000-0000-0000-0000-000000000005',
 'Jazz Boat on the Vltava','Evening dinner cruise with live jazz as you drift under Prague''s illuminated bridges.',
 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=600',70.00,150,79),

-- ── Tokyo ─────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000029','b1000000-0000-0000-0000-000000000008','c1000000-0000-0000-0000-000000000001',
 'Senso-ji Temple, Asakusa','Tokyo''s oldest Buddhist temple with a 5-storey pagoda and Nakamise shopping street.',
 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',0.00,90,95),

('d100-0000-0000-0000-000000000030','b1000000-0000-0000-0000-000000000008','c1000000-0000-0000-0000-000000000002',
 'Tsukiji Outer Market Breakfast','Tuna sashimi, tamagoyaki, and fresh oysters at the legendary fish market.',
 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',25.00,90,91),

('d100-0000-0000-0000-000000000031','b1000000-0000-0000-0000-000000000008','c1000000-0000-0000-0000-000000000004',
 'teamLab Borderless Digital Art Museum','Immersive, ever-changing digital art universe spread across multiple rooms.',
 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',32.00,180,90),

('d100-0000-0000-0000-000000000032','b1000000-0000-0000-0000-000000000008','c1000000-0000-0000-0000-000000000002',
 'Ramen Tasting in Shinjuku','Work through three regional ramen styles — tonkotsu, shoyu, miso — in one district.',
 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',30.00,120,87),

('d100-0000-0000-0000-000000000033','b1000000-0000-0000-0000-000000000008','c1000000-0000-0000-0000-000000000005',
 'Shibuya Crossing & Nightlife','Cross the world''s busiest intersection then explore the surrounding neon-lit bars.',
 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',40.00,180,88),

('d100-0000-0000-0000-000000000034','b1000000-0000-0000-0000-000000000008','c1000000-0000-0000-0000-000000000001',
 'Tokyo Skytree Observation Deck','Rise 634m above the city for uninterrupted views as far as Mount Fuji on clear days.',
 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',22.00,90,86),

-- ── Kyoto ─────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000035','b1000000-0000-0000-0000-000000000009','c1000000-0000-0000-0000-000000000001',
 'Fushimi Inari Shrine','Hike through thousands of vermilion torii gates winding up the sacred Mount Inari.',
 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',0.00,120,97),

('d100-0000-0000-0000-000000000036','b1000000-0000-0000-0000-000000000009','c1000000-0000-0000-0000-000000000001',
 'Arashiyama Bamboo Grove','Walk the ethereal bamboo forest and visit the nearby Tenryu-ji garden.',
 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',0.00,90,94),

('d100-0000-0000-0000-000000000037','b1000000-0000-0000-0000-000000000009','c1000000-0000-0000-0000-000000000004',
 'Traditional Tea Ceremony','Participate in a 45-minute matcha tea ceremony in a historic machiya townhouse.',
 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',35.00,60,89),

('d100-0000-0000-0000-000000000038','b1000000-0000-0000-0000-000000000009','c1000000-0000-0000-0000-000000000002',
 'Nishiki Market Street Food','Kyoto''s "kitchen": 100+ vendors selling pickles, tofu, skewered seafood, and wagashi.',
 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',20.00,90,85),

('d100-0000-0000-0000-000000000039','b1000000-0000-0000-0000-000000000009','c1000000-0000-0000-0000-000000000006',
 'Ryokan Overnight Stay & Onsen','Soak in a traditional hot-spring bath and sleep on a futon in a historic inn.',
 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',180.00,720,91),

-- ── Osaka ─────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000040','b1000000-0000-0000-0000-000000000010','c1000000-0000-0000-0000-000000000002',
 'Dotonbori Street Food Crawl','Takoyaki, okonomiyaki, and kushikatsu along the neon-lit canal that defines Osaka.',
 'https://images.unsplash.com/photo-1588928859693-e49b6ab68e40?w=600',30.00,120,96),

('d100-0000-0000-0000-000000000041','b1000000-0000-0000-0000-000000000010','c1000000-0000-0000-0000-000000000001',
 'Osaka Castle','Iconic 16th-century castle with a history museum inside and cherry blossom grounds.',
 'https://images.unsplash.com/photo-1588928859693-e49b6ab68e40?w=600',8.00,120,87),

('d100-0000-0000-0000-000000000042','b1000000-0000-0000-0000-000000000010','c1000000-0000-0000-0000-000000000003',
 'Universal Studios Japan','Hollywood blockbuster rides and the Wizarding World of Harry Potter.',
 'https://images.unsplash.com/photo-1588928859693-e49b6ab68e40?w=600',75.00,480,88),

('d100-0000-0000-0000-000000000043','b1000000-0000-0000-0000-000000000010','c1000000-0000-0000-0000-000000000005',
 'Shinsaibashi Bar Hopping','Osaka''s electric entertainment district: craft cocktail bars, karaoke, and basement clubs.',
 'https://images.unsplash.com/photo-1588928859693-e49b6ab68e40?w=600',55.00,240,80),

-- ── Hiroshima ─────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000044','b1000000-0000-0000-0000-000000000011','c1000000-0000-0000-0000-000000000004',
 'Peace Memorial Park & Museum','Deeply moving memorial to the atomic bombing; the A-Bomb Dome stands beside the river.',
 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600',2.00,180,95),

('d100-0000-0000-0000-000000000045','b1000000-0000-0000-0000-000000000011','c1000000-0000-0000-0000-000000000001',
 'Miyajima Island & Floating Torii','Ferry to the sacred island to see the iconic floating gate at high tide.',
 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600',10.00,240,93),

('d100-0000-0000-0000-000000000046','b1000000-0000-0000-0000-000000000011','c1000000-0000-0000-0000-000000000002',
 'Hiroshima Okonomiyaki Lesson','Learn the Hiroshima-style layered version of this savoury pancake from a local chef.',
 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600',40.00,120,78),

('d100-0000-0000-0000-000000000047','b1000000-0000-0000-0000-000000000011','c1000000-0000-0000-0000-000000000006',
 'Shukkei-en Garden','Miniature landscape garden with a central pond reflecting the surrounding pavilions.',
 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600',2.50,60,65),

-- ── Bangkok ───────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000048','b1000000-0000-0000-0000-000000000012','c1000000-0000-0000-0000-000000000001',
 'Grand Palace & Wat Phra Kaew','The dazzling Royal Palace complex with the sacred Emerald Buddha temple.',
 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=600',15.00,180,97),

('d100-0000-0000-0000-000000000049','b1000000-0000-0000-0000-000000000012','c1000000-0000-0000-0000-000000000002',
 'Chatuchak Weekend Market','8,000 stalls selling street food, vintage clothing, ceramics, and live animals.',
 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=600',20.00,180,88),

('d100-0000-0000-0000-000000000050','b1000000-0000-0000-0000-000000000012','c1000000-0000-0000-0000-000000000006',
 'Thai Massage at Wat Pho','Traditional Thai massage school at the temple famous for its 46m reclining Buddha.',
 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=600',12.00,60,91),

('d100-0000-0000-0000-000000000051','b1000000-0000-0000-0000-000000000012','c1000000-0000-0000-0000-000000000003',
 'Chao Phraya River Kayak Tour','Paddle through hidden canals and under bridges as the city skyline rises around you.',
 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=600',35.00,180,72),

('d100-0000-0000-0000-000000000052','b1000000-0000-0000-0000-000000000012','c1000000-0000-0000-0000-000000000005',
 'Rooftop Bar at Vertigo','Cocktails 61 floors up with a 360° view of the Bangkok skyline at sunset.',
 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=600',60.00,120,85),

-- ── Chiang Mai ────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000053','b1000000-0000-0000-0000-000000000013','c1000000-0000-0000-0000-000000000003',
 'Elephant Nature Park Half-Day','Ethical elephant sanctuary: feed, bathe, and walk alongside rescued elephants.',
 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600',80.00,300,97),

('d100-0000-0000-0000-000000000054','b1000000-0000-0000-0000-000000000013','c1000000-0000-0000-0000-000000000001',
 'Doi Suthep Temple Hike','Climb 306 steps to the golden-spired temple perched above the city on a forested mountain.',
 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600',3.00,180,88),

('d100-0000-0000-0000-000000000055','b1000000-0000-0000-0000-000000000013','c1000000-0000-0000-0000-000000000002',
 'Thai Cooking Class','Hands-on market tour then cook five dishes including pad thai and green curry.',
 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600',38.00,300,93),

('d100-0000-0000-0000-000000000056','b1000000-0000-0000-0000-000000000013','c1000000-0000-0000-0000-000000000005',
 'Saturday Night Market','Massive street bazaar along Wualai Road with live music, crafts, and Thai street eats.',
 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600',15.00,180,82),

-- ── Phuket ────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000057','b1000000-0000-0000-0000-000000000014','c1000000-0000-0000-0000-000000000003',
 'Phi Phi Islands Speedboat Tour','Snorkel in turquoise lagoons and visit the famous Maya Bay from The Beach.',
 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600',55.00,480,95),

('d100-0000-0000-0000-000000000058','b1000000-0000-0000-0000-000000000014','c1000000-0000-0000-0000-000000000006',
 'Patong Beach Sunset & Spa','Watch the sunset over the Andaman Sea then unwind with a traditional Thai oil massage.',
 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600',45.00,180,85),

('d100-0000-0000-0000-000000000059','b1000000-0000-0000-0000-000000000014','c1000000-0000-0000-0000-000000000002',
 'Phuket Old Town Food Walk','Sino-Portuguese shophouses, Hokkien shrines, and local dishes like mee hokkien.',
 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600',25.00,150,77),

('d100-0000-0000-0000-000000000060','b1000000-0000-0000-0000-000000000014','c1000000-0000-0000-0000-000000000003',
 'Sea Kayaking Phang Nga Bay','Paddle through limestone karsts and sea caves in one of Asia''s most dramatic seascapes.',
 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600',65.00,300,90),

-- ── Mumbai ────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000061','b1000000-0000-0000-0000-000000000015','c1000000-0000-0000-0000-000000000001',
 'Gateway of India & Elephanta Caves','Iconic colonial arch then a ferry to ancient rock-cut Hindu and Buddhist temples.',
 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600',10.00,240,90),

('d100-0000-0000-0000-000000000062','b1000000-0000-0000-0000-000000000015','c1000000-0000-0000-0000-000000000002',
 'Dharavi Street Food & Dabbawala Tour','Explore Asia''s largest slum market and witness the legendary Mumbai lunch delivery system.',
 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600',20.00,180,82),

('d100-0000-0000-0000-000000000063','b1000000-0000-0000-0000-000000000015','c1000000-0000-0000-0000-000000000004',
 'Bollywood Studio Tour','Go behind the scenes of the world''s most prolific film industry with a chance to meet actors.',
 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600',30.00,180,75),

('d100-0000-0000-0000-000000000064','b1000000-0000-0000-0000-000000000015','c1000000-0000-0000-0000-000000000005',
 'Juhu Beach Sunset & Bhelpuri','Watch Mumbai''s famous sunset over the Arabian Sea while eating spiced puffed-rice.',
 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600',5.00,90,72),

-- ── Jaipur ────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000065','b1000000-0000-0000-0000-000000000016','c1000000-0000-0000-0000-000000000001',
 'Amber Fort Elephant Ride','Ascend the majestic 16th-century fort on elephant-back through the ornate Sun Gate.',
 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600',25.00,180,93),

('d100-0000-0000-0000-000000000066','b1000000-0000-0000-0000-000000000016','c1000000-0000-0000-0000-000000000004',
 'City Palace & Jantar Mantar','Royal museum complex and the world''s largest stone astronomical observatory.',
 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600',12.00,150,85),

('d100-0000-0000-0000-000000000067','b1000000-0000-0000-0000-000000000016','c1000000-0000-0000-0000-000000000002',
 'Johari Bazaar Spice & Sweets Walk','Taste ghevar, kachori, and dal baati churma in the aromatic old city markets.',
 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600',15.00,120,80),

('d100-0000-0000-0000-000000000068','b1000000-0000-0000-0000-000000000016','c1000000-0000-0000-0000-000000000006',
 'Nahargarh Fort Sunset','Watch the Pink City glow golden from this hillside fort as the sun sets over the Aravalli hills.',
 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600',2.00,90,88),

-- ── New York ──────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000069','b1000000-0000-0000-0000-000000000018','c1000000-0000-0000-0000-000000000001',
 'Top of the Rock Observation Deck','Panoramic Manhattan views from 30 Rockefeller Plaza, including the Empire State Building.',
 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600',40.00,90,90),

('d100-0000-0000-0000-000000000070','b1000000-0000-0000-0000-000000000018','c1000000-0000-0000-0000-000000000004',
 'Metropolitan Museum of Art','One of the world''s greatest museums: 5,000 years of art across 17 curatorial departments.',
 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600',30.00,240,94),

('d100-0000-0000-0000-000000000071','b1000000-0000-0000-0000-000000000018','c1000000-0000-0000-0000-000000000002',
 'Chelsea Market Food Hall','Artisan food vendors, celebrity chef restaurants, and the city''s best lobster rolls.',
 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600',35.00,120,85),

('d100-0000-0000-0000-000000000072','b1000000-0000-0000-0000-000000000018','c1000000-0000-0000-0000-000000000006',
 'Central Park Bike Ride','Rent a CitiBike and cruise the 6-mile loop past Bethesda Fountain and Strawberry Fields.',
 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600',15.00,120,88),

('d100-0000-0000-0000-000000000073','b1000000-0000-0000-0000-000000000018','c1000000-0000-0000-0000-000000000005',
 'Jazz at the Blue Note','World-famous Greenwich Village jazz club with nightly performances from jazz legends.',
 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600',55.00,150,86),

('d100-0000-0000-0000-000000000074','b1000000-0000-0000-0000-000000000018','c1000000-0000-0000-0000-000000000001',
 'Statue of Liberty & Ellis Island','Ferry to Liberty Island for close-up views of the iconic copper statue and immigration museum.',
 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600',25.00,300,92),

-- ── Los Angeles ───────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000075','b1000000-0000-0000-0000-000000000019','c1000000-0000-0000-0000-000000000001',
 'Hollywood Walk of Fame & Griffith Observatory','Star map selfies then a hike to the Art Deco observatory with views from the Hollywood Sign.',
 'https://images.unsplash.com/photo-1580655653885-65763b2597d1?w=600',0.00,180,86),

('d100-0000-0000-0000-000000000076','b1000000-0000-0000-0000-000000000019','c1000000-0000-0000-0000-000000000002',
 'Grand Central Market DTLA','Downtown LA''s 1917 food hall: tacos, pupusas, bánh mì, and artisan coffee.',
 'https://images.unsplash.com/photo-1580655653885-65763b2597d1?w=600',20.00,90,82),

('d100-0000-0000-0000-000000000077','b1000000-0000-0000-0000-000000000019','c1000000-0000-0000-0000-000000000006',
 'Santa Monica Beach & Pier','Surf the Pacific, stroll the historic pier, and catch a Pacific sunset from the Ferris wheel.',
 'https://images.unsplash.com/photo-1580655653885-65763b2597d1?w=600',10.00,180,87),

('d100-0000-0000-0000-000000000078','b1000000-0000-0000-0000-000000000019','c1000000-0000-0000-0000-000000000004',
 'Getty Center','Richard Meier''s hilltop museum with Impressionist masterpieces and sweeping LA views.',
 'https://images.unsplash.com/photo-1580655653885-65763b2597d1?w=600',0.00,180,83),

-- ── Chicago ───────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000079','b1000000-0000-0000-0000-000000000020','c1000000-0000-0000-0000-000000000001',
 'Chicago Architecture River Cruise','One-hour narrated boat tour past 50+ landmark buildings, including the iconic Marina City.',
 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600',48.00,75,94),

('d100-0000-0000-0000-000000000080','b1000000-0000-0000-0000-000000000020','c1000000-0000-0000-0000-000000000002',
 'Deep-Dish Pizza at Lou Malnati''s','The definitive Chicago deep-dish: buttery crust, chunky tomato, and cheese in reverse order.',
 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600',22.00,90,91),

('d100-0000-0000-0000-000000000081','b1000000-0000-0000-0000-000000000020','c1000000-0000-0000-0000-000000000004',
 'Art Institute of Chicago','World-class collection including Seurat''s A Sunday Afternoon and Grant Wood''s American Gothic.',
 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600',26.00,180,88),

('d100-0000-0000-0000-000000000082','b1000000-0000-0000-0000-000000000020','c1000000-0000-0000-0000-000000000005',
 'Blues Clubs on Wentworth','The spiritual home of Chicago blues: Kingston Mines and B.L.U.E.S. side by side.',
 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600',30.00,240,79),

-- ── Rio de Janeiro ─────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000083','b1000000-0000-0000-0000-000000000026','c1000000-0000-0000-0000-000000000001',
 'Christ the Redeemer at Sunrise','Take the cog railway to the 30m Art Deco statue for golden-hour panoramas of the city.',
 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600',28.00,180,98),

('d100-0000-0000-0000-000000000084','b1000000-0000-0000-0000-000000000026','c1000000-0000-0000-0000-000000000001',
 'Sugarloaf Mountain Cable Car','Two cable-car rides to the iconic granite peak for 360° views of Guanabara Bay.',
 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600',28.00,120,95),

('d100-0000-0000-0000-000000000085','b1000000-0000-0000-0000-000000000026','c1000000-0000-0000-0000-000000000006',
 'Copacabana & Ipanema Beach Day','Sun, volleyball, and açaí bowls on the world''s most famous urban beaches.',
 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600',15.00,300,92),

('d100-0000-0000-0000-000000000086','b1000000-0000-0000-0000-000000000026','c1000000-0000-0000-0000-000000000002',
 'Feijoada at Casa da Feijoada','Brazil''s national dish: black bean and pork stew served with farofa, rice, and caipirinha.',
 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600',30.00,120,84),

('d100-0000-0000-0000-000000000087','b1000000-0000-0000-0000-000000000026','c1000000-0000-0000-0000-000000000005',
 'Samba Night at Lapa','Dance in the open-air arches district, Rio''s bohemian nightlife heart, to live samba bands.',
 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600',25.00,240,87),

-- ── Marrakech ─────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000088','b1000000-0000-0000-0000-000000000029','c1000000-0000-0000-0000-000000000001',
 'Djemaa el-Fna Square at Dusk','Watch snake charmers, storytellers, and food stalls transform the main square after dark.',
 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600',0.00,120,96),

('d100-0000-0000-0000-000000000089','b1000000-0000-0000-0000-000000000029','c1000000-0000-0000-0000-000000000006',
 'Hammam & Argan Oil Treatment','Steam, scrub, and massage in a traditional Moroccan bathhouse followed by argan oil skin treatment.',
 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600',35.00,120,91),

('d100-0000-0000-0000-000000000090','b1000000-0000-0000-0000-000000000029','c1000000-0000-0000-0000-000000000004',
 'Medina Souk Walking Tour','Navigate the labyrinthine medina with a guide: spice souk, leather tanneries, lantern-makers.',
 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600',18.00,180,89),

('d100-0000-0000-0000-000000000091','b1000000-0000-0000-0000-000000000029','c1000000-0000-0000-0000-000000000002',
 'Moroccan Cooking Class','Learn to make tagine, couscous, and bastilla in a riad kitchen, then eat your creation.',
 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600',45.00,240,87),

('d100-0000-0000-0000-000000000092','b1000000-0000-0000-0000-000000000029','c1000000-0000-0000-0000-000000000003',
 'Hot Air Balloon over the Atlas','Float above the Marrakech plain at sunrise with the snow-capped Atlas Mountains as backdrop.',
 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600',185.00,240,93),

-- ── Sydney ────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000093','b1000000-0000-0000-0000-000000000032','c1000000-0000-0000-0000-000000000001',
 'Sydney Opera House Guided Tour','Behind-the-scenes tour of Jørn Utzon''s masterpiece on Sydney Harbour.',
 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600',43.00,60,96),

('d100-0000-0000-0000-000000000094','b1000000-0000-0000-0000-000000000032','c1000000-0000-0000-0000-000000000003',
 'Sydney Harbour Bridge Climb','3.5-hour guided climb to the summit of the "Coathanger" for iconic harbour views.',
 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600',268.00,210,94),

('d100-0000-0000-0000-000000000095','b1000000-0000-0000-0000-000000000032','c1000000-0000-0000-0000-000000000006',
 'Bondi to Coogee Coastal Walk','6km cliff-top walk past rock pools, sculptures, and a dozen golden beaches.',
 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600',0.00,180,91),

('d100-0000-0000-0000-000000000096','b1000000-0000-0000-0000-000000000032','c1000000-0000-0000-0000-000000000002',
 'Fish Market Seafood Breakfast','Sydney''s wholesale fish market opens to the public for the freshest Sydney rock oysters.',
 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600',30.00,90,85),

-- ── Dubai ─────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000097','b1000000-0000-0000-0000-000000000036','c1000000-0000-0000-0000-000000000001',
 'Burj Khalifa At the Top','Ascend to level 124 (452m) of the world''s tallest building for desert-to-sea views.',
 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',37.00,90,98),

('d100-0000-0000-0000-000000000098','b1000000-0000-0000-0000-000000000036','c1000000-0000-0000-0000-000000000003',
 'Desert Safari & Dune Bashing','4WD dune bashing, sandboarding, camel ride, and a bedouin camp dinner under the stars.',
 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',90.00,360,95),

('d100-0000-0000-0000-000000000099','b1000000-0000-0000-0000-000000000036','c1000000-0000-0000-0000-000000000002',
 'Dubai Mall Food Court & Fountain Show','Global cuisines, then watch the world''s largest fountain choreographed to music.',
 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',25.00,120,88),

('d100-0000-0000-0000-000000000100','b1000000-0000-0000-0000-000000000036','c1000000-0000-0000-0000-000000000001',
 'Dubai Creek & Old Gold Souk','Abra ride across the historic creek then browse the Gold and Spice Souks in Deira.',
 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',10.00,150,82),

('d100-0000-0000-0000-000000000101','b1000000-0000-0000-0000-000000000036','c1000000-0000-0000-0000-000000000006',
 'Atlantis Aquaventure Waterpark','World-class waterpark on Palm Jumeirah with record-breaking slides and private beach.',
 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',115.00,480,89),

-- ── Mexico City ────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000102','b1000000-0000-0000-0000-000000000023','c1000000-0000-0000-0000-000000000001',
 'Teotihuacán Pyramids','Climb the Pyramid of the Sun at the ancient Mesoamerican city 50km from the capital.',
 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=600',12.00,360,97),

('d100-0000-0000-0000-000000000103','b1000000-0000-0000-0000-000000000023','c1000000-0000-0000-0000-000000000004',
 'Frida Kahlo Museum (La Casa Azul)','The cobalt-blue house where Frida was born, lived, and died, filled with her art and belongings.',
 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=600',10.00,90,92),

('d100-0000-0000-0000-000000000104','b1000000-0000-0000-0000-000000000023','c1000000-0000-0000-0000-000000000002',
 'Mercado de San Juan Food Tour','Gourmet market with exotic fruits, truffle cheese, and the city''s best tacos de canasta.',
 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=600',22.00,120,85),

('d100-0000-0000-0000-000000000105','b1000000-0000-0000-0000-000000000023','c1000000-0000-0000-0000-000000000005',
 'Mezcal Bar Crawl in Roma Norte','Hip neighbourhood known for mezcalerías, natural wine bars, and Art Deco architecture.',
 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=600',40.00,240,80),

-- ── Goa ───────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000106','b1000000-0000-0000-0000-000000000017','c1000000-0000-0000-0000-000000000006',
 'Anjuna Beach Sunset Session','Legendary sunset point with trance music, hammocks, and fresh coconuts.',
 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600',10.00,180,85),

('d100-0000-0000-0000-000000000107','b1000000-0000-0000-0000-000000000017','c1000000-0000-0000-0000-000000000001',
 'Old Goa Churches Tour','UNESCO heritage churches including the Basilica of Bom Jesus with St. Francis Xavier''s relics.',
 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600',0.00,150,78),

('d100-0000-0000-0000-000000000108','b1000000-0000-0000-0000-000000000017','c1000000-0000-0000-0000-000000000002',
 'Spice Plantation Lunch Tour','Visit a working spice farm, see cardamom and vanilla grown, and enjoy a traditional Goan thali.',
 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600',25.00,240,73),

('d100-0000-0000-0000-000000000109','b1000000-0000-0000-0000-000000000017','c1000000-0000-0000-0000-000000000003',
 'Scuba Diving at Grande Island','Beginner-friendly dives among coral reefs, parrotfish, and moray eels off the coast.',
 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600',55.00,240,80),

-- ── Delhi ─────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000110','b1000000-0000-0000-0000-000000000039','c1000000-0000-0000-0000-000000000001',
 'Red Fort & Chandni Chowk','Mughal masterpiece and the labyrinthine old city market — spices, silver, and street food.',
 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600',8.00,240,90),

('d100-0000-0000-0000-000000000111','b1000000-0000-0000-0000-000000000039','c1000000-0000-0000-0000-000000000001',
 'Humayun''s Tomb','The inspiration for the Taj Mahal: serene Mughal garden tomb and a UNESCO World Heritage Site.',
 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600',7.00,90,82),

('d100-0000-0000-0000-000000000112','b1000000-0000-0000-0000-000000000039','c1000000-0000-0000-0000-000000000002',
 'Old Delhi Street Food Walk','Dahi bhalla, jalebi, butter chicken at Moti Mahal, and kulfi from Kuremal''s — with a guide.',
 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600',18.00,150,88),

('d100-0000-0000-0000-000000000113','b1000000-0000-0000-0000-000000000039','c1000000-0000-0000-0000-000000000004',
 'National Museum of India','75,000 artifacts spanning 5,000 years of Indian art, history, and civilisation.',
 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600',5.00,150,74),

-- ── Melbourne ─────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000114','b1000000-0000-0000-0000-000000000033','c1000000-0000-0000-0000-000000000002',
 'Laneway Coffee Culture Tour','Filter coffee in hidden laneways — Degraves St, Centre Place — the birthplace of third-wave coffee.',
 'https://images.unsplash.com/photo-1545044846-351ba102b6d5?w=600',20.00,120,90),

('d100-0000-0000-0000-000000000115','b1000000-0000-0000-0000-000000000033','c1000000-0000-0000-0000-000000000004',
 'National Gallery of Victoria','Australia''s oldest and most visited gallery with an international art collection spanning centuries.',
 'https://images.unsplash.com/photo-1545044846-351ba102b6d5?w=600',0.00,150,83),

('d100-0000-0000-0000-000000000116','b1000000-0000-0000-0000-000000000033','c1000000-0000-0000-0000-000000000001',
 'Queen Victoria Market','Sprawling 19th-century market: fresh produce, delicatessens, and crafts since 1878.',
 'https://images.unsplash.com/photo-1545044846-351ba102b6d5?w=600',0.00,90,85),

('d100-0000-0000-0000-000000000117','b1000000-0000-0000-0000-000000000033','c1000000-0000-0000-0000-000000000003',
 'Great Ocean Road Day Trip','Drive the legendary coastal road past the Twelve Apostles limestone stacks.',
 'https://images.unsplash.com/photo-1545044846-351ba102b6d5?w=600',60.00,540,93),

-- ── Fes ───────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000118','b1000000-0000-0000-0000-000000000030','c1000000-0000-0000-0000-000000000001',
 'Chouara Tannery Viewpoint','Watch leather dyers working in the 9th-century tanneries from above — and smell the history.',
 'https://images.unsplash.com/photo-1577147443647-81856d5151af?w=600',5.00,60,91),

('d100-0000-0000-0000-000000000119','b1000000-0000-0000-0000-000000000030','c1000000-0000-0000-0000-000000000004',
 'Al-Qarawiyyin University & Library','Visit the world''s oldest operating university, founded in 859 AD.',
 'https://images.unsplash.com/photo-1577147443647-81856d5151af?w=600',0.00,60,82),

('d100-0000-0000-0000-000000000120','b1000000-0000-0000-0000-000000000030','c1000000-0000-0000-0000-000000000002',
 'Medina Street Food Walk','Sfenj (doughnuts), harira soup, and msemen flatbread from tiny stalls in the old city.',
 'https://images.unsplash.com/photo-1577147443647-81856d5151af?w=600',12.00,90,78),

('d100-0000-0000-0000-000000000121','b1000000-0000-0000-0000-000000000030','c1000000-0000-0000-0000-000000000004',
 'Bou Inania Madrasa','14th-century Quranic school with intricate tilework, carved cedar, and a central ablution pool.',
 'https://images.unsplash.com/photo-1577147443647-81856d5151af?w=600',3.00,60,80),

-- ── Abu Dhabi ─────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000122','b1000000-0000-0000-0000-000000000037','c1000000-0000-0000-0000-000000000001',
 'Sheikh Zayed Grand Mosque','One of the world''s largest mosques with 82 marble domes and the world''s largest hand-knotted carpet.',
 'https://images.unsplash.com/photo-1563188091-8b15a8ab71d7?w=600',0.00,120,98),

('d100-0000-0000-0000-000000000123','b1000000-0000-0000-0000-000000000037','c1000000-0000-0000-0000-000000000004',
 'Louvre Abu Dhabi','Saadiyat Island''s stunning Jean Nouvel museum under a floating geometric dome.',
 'https://images.unsplash.com/photo-1563188091-8b15a8ab71d7?w=600',25.00,180,90),

('d100-0000-0000-0000-000000000124','b1000000-0000-0000-0000-000000000037','c1000000-0000-0000-0000-000000000003',
 'Ferrari World Abu Dhabi','Home to Formula Rossa, the world''s fastest roller coaster, on Yas Island.',
 'https://images.unsplash.com/photo-1563188091-8b15a8ab71d7?w=600',90.00,360,84),

-- ── Brno ──────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000125','b1000000-0000-0000-0000-000000000007','c1000000-0000-0000-0000-000000000001',
 'Špilberk Castle','Brno''s 13th-century hilltop fortress with panoramic views, a museum, and notorious dungeons.',
 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=600',7.00,120,78),

('d100-0000-0000-0000-000000000126','b1000000-0000-0000-0000-000000000007','c1000000-0000-0000-0000-000000000001',
 'Villa Tugendhat','UNESCO-listed Mies van der Rohe masterpiece of functionalist architecture (1930).',
 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=600',18.00,90,72),

('d100-0000-0000-0000-000000000127','b1000000-0000-0000-0000-000000000007','c1000000-0000-0000-0000-000000000002',
 'Zelný trh Farmer''s Market','Brno''s vegetable market in the Baroque square at the city''s social heart.',
 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=600',10.00,60,65),

('d100-0000-0000-0000-000000000128','b1000000-0000-0000-0000-000000000007','c1000000-0000-0000-0000-000000000005',
 'Craft Beer Bar Hop on Česká','Brno''s student bar strip with world-class Czech craft lagers and moody basement pubs.',
 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=600',20.00,180,68),

-- ── São Paulo ─────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000129','b1000000-0000-0000-0000-000000000027','c1000000-0000-0000-0000-000000000004',
 'MASP Art Museum','Oscar Niemeyer''s concrete-and-glass museum suspended over Avenida Paulista has 10,000 artworks.',
 'https://images.unsplash.com/photo-1535551951406-a19828b0a76b?w=600',22.00,180,88),

('d100-0000-0000-0000-000000000130','b1000000-0000-0000-0000-000000000027','c1000000-0000-0000-0000-000000000002',
 'Mercado Municipal Food Tour','Mortadella sandwich at Hocca Bar, pastel de bacalhau, and exotic Amazonian fruits.',
 'https://images.unsplash.com/photo-1535551951406-a19828b0a76b?w=600',18.00,120,85),

('d100-0000-0000-0000-000000000131','b1000000-0000-0000-0000-000000000027','c1000000-0000-0000-0000-000000000005',
 'Vila Madalena Bar Scene','São Paulo''s Brooklyn: street art, vinyl bars, natural wine spots, and samba on Sundays.',
 'https://images.unsplash.com/photo-1535551951406-a19828b0a76b?w=600',35.00,240,80),

-- ── New Orleans ────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000132','b1000000-0000-0000-0000-000000000021','c1000000-0000-0000-0000-000000000005',
 'Frenchmen Street Jazz Night','The authentic alternative to Bourbon Street: live jazz and zydeco spilling from every bar.',
 'https://images.unsplash.com/photo-1569023538034-0af35c0b1f5a?w=600',20.00,240,93),

('d100-0000-0000-0000-000000000133','b1000000-0000-0000-0000-000000000021','c1000000-0000-0000-0000-000000000002',
 'Commander''s Palace Brunch','Legendary Saturday Jazz Brunch with turtle soup, pecan-crusted fish, and bread pudding soufflé.',
 'https://images.unsplash.com/photo-1569023538034-0af35c0b1f5a?w=600',75.00,120,88),

('d100-0000-0000-0000-000000000134','b1000000-0000-0000-0000-000000000021','c1000000-0000-0000-0000-000000000004',
 'National WWII Museum','America''s most visited museum: immersive exhibits on the road to the D-Day landings.',
 'https://images.unsplash.com/photo-1569023538034-0af35c0b1f5a?w=600',30.00,240,86),

('d100-0000-0000-0000-000000000135','b1000000-0000-0000-0000-000000000021','c1000000-0000-0000-0000-000000000001',
 'Garden District Walking Tour','Antebellum mansions and wrought-iron galleries in the city''s most photogenic neighbourhood.',
 'https://images.unsplash.com/photo-1569023538034-0af35c0b1f5a?w=600',15.00,120,79),

-- ── San Francisco ──────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000136','b1000000-0000-0000-0000-000000000022','c1000000-0000-0000-0000-000000000001',
 'Golden Gate Bridge Walk','Cross the 2.7km suspension bridge on foot for views of the bay, Marin Headlands, and city.',
 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600',0.00,90,97),

('d100-0000-0000-0000-000000000137','b1000000-0000-0000-0000-000000000022','c1000000-0000-0000-0000-000000000001',
 'Alcatraz Island Night Tour','Evening audio tour of the infamous island prison with haunting backstories.',
 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600',50.00,180,92),

('d100-0000-0000-0000-000000000138','b1000000-0000-0000-0000-000000000022','c1000000-0000-0000-0000-000000000002',
 'Ferry Building Marketplace','Saturday farmers'' market beside the bay: sourdough, oysters, and Blue Bottle coffee.',
 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600',25.00,90,85),

('d100-0000-0000-0000-000000000139','b1000000-0000-0000-0000-000000000022','c1000000-0000-0000-0000-000000000003',
 'Muir Woods Redwood Hike','Walk among 1,000-year-old coast redwoods just 20 minutes across the Golden Gate.',
 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600',10.00,240,89),

-- ── Cancún ────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000140','b1000000-0000-0000-0000-000000000024','c1000000-0000-0000-0000-000000000001',
 'Chichén Itzá Day Trip','Guided tour to the New Wonder of the World: the 30m pyramid of Kukulcán.',
 'https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=600',65.00,540,96),

('d100-0000-0000-0000-000000000141','b1000000-0000-0000-0000-000000000024','c1000000-0000-0000-0000-000000000003',
 'Cenote Swim & Snorkel','Swim in crystal-clear underground sinkholes sacred to the Maya, filled with stalactites.',
 'https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=600',35.00,180,92),

('d100-0000-0000-0000-000000000142','b1000000-0000-0000-0000-000000000024','c1000000-0000-0000-0000-000000000006',
 'Hotel Zone Beach Day','Turquoise Caribbean water, white sand, and beach clubs with free chairs for hotel guests.',
 'https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=600',0.00,300,80),

-- ── Oaxaca ────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000143','b1000000-0000-0000-0000-000000000025','c1000000-0000-0000-0000-000000000002',
 'Mole & Mezcal Tasting','Sample the seven classic moles and artisanal mezcal varieties at a traditional tlayuda bar.',
 'https://images.unsplash.com/photo-1590059913761-4dcaa70e79e9?w=600',30.00,120,92),

('d100-0000-0000-0000-000000000144','b1000000-0000-0000-0000-000000000025','c1000000-0000-0000-0000-000000000001',
 'Monte Albán Archaeological Site','Pre-Columbian Zapotec capital with pyramids, ball courts, and carved stone glyphs.',
 'https://images.unsplash.com/photo-1590059913761-4dcaa70e79e9?w=600',5.00,240,88),

('d100-0000-0000-0000-000000000145','b1000000-0000-0000-0000-000000000025','c1000000-0000-0000-0000-000000000004',
 'Textile & Weaving Workshop','Watch Zapotec weavers use traditional backstrap looms to create geometric rugs with natural dyes.',
 'https://images.unsplash.com/photo-1590059913761-4dcaa70e79e9?w=600',15.00,90,75),

-- ── Salvador ──────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000146','b1000000-0000-0000-0000-000000000028','c1000000-0000-0000-0000-000000000004',
 'Pelourinho Walking Tour','UNESCO colonial old town: colourful Baroque churches, capoeira demonstrations, and Afro-Brazilian art.',
 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=600',12.00,150,82),

('d100-0000-0000-0000-000000000147','b1000000-0000-0000-0000-000000000028','c1000000-0000-0000-0000-000000000002',
 'Acarajé & Moqueca Cooking Class','Learn to cook Bahian classics: black-eyed pea fritters and coconut seafood stew.',
 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=600',35.00,180,75),

('d100-0000-0000-0000-000000000148','b1000000-0000-0000-0000-000000000028','c1000000-0000-0000-0000-000000000005',
 'Carybé Arts Centre Samba Night','Experience the roots of axé music and samba-reggae at a weekly community event.',
 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=600',15.00,180,70),

-- ── Casablanca ─────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000149','b1000000-0000-0000-0000-000000000031','c1000000-0000-0000-0000-000000000001',
 'Hassan II Mosque','The world''s third-largest mosque with a retractable roof, built over the Atlantic Ocean.',
 'https://images.unsplash.com/photo-1539035985090-e5b9f51c8be0?w=600',12.00,90,94),

('d100-0000-0000-0000-000000000150','b1000000-0000-0000-0000-000000000031','c1000000-0000-0000-0000-000000000002',
 'Rick''s Café & Medina Dinner','Dinner at the famous Casablanca film-themed restaurant, then explore the old medina.',
 'https://images.unsplash.com/photo-1539035985090-e5b9f51c8be0?w=600',55.00,180,77),

('d100-0000-0000-0000-000000000151','b1000000-0000-0000-0000-000000000031','c1000000-0000-0000-0000-000000000001',
 'Art Deco Heritage Walk','1930s French Protectorate architecture — Casablanca has more Art Deco than any African city.',
 'https://images.unsplash.com/photo-1539035985090-e5b9f51c8be0?w=600',10.00,90,68),

-- ── Brisbane ──────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000152','b1000000-0000-0000-0000-000000000034','c1000000-0000-0000-0000-000000000006',
 'South Bank Parklands & Streets Beach','Artificial beach in the heart of the city with free pools, parklands, and weekend markets.',
 'https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=600',0.00,120,82),

('d100-0000-0000-0000-000000000153','b1000000-0000-0000-0000-000000000034','c1000000-0000-0000-0000-000000000004',
 'QAGOMA Gallery of Modern Art','Australia''s largest gallery of modern and contemporary art with free admission.',
 'https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=600',0.00,150,75),

('d100-0000-0000-0000-000000000154','b1000000-0000-0000-0000-000000000034','c1000000-0000-0000-0000-000000000003',
 'Lone Pine Koala Sanctuary','Hold a koala, hand-feed kangaroos, and meet wombats at the world''s first koala sanctuary.',
 'https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=600',36.00,240,88),

-- ── Perth ──────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000155','b1000000-0000-0000-0000-000000000035','c1000000-0000-0000-0000-000000000006',
 'Cottesloe Beach Sunset','Perth''s most iconic beach: calm Indian Ocean waves, golden sand, and spectacular sunsets.',
 'https://images.unsplash.com/photo-1559628233-100c798642d8?w=600',0.00,120,87),

('d100-0000-0000-0000-000000000156','b1000000-0000-0000-0000-000000000035','c1000000-0000-0000-0000-000000000003',
 'Rottnest Island Cycle & Quokka','Ferry to the car-free island, rent a bike, and meet the world''s happiest animal.',
 'https://images.unsplash.com/photo-1559628233-100c798642d8?w=600',40.00,360,91),

('d100-0000-0000-0000-000000000157','b1000000-0000-0000-0000-000000000035','c1000000-0000-0000-0000-000000000002',
 'Fremantle Market & Fish & Chips','Victorian-era market on Saturdays then harbour fish and chips overlooking the Indian Ocean.',
 'https://images.unsplash.com/photo-1559628233-100c798642d8?w=600',18.00,120,80),

-- ── Koh Samui ─────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000158','b1000000-0000-0000-0000-000000000040','c1000000-0000-0000-0000-000000000006',
 'Chaweng Beach & Water Sports','Rent a jet ski or just lounge on the island''s most popular strip of white sand.',
 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600',20.00,240,83),

('d100-0000-0000-0000-000000000159','b1000000-0000-0000-0000-000000000040','c1000000-0000-0000-0000-000000000003',
 'Snorkelling at Koh Tao','Speed boat to the world-famous dive site for reef sharks, sea turtles, and neon parrotfish.',
 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600',60.00,300,90),

('d100-0000-0000-0000-000000000160','b1000000-0000-0000-0000-000000000040','c1000000-0000-0000-0000-000000000006',
 'Waterfall & Jungle Hike at Na Muang','Two-tiered purple waterfall in the jungle interior with rope swings and natural pools.',
 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600',5.00,180,75),

-- ── Sharjah ────────────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000161','b1000000-0000-0000-0000-000000000038','c1000000-0000-0000-0000-000000000004',
 'Sharjah Art Museum','One of the Middle East''s finest art museums, with extensive Arab and Islamic collections.',
 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600',0.00,120,72),

('d100-0000-0000-0000-000000000162','b1000000-0000-0000-0000-000000000038','c1000000-0000-0000-0000-000000000001',
 'Sharjah Heritage Area','Restored mudbrick houses and 16 museums set around a historic central square.',
 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600',5.00,150,68),

-- ── Rotterdam extra ────────────────────────────────────────────────────────
('d100-0000-0000-0000-000000000163','b1000000-0000-0000-0000-000000000005','c1000000-0000-0000-0000-000000000003',
 'Kinderdijk Windmill Cycle','Cycle to UNESCO-listed polder with 19 operating 18th-century windmills.',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',12.00,240,82),

-- ── Extra activities to reach 180+ total ──────────────────────────────────
('d100-0000-0000-0000-000000000164','b1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000003',
 'Versailles Palace & Gardens Day Trip','Louis XIV''s opulent palace and the vast formal gardens 30 minutes from Paris by RER.',
 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',25.00,360,91),

('d100-0000-0000-0000-000000000165','b1000000-0000-0000-0000-000000000008','c1000000-0000-0000-0000-000000000006',
 'Odaiba Beach & Teamlab Planets','Futuristic island with digital art, giant Gundam statue, and great views of Rainbow Bridge.',
 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',35.00,240,80),

('d100-0000-0000-0000-000000000166','b1000000-0000-0000-0000-000000000018','c1000000-0000-0000-0000-000000000003',
 'Hudson River Kayaking','Paddle along the Hudson from Manhattan with views of the skyline and New Jersey Palisades.',
 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600',45.00,120,72),

('d100-0000-0000-0000-000000000167','b1000000-0000-0000-0000-000000000004','c1000000-0000-0000-0000-000000000006',
 'Vondelpark Picnic & Concert','Amsterdam''s most beloved park hosts free outdoor concerts; rent a blanket and watch the world go by.',
 'https://images.unsplash.com/photo-1512470604718-d55db9b08e64?w=600',5.00,120,78),

('d100-0000-0000-0000-000000000168','b1000000-0000-0000-0000-000000000012','c1000000-0000-0000-0000-000000000004',
 'Jim Thompson House Museum','The mysterious American silk entrepreneur''s Thai-style mansion filled with Asian antiques.',
 'https://images.unsplash.com/photo-1598935898639-81586f7d2129?w=600',8.00,90,79),

('d100-0000-0000-0000-000000000169','b1000000-0000-0000-0000-000000000009','c1000000-0000-0000-0000-000000000001',
 'Gion District Night Walk','Stroll the preserved geisha quarter at dusk for a chance to see a maiko hurrying to an appointment.',
 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',0.00,60,92),

('d100-0000-0000-0000-000000000170','b1000000-0000-0000-0000-000000000029','c1000000-0000-0000-0000-000000000001',
 'Bahia Palace','14th-century palace of a powerful grand vizier; a labyrinth of rooms, gardens, and zellige tilework.',
 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600',2.00,60,84),

('d100-0000-0000-0000-000000000171','b1000000-0000-0000-0000-000000000032','c1000000-0000-0000-0000-000000000005',
 'Newtown & Surry Hills Bar Night','Sydney''s hippest inner suburbs: craft cocktail bars, live bands, and late-night pizza.',
 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600',60.00,240,77),

('d100-0000-0000-0000-000000000172','b1000000-0000-0000-0000-000000000036','c1000000-0000-0000-0000-000000000005',
 'Bluewaters Island Rooftop Dining','Waterfront restaurants and bars on the newest Dubai island with Ain Dubai views.',
 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',80.00,180,80),

('d100-0000-0000-0000-000000000173','b1000000-0000-0000-0000-000000000026','c1000000-0000-0000-0000-000000000003',
 'Hang-gliding over Rio','Tandem hang-glide from Pedra Bonita into São Conrado Beach for a bird''s-eye city view.',
 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600',120.00,90,89),

('d100-0000-0000-0000-000000000174','b1000000-0000-0000-0000-000000000023','c1000000-0000-0000-0000-000000000006',
 'Chapultepec Park & Rowing Lake','Vast urban park with a castle, zoo, rowing boats on the lake, and great people-watching.',
 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=600',5.00,180,76),

('d100-0000-0000-0000-000000000175','b1000000-0000-0000-0000-000000000033','c1000000-0000-0000-0000-000000000005',
 'Rooftop Bar at Naked in the Sky','Fitzroy rooftop bar with panoramic Melbourne views, craft cocktails, and live DJs on weekends.',
 'https://images.unsplash.com/photo-1545044846-351ba102b6d5?w=600',45.00,180,79),

('d100-0000-0000-0000-000000000176','b1000000-0000-0000-0000-000000000019','c1000000-0000-0000-0000-000000000005',
 'WeHo & Silver Lake Nightlife','LA''s most vibrant LGBTQ+ neighbourhood and hipster enclave with comedy clubs and dance bars.',
 'https://images.unsplash.com/photo-1580655653885-65763b2597d1?w=600',50.00,240,76),

('d100-0000-0000-0000-000000000177','b1000000-0000-0000-0000-000000000016','c1000000-0000-0000-0000-000000000003',
 'Hot Air Balloon over Jaipur','Float above the Pink City''s forts, palaces, and desert plains at sunrise.',
 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600',130.00,120,85),

('d100-0000-0000-0000-000000000178','b1000000-0000-0000-0000-000000000015','c1000000-0000-0000-0000-000000000006',
 'Marine Drive Sunset Walk','Stroll along the Queen''s Necklace as the Arabian Sea lights up amber at dusk.',
 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600',0.00,60,80),

('d100-0000-0000-0000-000000000179','b1000000-0000-0000-0000-000000000014','c1000000-0000-0000-0000-000000000005',
 'Bangla Road Night Market','Phuket''s famous party street: fire shows, street food, and open-air bars along the strip.',
 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600',25.00,180,76),

('d100-0000-0000-0000-000000000180','b1000000-0000-0000-0000-000000000013','c1000000-0000-0000-0000-000000000006',
 'Doi Inthanon National Park','Thailand''s highest peak with twin royal chedis, misty trails, and bird-watching at dawn.',
 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600',8.00,360,82),

('d100-0000-0000-0000-000000000181','b1000000-0000-0000-0000-000000000022','c1000000-0000-0000-0000-000000000005',
 'LGBTQ+ Castro District Evening','The historic heart of gay rights in America: Harvey Milk''s camera shop, dive bars, and cinema.',
 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600',30.00,180,73),

('d100-0000-0000-0000-000000000182','b1000000-0000-0000-0000-000000000039','c1000000-0000-0000-0000-000000000003',
 'Cycle Tour of Lutyens'' Delhi','Pedal past Parliament House, India Gate, and the Secretariat on a guided heritage bike tour.',
 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600',22.00,240,72),

('d100-0000-0000-0000-000000000183','b1000000-0000-0000-0000-000000000011','c1000000-0000-0000-0000-000000000001',
 'Hiroshima Shukkeien Garden','Tranquil stroll-garden built in 1620 with a stream-fed pond, arched bridges, and stone lanterns.',
 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600',2.60,60,62),

('d100-0000-0000-0000-000000000184','b1000000-0000-0000-0000-000000000002','c1000000-0000-0000-0000-000000000005',
 'Nice Old Town Bar Night','Bar-hop through Vieux-Nice: rosé wine bars, cocktail lounges, and jazz clubs in 18th-century alleys.',
 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=600',45.00,180,70),

('d100-0000-0000-0000-000000000185','b1000000-0000-0000-0000-000000000006','c1000000-0000-0000-0000-000000000006',
 'Prague Spa Day at Mandarin Oriental','World-class spa in a 14th-century Dominican monastery with Czech herbal treatments.',
 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=600',150.00,240,74)

ON CONFLICT (city_id, name) DO NOTHING;

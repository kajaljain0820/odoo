-- 01_countries.sql
-- 12 countries across all 7 regions.
-- Idempotent: ON CONFLICT DO NOTHING on unique name/iso2 columns.

INSERT INTO countries (id, name, iso2, region, currency_code) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'France',        'FR', 'Europe',        'EUR'),
  ('a1000000-0000-0000-0000-000000000002', 'Netherlands',   'NL', 'Europe',        'EUR'),
  ('a1000000-0000-0000-0000-000000000003', 'Czech Republic','CZ', 'Europe',        'CZK'),
  ('a1000000-0000-0000-0000-000000000004', 'Japan',         'JP', 'Asia',          'JPY'),
  ('a1000000-0000-0000-0000-000000000005', 'Thailand',      'TH', 'Asia',          'THB'),
  ('a1000000-0000-0000-0000-000000000006', 'India',         'IN', 'Asia',          'INR'),
  ('a1000000-0000-0000-0000-000000000007', 'United States', 'US', 'North America', 'USD'),
  ('a1000000-0000-0000-0000-000000000008', 'Mexico',        'MX', 'North America', 'MXN'),
  ('a1000000-0000-0000-0000-000000000009', 'Brazil',        'BR', 'South America', 'BRL'),
  ('a1000000-0000-0000-0000-000000000010', 'Morocco',       'MA', 'Africa',        'MAD'),
  ('a1000000-0000-0000-0000-000000000011', 'Australia',     'AU', 'Oceania',       'AUD'),
  ('a1000000-0000-0000-0000-000000000012', 'United Arab Emirates', 'AE', 'Middle East', 'AED')
ON CONFLICT (iso2) DO NOTHING;

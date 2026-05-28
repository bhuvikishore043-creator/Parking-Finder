-- ─────────────────────────────────────────────
--  Chennai Parking Finder — Supabase Database
--  Run this SQL inside Supabase → SQL Editor
-- ─────────────────────────────────────────────


-- 1. PARKING SPOTS TABLE
-- Stores all parking locations in Chennai
-- ─────────────────────────────────────────────
CREATE TABLE parking_spots (
  id          SERIAL PRIMARY KEY,
  name        TEXT    NOT NULL,
  area        TEXT,
  type        TEXT    CHECK (type IN ('Metro', 'Multi-level', 'Open lot')),
  lat         NUMERIC NOT NULL,
  lng         NUMERIC NOT NULL,
  fee         TEXT,
  hours       TEXT,
  is_open_24  BOOLEAN DEFAULT false,
  address     TEXT,
  capacity    TEXT,
  rating      NUMERIC DEFAULT 0,
  reviews     INTEGER DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW()
);


-- 2. REVIEWS TABLE
-- Stores user reviews for each parking spot
-- ─────────────────────────────────────────────
CREATE TABLE reviews (
  id          SERIAL PRIMARY KEY,
  parking_id  INTEGER REFERENCES parking_spots(id) ON DELETE CASCADE,
  author_name TEXT    NOT NULL,
  rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);


-- 3. SAVED SPOTS TABLE
-- Users can bookmark/save their favourite spots
-- ─────────────────────────────────────────────
CREATE TABLE saved_spots (
  id          SERIAL PRIMARY KEY,
  user_id     TEXT    NOT NULL,
  parking_id  INTEGER REFERENCES parking_spots(id) ON DELETE CASCADE,
  saved_at    TIMESTAMP DEFAULT NOW()
);


-- ─────────────────────────────────────────────
--  4. SEED DATA — Insert all 8 Chennai spots
-- ─────────────────────────────────────────────
INSERT INTO parking_spots (name, area, type, lat, lng, fee, hours, is_open_24, address, capacity, rating, reviews) VALUES
  ('GCC Multilevel Parking',         'T. Nagar',       'Multi-level', 13.0441, 80.2338, '₹20/hr',                  '09:30 AM - 11:00 PM', false, 'Burkit Rd, T. Nagar, Chennai 600017',                        '500+ Cars',   4.4, 180),
  ('Chennai Central Station Parking','Central',        'Open lot',    13.0827, 80.2707, '₹35 for 2 hrs',           '24 Hours',            true,  'Kannappar Thidal, Periyamet, Chennai 600003',                '200 Cars',    3.7, 349),
  ('Marina Beach Car Parking',       'Triplicane',     'Open lot',    13.0544, 80.2826, 'Free / Nominal',           '05:00 AM - 11:30 PM', false, 'Marina Beach Road, Triplicane, Chennai 600005',              '1000+ Cars',  4.1, 558),
  ('Nehru Park Metro Parking',       'Kilpauk',        'Metro',       13.0792, 80.2514, '₹30 for 12 hrs',          '06:00 AM - 11:00 PM', false, 'Poonamallee High Rd, Kilpauk, Chennai 600084',               '120 Cars',    4.4,  70),
  ('Alandur Metro Car Parking',      'Alandur',        'Metro',       13.0039, 80.2015, '₹30 (Metro Card discount)','05:00 AM - 11:30 PM', false, 'Kathipara Junction, Alandur, Chennai 600016',                '300 Cars',    4.4, 380),
  ('Central Metro Station Parking',  'Central',        'Metro',       13.0815, 80.2725, '₹40 for 4 hrs',           '24 Hours',            true,  'Poonamallee High Rd, Central, Chennai 600003',               '400 Cars',    4.5, 228),
  ('Chennai Airport Multi-level',    'Meenambakkam',   'Multi-level', 12.9816, 80.1652, 'FASTag Managed Rates',     '24 Hours',            true,  'Grand Southern Trunk Rd, Meenambakkam, Chennai 600027',      '2000+ Cars',  4.0, 112),
  ('Express Avenue Mall Parking',    'Royapettah',     'Multi-level', 13.0587, 80.2641, '₹40–60/hr',               '10:00 AM - 10:00 PM', false, 'Club House Rd, Express Estate, Royapettah, Chennai 600002',  '1500 Cars',   4.4, 1057);


-- ─────────────────────────────────────────────
--  5. SAMPLE REVIEWS (optional seed data)
-- ─────────────────────────────────────────────
INSERT INTO reviews (parking_id, author_name, rating, comment) VALUES
  (1, 'Ramesh K',  5, 'Very neatly maintained. Free for 3 hours — perfect for T. Nagar shopping!'),
  (1, 'Priya S',   4, 'Clean restrooms and helpful staff. Slight wait on weekends but worth it.'),
  (2, 'Vijay R',   3, 'Tough to park during peak hours but the only nearby option near Central.'),
  (3, 'Suresh P',  5, 'Free parking right at the beach. Cannot ask for more!'),
  (4, 'Balaji T',  5, 'Best value parking in Chennai. Metro card payment is very convenient.'),
  (5, 'Karthik N', 5, 'Great for metro commuters. Very affordable and well laid out.'),
  (6, 'Senthil V', 5, 'Underground and dry even in heavy rain. Very safe — highly recommend.'),
  (7, 'Mohan Das', 5, 'Green/red indicators above each slot are super helpful. FASTag is seamless.'),
  (8, 'Arjun S',   5, 'Ample space, well-lit and secure. EV charging is a great addition.');

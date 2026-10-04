-- ============================================================
-- Travel Journey Planner — MySQL Database Schema
-- ============================================================
-- Run this file once to create all tables.
-- Import via: phpMyAdmin > Import, or run in MySQL CLI.
-- ============================================================

CREATE DATABASE IF NOT EXISTS travel_planner
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE travel_planner;

-- ============================================================
-- 1. USERS
-- Stores registered user accounts
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100)        NOT NULL,
    email        VARCHAR(150)        NOT NULL UNIQUE,
    password     VARCHAR(255)        NOT NULL,  -- Stored as bcrypt hash
    created_at   TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. DESTINATIONS
-- Stores travel destination information
-- ============================================================
CREATE TABLE IF NOT EXISTS destinations (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(150)        NOT NULL,
    country      VARCHAR(100)        NOT NULL  DEFAULT 'India',
    state        VARCHAR(100),
    description  TEXT,
    image_url    VARCHAR(500),
    category     VARCHAR(100),                -- e.g. Beach, Mountain, Heritage
    created_at   TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. PLACES
-- Tourist attractions linked to a destination
-- ============================================================
CREATE TABLE IF NOT EXISTS places (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    destination_id  INT            NOT NULL,
    name            VARCHAR(150)   NOT NULL,
    description     TEXT,
    image_url       VARCHAR(500),
    entry_fee       DECIMAL(8, 2)  DEFAULT 0.00,   -- In INR
    timings         VARCHAR(200),                   -- e.g. "9 AM – 6 PM"
    latitude        DECIMAL(10, 7),
    longitude       DECIMAL(10, 7),
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- ============================================================
-- 4. HOTELS
-- Basic hotel information linked to a destination
-- ============================================================
CREATE TABLE IF NOT EXISTS hotels (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    destination_id  INT            NOT NULL,
    name            VARCHAR(150)   NOT NULL,
    description     TEXT,
    image_url       VARCHAR(500),
    price_per_night DECIMAL(10, 2) DEFAULT 0.00,  -- In INR
    rating          DECIMAL(2, 1)  DEFAULT 0.0,   -- e.g. 4.2
    address         VARCHAR(300),
    phone           VARCHAR(20),
    latitude        DECIMAL(10, 7),
    longitude       DECIMAL(10, 7),
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- ============================================================
-- 5. TRIPS
-- Trips created by users
-- ============================================================
CREATE TABLE IF NOT EXISTS trips (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT            NOT NULL,
    destination_id  INT,
    trip_name       VARCHAR(200),
    start_date      DATE           NOT NULL,
    end_date        DATE           NOT NULL,
    num_travellers  INT            DEFAULT 1,
    notes           TEXT,
    created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)        REFERENCES users(id)        ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL
);

-- ============================================================
-- 6. ITINERARY
-- Day-by-day activities for a trip
-- ============================================================
CREATE TABLE IF NOT EXISTS itinerary (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    trip_id       INT            NOT NULL,
    day_number    INT            NOT NULL,   -- e.g. 1, 2, 3
    time          VARCHAR(20),              -- e.g. "10:00 AM"
    activity_name VARCHAR(200)   NOT NULL,
    notes         TEXT,
    created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- ============================================================
-- 7. CONTACT MESSAGES
-- Messages submitted via the contact form
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL,
    message     TEXT          NOT NULL,
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SAMPLE DATA — Destinations (used for Phase 2+)
-- ============================================================
INSERT INTO destinations (name, country, state, description, category) VALUES
('Jaipur',   'India', 'Rajasthan', 'The Pink City, famous for Amer Fort, Hawa Mahal, and vibrant bazaars.', 'Heritage'),
('Goa',      'India', 'Goa',       'India''s beach paradise with sandy shores, seafood, and nightlife.',    'Beach'),
('Manali',   'India', 'Himachal Pradesh', 'A high-altitude Himalayan resort town for adventure seekers.',  'Mountain'),
('Agra',     'India', 'Uttar Pradesh',    'Home to the iconic Taj Mahal, one of the Seven Wonders.',       'Heritage'),
('Munnar',   'India', 'Kerala',           'Scenic hill station famous for its tea plantations.',           'Hill Station'),
('Varanasi', 'India', 'Uttar Pradesh',    'One of the world''s oldest cities on the banks of the Ganges.','Spiritual');

-- ============================================================
-- SAMPLE DATA — Places
-- ============================================================
INSERT INTO places (destination_id, name, description, entry_fee, timings) VALUES
(1, 'Amer Fort',       'Magnificent fort with stunning views of Maota Lake.',    200.00, '8 AM – 5:30 PM'),
(1, 'Hawa Mahal',      'Palace of Winds — iconic five-storey pink sandstone facade.', 50.00, '9 AM – 5 PM'),
(2, 'Baga Beach',      'Popular beach known for water sports and shacks.',          0.00, 'Open All Day'),
(2, 'Dudhsagar Falls', 'One of India''s tallest waterfalls located in the forest.',  0.00, '9 AM – 4 PM'),
(3, 'Rohtang Pass',    'High mountain pass offering panoramic Himalayan views.',   550.00, '6 AM – 5 PM'),
(4, 'Taj Mahal',       'Iconic white marble mausoleum — UNESCO World Heritage site.', 1100.00, '6 AM – 6:30 PM');

-- ============================================================
-- SAMPLE DATA — Hotels
-- ============================================================
INSERT INTO hotels (destination_id, name, description, price_per_night, rating, address) VALUES
(1, 'Hotel Pink Pearl',   'Comfortable hotel in the heart of Jaipur with rooftop dining.', 2500.00, 4.2, 'M.I. Road, Jaipur'),
(1, 'The Royal Heritage', 'Heritage property with palace-style architecture.',             5500.00, 4.7, 'Hawa Mahal Road, Jaipur'),
(2, 'Sea Shell Resort',   'Beachfront resort with stunning ocean views.',                  4200.00, 4.3, 'Calangute Beach, Goa'),
(3, 'Snow Valley Lodge',  'Cozy mountain lodge with views of Rohtang Pass.',               3800.00, 4.5, 'Old Manali, Himachal Pradesh');

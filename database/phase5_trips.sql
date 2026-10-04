-- ============================================================
-- Travel Journey Planner — Phase 5: Trip Planner
-- ============================================================
-- The trips table already exists in travel_planner.sql.
-- This file documents its structure and what Phase 5 uses.
--
-- If you created the database from travel_planner.sql, you 
-- already have this table. No action needed.
--
-- If starting fresh, run this file after travel_planner.sql.
-- ============================================================

USE travel_planner;

-- ============================================================
-- TRIPS TABLE (already created by travel_planner.sql)
-- Using the existing schema which has these columns:
--   id              - primary key
--   user_id         - links to users table (get from PHP session)
--   destination_id  - links to destinations table (may be NULL)
--   trip_name       - optional friendly name for the trip
--   start_date      - trip start date
--   end_date        - trip end date
--   num_travellers  - number of people travelling
--   notes           - optional additional notes
--   created_at      - auto timestamp
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
-- Phase 5 uses these columns from trips:
--   user_id         -> NEVER taken from React; always from $_SESSION['user_id']
--   destination_id  -> Required for Phase 5 (dropdown in form)
--   start_date      -> Required
--   end_date        -> Required; must be >= start_date
--   num_travellers  -> Required; minimum 1
--   trip_name       -> Auto-generated from destination name (e.g. "Goa Trip")
-- ============================================================

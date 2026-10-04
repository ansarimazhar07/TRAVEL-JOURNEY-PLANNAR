-- ============================================================
-- Travel Journey Planner — Phase 4: User Authentication
-- ============================================================
-- This file sets up the users table for authentication.
--
-- The users table was already defined in travel_planner.sql.
-- This file ensures the table exists and is correctly structured.
--
-- Run this file if you created the database WITHOUT travel_planner.sql,
-- or if you want to verify the users table is present.
--
-- Import via: phpMyAdmin > Import, or run in MySQL CLI:
--   mysql -u root -p travel_planner < phase4_auth.sql
-- ============================================================

USE travel_planner;

-- ============================================================
-- USERS TABLE
-- Stores registered user accounts.
-- Passwords are stored as bcrypt hashes (via PHP password_hash).
-- NEVER store plain-text passwords.
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,  -- bcrypt hash from PHP password_hash()
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- HOW PASSWORDS WORK (for viva explanation)
-- ============================================================
-- Registration:
--   $hash = password_hash($plainPassword, PASSWORD_DEFAULT);
--   INSERT INTO users (name, email, password) VALUES (?, ?, $hash);
--
-- Login:
--   SELECT password FROM users WHERE email = ?;
--   if (password_verify($plainPassword, $storedHash)) { ... login ... }
--
-- password_hash() uses bcrypt by default.
-- password_verify() automatically handles the algorithm details.
-- The stored hash looks like: $2y$10$...
-- ============================================================

-- ============================================================
-- TEST: After running register.php with these credentials:
--   Name:     Test User
--   Email:    test@example.com
--   Password: password123
--
-- The password column should contain a hash like:
--   $2y$10$someRandomSaltHere...
-- NOT the plain text: password123
-- ============================================================

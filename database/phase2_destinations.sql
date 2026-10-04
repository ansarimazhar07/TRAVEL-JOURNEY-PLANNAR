-- ============================================================
-- Phase 2 Update: Add best_time column + more destinations
-- Run this in phpMyAdmin or MySQL CLI on your travel_planner DB
-- ============================================================

USE travel_planner;

-- Add best_time column to destinations table (if not exists)
ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS best_time VARCHAR(100) AFTER category;

-- Clear old sample data and reload with full Phase 2 data
DELETE FROM destinations;

-- Reset auto-increment so IDs start from 1
ALTER TABLE destinations AUTO_INCREMENT = 1;

-- Insert 8 destinations with all required fields
INSERT INTO destinations
  (name, country, state, description, image_url, category, best_time)
VALUES
(
  'Jaipur', 'India', 'Rajasthan',
  'Known as the Pink City, Jaipur is the capital of Rajasthan and a major tourist destination. It is famous for its stunning forts, palaces, and vibrant bazaars. Highlights include the majestic Amer Fort, the iconic Hawa Mahal (Palace of Winds), the City Palace, and the Jantar Mantar observatory. The city''s rich Rajput heritage, colourful culture, and delicious local cuisine make it a must-visit destination in India.',
  '/images/destinations/jaipur.jpg', 'Heritage',
  'October to March'
),
(
  'Goa', 'India', 'Goa',
  'Goa is India''s smallest state and its most popular beach destination. Famous for its palm-fringed beaches, Portuguese architecture, vibrant nightlife, and delicious seafood, Goa attracts millions of visitors each year. Whether you want to relax on Baga Beach, explore the historic churches of Old Goa, or enjoy water sports, this coastal paradise has something for everyone.',
  '/images/destinations/goa.jpg', 'Beach',
  'November to February'
),
(
  'Manali', 'India', 'Himachal Pradesh',
  'Nestled in the Himalayas at an altitude of 2,050 metres, Manali is a popular hill station and adventure tourism destination. It offers breathtaking views of snow-capped peaks, lush green valleys, and the Beas River. Adventure seekers can enjoy trekking, skiing, paragliding, and river rafting. The nearby Rohtang Pass and Solang Valley are major attractions.',
  '/images/destinations/manali.jpg', 'Mountain',
  'October to June'
),
(
  'Agra', 'India', 'Uttar Pradesh',
  'Agra is home to the Taj Mahal, one of the Seven Wonders of the World and a UNESCO World Heritage Site. Built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal, this white marble mausoleum is a symbol of eternal love. Agra also offers the Agra Fort and Fatehpur Sikri, making it a treasured stop on India''s Golden Triangle tourist circuit.',
  '/images/destinations/agra.jpg', 'Heritage',
  'October to March'
),
(
  'Munnar', 'India', 'Kerala',
  'Munnar is a picturesque hill station in the Western Ghats of Kerala, famous for its vast tea plantations, rolling green hills, and misty mountains. It is one of South India''s most beautiful retreats. Visitors can explore tea estates, trek through the Eravikulam National Park (home to the rare Nilgiri Tahr), and enjoy the cool, refreshing climate that provides welcome relief from the heat.',
  '/images/destinations/munnar.jpg', 'Hill Station',
  'September to May'
),
(
  'Varanasi', 'India', 'Uttar Pradesh',
  'Varanasi, also known as Kashi or Benares, is one of the world''s oldest continuously inhabited cities. Situated on the banks of the holy River Ganges, it is a major pilgrimage site for Hindus and a fascinating cultural destination. The famous Ganga Aarti ceremony, ancient ghats, narrow lanes filled with temples, and the vibrant spiritual atmosphere make Varanasi a truly unique experience.',
  '/images/destinations/varanasi.jpg', 'Spiritual',
  'October to March'
),
(
  'Mumbai', 'India', 'Maharashtra',
  'Mumbai, the financial capital of India, is a city of dreams, contrasts, and endless energy. Known as Bollywood''s home, it offers iconic landmarks such as the Gateway of India, Marine Drive, Elephanta Caves, and the Chhatrapati Shivaji Maharaj Terminus. The city''s street food scene, diverse culture, and vibrant nightlife make it one of India''s most exciting urban destinations.',
  '/images/destinations/mumbai.jpg', 'City',
  'November to February'
),
(
  'Delhi', 'India', 'Delhi',
  'Delhi, India''s capital territory, is a sprawling metropolis where ancient history and modern life blend seamlessly. From the majestic Red Fort and Qutub Minar to the India Gate and Lotus Temple, Delhi is packed with iconic landmarks. The city''s diverse cuisine, bustling markets like Chandni Chowk, and proximity to Agra and Jaipur make it the perfect starting point for exploring North India.',
  '/images/destinations/delhi.jpg', 'Heritage',
  'October to March'
);

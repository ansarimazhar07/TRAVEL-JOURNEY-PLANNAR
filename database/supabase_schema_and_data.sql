-- ============================================================
-- Supabase (PostgreSQL) Schema & Seed Data
-- Travel Journey Planner
--
-- HOW TO USE IN SUPABASE:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Go to the 'SQL Editor' tab in the left sidebar.
-- 3. Click 'New query', paste this entire file, and click 'Run'.
-- ============================================================

-- Clean up existing tables if any
DROP TABLE IF EXISTS itinerary CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS destinations CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;

-- 1. DESTINATIONS
CREATE TABLE destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    state VARCHAR(100),
    description TEXT,
    image_url VARCHAR(500),
    category VARCHAR(100),
    best_time VARCHAR(100),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. HOTELS
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    destination_id INT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    price_per_night NUMERIC(10,2) DEFAULT 0.00,
    rating NUMERIC(2,1) DEFAULT 0.0,
    address VARCHAR(300),
    phone VARCHAR(20),
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. PLACES
CREATE TABLE places (
    id SERIAL PRIMARY KEY,
    destination_id INT NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    entry_fee NUMERIC(8,2) DEFAULT 0.00,
    timings VARCHAR(200),
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TRIPS
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination_id INT REFERENCES destinations(id) ON DELETE SET NULL,
    trip_name VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    num_travellers INT DEFAULT 1,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ITINERARY
CREATE TABLE itinerary (
    id SERIAL PRIMARY KEY,
    trip_id INT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    time VARCHAR(20),
    activity_name VARCHAR(200) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. CONTACT MESSAGES
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO destinations VALUES (1,'Jaipur','India','Rajasthan','Known as the Pink City, Jaipur is the capital of Rajasthan and a major tourist destination. It is famous for its stunning forts, palaces, and vibrant bazaars. Highlights include the majestic Amer Fort, the iconic Hawa Mahal (Palace of Winds), the City Palace, and the Jantar Mantar observatory. The city\'s rich Rajput heritage, colourful culture, and delicious local cuisine make it a must-visit destination in India.','/images/destinations/jaipur.jpg','Heritage','October to March','2026-10-01 16:12:10'),(2,'Goa','India','Goa','Goa is India\'s smallest state and its most popular beach destination. Famous for its palm-fringed beaches, Portuguese architecture, vibrant nightlife, and delicious seafood, Goa attracts millions of visitors each year. Whether you want to relax on Baga Beach, explore the historic churches of Old Goa, or enjoy water sports, this coastal paradise has something for everyone.','/images/destinations/goa.jpg','Beach','November to February','2026-10-01 16:12:10'),(3,'Manali','India','Himachal Pradesh','Nestled in the Himalayas at an altitude of 2,050 metres, Manali is a popular hill station and adventure tourism destination. It offers breathtaking views of snow-capped peaks, lush green valleys, and the Beas River. Adventure seekers can enjoy trekking, skiing, paragliding, and river rafting. The nearby Rohtang Pass and Solang Valley are major attractions.','/images/destinations/manali.jpg','Mountain','October to June','2026-10-01 16:12:10'),(4,'Agra','India','Uttar Pradesh','Agra is home to the Taj Mahal, one of the Seven Wonders of the World and a UNESCO World Heritage Site. Built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal, this white marble mausoleum is a symbol of eternal love. Agra also offers the Agra Fort and Fatehpur Sikri, making it a treasured stop on India\'s Golden Triangle tourist circuit.','/images/destinations/agra.jpg','Heritage','October to March','2026-10-01 16:12:10'),(5,'Munnar','India','Kerala','Munnar is a picturesque hill station in the Western Ghats of Kerala, famous for its vast tea plantations, rolling green hills, and misty mountains. It is one of South India\'s most beautiful retreats. Visitors can explore tea estates, trek through the Eravikulam National Park (home to the rare Nilgiri Tahr), and enjoy the cool, refreshing climate that provides welcome relief from the heat.','/images/destinations/munnar.jpg','Hill Station','September to May','2026-10-01 16:12:10'),(6,'Varanasi','India','Uttar Pradesh','Varanasi, also known as Kashi or Benares, is one of the world\'s oldest continuously inhabited cities. Situated on the banks of the holy River Ganges, it is a major pilgrimage site for Hindus and a fascinating cultural destination. The famous Ganga Aarti ceremony, ancient ghats, narrow lanes filled with temples, and the vibrant spiritual atmosphere make Varanasi a truly unique experience.','/images/destinations/varanasi.jpg','Spiritual','October to March','2026-10-01 16:12:10'),(7,'Mumbai','India','Maharashtra','Mumbai, the financial capital of India, is a city of dreams, contrasts, and endless energy. Known as Bollywood\'s home, it offers iconic landmarks such as the Gateway of India, Marine Drive, Elephanta Caves, and the Chhatrapati Shivaji Maharaj Terminus. The city\'s street food scene, diverse culture, and vibrant nightlife make it one of India\'s most exciting urban destinations.','/images/destinations/mumbai.jpg','City','November to February','2026-10-01 16:12:10'),(8,'Delhi','India','Delhi','Delhi, India\'s capital territory, is a sprawling metropolis where ancient history and modern life blend seamlessly. From the majestic Red Fort and Qutub Minar to the India Gate and Lotus Temple, Delhi is packed with iconic landmarks. The city\'s diverse cuisine, bustling markets like Chandni Chowk, and proximity to Agra and Jaipur make it the perfect starting point for exploring North India.','/images/destinations/delhi.jpg','Heritage','October to March','2026-10-01 16:12:10');

INSERT INTO hotels VALUES (9,1,'Jaipur Palace Hotel','A comfortable hotel in the heart of Jaipur offering easy access to major tourist attractions. Rooms are clean and well-maintained with modern amenities. The hotel serves a good breakfast and the staff is helpful.','/images/hotels/jaipur-palace-hotel.jpg',2800.00,4.2,'MI Road, Jaipur',NULL,NULL,NULL,'2026-10-01 16:13:58'),(10,1,'Pink City Inn','A budget-friendly stay in Jaipur that provides comfortable rooms and a friendly atmosphere. Located close to the main shopping areas and the old city.','/images/hotels/pink-city-inn.jpg',1500.00,3.8,'Sanganer Road, Jaipur',NULL,NULL,NULL,'2026-10-01 16:13:58'),(11,1,'Heritage Haveli','Experience the charm of Rajasthani culture in this beautifully restored heritage property. The haveli features traditionally decorated rooms, a courtyard, and serves home-style Rajasthani meals.','/images/hotels/heritage-haveli.jpg',3500.00,4.5,'Badi Choupad, Jaipur',NULL,NULL,NULL,'2026-10-01 16:13:58'),(12,2,'Goa Beach Resort','A comfortable resort located a short walk from the beach. The property features simple, clean rooms and a small pool area. Ideal for travellers who want to enjoy the beach without spending too much.','/images/hotels/goa-beach-resort.jpg',2500.00,4.2,'Calangute, North Goa',NULL,NULL,NULL,'2026-10-01 16:13:58'),(13,2,'Calangute Hotel','A good value hotel in the popular Calangute area, close to beaches, restaurants, and night spots. Rooms are well-maintained with essential amenities.','/images/hotels/calangute-hotel.jpg',1800.00,4.0,'Calangute Beach Road, North Goa',NULL,NULL,NULL,'2026-10-01 16:13:58'),(14,2,'Sunset Stay Goa','A pleasant guesthouse offering sea-facing rooms with beautiful sunset views. The property is small and cosy, perfect for couples and solo travellers. Breakfast is included.','/images/hotels/sunset-stay-goa.jpg',2200.00,4.3,'Baga, North Goa',NULL,NULL,NULL,'2026-10-01 16:13:58'),(15,3,'Snow Valley Resort','Situated near Solang Valley, this resort offers stunning mountain views from every room. Perfect for adventure enthusiasts, the property can help arrange outdoor activities like trekking and skiing.','/images/hotels/snow-valley-resort.jpg',3200.00,4.4,'Solang Valley Road, Manali',NULL,NULL,NULL,'2026-10-01 16:13:58'),(16,3,'Himalayan Inn','A cosy, budget-friendly property in central Manali with warm and comfortable rooms. The inn has a pleasant sitting area and the staff provides good tips for local exploration.','/images/hotels/himalayan-inn.jpg',1600.00,3.9,'Mall Road, Manali',NULL,NULL,NULL,'2026-10-01 16:13:58'),(17,3,'Manali Cedar Hotel','Set in a cedar forest near Old Manali, this hotel offers a quiet and refreshing retreat. Rooms are comfortable with wooden interiors that give a classic mountain feel.','/images/hotels/manali-cedar-hotel.jpg',2600.00,4.1,'Old Manali Road, Manali',NULL,NULL,NULL,'2026-10-01 16:13:58'),(18,4,'Taj View Hotel','As the name suggests, this hotel offers rooms with a partial view of the Taj Mahal. Located in the Taj Ganj area, it is within easy walking distance of the main monument.','/images/hotels/taj-view-hotel.jpg',2200.00,4.0,'Taj Ganj, Agra',NULL,NULL,NULL,'2026-10-01 16:13:58'),(19,4,'Agra Comfort Inn','A well-maintained hotel offering good value in Agra. Rooms are clean and spacious with modern amenities. The hotel provides helpful concierge service for arranging guided tours.','/images/hotels/agra-comfort-inn.jpg',1900.00,3.9,'Fatehabad Road, Agra',NULL,NULL,NULL,'2026-10-01 16:13:58'),(20,4,'Mughal Heritage Hotel','A boutique property inspired by Mughal design, featuring ornate interiors and a beautiful courtyard. Located near the Agra Fort, this hotel offers a unique cultural experience.','/images/hotels/mughal-heritage-hotel.jpg',4000.00,4.6,'Near Agra Fort, Agra',NULL,NULL,NULL,'2026-10-01 16:13:58'),(21,5,'Tea Valley Resort','Set amidst lush tea plantations, this resort provides a serene and beautiful environment. Wake up to misty mountain views and enjoy guided walks through the tea estates.','/images/hotels/tea-valley-resort.jpg',3000.00,4.5,'Pothamedu View Point, Munnar',NULL,NULL,NULL,'2026-10-01 16:13:58'),(22,5,'Misty Hills Hotel','A comfortable hotel perched on the hillside with beautiful views of the misty Munnar hills. The hotel offers clean rooms, a simple restaurant, and is centrally located.','/images/hotels/misty-hills-hotel.jpg',1700.00,4.0,'Munnar Town, Kerala',NULL,NULL,NULL,'2026-10-01 16:13:58'),(23,5,'Munnar Green Resort','A budget resort surrounded by greenery and fresh air. Simple but comfortable rooms with good service. Ideal for travellers looking for a peaceful stay in nature.','/images/hotels/munnar-green-resort.jpg',1400.00,3.7,'Chinnakanal, Munnar',NULL,NULL,NULL,'2026-10-01 16:13:58'),(24,6,'Ganges View Hotel','A guesthouse with beautiful views of the Ganges River. Situated near the main ghats, it is an ideal base for early morning boat rides and exploring the spiritual heart of Varanasi.','/images/hotels/ganges-view-hotel.jpg',1800.00,4.1,'Assi Ghat, Varanasi',NULL,NULL,NULL,'2026-10-01 16:13:58'),(25,6,'Banaras Inn','A comfortable property in the lanes near the ghats, offering an authentic Varanasi experience. The inn has helpful staff who can arrange Ganga Aarti tours and local experiences.','/images/hotels/banaras-inn.jpg',1400.00,3.8,'Dashashwamedh Ghat Road, Varanasi',NULL,NULL,NULL,'2026-10-01 16:13:58'),(26,7,'Mumbai Harbor Hotel','A mid-range hotel with great connectivity to Mumbai\'s major attractions. Comfortable rooms with modern furnishings and a good restaurant on-site.','/images/hotels/mumbai-harbor-hotel.jpg',3500.00,4.2,'Colaba, South Mumbai',NULL,NULL,NULL,'2026-10-01 16:13:58'),(27,7,'Marine Drive Hotel','Located close to the iconic Marine Drive promenade, this hotel offers a pleasant stay in a great location. Some rooms have partial sea views.','/images/hotels/marine-drive-hotel.jpg',2800.00,4.0,'Nariman Point, South Mumbai',NULL,NULL,NULL,'2026-10-01 16:13:58'),(28,7,'Mumbai Central Stay','A budget-friendly hotel in central Mumbai, ideal for business and leisure travellers alike. Clean rooms, reliable WiFi, and a convenient location near the railway station.','/images/hotels/mumbai-central-stay.jpg',1800.00,3.8,'Mumbai Central, Mumbai',NULL,NULL,NULL,'2026-10-01 16:13:58'),(29,8,'Delhi Grand Hotel','A comfortable hotel in New Delhi offering spacious rooms and good service. Located near Connaught Place, it provides easy access to shopping, dining, and public transport.','/images/hotels/delhi-grand-hotel.jpg',3200.00,4.3,'Connaught Place, New Delhi',NULL,NULL,NULL,'2026-10-01 16:13:58'),(30,8,'Connaught Inn','A well-located hotel in the heart of Connaught Place, one of Delhi\'s most vibrant commercial districts. Clean and comfortable rooms, friendly staff, and easy access to the Delhi Metro.','/images/hotels/connaught-inn.jpg',2200.00,4.0,'Connaught Place, New Delhi',NULL,NULL,NULL,'2026-10-01 16:13:58'),(31,8,'Delhi Heritage Hotel','A boutique hotel in Old Delhi offering a glimpse into the city\'s rich history. Set in a restored haveli near the Red Fort, it features heritage-styled rooms and traditional Mughal-inspired cuisine.','/images/hotels/delhi-heritage-hotel.jpg',2600.00,4.2,'Chandni Chowk, Old Delhi',NULL,NULL,NULL,'2026-10-01 16:13:58');

INSERT INTO places VALUES (13,1,'Amber Fort','Amber Fort, also known as Amer Fort, is a grand Rajput fort-palace built in 1592 on a hillside overlooking Maota Lake. The fort is famous for its artistic style that blends Rajput and Mughal architecture. Visitors can explore its stunning halls, temples, and gardens.','/images/places/amber-fort.jpg',200.00,'8:00 AM ??? 5:30 PM',NULL,NULL,'2026-10-01 16:13:58'),(14,1,'Hawa Mahal','Hawa Mahal, or the Palace of Winds, is one of Jaipur\'s most recognisable landmarks. Built in 1799, its distinctive pink sandstone facade has 953 small windows that allowed royal ladies to observe street life without being seen.','/images/places/hawa-mahal.jpg',50.00,'9:00 AM ??? 4:30 PM',NULL,NULL,'2026-10-01 16:13:58'),(15,1,'City Palace','The City Palace in Jaipur is a magnificent royal complex that served as the seat of the Maharaja of Jaipur. Today it houses museums displaying royal artefacts, clothing, and weapons.','/images/places/city-palace.jpg',150.00,'9:30 AM ??? 5:00 PM',NULL,NULL,'2026-10-01 16:13:58'),(16,2,'Baga Beach','Baga Beach is one of the most popular and lively beaches in North Goa. Lined with palm trees and shacks, it is known for its water sports, vibrant nightlife, and delicious seafood restaurants.','/images/places/baga-beach.jpg',0.00,'Open all day',NULL,NULL,'2026-10-01 16:13:58'),(17,2,'Fort Aguada','Fort Aguada is a well-preserved 17th-century Portuguese fort that sits on the confluence of the Mandovi River and the Arabian Sea. Built in 1612, it offers panoramic views of the sea.','/images/places/fort-aguada.jpg',0.00,'9:30 AM ??? 6:00 PM',NULL,NULL,'2026-10-01 16:13:58'),(18,2,'Dudhsagar Falls','Dudhsagar Falls is a stunning four-tiered waterfall on the Mandovi River, located on the Goa-Karnataka border. The name means \"Sea of Milk\" in Konkani.','/images/places/dudhsagar.jpg',400.00,'7:00 AM ??? 6:00 PM',NULL,NULL,'2026-10-01 16:13:58'),(19,3,'Solang Valley','Solang Valley is a side valley at the top of the Kullu Valley, famous for breathtaking views of glaciers and snow-capped peaks. Popular for skiing in winter and paragliding in summer.','/images/places/solang-valley.jpg',0.00,'Open all day',NULL,NULL,'2026-10-01 16:13:58'),(20,3,'Hadimba Temple','Hadimba Devi Temple is an ancient cave temple dedicated to Hadimba Devi, wife of Bhima from the Mahabharata. Built in 1553, the temple is surrounded by a peaceful cedar forest.','/images/places/hadimba-temple.jpg',0.00,'8:00 AM ??? 6:00 PM',NULL,NULL,'2026-10-01 16:13:58'),(21,3,'Mall Road','Mall Road is the main market street of Manali and the centre of its commercial activity. Lined with shops, restaurants, hotels and cafes, ideal for shopping for local handicrafts and woolens.','/images/places/mall-road-manali.jpg',0.00,'Open all day',NULL,NULL,'2026-10-01 16:13:58'),(22,4,'Taj Mahal','The Taj Mahal is a UNESCO World Heritage Site and one of the Seven Wonders of the World. Built by Mughal Emperor Shah Jahan between 1632 and 1653 in memory of his wife Mumtaz Mahal.','/images/places/taj-mahal.jpg',1100.00,'6:00 AM ??? 7:00 PM (Closed Fridays)',NULL,NULL,'2026-10-01 16:13:58'),(23,4,'Agra Fort','Agra Fort is a UNESCO World Heritage Site and a magnificent Mughal fortress built primarily by Emperor Akbar in 1565. The fort served as the main residence of the Mughal emperors until 1638.','/images/places/agra-fort.jpg',650.00,'6:00 AM ??? 6:00 PM',NULL,NULL,'2026-10-01 16:13:58'),(24,4,'Mehtab Bagh','Mehtab Bagh, meaning \"Moonlight Garden\", is a garden complex located across the Yamuna River from the Taj Mahal. It is the best spot to view the Taj Mahal reflected in the Yamuna River at sunset.','/images/places/mehtab-bagh.jpg',300.00,'Sunrise to Sunset',NULL,NULL,'2026-10-01 16:13:58'),(25,5,'Tea Gardens','The vast tea plantations of Munnar stretch across rolling hills as far as the eye can see. Visitors can take guided tours of tea estates to learn about the entire tea-making process.','/images/places/tea-gardens.jpg',0.00,'Open all day',NULL,NULL,'2026-10-01 16:13:58'),(26,5,'Mattupetty Dam','Mattupetty Dam is a beautiful masonry dam located 13 km from Munnar, surrounded by lush green tea gardens and forests. The large reservoir offers scenic boat rides with stunning mountain views.','/images/places/mattupetty-dam.jpg',50.00,'9:00 AM ??? 5:00 PM',NULL,NULL,'2026-10-01 16:13:58'),(27,5,'Echo Point','Echo Point is a popular tourist spot near Munnar where the natural echo phenomenon can be experienced. Located in the middle of a shola forest beside a lake, offering beautiful views.','/images/places/echo-point.jpg',0.00,'7:00 AM ??? 6:00 PM',NULL,NULL,'2026-10-01 16:13:58'),(28,6,'Dashashwamedh Ghat','Dashashwamedh Ghat is the main and one of the oldest ghats of Varanasi. Famous for the spectacular Ganga Aarti ceremony performed every evening by priests, with lamps, incense, and chants.','/images/places/dashashwamedh-ghat.jpg',0.00,'Open all day (Aarti: 7:00 PM)',NULL,NULL,'2026-10-01 16:13:58'),(29,6,'Kashi Vishwanath Temple','The Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. Located on the western bank of the Ganges, it is one of the twelve Jyotirlingas.','/images/places/kashi-vishwanath.jpg',0.00,'3:00 AM ??? 11:00 PM',NULL,NULL,'2026-10-01 16:13:58'),(30,6,'Assi Ghat','Assi Ghat is the southernmost of the main ghats in Varanasi and a popular gathering place for pilgrims and tourists. Located at the confluence of the rivers Assi and Ganges.','/images/places/assi-ghat.jpg',0.00,'Open all day',NULL,NULL,'2026-10-01 16:13:58'),(31,7,'Gateway of India','The Gateway of India is an arch monument built in the early 20th century. Located on the waterfront overlooking the Arabian Sea, it was built to commemorate the visit of King George V.','/images/places/gateway-of-india.jpg',0.00,'Open all day',NULL,NULL,'2026-10-01 16:13:58'),(32,7,'Marine Drive','Marine Drive, also called the \"Queen\'s Necklace\", is a 3.6-kilometre-long boulevard along the coast of the Arabian Sea in South Mumbai. A favourite evening spot for locals and tourists.','/images/places/marine-drive.jpg',0.00,'Open all day',NULL,NULL,'2026-10-01 16:13:58'),(33,7,'Elephanta Caves','Elephanta Caves is a UNESCO World Heritage Site located on Elephanta Island in Mumbai Harbour. The caves contain rock-cut sculptures dedicated to Lord Shiva, dating from the 5th to 8th centuries.','/images/places/elephanta-caves.jpg',600.00,'9:00 AM ??? 5:30 PM (Closed Mondays)',NULL,NULL,'2026-10-01 16:13:58'),(34,8,'India Gate','India Gate is a war memorial dedicated to the 70,000 soldiers of the British Indian Army who died in the First World War. Built in 1931, the 42-metre tall arch stands at the centre of New Delhi.','/images/places/india-gate.jpg',0.00,'Open all day',NULL,NULL,'2026-10-01 16:13:58'),(35,8,'Red Fort','The Red Fort is a UNESCO World Heritage Site and a magnificent Mughal fort built in 1639 by Emperor Shah Jahan. The massive red sandstone fortification is the site of India\'s Independence Day celebrations every year.','/images/places/red-fort.jpg',500.00,'9:30 AM ??? 4:30 PM (Closed Mondays)',NULL,NULL,'2026-10-01 16:13:58'),(36,8,'Qutub Minar','Qutub Minar is a UNESCO World Heritage Site and the tallest brick minaret in the world at 72.5 metres. Built in 1193 by Qutb-ud-din Aibak, this remarkable example of early Afghan architecture.','/images/places/qutub-minar.jpg',650.00,'7:00 AM ??? 5:00 PM',NULL,NULL,'2026-10-01 16:13:58');

-- Advance sequences so new user trips or registrations get IDs after the seed data
SELECT setval('destinations_id_seq', (SELECT COALESCE(MAX(id), 1) FROM destinations));
SELECT setval('hotels_id_seq', (SELECT COALESCE(MAX(id), 1) FROM hotels));
SELECT setval('places_id_seq', (SELECT COALESCE(MAX(id), 1) FROM places));
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('trips_id_seq', (SELECT COALESCE(MAX(id), 1) FROM trips));
SELECT setval('itinerary_id_seq', (SELECT COALESCE(MAX(id), 1) FROM itinerary));
SELECT setval('contact_messages_id_seq', (SELECT COALESCE(MAX(id), 1) FROM contact_messages));

-- ============================================================
-- Phase 3: Places & Hotels
-- Run this in phpMyAdmin or MySQL CLI on your travel_planner DB
-- Requires: Phase 1 (travel_planner.sql) and Phase 2 (phase2_destinations.sql)
-- ============================================================

USE travel_planner;

-- ============================================================
-- 1. PLACES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS places (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    name           VARCHAR(150) NOT NULL,
    description    TEXT,
    image          VARCHAR(255),
    location       VARCHAR(255),
    entry_fee      DECIMAL(10,2) DEFAULT 0.00,
    category       VARCHAR(100),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE CASCADE
);

-- ============================================================
-- 2. HOTELS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS hotels (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    destination_id   INT NOT NULL,
    name             VARCHAR(150) NOT NULL,
    description      TEXT,
    image            VARCHAR(255),
    location         VARCHAR(255),
    price_per_night  DECIMAL(10,2) DEFAULT 0.00,
    rating           DECIMAL(2,1) DEFAULT 0.0,
    facilities       VARCHAR(500),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (destination_id)
        REFERENCES destinations(id)
        ON DELETE CASCADE
);

-- ============================================================
-- 3. PLACES DATA
-- destination IDs from phase2_destinations.sql (order of INSERT):
--   1 = Jaipur, 2 = Goa, 3 = Manali, 4 = Agra,
--   5 = Munnar, 6 = Varanasi, 7 = Mumbai, 8 = Delhi
-- ============================================================

INSERT INTO places (destination_id, name, description, image, location, entry_fee, category) VALUES

-- ---- Jaipur (id = 1) ----
(1, 'Amber Fort',
 'Amber Fort, also known as Amer Fort, is a grand Rajput fort-palace built in 1592 on a hillside overlooking Maota Lake. The fort is famous for its artistic style that blends Rajput and Mughal architecture. Visitors can explore its stunning halls, temples, and gardens.',
 '/images/places/amber-fort.jpg',
 'Devisinghpura, Amer, Jaipur',
 200.00, 'Heritage'),

(1, 'Hawa Mahal',
 'Hawa Mahal, or the Palace of Winds, is one of Jaipur''s most recognisable landmarks. Built in 1799, its distinctive pink sandstone facade has 953 small windows that allowed royal ladies to observe street life without being seen. It is a masterpiece of Rajput architecture.',
 '/images/places/hawa-mahal.jpg',
 'Hawa Mahal Road, Badi Choupad, Jaipur',
 50.00, 'Heritage'),

(1, 'City Palace',
 'The City Palace in Jaipur is a magnificent royal complex that served as the seat of the Maharaja of Jaipur. Today it houses museums displaying royal artefacts, clothing, and weapons. The palace complex includes several beautiful courtyards, gardens, and temples.',
 '/images/places/city-palace.jpg',
 'Tulsi Marg, Gangori Bazaar, Jaipur',
 150.00, 'Heritage'),

-- ---- Goa (id = 2) ----
(2, 'Baga Beach',
 'Baga Beach is one of the most popular and lively beaches in North Goa. Lined with palm trees and shacks, it is known for its water sports, vibrant nightlife, and delicious seafood restaurants. The beach attracts both relaxation seekers and adventure lovers.',
 '/images/places/baga-beach.jpg',
 'North Goa',
 0.00, 'Beach'),

(2, 'Fort Aguada',
 'Fort Aguada is a well-preserved 17th-century Portuguese fort that sits on the confluence of the Mandovi River and the Arabian Sea. It was built in 1612 to guard against Dutch and Maratha invasions. The fort offers panoramic views of the sea and houses a lighthouse.',
 '/images/places/fort-aguada.jpg',
 'Aguada Road, Candolim, North Goa',
 0.00, 'Historical'),

(2, 'Dudhsagar Falls',
 'Dudhsagar Falls is a stunning four-tiered waterfall on the Mandovi River, located on the Goa-Karnataka border. The name means "Sea of Milk" in Konkani, which describes the appearance of the milky-white water as it cascades down from a height of 310 metres.',
 '/images/places/dudhsagar.jpg',
 'Sonaulim, South Goa',
 400.00, 'Nature'),

-- ---- Manali (id = 3) ----
(3, 'Solang Valley',
 'Solang Valley is a side valley at the top of the Kullu Valley, famous for its breathtaking views of glaciers and snow-capped peaks. It is a popular destination for adventure sports such as skiing in winter, and paragliding and zorbing in summer.',
 '/images/places/solang-valley.jpg',
 'Solang, Manali, Himachal Pradesh',
 0.00, 'Adventure'),

(3, 'Hadimba Temple',
 'Hadimba Devi Temple is an ancient cave temple dedicated to Hadimba Devi, wife of Bhima from the Mahabharata. Built in 1553, the temple is surrounded by a peaceful cedar forest and features a distinctive four-tiered wooden pagoda-style tower.',
 '/images/places/hadimba-temple.jpg',
 'Old Manali Road, Manali',
 0.00, 'Spiritual'),

(3, 'Mall Road',
 'Mall Road is the main market street of Manali and the centre of its commercial activity. Lined with shops, restaurants, hotels and cafes, it is the perfect place to shop for local handicrafts, woolens and souvenirs while enjoying the mountain atmosphere.',
 '/images/places/mall-road-manali.jpg',
 'The Mall, Manali, Himachal Pradesh',
 0.00, 'Market'),

-- ---- Agra (id = 4) ----
(4, 'Taj Mahal',
 'The Taj Mahal is a UNESCO World Heritage Site and one of the Seven Wonders of the World. Built by Mughal Emperor Shah Jahan between 1632 and 1653 in memory of his wife Mumtaz Mahal, this white marble mausoleum is regarded as the finest example of Mughal architecture.',
 '/images/places/taj-mahal.jpg',
 'Dharmapuri, Forest Colony, Tajganj, Agra',
 1100.00, 'Heritage'),

(4, 'Agra Fort',
 'Agra Fort is a UNESCO World Heritage Site and a magnificent Mughal fortress built primarily by Emperor Akbar in 1565. The fort served as the main residence of the Mughal emperors until 1638. It contains several palaces, mosques, and audience halls within its massive red sandstone walls.',
 '/images/places/agra-fort.jpg',
 'Rakabganj, Agra',
 650.00, 'Heritage'),

(4, 'Mehtab Bagh',
 'Mehtab Bagh, meaning "Moonlight Garden", is a garden complex located across the Yamuna River from the Taj Mahal. It is the best spot to view the Taj Mahal reflected in the Yamuna River at sunset. Built by Babur, it provides a spectacular view of the iconic monument.',
 '/images/places/mehtab-bagh.jpg',
 'Opposite Taj Mahal, Agra',
 300.00, 'Garden'),

-- ---- Munnar (id = 5) ----
(5, 'Tea Gardens',
 'The vast tea plantations of Munnar stretch across rolling hills as far as the eye can see, creating a breathtaking emerald landscape. Visitors can take guided tours of tea estates to learn about the entire tea-making process from leaf to cup, and sample fresh Munnar tea.',
 '/images/places/tea-gardens.jpg',
 'Kanan Devan Hills, Munnar, Kerala',
 0.00, 'Nature'),

(5, 'Mattupetty Dam',
 'Mattupetty Dam is a beautiful masonry dam located 13 km from Munnar, surrounded by lush green tea gardens and forests. The large reservoir offers scenic boat rides with stunning mountain views. The nearby Mattupetty Indo-Swiss Farm is also worth visiting.',
 '/images/places/mattupetty-dam.jpg',
 'Mattupetty, Munnar, Kerala',
 50.00, 'Nature'),

(5, 'Echo Point',
 'Echo Point is a popular tourist spot near Munnar where the natural echo phenomenon can be experienced. Located in the middle of a shola forest beside a lake, it offers beautiful views of the surrounding hills and the reservoir below. The picturesque surroundings make it a must-visit.',
 '/images/places/echo-point.jpg',
 'Kundala Lake Road, Munnar, Kerala',
 0.00, 'Scenic'),

-- ---- Varanasi (id = 6) ----
(6, 'Dashashwamedh Ghat',
 'Dashashwamedh Ghat is the main and one of the oldest ghats of Varanasi. It is famous for the spectacular Ganga Aarti ceremony performed every evening by priests, with lamps, incense, and chants. The ghat is believed to have been created by Lord Brahma to welcome Lord Shiva.',
 '/images/places/dashashwamedh-ghat.jpg',
 'Dashashwamedh Ghat Road, Varanasi',
 0.00, 'Spiritual'),

(6, 'Kashi Vishwanath Temple',
 'The Kashi Vishwanath Temple is one of the most famous Hindu temples dedicated to Lord Shiva. Located on the western bank of the Ganges, it is one of the twelve Jyotirlingas. The temple is a major pilgrimage site for Hindus and draws millions of devotees every year.',
 '/images/places/kashi-vishwanath.jpg',
 'Lahori Tola, Varanasi',
 0.00, 'Spiritual'),

(6, 'Assi Ghat',
 'Assi Ghat is the southernmost of the main ghats in Varanasi and a popular gathering place for pilgrims and tourists alike. It is located at the confluence of the rivers Assi and Ganges. Morning boat rides from this ghat offer a peaceful view of the sacred riverfront.',
 '/images/places/assi-ghat.jpg',
 'Assi Ghat, Varanasi',
 0.00, 'Spiritual'),

-- ---- Mumbai (id = 7) ----
(7, 'Gateway of India',
 'The Gateway of India is an arch monument built in the early 20th century during the British Raj. Located on the waterfront overlooking the Arabian Sea, it was built to commemorate the visit of King George V. It is now Mumbai''s most iconic landmark and a major tourist attraction.',
 '/images/places/gateway-of-india.jpg',
 'Apollo Bunder, Mumbai Harbour',
 0.00, 'Historical'),

(7, 'Marine Drive',
 'Marine Drive, also called the "Queen''s Necklace", is a 3.6-kilometre-long boulevard along the coast of the Arabian Sea in South Mumbai. The beautiful promenade lined with Art Deco buildings is a favourite evening spot for locals and tourists, offering stunning sea views and sunsets.',
 '/images/places/marine-drive.jpg',
 'Netaji Subhash Chandra Bose Road, Mumbai',
 0.00, 'Scenic'),

(7, 'Elephanta Caves',
 'Elephanta Caves is a UNESCO World Heritage Site located on Elephanta Island in Mumbai Harbour. The caves contain a collection of rock-cut sculptures dedicated to Lord Shiva, dating from the 5th to 8th centuries. Reaching the island requires a boat ride from the Gateway of India.',
 '/images/places/elephanta-caves.jpg',
 'Elephanta Island, Mumbai Harbour',
 600.00, 'Heritage'),

-- ---- Delhi (id = 8) ----
(8, 'India Gate',
 'India Gate is a war memorial dedicated to the 70,000 soldiers of the British Indian Army who died in the First World War. Built in 1931, the 42-metre tall arch stands at the centre of New Delhi and is surrounded by large lawns that are a popular gathering spot in the evenings.',
 '/images/places/india-gate.jpg',
 'Rajpath, India Gate, New Delhi',
 0.00, 'Historical'),

(8, 'Red Fort',
 'The Red Fort is a UNESCO World Heritage Site and a magnificent Mughal fort built in 1639 by Emperor Shah Jahan as the main residence of the Mughal emperors. The massive red sandstone fortification stands along the Yamuna River and is the site of India''s Independence Day celebrations every year.',
 '/images/places/red-fort.jpg',
 'Netaji Subhash Marg, Lal Qila, Delhi',
 500.00, 'Heritage'),

(8, 'Qutub Minar',
 'Qutub Minar is a UNESCO World Heritage Site and the tallest brick minaret in the world at 72.5 metres. Built in 1193 by Qutb-ud-din Aibak, the founder of the Delhi Sultanate, this remarkable example of early Afghan architecture is surrounded by several historically significant ruins.',
 '/images/places/qutub-minar.jpg',
 'Mehrauli, New Delhi',
 650.00, 'Heritage');

-- ============================================================
-- 4. HOTELS DATA
-- ============================================================

INSERT INTO hotels (destination_id, name, description, image, location, price_per_night, rating, facilities) VALUES

-- ---- Jaipur hotels ----
(1, 'Jaipur Palace Hotel',
 'A comfortable hotel in the heart of Jaipur offering easy access to major tourist attractions. Rooms are clean and well-maintained with modern amenities. The hotel serves a good breakfast and the staff is helpful.',
 '/images/hotels/jaipur-palace-hotel.jpg',
 'MI Road, Jaipur',
 2800.00, 4.2, 'WiFi, Parking, Breakfast, AC, Reception 24/7'),

(1, 'Pink City Inn',
 'A budget-friendly stay in Jaipur that provides comfortable rooms and a friendly atmosphere. Located close to the main shopping areas and the old city. Simple, clean rooms make it ideal for short trips.',
 '/images/hotels/pink-city-inn.jpg',
 'Sanganer Road, Jaipur',
 1500.00, 3.8, 'WiFi, Parking, AC'),

(1, 'Heritage Haveli',
 'Experience the charm of Rajasthani culture in this beautifully restored heritage property. The haveli features traditionally decorated rooms, a courtyard, and serves home-style Rajasthani meals. A memorable stay close to the old city.',
 '/images/hotels/heritage-haveli.jpg',
 'Badi Choupad, Jaipur',
 3500.00, 4.5, 'WiFi, Breakfast, Restaurant, Cultural Programs'),

-- ---- Goa hotels ----
(2, 'Goa Beach Resort',
 'A comfortable resort located a short walk from the beach. The property features simple, clean rooms and a small pool area. Ideal for travellers who want to enjoy the beach without spending too much.',
 '/images/hotels/goa-beach-resort.jpg',
 'Calangute, North Goa',
 2500.00, 4.2, 'WiFi, Pool, Parking, Breakfast, Beach Access'),

(2, 'Calangute Hotel',
 'A good value hotel in the popular Calangute area, close to beaches, restaurants, and night spots. Rooms are well-maintained with essential amenities. The front desk staff are very helpful with local information.',
 '/images/hotels/calangute-hotel.jpg',
 'Calangute Beach Road, North Goa',
 1800.00, 4.0, 'WiFi, Parking, AC, Restaurant'),

(2, 'Sunset Stay Goa',
 'A pleasant guesthouse offering sea-facing rooms with beautiful sunset views. The property is small and cosy, perfect for couples and solo travellers. Breakfast is included and features local Goan dishes.',
 '/images/hotels/sunset-stay-goa.jpg',
 'Baga, North Goa',
 2200.00, 4.3, 'WiFi, Breakfast, Sea View Rooms, AC'),

-- ---- Manali hotels ----
(3, 'Snow Valley Resort',
 'Situated near Solang Valley, this resort offers stunning mountain views from every room. Perfect for adventure enthusiasts, the property can help arrange outdoor activities like trekking and skiing. Warm rooms and a good restaurant make it a great base.',
 '/images/hotels/snow-valley-resort.jpg',
 'Solang Valley Road, Manali',
 3200.00, 4.4, 'WiFi, Restaurant, Mountain View, Parking, Trekking Guides'),

(3, 'Himalayan Inn',
 'A cosy, budget-friendly property in central Manali with warm and comfortable rooms. The inn has a pleasant sitting area and the staff provides good tips for local exploration. Clean bathrooms and hot water are assured.',
 '/images/hotels/himalayan-inn.jpg',
 'Mall Road, Manali',
 1600.00, 3.9, 'WiFi, Parking, Hot Water, Restaurant'),

(3, 'Manali Cedar Hotel',
 'Set in a cedar forest near Old Manali, this hotel offers a quiet and refreshing retreat. Rooms are comfortable with wooden interiors that give a classic mountain feel. The Beas River is within walking distance.',
 '/images/hotels/manali-cedar-hotel.jpg',
 'Old Manali Road, Manali',
 2600.00, 4.1, 'WiFi, Parking, Room Service, Nature Walks'),

-- ---- Agra hotels ----
(4, 'Taj View Hotel',
 'As the name suggests, this hotel offers rooms with a partial view of the Taj Mahal. Located in the Taj Ganj area, it is within easy walking distance of the main monument. A good budget option for Agra visitors.',
 '/images/hotels/taj-view-hotel.jpg',
 'Taj Ganj, Agra',
 2200.00, 4.0, 'WiFi, Taj Mahal View, Restaurant, AC'),

(4, 'Agra Comfort Inn',
 'A well-maintained hotel offering good value in Agra. Rooms are clean and spacious with modern amenities. The hotel provides a helpful concierge service for arranging guided tours to the Taj Mahal and Agra Fort.',
 '/images/hotels/agra-comfort-inn.jpg',
 'Fatehabad Road, Agra',
 1900.00, 3.9, 'WiFi, Parking, Breakfast, AC, Tour Desk'),

(4, 'Mughal Heritage Hotel',
 'A boutique property inspired by Mughal design, featuring ornate interiors and a beautiful courtyard. Located near the Agra Fort, this hotel offers a unique cultural experience along with comfortable modern amenities.',
 '/images/hotels/mughal-heritage-hotel.jpg',
 'Near Agra Fort, Agra',
 4000.00, 4.6, 'WiFi, Parking, Restaurant, Courtyard, Pool, Concierge'),

-- ---- Munnar hotels ----
(5, 'Tea Valley Resort',
 'Set amidst lush tea plantations, this resort provides a serene and beautiful environment. Wake up to misty mountain views and enjoy guided walks through the tea estates. The restaurant serves excellent Kerala cuisine.',
 '/images/hotels/tea-valley-resort.jpg',
 'Pothamedu View Point, Munnar',
 3000.00, 4.5, 'WiFi, Restaurant, Plantation Views, Tea Walks, Parking'),

(5, 'Misty Hills Hotel',
 'A comfortable hotel perched on the hillside with beautiful views of the misty Munnar hills. The hotel offers clean rooms, a simple restaurant, and is centrally located for exploring Munnar''s attractions.',
 '/images/hotels/misty-hills-hotel.jpg',
 'Munnar Town, Kerala',
 1700.00, 4.0, 'WiFi, Parking, Restaurant, Mountain View'),

(5, 'Munnar Green Resort',
 'A budget resort surrounded by greenery and fresh air. Simple but comfortable rooms with good service. The resort is ideal for travellers looking for a peaceful stay in the middle of nature at an affordable price.',
 '/images/hotels/munnar-green-resort.jpg',
 'Chinnakanal, Munnar',
 1400.00, 3.7, 'WiFi, Parking, Breakfast, Garden'),

-- ---- Varanasi hotels ----
(6, 'Ganges View Hotel',
 'A guesthouse with beautiful views of the Ganges River. Situated near the main ghats, it is an ideal base for early morning boat rides and exploring the spiritual heart of Varanasi. Simple, clean rooms at a reasonable price.',
 '/images/hotels/ganges-view-hotel.jpg',
 'Assi Ghat, Varanasi',
 1800.00, 4.1, 'WiFi, River View, Rooftop, Breakfast'),

(6, 'Banaras Inn',
 'A comfortable property in the lanes near the ghats, offering an authentic Varanasi experience. The inn has helpful staff who can arrange Ganga Aarti tours and local experiences. A good choice for first-time visitors.',
 '/images/hotels/banaras-inn.jpg',
 'Dashashwamedh Ghat Road, Varanasi',
 1400.00, 3.8, 'WiFi, AC, Restaurant, Tour Assistance'),

-- ---- Mumbai hotels ----
(7, 'Mumbai Harbor Hotel',
 'A mid-range hotel with great connectivity to Mumbai''s major attractions. Comfortable rooms with modern furnishings and a good restaurant on-site. The hotel is within easy reach of the Gateway of India and Colaba area.',
 '/images/hotels/mumbai-harbor-hotel.jpg',
 'Colaba, South Mumbai',
 3500.00, 4.2, 'WiFi, Parking, Restaurant, AC, Concierge'),

(7, 'Marine Drive Hotel',
 'Located close to the iconic Marine Drive promenade, this hotel offers a pleasant stay in a great location. Some rooms have partial sea views. The property is clean and the staff helpful. Multiple restaurants are within walking distance.',
 '/images/hotels/marine-drive-hotel.jpg',
 'Nariman Point, South Mumbai',
 2800.00, 4.0, 'WiFi, AC, Sea View, Restaurant'),

(7, 'Mumbai Central Stay',
 'A budget-friendly hotel in central Mumbai, ideal for business and leisure travellers alike. Clean rooms, reliable WiFi, and a convenient location near the railway station make it a practical choice for a short stay.',
 '/images/hotels/mumbai-central-stay.jpg',
 'Mumbai Central, Mumbai',
 1800.00, 3.8, 'WiFi, AC, Parking, 24 Hour Reception'),

-- ---- Delhi hotels ----
(8, 'Delhi Grand Hotel',
 'A comfortable hotel in New Delhi offering spacious rooms and good service. Located near Connaught Place, it provides easy access to shopping, dining, and public transport. A solid choice for exploring the capital.',
 '/images/hotels/delhi-grand-hotel.jpg',
 'Connaught Place, New Delhi',
 3200.00, 4.3, 'WiFi, Parking, Restaurant, Breakfast, AC, Gym'),

(8, 'Connaught Inn',
 'A well-located hotel in the heart of Connaught Place, one of Delhi''s most vibrant commercial districts. Clean and comfortable rooms, friendly staff, and easy access to the Delhi Metro make it very convenient.',
 '/images/hotels/connaught-inn.jpg',
 'Connaught Place, New Delhi',
 2200.00, 4.0, 'WiFi, AC, Restaurant, Metro Access'),

(8, 'Delhi Heritage Hotel',
 'A boutique hotel in Old Delhi offering a glimpse into the city''s rich history. Set in a restored haveli near the Red Fort, it features heritage-styled rooms and serves traditional Mughal-inspired cuisine in its restaurant.',
 '/images/hotels/delhi-heritage-hotel.jpg',
 'Chandni Chowk, Old Delhi',
 2600.00, 4.2, 'WiFi, Restaurant, Heritage Decor, Tour Desk');

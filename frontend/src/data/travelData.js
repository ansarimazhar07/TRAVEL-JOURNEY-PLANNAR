/**
 * travelData.js
 * 
 * Curated destination dataset for Destination Explorer & Trip Planner.
 * Includes complete information for destinations:
 * - Location, images, description, why visit highlights
 * - Curated places to visit with timings & entry fees
 * - Best time to visit & climate notes
 * - Estimated travel budget breakdown (Backpacker, Mid-range, Luxury)
 * - Practical destination-specific travel tips & hacks
 * 
 * Serves as both instant offline fallback data and rich client metadata.
 */

export const DESTINATIONS_DATA = [
  {
    id: 1,
    name: 'Jaipur',
    country: 'India',
    state: 'Rajasthan',
    category: 'Heritage',
    image_url: '/images/destinations/jaipur.jpg',
    best_time: 'October to March',
    ideal_duration: '3 - 4 Days',
    ideal_for: ['Heritage Lovers', 'Photographers', 'Shoppers', 'Foodies'],
    nearest_station: { code: 'JP', name: 'Jaipur Junction' },
    description: 'Known as the Pink City, Jaipur is the vibrant capital of Rajasthan and a cornerstone of India\'s famed Golden Triangle. Renowned for its imposing hill forts, pastel palaces, intricate Rajput architecture, and bustling bazaars brimming with textiles and jewelry, Jaipur offers an unforgettable journey into royal heritage.',
    why_visit: [
      'UNESCO World Heritage City featuring Amber Fort & Jantar Mantar',
      'Architectural wonder of Hawa Mahal with 953 honeycomb windows',
      'Vibrant Johari Bazaar and Bapu Bazaar for authentic handicrafts and gemstones',
      'Rich culinary delights including Dal Baati Churma, Pyaaz Kachori, and Ghevar'
    ],
    budget: {
      daily_backpacker: 1600,
      daily_midrange: 3600,
      daily_luxury: 8000,
      avg_stay: '₹1,200 – ₹3,500 / night',
      avg_food: '₹400 – ₹900 / day',
      avg_transport: '₹300 – ₹700 / day',
      avg_activities: '₹300 – ₹800 / day',
      estimate_3day: '₹7,500 – ₹14,500 per person',
      estimate_5day: '₹12,500 – ₹24,000 per person'
    },
    travel_tips: [
      {
        icon: '👟',
        title: 'Wear Comfortable Walking Footwear',
        desc: 'Amer Fort and Jaigarh involve cobblestone inclines and stairways. Sturdy walking shoes will save your feet.'
      },
      {
        icon: '🛺',
        title: 'Bargain on Auto-Rickshaws or Use Ola/Uber',
        desc: 'For local transit, agree on fares before boarding autos or book through app-based rides for fixed rates.'
      },
      {
        icon: '🎟️',
        title: 'Buy the Composite Entry Ticket',
        desc: 'Purchase Rajasthan Tourism\'s composite pass at Amber Fort to save up to 40% on entry to multiple monuments.'
      },
      {
        icon: '🌅',
        title: 'Visit Hawa Mahal Early in the Morning',
        desc: 'The facade faces east and catches the morning sunlight beautifully, with minimal street traffic for photography.'
      },
      {
        icon: '🍲',
        title: 'Savor Authentic Rajasthani Thali',
        desc: 'Visit heritage eateries in the Old City for authentic Dal Baati Churma, Ker Sangri, and freshly made sweet lassi.'
      }
    ],
    places: [
      {
        id: 13,
        name: 'Amber Fort',
        description: 'A grand Rajput fort-palace built in 1592 on a hillside overlooking Maota Lake, blending Hindu and Mughal styles with stunning Sheesh Mahal (Mirror Palace).',
        image_url: '/images/places/amber-fort.jpg',
        timings: '8:00 AM – 5:30 PM',
        entry_fee: 200,
        type: 'Historic Fort'
      },
      {
        id: 14,
        name: 'Hawa Mahal',
        description: 'The iconic Palace of Winds built in 1799, featuring a 5-story pink sandstone facade with 953 jharokhas that cooled interior rooms through the Venturi effect.',
        image_url: '/images/places/hawa-mahal.jpg',
        timings: '9:00 AM – 4:30 PM',
        entry_fee: 50,
        type: 'Palace'
      },
      {
        id: 15,
        name: 'City Palace',
        description: 'A magnificent royal residence complex housing Chandra Mahal, Mubarak Mahal, courtyards, and museum galleries preserving royal costumes and weaponry.',
        image_url: '/images/places/city-palace.jpg',
        timings: '9:30 AM – 5:00 PM',
        entry_fee: 150,
        type: 'Royal Palace'
      }
    ]
  },
  {
    id: 2,
    name: 'Goa',
    country: 'India',
    state: 'Goa',
    category: 'Beach',
    image_url: '/images/destinations/goa.jpg',
    best_time: 'November to February',
    ideal_duration: '4 - 6 Days',
    ideal_for: ['Beach Lovers', 'Partiers', 'Water Sports Enthusiasts', 'Couples'],
    nearest_station: { code: 'MAO', name: 'Madgaon Junction' },
    description: 'Goa is India\'s premier coastal paradise, celebrated for its golden palm-fringed beaches, vibrant nightlife, Portuguese colonial architecture, and tantalizing Konkani seafood. From the energetic beach clubs of North Goa to the peaceful, secluded coves of South Goa, it caters to every style of holiday.',
    why_visit: [
      'Miles of scenic beaches spanning Baga, Anjuna, Palolem, and Morjim',
      'Thrilling water sports including parasailing, jet skiing, scuba diving, and boat cruises',
      'Historic UNESCO churches in Old Goa and colorful Latin Quarter in Fontainhas',
      'Eclectic night markets, vibrant shack culture, and fresh coastal seafood curries'
    ],
    budget: {
      daily_backpacker: 1800,
      daily_midrange: 4200,
      daily_luxury: 9500,
      avg_stay: '₹1,500 – ₹4,500 / night',
      avg_food: '₹600 – ₹1,400 / day',
      avg_transport: '₹350 – ₹900 / day (Scooter rental)',
      avg_activities: '₹400 – ₹1,500 / day',
      estimate_3day: '₹8,500 – ₹16,500 per person',
      estimate_5day: '₹14,000 – ₹28,000 per person'
    },
    travel_tips: [
      {
        icon: '🛵',
        title: 'Rent a Scooter or Car for Freedom',
        desc: 'Renting a scooter (₹350-₹500/day) is the most flexible and economical way to navigate between beaches and shacks.'
      },
      {
        icon: '🚩',
        title: 'Heed Beach Safety Flags',
        desc: 'Always swim within designated lifeguard zones and obey red warning flags, especially near rocky breakwaters.'
      },
      {
        icon: '📅',
        title: 'Book December & New Year Early',
        desc: 'Peak season between Christmas and New Year brings extreme price surges; reserve stays at least 2 months ahead.'
      },
      {
        icon: '🏛️',
        title: 'Explore the Portuguese Heritage',
        desc: 'Dedicate an afternoon to the Latin Quarter (Fontainhas) in Panaji and the Basilica of Bom Jesus in Old Goa.'
      },
      {
        icon: '🦐',
        title: 'Taste Goan Fish Curry Thali',
        desc: 'Look for local dhabas and beach shacks serving traditional Kingfish or Prawn curry with red rice and sol kadi.'
      }
    ],
    places: [
      {
        id: 16,
        name: 'Baga Beach',
        description: 'North Goa\'s premier bustling beach, renowned for pulsating beach shacks, jet-ski water sports, sunset lounges, and vibrant nightlife.',
        image_url: '/images/places/baga-beach.jpg',
        timings: 'Open 24 Hours',
        entry_fee: 0,
        type: 'Beach'
      },
      {
        id: 17,
        name: 'Fort Aguada',
        description: 'A well-preserved 17th-century Portuguese fortress overlooking Sinquerim Beach, featuring a four-storey freshwater lighthouse built in 1864.',
        image_url: '/images/places/fort-aguada.jpg',
        timings: '9:30 AM – 6:00 PM',
        entry_fee: 0,
        type: 'Historic Fort'
      },
      {
        id: 18,
        name: 'Dudhsagar Falls',
        description: 'A spectacular 310-metre, four-tiered waterfall on the Mandovi River along the Goa-Karnataka border, resembling a foaming cascade of milk.',
        image_url: '/images/places/dudhsagar.jpg',
        timings: '7:00 AM – 6:00 PM',
        entry_fee: 400,
        type: 'Natural Waterfall'
      }
    ]
  },
  {
    id: 3,
    name: 'Manali',
    country: 'India',
    state: 'Himachal Pradesh',
    category: 'Mountain',
    image_url: '/images/destinations/manali.jpg',
    best_time: 'October to June',
    ideal_duration: '4 - 5 Days',
    ideal_for: ['Adventure Seekers', 'Honeymooners', 'Trekkers', 'Nature Lovers'],
    nearest_station: { code: 'CDG', name: 'Chandigarh Junction' },
    description: 'Perched in the Kullu Valley at an altitude of 2,050 metres, Manali is India\'s top Himalayan getaway. Surrounded by towering pine forests, snow-dusted peaks, and the rushing Beas River, it is equally loved by adventure enthusiasts seeking adrenaline and leisure travellers seeking alpine peace.',
    why_visit: [
      'Spectacular views of snow-capped Pir Panjal and Dhauladhar mountain ranges',
      'Adrenaline-packed activities: paragliding, skiing, river rafting, and high-altitude trekking',
      'Scenic day trips to Solang Valley and the engineering marvel of Atal Tunnel',
      'Charming cafes and traditional wooden architecture in Old Manali'
    ],
    budget: {
      daily_backpacker: 1700,
      daily_midrange: 3800,
      daily_luxury: 8500,
      avg_stay: '₹1,400 – ₹4,000 / night',
      avg_food: '₹500 – ₹1,100 / day',
      avg_transport: '₹400 – ₹1,000 / day (Shared / Private cabs)',
      avg_activities: '₹500 – ₹2,000 / day (Adventure passes)',
      estimate_3day: '₹8,000 – ₹15,500 per person',
      estimate_5day: '₹13,500 – ₹26,000 per person'
    },
    travel_tips: [
      {
        icon: '🧥',
        title: 'Pack Thermal Layers Year-Round',
        desc: 'Mountain evenings turn chilly even in mid-summer; winter requires heavy down jackets, gloves, and snow boots.'
      },
      {
        icon: '🎫',
        title: 'Obtain Rohtang Pass Permits in Advance',
        desc: 'Vehicular access to Rohtang Pass is capped daily; apply through the official Himachal portal 2-3 days ahead.'
      },
      {
        icon: '🚗',
        title: 'Keep Travel Buffers for Mountain Roads',
        desc: 'Monsoon landslides (July-Aug) or winter snowfall can delay hill transit; keep generous time buffers.'
      },
      {
        icon: '🧣',
        title: 'Shop for Genuine Kullu Woolens on Mall Road',
        desc: 'Look for government-authorized emporiums for authentic Kullu shawls, wooden handicrafts, and Himachali caps.'
      },
      {
        icon: '🥟',
        title: 'Enjoy Steaming Momos & Siddu',
        desc: 'Taste local Himachali Siddu (steamed wheat bread stuffed with walnuts or lentils) and authentic Tibetan thukpa.'
      }
    ],
    places: [
      {
        id: 19,
        name: 'Solang Valley',
        description: 'A stunning side valley 14 km from Manali offering skiing, snowboarding, zorbing, cable car rides, and paragliding amidst snow-clad peaks.',
        image_url: '/images/places/solang-valley.jpg',
        timings: 'Open Daylight Hours',
        entry_fee: 0,
        type: 'Adventure Valley'
      },
      {
        id: 20,
        name: 'Hadimba Temple',
        description: 'An ancient pagoda-styled wooden cave temple built in 1553, dedicated to Hadimba Devi and nestled inside dense cedar forests of Dhungri.',
        image_url: '/images/places/hadimba-temple.jpg',
        timings: '8:00 AM – 6:00 PM',
        entry_fee: 0,
        type: 'Heritage Temple'
      },
      {
        id: 21,
        name: 'Mall Road',
        description: 'The bustling central pedestrian avenue of Manali, lined with lively handicraft emporiums, woolen stores, cafes, and street food stalls.',
        image_url: '/images/places/mall-road-manali.jpg',
        timings: 'Open Daily (Best: 4 PM - 9 PM)',
        entry_fee: 0,
        type: 'Shopping & Leisure'
      }
    ]
  },
  {
    id: 4,
    name: 'Agra',
    country: 'India',
    state: 'Uttar Pradesh',
    category: 'Heritage',
    image_url: '/images/destinations/agra.jpg',
    best_time: 'October to March',
    ideal_duration: '1 - 2 Days',
    ideal_for: ['History Buffs', 'Couples', 'Architects', 'World Wonder Explorers'],
    nearest_station: { code: 'AGC', name: 'Agra Cantt' },
    description: 'Agra is world-famous as the home of the Taj Mahal, an eternal wonder of the world and a monument to sublime love. As the former imperial capital of the Mughal Empire, Agra also boasts the formidable Agra Fort and Fatehpur Sikri, showcasing the zenith of Mughal art and architecture.',
    why_visit: [
      'The Taj Mahal — a UNESCO World Wonder crafted in pure white Makrana marble',
      'The majestic red sandstone Agra Fort, home to emperors Akbar, Jahangir, and Shah Jahan',
      'Romantic sunset panoramas of the Taj Mahal from Mehtab Bagh across the Yamuna River',
      'Famous Mughlai gastronomy and traditional sweet Petha in assorted flavors'
    ],
    budget: {
      daily_backpacker: 1500,
      daily_midrange: 3200,
      daily_luxury: 7500,
      avg_stay: '₹1,000 – ₹3,200 / night',
      avg_food: '₹350 – ₹850 / day',
      avg_transport: '₹250 – ₹600 / day',
      avg_activities: '₹500 – ₹1,500 / day (Monument tickets)',
      estimate_3day: '₹6,500 – ₹13,000 per person',
      estimate_5day: '₹11,000 – ₹21,000 per person'
    },
    travel_tips: [
      {
        icon: '🌅',
        title: 'Visit Taj Mahal at Sunrise',
        desc: 'Arriving at the gates at 5:45 AM avoids extreme crowds and treats you to golden morning hues on the white marble.'
      },
      {
        icon: '🚫',
        title: 'Remember: Taj Mahal is Closed on Fridays',
        desc: 'Plan your itinerary carefully — the Taj Mahal complex is closed to all tourists every Friday for prayers.'
      },
      {
        icon: '📱',
        title: 'Book Tickets Online via ASI Portal',
        desc: 'Buy entry tickets online on the ASI website to skip long ticket queues and receive official ticket discounts.'
      },
      {
        icon: '🍬',
        title: 'Buy Authentic Agra Petha from Panchhi Petha',
        desc: 'Visit verified outlets of Panchhi Petha at Sadar Bazaar for authentic Kesar, Angoori, and Paan flavored sweets.'
      },
      {
        icon: '⚠️',
        title: 'Beware of Unauthorized Guides and Touts',
        desc: 'Only hire guides with official government-issued ID badges inside monument gates, and decline unsolicited touts.'
      }
    ],
    places: [
      {
        id: 22,
        name: 'Taj Mahal',
        description: 'A UNESCO World Heritage Wonder commissioned in 1632 by Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal, renowned for its symmetrical marble domes.',
        image_url: '/images/places/taj-mahal.jpg',
        timings: '6:00 AM – 7:00 PM (Closed Fridays)',
        entry_fee: 1100,
        type: 'World Heritage Wonder'
      },
      {
        id: 23,
        name: 'Agra Fort',
        description: 'A massive 16th-century Mughal fortress in red sandstone, encompassing palaces like Jahangir Mahal, Khas Mahal, and Diwan-i-Khas overlooking the Yamuna.',
        image_url: '/images/places/agra-fort.jpg',
        timings: '6:00 AM – 6:00 PM',
        entry_fee: 650,
        type: 'Imperial Fort'
      },
      {
        id: 24,
        name: 'Mehtab Bagh',
        description: 'The "Moonlight Garden" across the Yamuna River, perfectly aligned with the Taj Mahal to offer uninterrupted reflective sunset views without the dense crowds.',
        image_url: '/images/places/mehtab-bagh.jpg',
        timings: 'Sunrise to Sunset',
        entry_fee: 300,
        type: 'Mughal Garden'
      }
    ]
  },
  {
    id: 5,
    name: 'Munnar',
    country: 'India',
    state: 'Kerala',
    category: 'Hill Station',
    image_url: '/images/destinations/munnar.jpg',
    best_time: 'September to May',
    ideal_duration: '3 - 4 Days',
    ideal_for: ['Nature Lovers', 'Tea Aficionados', 'Couples', 'Trekkers'],
    nearest_station: { code: 'AWY', name: 'Aluva / Ernakulam Junction' },
    description: 'Set in the misty Western Ghats of Kerala at 1,600 metres above sea level, Munnar is a picturesque paradise of rolling green tea estates, cascading waterfalls, and misty mountain passes. Once the summer retreat of the British Raj in South India, it provides cool mountain air, aromatic spice gardens, and tranquil wildlife sanctuaries.',
    why_visit: [
      'Sprawling emerald tea plantations cascading across undulating misty hillsides',
      'Home to the endangered Nilgiri Tahr at Eravikulam National Park and Anamudi peak',
      'Serene boating at Mattupetty Dam and playful acoustic reverberations at Echo Point',
      'Aromatic spice plantations growing fresh cardamom, pepper, vanilla, and cinnamon'
    ],
    budget: {
      daily_backpacker: 1500,
      daily_midrange: 3400,
      daily_luxury: 7800,
      avg_stay: '₹1,200 – ₹3,500 / night',
      avg_food: '₹400 – ₹950 / day',
      avg_transport: '₹350 – ₹850 / day (Hired auto/cab)',
      avg_activities: '₹300 – ₹800 / day',
      estimate_3day: '₹7,000 – ₹14,000 per person',
      estimate_5day: '₹12,000 – ₹23,500 per person'
    },
    travel_tips: [
      {
        icon: '☕',
        title: 'Buy Tea & Spices Direct from Factory Outlets',
        desc: 'Purchase fresh tea powders and organic spices from KDHP / Tata Tea museum outlets for unadulterated quality.'
      },
      {
        icon: '🦙',
        title: 'Book Eravikulam National Park Early',
        desc: 'Park tickets for seeing the Nilgiri Tahr are limited; book online to avoid long entry lines and peak crowd caps.'
      },
      {
        icon: '🧥',
        title: 'Carry Light Sweaters and Rain Gear',
        desc: 'Munnar can encounter sudden drizzle and cool mountain breezes at dusk even outside the monsoon months.'
      },
      {
        icon: '🚗',
        title: 'Hire a Local Driver for Winding Slopes',
        desc: 'Hill roads are curvy and often shrouded in mist; hiring an experienced local taxi driver ensures safety and comfort.'
      },
      {
        icon: '🍌',
        title: 'Sample Traditional Kerala Sadhya',
        desc: 'Enjoy authentic meals served on banana leaves with avial, sambar, thoran, and fresh crispy banana chips.'
      }
    ],
    places: [
      {
        id: 25,
        name: 'Tea Gardens & Museum',
        description: 'Vast emerald tea plantations blanketing the hillsides, with museum tours demonstrating orthodox and CTC tea processing and tasting sessions.',
        image_url: '/images/places/tea-gardens.jpg',
        timings: '9:00 AM – 5:00 PM (Closed Mondays)',
        entry_fee: 125,
        type: 'Tea Plantation'
      },
      {
        id: 26,
        name: 'Mattupetty Dam',
        description: 'A gravity masonry dam nestled among hills and tea slopes, offering peaceful speed-boat rides and sightings of wild mountain elephants.',
        image_url: '/images/places/mattupetty-dam.jpg',
        timings: '9:00 AM – 5:00 PM',
        entry_fee: 50,
        type: 'Scenic Dam & Lake'
      },
      {
        id: 27,
        name: 'Echo Point',
        description: 'A natural acoustic phenomenon located 15 km from Munnar beside a tranquil mist-covered lake surrounded by native shola forests.',
        image_url: '/images/places/echo-point.jpg',
        timings: '7:00 AM – 6:00 PM',
        entry_fee: 30,
        type: 'Natural Viewpoint'
      }
    ]
  },
  {
    id: 6,
    name: 'Varanasi',
    country: 'India',
    state: 'Uttar Pradesh',
    category: 'Spiritual',
    image_url: '/images/destinations/varanasi.jpg',
    best_time: 'October to March',
    ideal_duration: '2 - 3 Days',
    ideal_for: ['Spiritual Seekers', 'Photographers', 'Culture Lovers', 'Solo Travellers'],
    nearest_station: { code: 'BSB', name: 'Varanasi Junction' },
    description: 'Varanasi, also revered as Kashi or Benares, is one of the world\'s oldest continuously inhabited cities and the spiritual heartbeat of India. Sprawled along the sacred western banks of the River Ganges, its legendary stone ghats, chanting priests, ancient narrow alleyways, and mystical Ganga Aarti deliver an unforgettable, deeply moving encounter.',
    why_visit: [
      'Mesmerizing Ganga Aarti ceremony performed each evening at Dashashwamedh Ghat',
      'The sacred Kashi Vishwanath Temple, one of the twelve divine Jyotirlingas of Lord Shiva',
      'Soul-stirring dawn boat rides along the ghats watching sunrise prayers and morning rituals',
      'World-famous Banarasi silk sarees, creamy Malaiyo dessert, and authentic Banarasi Paan'
    ],
    budget: {
      daily_backpacker: 1300,
      daily_midrange: 2800,
      daily_luxury: 7000,
      avg_stay: '₹900 – ₹2,800 / night',
      avg_food: '₹300 – ₹700 / day',
      avg_transport: '₹200 – ₹500 / day (Cycle rickshaws & walking)',
      avg_activities: '₹250 – ₹700 / day (Boat rides)',
      estimate_3day: '₹5,500 – ₹11,500 per person',
      estimate_5day: '₹9,500 – ₹18,500 per person'
    },
    travel_tips: [
      {
        icon: '⛵',
        title: 'Take a Sunrise Boat Ride along the Ghats',
        desc: 'Hiring a traditional wooden rowboat at 5:30 AM from Assi Ghat to Dashashwamedh gives a magical perspective on riverside life.'
      },
      {
        icon: '🪔',
        title: 'Arrive by 5:30 PM for Evening Ganga Aarti',
        desc: 'The stairs at Dashashwamedh fill rapidly; arrive early for seating on the steps or watch from a boat anchored in the river.'
      },
      {
        icon: '👟',
        title: 'Wear Slip-On Shoes for Ghats & Temples',
        desc: 'Shoes must be removed at temple entrances and temple streets are cobblestoned; comfortable slip-ons make visits effortless.'
      },
      {
        icon: '📷',
        title: 'Respect Cremation Ghat Etiquette',
        desc: 'Strictly avoid taking photos or videos at Manikarnika and Harishchandra Ghats out of respect for grieving families.'
      },
      {
        icon: '🍲',
        title: 'Taste Banarasi Street Food & Lassi',
        desc: 'Savor Tamatar Chaat at Kashi Chaat Bhandar, thick creamy Blue Lassi near Manikarnika, and winter frothy Malaiyo.'
      }
    ],
    places: [
      {
        id: 28,
        name: 'Dashashwamedh Ghat',
        description: 'The most sacred and lively ghat of Varanasi, famous worldwide for the elaborate evening Ganga Aarti conducted with brass lamps, incense, and bells.',
        image_url: '/images/places/dashashwamedh-ghat.jpg',
        timings: 'Open All Day (Ganga Aarti: 6:45 PM)',
        entry_fee: 0,
        type: 'Sacred River Ghat'
      },
      {
        id: 29,
        name: 'Kashi Vishwanath Temple',
        description: 'The revered Golden Temple dedicated to Lord Shiva, featuring gold-plated spires and the majestic Kashi Vishwanath Corridor connecting directly to the Ganga.',
        image_url: '/images/places/kashi-vishwanath.jpg',
        timings: '3:00 AM – 11:00 PM',
        entry_fee: 0,
        type: 'Jyotirlinga Temple'
      },
      {
        id: 30,
        name: 'Assi Ghat',
        description: 'The southernmost main ghat where the Assi River joins the Ganga, famed for early morning Subah-e-Banaras music, yoga, and quiet sunrise contemplation.',
        image_url: '/images/places/assi-ghat.jpg',
        timings: 'Open 24 Hours',
        entry_fee: 0,
        type: 'Cultural Ghat'
      }
    ]
  },
  {
    id: 7,
    name: 'Mumbai',
    country: 'India',
    state: 'Maharashtra',
    category: 'City',
    image_url: '/images/destinations/mumbai.jpg',
    best_time: 'November to February',
    ideal_duration: '3 - 5 Days',
    ideal_for: ['City Explorers', 'Foodies', 'Cinema Lovers', 'Heritage Admirers'],
    nearest_station: { code: 'CSMT', name: 'Mumbai CSMT' },
    description: 'Mumbai, the legendary "City of Dreams", is India\'s bustling financial hub and home to the Bollywood film industry. Facing the Arabian Sea, it pulses with relentless energy, Victorian Gothic architectural marvels, the glamour of cinema, and a world-renowned coastal street food culture.',
    why_visit: [
      'The iconic Gateway of India overlooking the bustling Mumbai Harbour and Arabian Sea',
      'Strolling along the sweeping 3.6 km Marine Drive boulevard, known as the "Queen\'s Necklace"',
      'UNESCO rock-cut sculptures at the ancient Elephanta Caves on Elephanta Island',
      'Electrifying street delicacies: authentic Vada Pav, Pav Bhaji, Sev Puri, and Bombay Duck'
    ],
    budget: {
      daily_backpacker: 1800,
      daily_midrange: 4500,
      daily_luxury: 11000,
      avg_stay: '₹1,800 – ₹5,500 / night',
      avg_food: '₹500 – ₹1,500 / day',
      avg_transport: '₹200 – ₹800 / day (Local Train / Metro / Cabs)',
      avg_activities: '₹300 – ₹900 / day',
      estimate_3day: '₹9,000 – ₹18,000 per person',
      estimate_5day: '₹15,000 – ₹31,000 per person'
    },
    travel_tips: [
      {
        icon: '🚆',
        title: 'Use Local Trains & Metro during Non-Peak Hours',
        desc: 'Avoid local trains during morning (8-11 AM) and evening (5-8 PM) office rush; midday rides are easy and ultra-fast.'
      },
      {
        icon: '🚕',
        title: 'Use Metered Kaali-Peeli Cabs and Autos',
        desc: 'Taxis in South Mumbai and auto-rickshaws in the suburbs legally run on calibrated meters without bargaining.'
      },
      {
        icon: '🌅',
        title: 'Catch the Sunset on Marine Drive',
        desc: 'Join locals sitting on the promenade ledge in the evening as the sea breeze cools the city and streetlights illuminate.'
      },
      {
        icon: '🥪',
        title: 'Try Iconic Street Eats at Girgaon Chowpatty',
        desc: 'Enjoy authentic hot Vada Pav, Bhel Puri, and Pav Bhaji from long-established clean food stalls at Chowpatty.'
      },
      {
        icon: '⛴️',
        title: 'Book Ferry to Elephanta from Gateway Early',
        desc: 'Ferry boats depart regularly from Gateway of India; catch morning boats to avoid the afternoon midday sun.'
      }
    ],
    places: [
      {
        id: 31,
        name: 'Gateway of India',
        description: 'An imposing 26-metre basalt triumphal arch built in 1924 on the waterfront at Apollo Bunder, standing as the grand ceremonial entrance to India.',
        image_url: '/images/places/gateway-of-india.jpg',
        timings: 'Open 24 Hours',
        entry_fee: 0,
        type: 'Colonial Monument'
      },
      {
        id: 32,
        name: 'Marine Drive',
        description: 'A 3.6-kilometre arc-shaped coastal promenade along Netaji Subhash Chandra Bose Road, famed for its sweeping evening sunset views and Art Deco buildings.',
        image_url: '/images/places/marine-drive.jpg',
        timings: 'Open 24 Hours',
        entry_fee: 0,
        type: 'Coastal Promenade'
      },
      {
        id: 33,
        name: 'Elephanta Caves',
        description: 'A UNESCO World Heritage complex of rock-cut cave temples on Elephanta Island dating to the 5th-8th centuries, dominated by the colossal 6-metre Trimurti Shiva.',
        image_url: '/images/places/elephanta-caves.jpg',
        timings: '9:00 AM – 5:30 PM (Closed Mondays)',
        entry_fee: 600,
        type: 'UNESCO Rock-Cut Caves'
      }
    ]
  },
  {
    id: 8,
    name: 'Delhi',
    country: 'India',
    state: 'Delhi',
    category: 'Heritage',
    image_url: '/images/destinations/delhi.jpg',
    best_time: 'October to March',
    ideal_duration: '3 - 4 Days',
    ideal_for: ['Heritage Lovers', 'Street Food Fans', 'Museum Seekers', 'Shoppers'],
    nearest_station: { code: 'NDLS', name: 'New Delhi' },
    description: 'Delhi, India\'s capital territory, is an extraordinary tapestry where centuries of dynasties meet modern cosmopolitan life. From Mughal fortifications and soaring medieval minarets in Old Delhi to the wide boulevards, colonial architecture, and diplomatic enclaves of New Delhi, it is a magnificent open-air museum.',
    why_visit: [
      'The majestic UNESCO Red Fort and Qutub Minar, the tallest brick minaret in the world',
      'The solemn grandeur of India Gate war memorial and Rashtrapati Bhavan',
      'The sensory whirlwind of Old Delhi\'s Chandni Chowk and Paranthe Wali Gali',
      'Unmatched shopping for traditional crafts at Dilli Haat and high fashion at Connaught Place'
    ],
    budget: {
      daily_backpacker: 1500,
      daily_midrange: 3500,
      daily_luxury: 8500,
      avg_stay: '₹1,200 – ₹3,800 / night',
      avg_food: '₹400 – ₹1,100 / day',
      avg_transport: '₹150 – ₹600 / day (World-class Delhi Metro)',
      avg_activities: '₹350 – ₹900 / day',
      estimate_3day: '₹7,500 – ₹15,000 per person',
      estimate_5day: '₹12,500 – ₹25,000 per person'
    },
    travel_tips: [
      {
        icon: '🚇',
        title: 'Use the Delhi Metro Smart Card',
        desc: 'Delhi Metro is clean, air-conditioned, fast, and covers almost every major attraction. Buy a tourist day pass to save time.'
      },
      {
        icon: '🥻',
        title: 'Dress Respectfully for Places of Worship',
        desc: 'Carry a scarf or handkerchief to cover your head when visiting Jama Masjid, Gurudwara Bangla Sahib, or temples.'
      },
      {
        icon: '🛍️',
        title: 'Bargain at Janpath, Sarojini & Chandni Chowk',
        desc: 'Bargaining is expected in street markets; start at roughly 50% of the quoted price and negotiate politely.'
      },
      {
        icon: '🍛',
        title: 'Explore Chandni Chowk on a Cycle Rickshaw',
        desc: 'Old Delhi lanes are narrow and lively; hire a cycle rickshaw to navigate Paranthe Wali Gali and the spice market (Khari Baoli).'
      },
      {
        icon: '🎟️',
        title: 'Pre-book Monument Tickets Online',
        desc: 'Use the ASI ticketing portal to scan QR codes for Red Fort, Humayun\'s Tomb, and Qutub Minar to avoid waiting.'
      }
    ],
    places: [
      {
        id: 34,
        name: 'India Gate',
        description: 'A 42-metre tall memorial arch at the center of the capital, commemorating 70,000 soldiers with eternal flame and sprawling green evening lawns.',
        image_url: '/images/places/india-gate.jpg',
        timings: 'Open 24 Hours',
        entry_fee: 0,
        type: 'National War Memorial'
      },
      {
        id: 35,
        name: 'Red Fort',
        description: 'The monumental 17th-century red sandstone fortress built by Emperor Shah Jahan, serving as the seat of Mughal power and the site of India\'s Independence Day address.',
        image_url: '/images/places/red-fort.jpg',
        timings: '9:30 AM – 4:30 PM (Closed Mondays)',
        entry_fee: 500,
        type: 'UNESCO Mughal Fortress'
      },
      {
        id: 36,
        name: 'Qutub Minar',
        description: 'A 72.5-metre tall UNESCO World Heritage brick minaret begun in 1193, surrounded by ancient Indo-Islamic monuments and the rust-free Iron Pillar of Delhi.',
        image_url: '/images/places/qutub-minar.jpg',
        timings: '7:00 AM – 5:00 PM',
        entry_fee: 650,
        type: 'UNESCO Medieval Minaret'
      }
    ]
  }
]

/**
 * Common departure/source cities across India with codes and names.
 * Used for smart suggestions and auto-fill in Trip Planner.
 */
export const POPULAR_SOURCE_CITIES = [
  { city: 'New Delhi', state: 'Delhi', code: 'NDLS' },
  { city: 'Mumbai', state: 'Maharashtra', code: 'MMCT' },
  { city: 'Bengaluru', state: 'Karnataka', code: 'SBC' },
  { city: 'Kolkata', state: 'West Bengal', code: 'HWH' },
  { city: 'Chennai', state: 'Tamil Nadu', code: 'MAS' },
  { city: 'Hyderabad', state: 'Telangana', code: 'HYB' },
  { city: 'Ahmedabad', state: 'Gujarat', code: 'ADI' },
  { city: 'Pune', state: 'Maharashtra', code: 'PUNE' },
  { city: 'Jaipur', state: 'Rajasthan', code: 'JP' },
  { city: 'Chandigarh', state: 'Punjab/Haryana', code: 'CDG' },
  { city: 'Lucknow', state: 'Uttar Pradesh', code: 'LKO' },
  { city: 'Bhopal', state: 'Madhya Pradesh', code: 'BPL' },
  { city: 'Indore', state: 'Madhya Pradesh', code: 'INDB' },
  { city: 'Kochi', state: 'Kerala', code: 'ERS' }
]

/**
 * Helper to get a destination by its ID.
 */
export function getDestinationById(id) {
  const numId = parseInt(id, 10)
  return DESTINATIONS_DATA.find(d => d.id === numId) || null
}

/**
 * Helper to get places for a destination ID.
 */
export function getPlacesByDestinationId(id) {
  const dest = getDestinationById(id)
  return dest ? dest.places : []
}

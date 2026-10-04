# PROJECT REPORT ON
# TRAVEL JOURNEY PLANNER

---

### **A Web-Based Intelligent Journey and Itinerary Planning System**

**Course:** Web Technologies / Final Year Major Project  
**Academic Year:** 2025–2026  
**Repository:** [github.com/ansarimazhar07/TRAVEL-JOURNEY-PLANNAR](https://github.com/ansarimazhar07/TRAVEL-JOURNEY-PLANNAR)  

---

## 1. Title Page

| Project Title | **Travel Journey Planner** |
| :--- | :--- |
| **Domain** | Full-Stack Web Development, Cloud Computing, Distributed APIs |
| **Frontend Stack** | React 18, React Router v6, Vite, Vanilla CSS3 (Custom Design System) |
| **Backend Stack** | PHP 8.2, PDO, RESTful Micro-Services, Apache |
| **Database** | MySQL 8.0 / PostgreSQL (TiDB Cloud Serverless / Supabase Dual Compatible) |
| **Third-Party APIs** | RailRadar Live Indian Railway API, Google Gemini AI (Generative Travel Recommendations) |
| **Deployment Target** | Netlify (Frontend SPA), Render (Backend Docker Container), TiDB Cloud / Supabase (Cloud Database) |

---

## 2. Introduction

Travelling is one of the most rewarding personal and educational experiences, yet planning a journey remains notoriously fragmented. Anyone who has attempted to plan a multi-day vacation across Indian tourist circuits knows the frustration: you check trains on IRCTC or RailYatri, look up tourist spots on TripAdvisor or blogs, book hotels on Agoda or MakeMyTrip, calculate estimated costs on a rough spreadsheet, and ask ChatGPT for recommendations in another browser tab. 

The **Travel Journey Planner** was built to solve this exact fragmentation. It brings the entire lifecycle of journey preparation—discovering destinations, exploring landmark attractions, browsing curated hotels, tracking live train status, planning daily itineraries, calculating realistic budgets, and getting AI-assisted trip advice—into a single, unified, and aesthetically cohesive web application.

Rather than building a heavyweight commercial booking agency loaded with intrusive advertisements and paid sponsored listings, our focus has been on delivering a practical, responsive, and student/traveller-friendly planning companion. The system gives users factual information, transparent budget calculators, interactive route details, and live Indian Railway train running status without forcing immediate payment or ticket commitments.

---

## 3. Problem Statement

Modern travellers face several practical challenges when planning trips in India:

1. **Information Fragmentation:** Travellers are forced to jump between four to six disparate websites and mobile applications just to assemble a basic 3-day itinerary.
2. **Cluttered and Ad-Heavy Portals:** Most commercial travel portals prioritize sponsored hotel placements and affiliate banners over clean, legible data regarding entry fees, local timings, and travel distances.
3. **Disconnected Transport Tracking:** Transport planning is typically isolated from destination selection. A user often decides on a destination without easily knowing which express trains connect their nearest station or whether their train is currently running on schedule.
4. **Lack of Transparent Budgeting:** Most travel websites encourage impulse bookings without offering an interactive tool to estimate consolidated costs (lodging, dining, local transport, entrance tickets, and emergency buffers).
5. **Static, Generic Advice:** Traditional guidebook sites offer static paragraphs that do not adapt to individual traveller preferences (e.g., solo budget backpackers vs. families).

---

## 4. Objectives

The primary objectives of the Travel Journey Planner project are:

- **Centralized Exploration:** Provide structured, high-resolution visual guides for major Indian travel destinations, including Jaipur, Goa, Manali, Agra, Munnar, Varanasi, Mumbai, and Delhi.
- **Detailed Place & Hotel Catalogs:** Display curated tourist places with verified operating hours, ticket fees, and location coordinates, alongside destination-specific hotels categorized by rating, price per night, and amenities.
- **Live Railway Tracking:** Integrate the official RailRadar API to offer real-time Indian Railway train status tracking (current station, delay minutes, platform number, and speed) alongside independent inter-station train discovery.
- **Day-by-Day Trip Planning:** Allow registered users to create customized multi-day trip cards, set travel dates, define group sizes, and save personal itineraries.
- **Interactive Budget Estimation:** Implement an interactive budget calculator with slider controls that updates projected costs in real time across accommodation, food, local travel, activities, and emergency buffers.
- **AI-Driven Personalization:** Leverage the Google Gemini Generative AI API to produce customized travel itineraries and packing suggestions based on user prompts.
- **Independent & Production-Grade Hosting:** Architect the system using containerized Docker services on Render, automated single-page application builds on Netlify, and cloud-hosted MySQL/PostgreSQL databases with SSL.

---

## 5. Scope of the Project

### In-Scope Functional Modules
- **Destination Module:** Browsing popular and categorized destinations (Beach, Mountain, Heritage, Spiritual, Hill Station, City) with filtering and detailed overviews.
- **Places & Landmarks Module:** Visual cards displaying 24 curated tourist attractions across India with entrance pricing, category tags, visiting hours, and dedicated landmark photos.
- **Accommodation Module:** Visual directory of 23 hotels with star ratings, pricing per night, full address, and amenity badges.
- **Live Train Status Module:** Real-time Indian Railway train tracker accepting 5-digit train numbers (e.g., 12951, 12009) via RailRadar API, displaying live delay, current station, and upcoming stops.
- **Train Search Module:** Inter-station search engine connecting railway stations (e.g., New Delhi to Mumbai Central) with schedules and departure times.
- **AI Travel Assistant:** Interactive recommendation interface powered by Gemini AI generating customized day-wise plans.
- **Trip Planner & Itinerary Manager:** Protected user dashboard allowing authenticated travellers to create, review, edit, and delete planned journeys.
- **Trip Budget Calculator:** Dynamic cost estimator with responsive sliders and visual breakdowns.
- **Authentication & Security:** Secure user registration, password hashing (`bcrypt`), persistent session cookies with `SameSite=None; Secure` cross-domain compliance, and protected route guards.

### Out-of-Scope (Deliberate Design Boundaries)
- Direct credit card transactions or ticket issuance (the portal is a planner, not an IRCTC/OTA payment aggregator).
- Automated live flight seat booking.
- Flight seat assignment engines and refund handling.

---

## 6. Proposed System & System Architecture

### 6.1 Architectural Design

The application follows a decoupled, three-tier micro-service client-server architecture:

```
┌──────────────────────────────────────────────────────────┐
│                 PRESENTATION TIER (SPA)                  │
│       React 18 + React Router v6 + Vanilla CSS3          │
│                Hosted on Netlify (CDN)                   │
└────────────────────────────┬─────────────────────────────┘
                             │
                  HTTPS JSON REST Calls
                 (credentials: 'include')
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│                  APPLICATION TIER (API)                  │
│       PHP 8.2 Apache Micro-Service in Docker             │
│                 Hosted on Render.com                     │
│                                                          │
│  [Auth Engine]   [CORS Guard]    [Session Manager]       │
│  [Places API]    [Hotels API]    [Trips Controller]      │
│  [RailRadar Proxy]               [Gemini AI Handler]     │
└──────────────┬─────────────────────────────┬─────────────┘
               │                             │
       PDO / SSL Queries              External REST APIs
               │                             │
               ▼                             ▼
┌──────────────────────────────┐  ┌────────────────────────┐
│        DATA TIER             │  │   EXTERNAL SERVICES    │
│  TiDB Cloud / Supabase       │  │  - RailRadar API       │
│  (Cloud MySQL / PostgreSQL)  │  │  - Google Gemini AI    │
└──────────────────────────────┘  └────────────────────────┘
```

### 6.2 Key Architectural Decisions
1. **Decoupled Frontend & Backend:** Hosting the React single-page app independently on Netlify guarantees fast edge delivery, while the PHP REST API handles server-side database operations and proxying external API keys safely.
2. **Dedicated Live Train Status vs. Station Search:** Previous iterations merged train search and live running status into one page, creating confusing user flows. We separated them into two distinct pages: `/train-search` for planning future schedules and `/live-train-status` for monitoring a train currently on track.
3. **Session Cookie Strategy Across Domains:** Because Netlify and Render operate on different top-level domains, we implemented `SameSite=None; Secure` cookie parameters in a centralized session handler (`backend/session.php`), preventing modern browsers from dropping auth cookies.
4. **Dual-Driver Database Layer:** The database abstraction layer in `backend/db.php` dynamically identifies whether it is talking to a MySQL database (port 3306 or 4000) or PostgreSQL/Supabase (port 5432 or 6543), allowing zero-recode database portability.

---

## 7. Hardware Requirements

### Minimum Development Hardware
- **Processor:** Dual-Core Intel Core i3 / AMD Ryzen 3 or higher
- **RAM:** 4 GB minimum (8 GB recommended for running XAMPP, Node.js dev server, and IDE concurrently)
- **Disk Space:** 5 GB free hard drive / SSD space
- **Display Resolution:** 1366 × 768 or higher
- **Network Interface:** Active Internet connection for npm package installation and cloud API calls

### Client-Side Execution Hardware
- Any modern desktop, laptop, tablet, or smartphone capable of running an updated web browser (Chrome, Edge, Safari, Firefox). Minimum 2 GB RAM.

---

## 8. Software Requirements

### Development Environment & Tooling
- **Operating System:** Microsoft Windows 10/11, macOS, or Ubuntu Linux
- **Local Web Server:** XAMPP 8.2 (Apache 2.4.x, PHP 8.2.x, MariaDB/MySQL 10.4.x)
- **Runtime Environment:** Node.js v18.x or v20.x with npm v9.x or v10.x
- **Development Tool:** Visual Studio Code / Antigravity IDE
- **Version Control:** Git & GitHub

### Production Hosting & Cloud Services
- **Frontend Host:** Netlify (Automated CI/CD from Git, edge distribution, SPA redirects)
- **Backend Host:** Render (Docker container running Debian PHP 8.2 Apache)
- **Database Engine:** TiDB Cloud Serverless (MySQL 8.0 wire-compatible) or Supabase (PostgreSQL 15)
- **External APIs:**
  - RailRadar REST API (RapidAPI / RailRadar platform for live train GPS)
  - Google Gemini Generative Language API (`v1beta`)

---

## 9. Database Design

The relational database model consists of seven normalized tables designed in Third Normal Form (3NF).

### 9.1 Entity-Relationship (ER) Schema Overview

```
 [users] 1 ────< has many >──── 0..* [trips] 1 ────< has many >──── 0..* [itinerary]
                                       │
                                   references
                                       ▼
  [destinations] 1 ────< has many >──── 0..* [places]
         │
         └─────────────< has many >──── 0..* [hotels]

  [contact_messages] (Standalone contact submissions)
```

### 9.2 Data Dictionary

#### Table 1: `destinations`
Stores top-level cities and travel regions.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT / SERIAL | PRIMARY KEY, AUTO_INC | Unique identifier |
| `name` | VARCHAR(150) | NOT NULL | City or destination name (e.g., Jaipur, Goa) |
| `country` | VARCHAR(100) | DEFAULT 'India' | Country name |
| `state` | VARCHAR(100) | NULLABLE | State / province |
| `description` | TEXT | NULLABLE | Historical and geographical summary |
| `image_url` | VARCHAR(500) | NULLABLE | Path to destination hero image |
| `category` | VARCHAR(100) | NULLABLE | Heritage, Beach, Mountain, Spiritual, etc. |
| `best_time` | VARCHAR(100) | NULLABLE | Recommended travel season (e.g., Oct to Mar) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

#### Table 2: `places`
Stores landmark attractions situated within destinations.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT / SERIAL | PRIMARY KEY, AUTO_INC | Unique identifier |
| `destination_id` | INT | FOREIGN KEY (destinations.id) | Parent destination reference (ON DELETE CASCADE) |
| `name` | VARCHAR(150) | NOT NULL | Landmark name (e.g., Amber Fort, Taj Mahal) |
| `description` | TEXT | NULLABLE | Historical significance and visitor notes |
| `image_url` | VARCHAR(500) | NULLABLE | Dedicated high-resolution landmark photograph |
| `entry_fee` | DECIMAL(8,2) | DEFAULT 0.00 | Admission price in INR (0.00 represents free entry) |
| `timings` | VARCHAR(200) | NULLABLE | Daily opening and closing hours |
| `latitude` | DECIMAL(10,7)| NULLABLE | GPS coordinate latitude |
| `longitude`| DECIMAL(10,7)| NULLABLE | GPS coordinate longitude |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### Table 3: `hotels`
Stores accommodations associated with destinations.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT / SERIAL | PRIMARY KEY, AUTO_INC | Unique identifier |
| `destination_id` | INT | FOREIGN KEY (destinations.id) | Parent destination reference (ON DELETE CASCADE) |
| `name` | VARCHAR(150) | NOT NULL | Property name (e.g., Heritage Haveli) |
| `description` | TEXT | NULLABLE | Accommodation features and ambiance |
| `image_url` | VARCHAR(500) | NULLABLE | Dedicated hotel property photograph |
| `price_per_night`| DECIMAL(10,2)| DEFAULT 0.00 | Approximate room tariff per night in INR |
| `rating` | DECIMAL(2,1) | DEFAULT 0.0 | Star review score out of 5.0 |
| `address` | VARCHAR(300) | NULLABLE | Local physical address |
| `phone` | VARCHAR(20) | NULLABLE | Front-desk contact number |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

#### Table 4: `users`
Stores registered user credentials.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT / SERIAL | PRIMARY KEY, AUTO_INC | Unique identifier |
| `name` | VARCHAR(100) | NOT NULL | Full name of user |
| `email` | VARCHAR(150) | UNIQUE, NOT NULL | Account email address |
| `password` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account registration timestamp |

#### Table 5: `trips`
Stores itineraries created by users.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT / SERIAL | PRIMARY KEY, AUTO_INC | Unique identifier |
| `user_id` | INT | FOREIGN KEY (users.id) | Author user reference (ON DELETE CASCADE) |
| `destination_id` | INT | FOREIGN KEY (destinations.id) | Associated destination (ON DELETE SET NULL) |
| `trip_name` | VARCHAR(150) | NOT NULL | Title of the trip (e.g., "Goa Summer Getaway") |
| `start_date` | DATE | NOT NULL | Journey start date |
| `end_date` | DATE | NOT NULL | Journey end date |
| `num_travellers` | INT | DEFAULT 1 | Count of people in travelling party |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

---

## 11. Implementation

### 11.1 Frontend Implementation
The user interface is engineered as an SPA using React 18, bundled via Vite.
- **Component Hierarchy:** Built on reusable design components (`DestinationCard`, `PlaceCard`, `HotelCard`, `Navbar`, `Footer`) sharing CSS custom properties (variables) for consistent warm terracotta, amber gold, and sandy cream tones.
- **Routing:** Handled client-side via `react-router-dom` v6 with dynamic routing parameters (`/destinations/:id`, `/places/:id`, `/hotels/:id`).
- **State & Context:** Global authentication state is managed through `AuthContext.jsx`, which evaluates session validity upon mount by polling `auth/check.php`.
- **Search & Filter Algorithms:** Filtering on destination and landmark lists is implemented reactively on the client side using string matching against names, state names, and category tags.

### 11.2 Backend API Implementation
The backend consists of lightweight, single-responsibility PHP endpoints:
- **`destinations.php`**: Retrieves all destinations or filters by ID.
- **`places.php`**: Retrieves tourist places, with optional `destination_id` parameter.
- **`hotels.php`**: Retrieves hotels, with optional `destination_id` parameter.
- **`train_live.php`**: Server-side proxy connecting to RailRadar API. It validates the 5-digit train number, sends an authenticated HTTP request with secret headers, normalizes response fields, and returns clean JSON to the frontend.
- **`trains.php`**: Handles inter-station route searches with station code lookups.
- **`trips.php`**: Full CRUD endpoint for managing trips. Requires an active authenticated session.
- **`ai.php`**: Interfaces with the Gemini AI model, passing sanitized system prompts and returning structured travel recommendations.
- **`auth/login.php`, `register.php`, `logout.php`, `check.php`**: Manages secure user authentication using PHP's native `password_hash()` (Argon2/Bcrypt) and cross-origin sessions.

### 11.3 Containerization & Deployment Pipeline
- **Docker Integration:** A multi-stage `Dockerfile` based on `php:8.2-apache` installs both `pdo_mysql` and `pdo_pgsql` alongside Apache `mod_rewrite` and `mod_headers`.
- **Dynamic Port Entrypoint:** Render dynamically injects `$PORT` (typically 10000). A shell script (`docker-entrypoint.sh`) dynamically updates Apache's `ports.conf` and virtual host configuration at container startup.
- **Automated Netlify SPA Delivery:** `netlify.toml` automatically builds the frontend from `frontend/` and redirects all non-static asset routes to `/index.html` with HTTP 200, guaranteeing error-free page refreshes.

---

## 12. Screenshots / Results Walkthrough

*(The following describe the functional screens and verified results across the project)*

1. **Landing & Discovery Page (`/`)**: Displays a high-impact hero section with warm desert-and-terracotta branding, search bar, featured Indian destinations, category filters, and introductory highlights.
2. **Destinations Explorer (`/destinations`)**: Displays an interactive grid of destinations with category badges, best travel season tags, and overview cards. Clicking any card navigates to full destination details.
3. **Places & Attractions Directory (`/places`)**: Features 24 tourist spots, each with its own verified photograph, admission fees (clearly highlighting "Free Entry" where applicable), and visiting hours.
4. **Hotels & Accommodations Directory (`/hotels`)**: Displays 23 distinct lodging properties across budget havelis, luxury palace hotels, and beachside cottages with live star-rating visualizers (★) and calculated tariffs per night.
5. **Live Train Running Status (`/live-train-status`)**: Clean Indian Railway tracker interface. Entering a train number like `12951` (Mumbai Rajdhani Express) fetches real-time telemetry from RailRadar, displaying current station, speed, delay status (e.g., "On Time" or "Delayed by 14 mins"), and complete upcoming station itineraries.
6. **Train Search Between Stations (`/train-search`)**: Independent station-to-station schedule finder (e.g., NDLS to MMCT) displaying departure, arrival, journey duration, and operating train classes.
7. **Interactive Trip Budget Calculator (`/budget`)**: Real-time slider-based calculator enabling travellers to specify trip duration, group count, and lodging class. Automatically calculates interactive pie-style breakdowns across lodging, food, travel, and activities.
8. **AI Travel Recommendation Assistant (`/ai-recommendation`)**: Dynamic prompt interface that queries Google Gemini to generate custom day-by-day itineraries, packing lists, and local cultural etiquette tips.
9. **User Dashboard & Trip Planner (`/trips`)**: Secure member portal allowing logged-in travellers to create and review saved itineraries.

---

## 13. Advantages of the System

- **All-in-One Convenience:** Travellers can look up landmarks, hotels, live train status, and total budget estimates under one roof without switching apps.
- **Zero Sponsored Clutter:** Pure informational focus without third-party advertisements or deceptive pricing tricks.
- **Verified Visuals:** All 24 tourist places and 23 hotels feature distinct, high-resolution photographs representing the actual destination instead of placeholder graphics.
- **Real-Time Data Integration:** Live railway telemetry powered by RailRadar gives accurate, real-world utility for Indian train travellers.
- **Modern, Accessible UI:** Custom-tailored terracotta and cream design system built with clean Vanilla CSS delivers an intuitive and visually pleasing user experience across both desktop and mobile viewports.
- **High Portability:** Dockerized backend and multi-driver database layer make the application deployable on any modern cloud infrastructure with zero vendor lock-in.

---

## 14. Limitations

- **No Direct Booking Engine:** Because the portal intentionally avoids handling financial transactions or payment gateway compliance, users must complete final ticket purchases on official platforms (IRCTC, hotel booking engines).
- **Third-Party API Rate Limits:** Real-time train status and AI recommendations rely on external API quotas (RailRadar and Google Gemini), which may experience rate limiting under heavy concurrent usage.
- **Static Pricing Estimates:** Hotel tariffs and landmark entry fees represent verified seasonal averages and may fluctuate during peak holiday periods or festival seasons.
- **Regional Focus:** The primary database is currently focused on 8 prominent Indian tourist states and cities, rather than complete international coverage.

---

## 15. Future Scope

The modular architecture of the Travel Journey Planner provides a strong foundation for future extensions:
1. **Interactive Leaflet/Mapbox Maps:** Embedding interactive OpenStreetMap or Mapbox route visualization showing sequential paths between tourist places within each city.
2. **Offline PWA Support:** Converting the React frontend into a Progressive Web App (PWA) with service workers so travellers can view saved itineraries offline while travelling through remote areas with weak cellular coverage.
3. **Community Reviews & Travel Notes:** Enabling verified users to upload travel photographs, rate hotels, and leave local tips for fellow travellers.
4. **Multi-Currency Support:** Adding dynamic currency conversion for international tourists visiting India.
5. **Weather Radar Integration:** Hooking into OpenWeatherMap API to display 7-day live weather forecasts directly on destination and place cards.

---

## 16. Conclusion

The **Travel Journey Planner** successfully demonstrates how modern web engineering principles can simplify the complex task of journey organization. By pairing a responsive React single-page frontend with an efficient PHP REST backend, cloud-native containerization, and real-time external APIs, the application provides an integrated solution for modern travellers.

From exploring historical monuments and checking hotel amenities to tracking live Indian Railway express trains and calculating realistic budgets, the platform eliminates the need for fragmented browsing. The project meets all of its core design objectives, providing an attractive, reliable, and practical tool for travellers.

---

## 17. References

1. **React Documentation:** React official documentation & hooks guide (v18.x), [react.dev](https://react.dev/).
2. **Vite Build Tool:** Vite next-generation frontend tooling, [vitejs.dev](https://vitejs.dev/).
3. **PHP Official Manual:** PHP Data Objects (PDO) abstraction layer, [php.net/manual/en/book.pdo.php](https://www.php.net/manual/en/book.pdo.php).
4. **RailRadar API Documentation:** Indian Railway live tracking API specification, RailRadar Developer Portal.
5. **Google Gemini API Documentation:** Google AI for Developers Generative Language documentation, [ai.google.dev](https://ai.google.dev/).
6. **Docker Documentation:** Dockerizing PHP Apache applications, [docs.docker.com](https://docs.docker.com/).
7. **Netlify Documentation:** Deploying Single Page Applications and redirects, [docs.netlify.com](https://docs.netlify.com/).
8. **Indian Railways Official Data:** Ministry of Railways, Government of India, [indianrailways.gov.in](https://indianrailways.gov.in/).

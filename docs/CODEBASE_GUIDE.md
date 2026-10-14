# Travel Journey Planner — Complete Codebase Guide

> **Target Audience:** Computer Engineering Student preparing for Faculty Viva & Technical Demonstration.  
> **Project Name:** Travel Journey Planner  
> **Architecture:** Decoupled Client-Server (React SPA + Modular PHP REST API + MySQL/PostgreSQL + External APIs)

---

## 1. Project Overview (In Simple English)

**Travel Journey Planner** is a full-stack web application designed to help travelers plan, organize, and budget their trips across India. 

Instead of opening five different websites—one for researching attractions, one for finding hotels, one for checking live train statuses, one for calculating trip expenses, and another for writing daily itineraries—this application brings all these capabilities into a single, cohesive dashboard.

### Core Capabilities:
1. **Destination Discovery:** Explore popular travel destinations across India with details on weather, best travel seasons, estimated budgets, and local tips.
2. **Attraction & Hotel Directories:** Browse curated sightseeing points and accommodations linked to specific destinations.
3. **User Authentication:** Secure user registration, credential hashing with `bcrypt`, and persistent PHP session management.
4. **Trip Management (CRUD):** Logged-in travelers can create, view, update, and delete customized travel plans specifying source city, destination, dates, and number of companions.
5. **Live Railway Intelligence:** Integration with the **RailRadar API** to check real-time live train running status (delays, platform numbers, upcoming stations) and search for trains between any two Indian railway stations.
6. **AI-Powered Itinerary Generator:** Leverages **Google Gemini 1.5/2.0 API** to generate personalized day-by-day itineraries, complete with local delicacies, transport routes, and cost breakdowns.
7. **Offline-Resilient Architecture:** Features built-in mock/fallback datasets and an offline heuristic route engine (`route_planner_data.php`) so the application remains 100% operational even if external APIs or local databases are temporarily unavailable.
8. **Client-Side Trip Budget Calculator:** An interactive calculator allowing travelers to estimate and balance expenses across transit, hotels, meals, activities, and miscellaneous items.

---

## 2. What Problem the Application Solves

Planning a trip typically involves fragmented information across multiple disconnected portals:
- Travelers struggle to coordinate transit schedules with destination sightseeing.
- Itinerary generation often requires tedious manual research.
- Budgeting is usually done on spreadsheets or notes apps disconnected from destination pricing.
- During viva demonstrations or unstable network environments, student projects frequently crash when external APIs fail.

**Travel Journey Planner solves this by:**
- Centralizing destination research, transit schedules, accommodation discovery, and trip tracking into a single user interface.
- Providing server-side proxying to protect API keys from client exposure.
- Implementing dual-layer fallbacks: if the database or external APIs fail, curated local data guarantees uninterrupted user experience during demonstrations.

---

## 3. Technology Stack & Why Each Technology Was Chosen

| Layer | Technology | Actual Implementation Reason |
|---|---|---|
| **Frontend Framework** | **React 19** | Enables building a dynamic Single Page Application (SPA) using component-driven UI and declarative state management (`useState`, `useEffect`, `useContext`). |
| **Build Tool & Dev Server** | **Vite 6** | Provides ultra-fast Hot Module Replacement (HMR) and optimized ES-module bundling, drastically speeding up development and build times compared to legacy Webpack. |
| **Routing** | **React Router DOM v7** | Manages client-side routing, URL query parameter parsing (`useSearchParams`), dynamic route segments (`/destinations/:id`), and browser history without full page reloads. |
| **Styling** | **Pure Vanilla CSS** | Custom CSS variables in `index.css` provide a cohesive design system (color tokens, gradients, cards, badges, responsive layout) without heavy third-party UI framework dependencies. |
| **Backend Language** | **PHP 8.2 (Procedural / Modular)** | Ubiquitous on local development servers (XAMPP/WAMP), simple to host on Apache, natively handles sessions via cookies, and provides built-in cURL for external API requests. |
| **Backend Database** | **MySQL / MariaDB (or PostgreSQL via Supabase)** | Relational database accessed via **PHP PDO (PHP Data Objects)** using parameterized prepared statements to prevent SQL Injection. `db.php` auto-detects MySQL on port 3306 or PostgreSQL on port 5432/6543. |
| **External API 1** | **RailRadar API** | Provides real-time train running status, train routes, and station schedules across Indian Railways. Proxied securely through `backend/train_live.php` and `backend/trains.php`. |
| **External API 2** | **Google Gemini API** | Natural language generative AI used to produce day-by-day itineraries tailored to traveler duration, source, destination, and budget. Proxied through `backend/ai.php`. |

---

## 4. High-Level Architecture & Text-Based Diagram

The project implements a **Decoupled 3-Tier Architecture**:
1. **Presentation Tier (React SPA):** Runs in the user's browser, communicates asynchronously via HTTP `fetch` requests.
2. **Application Tier (PHP REST API):** Runs on Apache server, handles routing, CORS, session verification, input validation, database queries, and external API proxying.
3. **Data Tier (MySQL / PostgreSQL & External Web Services):** Stores user accounts, destinations, places, hotels, and trips; external REST endpoints supply train data and AI generations.

```text
+-----------------------------------------------------------------------------------+
|                            PRESENTATION TIER (Browser)                            |
|                                                                                   |
|  [ React 19 SPA (Vite) ]                                                          |
|    |-- App.jsx (Routes & Layout)                                                  |
|    |-- AuthContext.jsx (Global User State)                                        |
|    |-- Pages: Home, Destinations, Places, Hotels, TripPlanner, MyTrips,           |
|    |          TrainSearch, TrainStatus, BudgetCalculator, AIRecommendation        |
|    |-- Services: api.js (fetch wrapper + offline fallback engine)                 |
+------------------------------------------+----------------------------------------+
                                           |
                                    HTTP Requests
                       (JSON over HTTP with session cookies)
                                           |
+------------------------------------------v----------------------------------------+
|                             APPLICATION TIER (Apache / PHP)                       |
|                                                                                   |
|  [ Core Middleware ]                                                              |
|    |-- session.php  (SameSite=None/Lax cookie handler)                            |
|    |-- cors.php     (CORS headers + HTTP OPTIONS preflight responder)             |
|    |-- config.php   (Environment variables + API keys + DB credentials)           |
|    |-- db.php       (PDO database connection with auto-driver switch)             |
|                                                                                   |
|  [ REST API Endpoints ]                                                           |
|    |-- /auth/register.php   -> password_hash(PASSWORD_BCRYPT) + user insert       |
|    |-- /auth/login.php      -> password_verify + $_SESSION['user_id'] init        |
|    |-- /auth/check.php      -> Reads $_SESSION for active authentication state    |
|    |-- /auth/logout.php     -> session_destroy() + session cookie invalidation    |
|    |-- /destinations.php    -> SELECT destinations + category filter              |
|    |-- /places.php          -> SELECT places filtered by destination_id           |
|    |-- /hotels.php          -> SELECT hotels filtered by destination_id           |
|    |-- /trips.php           -> CRUD operations strictly scoped to $_SESSION['id'] |
|    |-- /trains.php          -> Proxies RailRadar API for station-to-station train |
|    |-- /train_live.php      -> Proxies RailRadar API for live running status      |
|    |-- /ai.php              -> Proxies Google Gemini API with route fallback      |
+----------------------+------------------------------------+-----------------------+
                       |                                    |
                 PDO Prepared Queries                  cURL HTTPS Requests
                       |                                    |
+----------------------v-----------------------+ +----------v-----------------------+
|             PERSISTENCE TIER                 | |          EXTERNAL SERVICES       |
|  MySQL / MariaDB / PostgreSQL                | |                                  |
|   - users (id, name, email, password)        | |  [ RailRadar API ]               |
|   - destinations (id, name, country, ...)    | |    - Live train telemetry        |
|   - places (id, destination_id, name, ...)   | |    - Station-to-station routes   |
|   - hotels (id, destination_id, name, ...)   | |                                  |
|   - trips (id, user_id, destination_id, ...) | |  [ Google Gemini API ]           |
+----------------------------------------------+ |    - Generative travel plans     |
                                                 +----------------------------------+
```

---

## 5. Folder-by-Folder Explanation

```text
TRAVEL JOURNEY PLANNER/
|-- backend/                     # PHP REST API backend source code
|   |-- auth/                    # Authentication sub-endpoints
|   |   |-- check.php            # Verifies active session for the frontend
|   |   |-- login.php            # Validates credentials and initializes session
|   |   |-- logout.php           # Destroys session and clears cookies
|   |   |-- profile.php          # Retrieves current user's database record
|   |   |-- register.php         # Creates new user with bcrypt password hash
|   |-- .env                     # Local backend secrets (Gemini & RailRadar API keys)
|   |-- ai.php                   # Proxies requests to Gemini; falls back to route data
|   |-- config.php               # Central configuration: database credentials & keys
|   |-- cors.php                 # Cross-Origin Resource Sharing headers & preflight handler
|   |-- db.php                   # PDO database connection factory (MySQL & PostgreSQL)
|   |-- destinations.php         # REST endpoint for destination records
|   |-- hotels.php               # REST endpoint for hotel records
|   |-- index.php                # API root status & healthcheck endpoint
|   |-- places.php               # REST endpoint for tourist attractions
|   |-- route_planner_data.php   # Curated offline route engine and itinerary fallback
|   |-- session.php              # Session configuration with cross-origin cookie flags
|   |-- train_live.php           # RailRadar live running status API proxy
|   |-- trains.php               # RailRadar station-to-station train search API proxy
|   |-- trips.php                # Complete CRUD REST API for user trip itineraries
|
|-- database/                    # SQL schema definitions and seed datasets
|   |-- complete_production_database.sql # Complete unified MySQL database export
|   |-- travel_planner.sql       # Baseline schema definition
|   |-- phase2_destinations.sql  # Destinations table definition and seed records
|   |-- phase3_places_hotels.sql # Places and Hotels schema definition
|   |-- phase3_seed_data.sql     # Rich seed records for places and hotels
|   |-- phase4_auth.sql          # Users table schema definition
|   |-- phase5_trips.sql         # Trips table schema with foreign keys
|   |-- supabase_schema_and_data.sql     # PostgreSQL compatible schema for cloud hosting
|
|-- docs/                        # Student viva & faculty demonstration guides
|   |-- CODEBASE_GUIDE.md        # Comprehensive architecture & codebase manual (this file)
|   |-- FEATURE_FLOW_GUIDE.md    # Function-by-function breakdown & sequence traces
|   |-- FACULTY_VIVA_GUIDE.md    # 1-min pitch, 2-min architecture talk, Q&A, and demo script
|
|-- frontend/                    # React 19 client application (Vite SPA)
|   |-- public/                  # Static assets served directly by Vite
|   |   |-- images/              # Destination, place, and hotel imagery
|   |   |   |-- destinations/    # Destination cover photos
|   |   |   |-- hotels/          # Hotel photos
|   |   |   |-- places/          # Attraction photos
|   |-- src/                     # React application source code
|   |   |-- components/          # Reusable UI presentation components
|   |   |   |-- AIItineraryDisplay.jsx # Renders structured day-by-day AI itineraries
|   |   |   |-- DestinationCard.jsx    # Displays destination thumbnail, category & rating
|   |   |   |-- Footer.jsx             # Site-wide footer with quick links
|   |   |   |-- HotelCard.jsx          # Displays hotel price, stars, and amenities
|   |   |   |-- Navbar.jsx             # Top navigation with auth state & mobile toggle
|   |   |   |-- PlaceCard.jsx          # Displays attraction details & entry fees
|   |   |   |-- StationInput.jsx       # Indian Railway station autocomplete input
|   |   |   |-- TrainCard.jsx          # Displays train schedule, duration & class badges
|   |   |   |-- TripCard.jsx           # Displays saved trip with edit & delete actions
|   |   |-- context/             # Global React state contexts
|   |   |   |-- AuthContext.jsx  # Provides user, login(), logout(), loading across app
|   |   |-- data/                # Curated local fallback datasets
|   |   |   |-- routePlannerData.js # Client-side route information & guides
|   |   |   |-- stations.js      # List of 100+ major Indian Railway stations & codes
|   |   |   |-- travelData.js    # Curated destinations, places, hotels, and categories
|   |   |-- pages/               # Top-level route pages
|   |   |   |-- About.jsx        # Project overview and mission page
|   |   |   |-- AIRecommendation.jsx # Standalone Gemini AI itinerary planner page
|   |   |   |-- BudgetCalculator.jsx # Client-side 5-category trip budget calculator
|   |   |   |-- DestinationDetails.jsx # Detailed single destination view with tabs
|   |   |   |-- Destinations.jsx # Filterable destination catalog
|   |   |   |-- Home.jsx         # Landing page with hero banner & featured destinations
|   |   |   |-- HotelDetails.jsx # Hotel detail page with amenities & booking info
|   |   |   |-- Hotels.jsx       # Filterable hotel directory
|   |   |   |-- Login.jsx        # User login form
|   |   |   |-- MyTrips.jsx      # Logged-in user's trip list dashboard
|   |   |   |-- PlaceDetails.jsx # Place detail page with timings & entry fees
|   |   |   |-- Placeholders.jsx # Future roadmap pages (Flights, Weather, Contact, 404)
|   |   |   |-- Places.jsx       # Filterable tourist attraction directory
|   |   |   |-- Profile.jsx      # User profile details and session termination
|   |   |   |-- Register.jsx     # User account registration form
|   |   |   |-- TrainSearch.jsx  # Station-to-station train search page
|   |   |   |-- TrainStatus.jsx  # Live train running status page
|   |   |   |-- TripDetails.jsx  # Single trip view with export & budget link
|   |   |   |-- TripPlanner.jsx  # Comprehensive trip creation and editing form
|   |   |-- services/            # API communication layer
|   |   |   |-- api.js           # Centralized fetch wrapper with fallback logic
|   |   |-- App.jsx              # Main routing declaration & layout wrapper
|   |   |-- index.css            # Global CSS design tokens, utilities & themes
|   |   |-- main.jsx             # React DOM root entry point
|   |-- index.html               # Single HTML shell file loaded by browser
|   |-- package.json             # NPM dependencies and development scripts
|   |-- vite.config.js           # Vite development and build configuration
|
|-- setup_backend.ps1            # Automated PowerShell script to deploy backend to XAMPP
|-- .gitignore                   # Excludes node_modules, dist, and local environment files
```

---

## 6. Repository Map (Stage 1 Audit Table)

| File or Directory | Purpose | Important Dependencies | Importance |
|---|---|---|---|
| `frontend/src/main.jsx` | React DOM root entry point. Mounts `<App />` to `#root`. | `react`, `react-dom/client` | High |
| `frontend/src/App.jsx` | Top-level routing declaration and layout wrapper. | `react-router-dom`, `AuthContext` | High |
| `frontend/src/context/AuthContext.jsx` | Global state provider for user authentication. | `react`, `api.js` | Critical |
| `frontend/src/services/api.js` | Centralized API client handling all network calls & fallbacks. | `travelData.js`, `routePlannerData.js` | Critical |
| `frontend/src/pages/TripPlanner.jsx` | Trip planning form with AI generation & budget preview. | `AuthContext`, `api.js`, `AIItineraryDisplay` | Critical |
| `frontend/src/pages/MyTrips.jsx` | Displays user's saved trips with edit/delete triggers. | `AuthContext`, `api.js`, `TripCard` | High |
| `frontend/src/pages/TrainSearch.jsx` | Searches trains between stations via RailRadar API. | `api.js`, `TrainCard`, `StationInput` | High |
| `frontend/src/pages/TrainStatus.jsx` | Tracks real-time train running status with station timeline. | `api.js` | High |
| `frontend/src/pages/AIRecommendation.jsx` | Generates custom AI itineraries via Gemini API. | `api.js` | High |
| `frontend/src/pages/BudgetCalculator.jsx` | Interactive client-side budget planning calculator. | Pure React state | Medium |
| `frontend/src/pages/Destinations.jsx` | Catalog of destinations with search & category filters. | `api.js`, `DestinationCard` | High |
| `frontend/src/index.css` | Design system: CSS variables, layout, components, buttons. | Vanilla CSS | High |
| `backend/config.php` | Defines DB credentials and external API keys from `.env`. | PHP core | Critical |
| `backend/db.php` | Establishes PDO database connection (MySQL / PostgreSQL). | `config.php`, PHP PDO | Critical |
| `backend/session.php` | Configures secure cross-origin PHP sessions. | PHP session core | Critical |
| `backend/cors.php` | Injects CORS headers and responds to preflight `OPTIONS`. | PHP core | Critical |
| `backend/auth/login.php` | Authenticates user credentials using `password_verify`. | `session.php`, `db.php`, `cors.php` | Critical |
| `backend/auth/register.php` | Registers new users using `password_hash(PASSWORD_BCRYPT)`. | `db.php`, `cors.php` | Critical |
| `backend/auth/check.php` | Returns current user session data to verify login state. | `session.php`, `cors.php` | Critical |
| `backend/trips.php` | Full CRUD REST endpoint for trips, enforced by session. | `session.php`, `db.php`, `cors.php` | Critical |
| `backend/trains.php` | Server-side proxy for RailRadar station-to-station train search. | `config.php`, `cors.php`, cURL | High |
| `backend/train_live.php` | Server-side proxy for RailRadar live train running status. | `config.php`, `cors.php`, cURL | High |
| `backend/ai.php` | Server-side proxy for Google Gemini AI with route fallback. | `config.php`, `route_planner_data.php` | High |
| `backend/route_planner_data.php` | Server-side heuristic itinerary generator & fallback dataset. | PHP core | High |
| `database/travel_planner.sql` | SQL schema definition for all tables (`users`, `destinations`, etc.). | MySQL / MariaDB | Critical |

---

## 7. How the Application Starts and Runs

### Development Execution:
1. **Frontend Boot:**
   - Command: `npm run dev` inside `frontend/`.
   - Vite starts a local dev server at `http://localhost:5173` (or preview on `http://localhost:4173`).
   - The browser loads `frontend/index.html`, which requests `frontend/src/main.jsx`.
   - `main.jsx` creates the React root and renders `<App />` inside `<AuthProvider>`.
   - React Router inspects the current URL and mounts the matching page component inside `<Layout>`.
2. **Backend Execution:**
   - Apache (via XAMPP) serves the `backend/` directory under `http://localhost/travel-journey-planner/backend`.
   - When the frontend makes an API call, Apache routes the request to the target `.php` script.
   - PHP processes the request, executes database queries or external cURL calls, sets session cookies, and emits a `Content-Type: application/json` response.

---

## 8. How Data Moves Through the Application

### The Unidirectional Data Flow:
```text
User Event (Click / Input)
   │
   ▼
Component State Update (useState / React controlled input)
   │
   ▼
Service Layer Invocation (api.js function)
   │
   ▼
Asynchronous Network Call (fetch() with JSON body & credentials: 'include')
   │
   ▼
Backend Endpoint Processing (cors.php -> session.php -> db.php / cURL)
   │
   ▼
Database / External API Execution (PDO Prepared Statement / RailRadar / Gemini)
   │
   ▼
JSON Response Serialization (json_encode(['success' => true, 'data' => ...]))
   │
   ▼
Frontend Response Resolution (Promise resolved in api.js -> state updated)
   │
   ▼
React Virtual DOM Re-render (UI updates with fresh data or error notification)
```

---

## 9. How the Frontend Communicates with the Backend

Communication is handled exclusively via HTTP REST calls using the browser's native `fetch()` API, wrapped within `frontend/src/services/api.js`.

### Key Communication Rules:
1. **Base URL Resolution:**
   ```javascript
   const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost/travel-journey-planner/backend';
   const API_URL = RAW_API_URL.replace(/\/+$/, '');
   ```
2. **Session Cookie Propagation:**
   All authenticated requests (`/auth/*` and `/trips.php`) MUST include:
   ```javascript
   credentials: 'include'
   ```
   This ensures the browser sends the `PHPSESSID` cookie along with the request across origins (e.g., from `localhost:5173` to `localhost:80`).
3. **CORS Handling (`backend/cors.php`):**
   The PHP backend inspects the `Origin` header and echoes back:
   ```php
   header("Access-Control-Allow-Origin: $origin");
   header("Access-Control-Allow-Credentials: true");
   header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
   header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
   ```
   If the browser sends an HTTP `OPTIONS` preflight request, PHP responds immediately with HTTP `200 OK` and exits.

---

## 10. How Database Operations Work

1. **Connection Factory (`backend/db.php`):**
   Uses **PHP Data Objects (PDO)**, which provides a data-access abstraction layer. It configures:
   - `PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION`: Any database query error throws a `PDOException`.
   - `PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC`: Results are returned as associative arrays (key-value pairs matching column names).
   - `PDO::ATTR_EMULATE_PREPARES => false`: Native prepared statements are executed directly on the database engine, maximizing security against SQL Injection.
2. **Dual-Engine Auto Detection:**
   If the database port is `5432` or `6543`, it builds a PostgreSQL DSN (`pgsql:host=...`). Otherwise, it defaults to MySQL/MariaDB (`mysql:host=...;charset=utf8mb4`).
3. **Prepared Statements Example (`trips.php`):**
   ```php
   $stmt = $conn->prepare("SELECT * FROM trips WHERE user_id = ? ORDER BY start_date ASC");
   $stmt->execute([$userId]);
   $trips = $stmt->fetchAll();
   ```
   User inputs are never concatenated directly into SQL queries, eliminating SQL injection vulnerabilities.

---

## 11. How External APIs are Integrated

### 1. RailRadar API (Live Trains & Search)
- **Role:** Supplies real-time train locations, delays, station timetables, and train search between stations.
- **Why Proxied:** Keeping the API key on the frontend would expose it to anyone inspecting browser network traffic. `backend/trains.php` and `backend/train_live.php` act as secure reverse proxies.
- **Mechanism:** PHP uses `curl_init()`, sends the secret header `X-API-Key: ...`, parses the JSON, normalizes the keys into a friendly format for React, and returns it.

### 2. Google Gemini API (AI Travel Itineraries)
- **Role:** Generates intelligent, customized travel recommendations and day-by-day itineraries based on traveler preferences.
- **Prompt Engineering (`backend/ai.php`):**
  PHP builds a structured prompt enforcing output sections: Journey Overview, Day-by-Day Itinerary, Must-Visit Sights, Local Delicacies, Shopping Bazaars, Budget Breakdown, and Smart Travel Tips.
- **Fail-Safe Fallback:**
  If the Gemini API key is missing, network is down, or Google rate limits are exceeded, `backend/ai.php` invokes `backend/route_planner_data.php` to generate a comprehensive, highly realistic itinerary for the requested route.

---

## 12. How Errors and Loading States are Handled

1. **Loading States:**
   Every asynchronous React page component manages a `loading` boolean state:
   - When a fetch starts: `setLoading(true)`, `setError('')`.
   - While loading: The UI displays an animated spinner or pulse indicator (`<div className="spinner"></div>`).
   - When complete: `setLoading(false)` inside a `.finally()` block, guaranteeing the spinner disappears even if the request fails.
2. **Error States:**
   - If an API returns an HTTP error (`!response.ok`), the service throws an error with the backend's message.
   - The React component catches it: `setError(err.message || 'Something went wrong')`.
   - A distinct alert banner (`<div className="alert alert-error">`) renders with a retry button.
3. **Graceful Fallbacks (`frontend/src/services/api.js`):**
   - If the backend is offline, `getDestinations()` catches the network exception and returns `DESTINATIONS_DATA` from `travelData.js`.
   - If a guest user visits `/my-trips` without logging in while offline, `api.js` creates a persistent mock user (`Explorer`) in `localStorage` so the user can still test the trip planner without encountering a crash.

---

## 13. Important Dependencies and Their Roles

### Frontend Dependencies (`frontend/package.json`):
- `react` (v19.0.0): Core library for declarative UI component rendering.
- `react-dom` (v19.0.0): Glue between React and the browser DOM.
- `react-router-dom` (v7.1.3): Enables single-page routing without page reloads.
- `vite` (v6.0.7): Next-generation build tool and rapid development server.

### Backend Infrastructure:
- `PHP 8.2+`: Core runtime engine.
- `ext-pdo` & `ext-pdo_mysql`: Database communication drivers.
- `ext-curl`: For making outbound HTTP requests to RailRadar and Gemini APIs.
- `ext-session`: For secure user session management.

---

## 14. Known Limitations, Incomplete Features & Roadmap

1. **Placeholder Routes (Future Scope):**
   - `/flights`, `/weather`, `/contact`, and `/itinerary` are declared in `App.jsx` and render the `ComingSoon` component in `frontend/src/pages/Placeholders.jsx`.
2. **Static Indian Railway Station List:**
   - Station codes in `frontend/src/data/stations.js` cover over 100 top Indian railway stations. Obscure rural halt stations may not appear in client autocomplete.
3. **Multi-Currency Support:**
   - The Budget Calculator operates primarily in Indian Rupees (INR - ₹).
4. **Email Verification:**
   - Registration creates accounts immediately without sending an email confirmation link (standard practice for academic prototypes).

---

## 15. Technical Glossary (Viva Vocabulary)

- **SPA (Single Page Application):** A web application that loads a single HTML page and dynamically updates content as the user interacts with the app, without reloading the whole page.
- **CORS (Cross-Origin Resource Sharing):** A browser security feature that restricts HTTP requests initiated from scripts to a different domain, port, or protocol than the one that served the web page.
- **PDO (PHP Data Objects):** A lean, consistent interface for accessing databases in PHP, supporting parameterized queries to protect against SQL injection.
- **Bcrypt (`PASSWORD_BCRYPT`):** A cryptographic password-hashing function based on the Blowfish cipher, incorporating a salt to protect against rainbow table attacks.
- **REST (Representational State Transfer):** An architectural style for networked applications using standard HTTP verbs (`GET` for reading, `POST` for creating, `PUT` for updating, `DELETE` for removing).
- **Preflight Request (`OPTIONS`):** An automated HTTP request sent by browsers before certain cross-origin requests to determine if the server permits the actual request.
- **Session Cookie (`PHPSESSID`):** An encrypted token stored in the user's browser that references a temporary server-side storage file where the user's identity is authenticated.
- **cURL:** A command-line tool and library used in PHP to transfer data over network protocols like HTTPS to communicate with third-party web services.

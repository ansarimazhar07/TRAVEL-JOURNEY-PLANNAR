# Travel Journey Planner — Faculty Viva & Demonstration Guide

> **Prepared For:** Final Year Engineering Faculty Demonstration & Viva Voce.  
> **Key Objective:** Enable the student to speak confidently, navigate the codebase effortlessly, and answer both standard and challenging examiner questions with 100% technical accuracy.

---

## SECTION A: 1-MINUTE PROJECT ELEVATOR PITCH

> **Say this verbatim when the examiner asks: "Tell me about your project in brief."**

*"Good morning/afternoon, professors. My project is the **Travel Journey Planner**, a decoupled full-stack web application designed to simplify how travelers plan, organize, and budget trips across India.*

*Instead of using multiple fragmented websites, our platform centralizes destination research, tourist attractions, and hotel directories with two critical real-time integrations:*
1. *First, real-time railway telemetry powered by the **RailRadar API**, which allows travelers to search trains between stations and track live running statuses with current delays and platforms.*
2. *Second, an intelligent **AI Itinerary Generator** powered by the **Google Gemini API**, which dynamically constructs customized day-by-day travel plans.*

*The frontend is built using **React 19** and **Vite** for a reactive single-page experience, while the backend is implemented as a modular **PHP REST API** connected to a relational database using secure **PDO prepared statements**. Furthermore, the architecture is engineered with offline-resilient fallbacks, ensuring high availability even under unstable network conditions."*

---

## SECTION B: 2-MINUTE ARCHITECTURE EXPLANATION

> **Say this when asked: "Explain your application architecture and data flow."**

*"Our project follows a **Decoupled 3-Tier Architecture**:*

1. ***Presentation Tier (React 19 SPA):***
   *The client interface is built as a Single Page Application using React 19. It uses **React Router DOM v7** for client-side navigation without page reloads, and **React Context API** (`AuthContext`) for centralized authentication state. Styling is crafted using custom Vanilla CSS variables for high performance and zero dependency overhead. All asynchronous communication is mediated through a centralized service module, `api.js`.*

2. ***Application & Middleware Tier (Modular PHP REST API):***
   *The backend runs on an Apache server. Each functional domain is organized as an independent REST endpoint—such as `trips.php`, `destinations.php`, `trains.php`, and `ai.php`. Before processing requests, two crucial middleware files execute:*
   - *`cors.php` handles Cross-Origin Resource Sharing, sets allowed HTTP verbs, and responds immediately to browser preflight `OPTIONS` requests.*
   - *`session.php` configures secure cross-origin session cookies using `SameSite=None/Lax` and `HttpOnly` flags.*

3. ***Data & Persistence Tier:***
   *For persistent data, we use MySQL via **PHP Data Objects (PDO)**. We disable prepared statement emulation (`ATTR_EMULATE_PREPARES => false`) to ensure queries are compiled natively by the database engine, completely preventing SQL Injection attacks. External data—such as live train tracking and AI itineraries—is fetched server-side via PHP cURL from the RailRadar and Google Gemini APIs, keeping API keys securely hidden from the browser.*

4. ***Dual-Layer Resilience:***
   *A standout architectural feature is our fail-safe fallback mechanism: if third-party APIs experience rate limits, or if the database is offline, our system automatically falls back to curated local route data and client-side datasets so the application remains completely interactive."*

---

## SECTION C: FILE-WISE EXPLANATIONS & WHAT TO OPEN IN VS CODE

### 1. `frontend/src/services/api.js`
- **What it does:** Central network gateway for all HTTP calls between React and PHP.
- **Why it exists:** Isolates network logic from UI components, standardizes headers (`credentials: 'include'`), and implements graceful offline fallbacks.
- **Key Functions:** `checkAuth()`, `loginUser()`, `getTrips()`, `createTrip()`, `searchTrains()`, `getLiveTrainStatus()`, `generateAITripPlan()`.
- **What to open during viva:** Show the `credentials: 'include'` configuration and the try/catch fallback mechanism.

### 2. `frontend/src/context/AuthContext.jsx`
- **What it does:** Provides application-wide user state (`user`, `login()`, `logout()`, `loading`).
- **Why it exists:** Prevents "prop drilling" so that the Navbar, Trip Planner, and Protected Routes immediately react when authentication changes.
- **Key Hook:** `useAuth()`.
- **What to open during viva:** Show `useEffect` running `checkAuth()` on mount to restore user session after browser refresh.

### 3. `backend/trips.php`
- **What it does:** Handles full CRUD (Create, Read, Update, Delete) operations for user travel plans.
- **Why it exists:** Core business logic for persisting and securing user itineraries.
- **Security Highlight:** Strictly reads `$_SESSION['user_id']`. It never trusts user IDs sent from client payloads.
- **What to open during viva:** Show the `switch ($method)` routing switch and the parameterized PDO `INSERT` / `UPDATE` queries.

### 4. `backend/train_live.php` & `backend/trains.php`
- **What they do:** Reverse proxy endpoints for the RailRadar API.
- **Why they exist:** Encapsulates the `RAILRADAR_API_KEY` on the server so that external API secrets are never visible in client network traffic.
- **What to open during viva:** Show the cURL execution and input sanitization (`preg_replace('/[^0-9]/', '', $number)`).

### 5. `backend/ai.php`
- **What it does:** Generates personalized travel itineraries using Google Gemini or the offline heuristic fallback engine.
- **Why it exists:** Powers the intelligent planning capabilities of the system.
- **What to open during viva:** Show the engineered 8-section prompt and the fallback branch calling `route_planner_data.php`.

### 6. `backend/db.php`
- **What it does:** Database connection singleton utilizing PDO.
- **Why it exists:** Centralizes database configuration with auto-detection for MySQL (port 3306) and PostgreSQL (port 5432).
- **What to open during viva:** Show PDO attributes for error modes and prepared statement security.

---

## SECTION D: LIKELY FACULTY QUESTIONS & VERIFIED ANSWERS

### Q1: Why did you choose React for the frontend instead of traditional server-side rendering (SSR)?
**Answer:**  
*"React allows us to build a Single Page Application (SPA). Instead of reloading the entire web page on every interaction, React re-renders only the components that have changed using its Virtual DOM. This gives our users a smooth, app-like experience when switching between destinations, searching trains, or generating itineraries."*

### Q2: Why use PHP for the backend instead of Node.js or Python?
**Answer:**  
*"PHP provides a battle-tested, modular runtime with native session handling out of the box. It connects effortlessly with Apache/XAMPP, requires no long-running process managers like PM2 during local development, and allows each endpoint script to run independently with zero framework bloat."*

### Q3: How do you protect your database against SQL Injection attacks?
**Answer:**  
*"We use **PDO prepared statements with bound parameters**. We set `PDO::ATTR_EMULATE_PREPARES => false`, which tells the database engine to compile the SQL query template and validate input parameters separately. Because user inputs are never concatenated directly into SQL query strings, attackers cannot inject malicious SQL commands."*

### Q4: How is user authentication managed between React and PHP?
**Answer:**  
*"We use cookie-based sessions. When a user logs in, PHP verifies their hashed password using `password_verify()` and initializes `$_SESSION['user_id']`. The server sets a `PHPSESSID` cookie. In React, our `api.js` includes `credentials: 'include'` on all fetch requests, sending the session cookie automatically. The backend verifies this session on every protected request."*

### Q5: How are passwords stored in the database?
**Answer:**  
*"Passwords are never stored in plain text. We hash them using PHP's native `password_hash()` with the `PASSWORD_BCRYPT` algorithm. Bcrypt incorporates an automatic cryptographic salt and a configurable work factor, making it immune to rainbow table attacks and dictionary attacks."*

### Q6: What is CORS and how did you resolve it in this project?
**Answer:**  
*"CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks requests made to a different origin than the one serving the web page (for example, React on port 5173 calling Apache on port 80). We resolved this in `backend/cors.php` by returning explicit headers:*
- `Access-Control-Allow-Origin: <origin>`
- `Access-Control-Allow-Credentials: true`
- *Handling HTTP `OPTIONS` preflight requests with an immediate HTTP 200 response."*

### Q7: Why do you proxy the RailRadar and Gemini APIs through PHP instead of calling them directly from React?
**Answer:**  
*"Security and rate management. If we called RailRadar or Gemini directly from React, our secret API keys would be visible to anyone opening the browser's Developer Tools network tab. By proxying through PHP, the API keys stay protected in our server environment, and we can sanitize inputs and implement server-side caching and fallbacks."*

### Q8: What happens if the external Gemini API is down or exhausts its free quota?
**Answer:**  
*"Our system has a built-in graceful degradation mechanism. In `backend/ai.php`, if the cURL request to Gemini fails or returns an error, the backend automatically catches the exception and invokes our server-side route engine (`route_planner_data.php`). This constructs an authentic, route-tailored itinerary so the user interface never crashes."*

### Q9: What HTTP methods do your REST APIs support and what are their semantic roles?
**Answer:**  
*"Our `trips.php` implements standard REST semantics:*
- `GET`: Reads user trips (read-only, idempotent).
- `POST`: Creates a new trip (returns HTTP 201 Created).
- `PUT`: Updates an existing trip (idempotent, checks ownership).
- `DELETE`: Deletes a trip (removes record permanently).
- `OPTIONS`: Browser preflight check for CORS authorization."*

### Q10: How does your Budget Calculator work? Does it store data in the database?
**Answer:**  
*"The Budget Calculator at `/budget` is an interactive client-side tool implemented using pure React state. It does not hit the database because travelers often need rapid, real-time calculations while tweaking numbers. It dynamically computes total expenses, per-person splits, and budget surpluses/deficits, color-coding progress indicators as the budget limit is approached."*

---

## SECTION E: DIFFICULT & TRICKY FOLLOW-UP QUESTIONS

### Q11: "What if a malicious user alters the `trip_id` in a PUT or DELETE request to delete someone else's trip?"
**Answer:**  
*"That attack is completely prevented by our backend authorization query. In `backend/trips.php`, the query is:*
```sql
DELETE FROM trips WHERE id = ? AND user_id = ?
```
*The `user_id` is extracted strictly from `$_SESSION['user_id']`, which the client cannot tamper with. If the trip ID does not belong to the currently logged-in user, `rowCount()` is 0, and PHP returns a 404/403 error."*

### Q12: "Why didn't you use JSON Web Tokens (JWT) instead of PHP sessions?"
**Answer:**  
*"While JWT is popular, PHP sessions stored via secure `HttpOnly` cookies provide superior security against XSS (Cross-Site Scripting) because JavaScript cannot read `HttpOnly` cookies. Additionally, server-side sessions can be revoked instantly upon logout, whereas JWT tokens remain valid until expiration unless a complex token blacklist is maintained."*

### Q13: "What happens if a user submits a trip with a custom destination not in your database?"
**Answer:**  
*"In `backend/trips.php`, inside `createTrip()`, we have auto-resolution logic: if the destination does not exist in the `destinations` table, PHP automatically inserts a new record into `destinations` with category 'Custom', obtains the new ID via `$conn->lastInsertId()`, and links the trip to it. This strictly preserves the foreign key constraint without rejecting the user's input."*

### Q14: "How does the live train status page know the train is running late?"
**Answer:**  
*"The RailRadar API returns telemetry data containing `actual_arrival` and `scheduled_arrival` timestamps, alongside a `delay_in_minutes` integer. In `TrainStatus.jsx`, we evaluate this integer: if delay is 0, we render a green 'On Time' badge; if delay > 0, we display the delay in orange or red with an estimated revised arrival time."*

### Q15: "Why do you have `routePlannerData.js` on both the frontend and `route_planner_data.php` on the backend?"
**Answer:**  
*"This represents our **Dual-Tier Offline Resilience Pattern**:*
- *If the backend server is completely offline or Apache is stopped, the frontend service `api.js` falls back to `routePlannerData.js` in the browser.*
- *If the backend server is running but external APIs (Gemini/RailRadar) fail, the PHP backend falls back to `route_planner_data.php`.*
*This guarantees that under any viva or examination condition, the examiner will always see a working demonstration."*

---

## SECTION F: STEP-BY-STEP LIVE DEMONSTRATION SCRIPT

Follow this exact sequence during your faculty demonstration:

```text
STEP 1: The Landing Page (Home)
- URL: http://localhost:5173/
- Action: Show the modern hero banner, search bar, and popular destinations grid.
- Technical Point: "This is a React SPA powered by Vite. The UI is built with a cohesive CSS variable design system."

STEP 2: Destination Discovery
- URL: Click "Destinations" in Navbar (/destinations)
- Action: Filter by "Heritage" or "Beaches". Click on "Jaipur".
- Technical Point: "The data is fetched via REST API from destinations.php and merged with rich client metadata in api.js."

STEP 3: Live Train Search
- URL: Click "Train Search" (/train-search)
- Action: Select popular route "Delhi -> Mumbai" or type NDLS to CSMT. Click "Search Trains".
- Technical Point: "Our backend trains.php securely proxies the RailRadar API using server-side cURL without exposing API keys."

STEP 4: Real-Time Train Running Status
- URL: Click "Train Status" (/train-status)
- Action: Enter train number 12919 (Malwa Express) and click "Track Live Status".
- Technical Point: "Here you see live telemetry with current station, delay in minutes, and an interactive station progress timeline."

STEP 5: User Authentication
- URL: Click "Login" (/login)
- Action: Sign in with registered credentials.
- Technical Point: "Credentials are encrypted with Bcrypt (PASSWORD_BCRYPT) in MySQL, and an HttpOnly session cookie is established."

STEP 6: AI-Powered Trip Planner
- URL: Click "Plan a Trip" (/plan-trip)
- Action: Select Source "Delhi", Destination "Jaipur", 3 Days, and click "Generate Smart AI Itinerary".
- Technical Point: "This sends parameters to backend/ai.php, which queries Google Gemini to construct an 8-part travel plan. If the API is rate-limited, our heuristic route engine steps in seamlessly."
- Action: Click "Create Trip" to save it.

STEP 7: My Trips Dashboard
- URL: Redirects to /my-trips
- Action: Show the newly created trip card. Click "Details" or "Delete".
- Technical Point: "Notice that trips are strictly scoped to the authenticated user's session ID in trips.php."

STEP 8: Budget Calculator
- URL: Click "Budget Calculator" (/budget)
- Action: Enter values for Hotels, Travel, Food.
- Technical Point: "This is a 100% reactive client-side calculator demonstrating pure state manipulation in React."
```

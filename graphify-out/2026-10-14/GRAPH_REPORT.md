# Graph Report - TRAVEL JOURNEY PLANNER  (2026-10-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 306 nodes · 504 edges · 41 communities (19 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `34436329`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.jsx
- api.js
- useAuth
- package.json
- compilerOptions
- getDestination
- getDestinations
- TrainSearch.jsx
- MyTrips.jsx
- BudgetCalculator
- TrainStatus.jsx
- supabase_schema_and_data.sql
- travel_planner.sql
- trips.php
- phase2_destinations.sql
- AIItineraryDisplay.jsx
- complete_production_database.sql
- phase3_places_hotels.sql
- trips
- phase4_auth.sql
- destinations
- Inter and Poppins Google Fonts Preconnect

## God Nodes (most connected - your core abstractions)
1. `TripPlanner()` - 16 edges
2. `compilerOptions` - 16 edges
3. `useAuth()` - 15 edges
4. `TripDetails()` - 14 edges
5. `getDestination()` - 11 edges
6. `generateAITripPlan()` - 10 edges
7. `deleteTrip()` - 9 edges
8. `updateTrip()` - 9 edges
9. `getDestinationById()` - 8 edges
10. `TrainStatus()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Agra Taj Mahal Destination Image` --references--> `DestinationDetails()`  [INFERRED]
  frontend/public/images/destinations/agra.jpg → frontend/src/pages/DestinationDetails.jsx
- `Goa Beach Coastline Destination Image` --references--> `DestinationCard()`  [INFERRED]
  frontend/public/images/destinations/goa.jpg → frontend/src/components/DestinationCard.jsx
- `handleDelete()` --calls--> `deleteTrip()`  [EXTRACTED]
  frontend/src/components/TripCard.jsx → frontend/src/services/api.js
- `Airplane Favicon Graphic` --references--> `HTML5 Web Application Shell`  [EXTRACTED]
  frontend/public/favicon.svg → frontend/index.html
- `getDestination()` --calls--> `getDestinationById()`  [EXTRACTED]
  frontend/src/services/api.js → frontend/src/data/travelData.js

## Import Cycles
- None detected.

## Communities (41 total, 3 thin omitted)

### Community 0 - "App.jsx"
Cohesion: 0.09
Nodes (23): HTML5 Web Application Shell, Airplane Favicon Graphic, App(), Footer(), About(), PAGES, TECH_STACK, FEATURES (+15 more)

### Community 1 - "api.js"
Cohesion: 0.15
Nodes (27): getSpecificDestinationGuide(), getSpecificRouteData(), DESTINATIONS_DATA, getDestinationById(), getPlacesByDestinationId(), POPULAR_SOURCE_CITIES, calcDays(), fmtDate() (+19 more)

### Community 2 - "useAuth"
Cohesion: 0.13
Nodes (23): UI SVG Sprite Icon Library, AUTH_LINKS, Navbar(), handleLogout(), PUBLIC_LINKS, AuthContext, AuthProvider(), login() (+15 more)

### Community 3 - "package.json"
Cohesion: 0.08
Nodes (24): axios, dependencies, axios, react, react-dom, react-router-dom, @vitejs/plugin-react, devDependencies (+16 more)

### Community 4 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution (+13 more)

### Community 5 - "getDestination"
Cohesion: 0.17
Nodes (15): Agra Taj Mahal Destination Image, HotelCard(), CATEGORY_ICONS, PlaceCard(), CATEGORY_ICONS, CATEGORY_TAGS, DestinationDetails(), fetchDestinationData() (+7 more)

### Community 6 - "getDestinations"
Cohesion: 0.18
Nodes (12): Goa Beach Coastline Destination Image, CATEGORY_ICONS, DestinationCard(), AIRecommendation(), handleSubmit(), inlineFormat(), renderMarkdown(), CATEGORIES (+4 more)

### Community 7 - "TrainSearch.jsx"
Cohesion: 0.22
Nodes (8): StationInput(), ALL_DAYS, TrainCard(), filterStations(), INDIAN_STATIONS, POPULAR_ROUTES, TrainSearch(), searchTrains()

### Community 8 - "MyTrips.jsx"
Cohesion: 0.29
Nodes (8): calcDays(), fmtDate(), getTripStatus(), TripCard(), handleDelete(), MyTrips(), fetchTripList(), getTrips()

### Community 9 - "BudgetCalculator"
Cohesion: 0.27
Nodes (6): BudgetCalculator(), pct(), CATEGORIES, formatINR(), INITIAL_BUDGET, toNum()

### Community 10 - "TrainStatus.jsx"
Cohesion: 0.39
Nodes (8): fmtTime(), getStatusInfo(), haltIcon(), relativeTime(), TrainStatus(), fetchLiveStatus(), validate(), getLiveTrainStatus()

### Community 11 - "supabase_schema_and_data.sql"
Cohesion: 0.43
Nodes (7): contact_messages, destinations, hotels, itinerary, places, trips, users

### Community 12 - "travel_planner.sql"
Cohesion: 0.43
Nodes (7): contact_messages, destinations, hotels, itinerary, places, trips, users

### Community 13 - "trips.php"
Cohesion: 0.48
Nodes (5): createTrip(), getAllTrips(), getOneTrip(), hasSourceLocationColumn(), updateTrip()

### Community 14 - "phase2_destinations.sql"
Cohesion: 0.29
Nodes (6): Delhi Red Fort Destination Image, Jaipur Hawa Mahal Destination Image, Manali Snow Mountains Destination Image, Mumbai Gateway of India Destination Image, Munnar Tea Plantations Destination Image, Varanasi Ghats Destination Image

### Community 15 - "AIItineraryDisplay.jsx"
Cohesion: 0.53
Nodes (4): AIItineraryDisplay(), escapeHtml(), formatInline(), renderItineraryHtml()

### Community 18 - "complete_production_database.sql"
Cohesion: 0.50
Nodes (3): `contact_messages`, `destinations`, `hotels`

### Community 19 - "phase3_places_hotels.sql"
Cohesion: 0.67
Nodes (3): hotels, places, destinations

### Community 20 - "trips"
Cohesion: 0.50
Nodes (3): destinations, trips, users

## Knowledge Gaps
- **70 isolated node(s):** `PAGES`, `TECH_STACK`, `FEATURES`, `SAMPLE_DESTINATIONS`, `STEPS` (+65 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 115 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `TripPlanner()` connect `api.js` to `App.jsx`, `useAuth`, `getDestinations`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `BudgetCalculator()` connect `BudgetCalculator` to `App.jsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `TripDetails()` connect `api.js` to `App.jsx`, `useAuth`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `PAGES`, `TECH_STACK`, `FEATURES` to the rest of the system?**
  _70 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0855614973262032 - nodes in this community are weakly interconnected._
- **Should `api.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1497326203208556 - nodes in this community are weakly interconnected._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.1349206349206349 - nodes in this community are weakly interconnected._
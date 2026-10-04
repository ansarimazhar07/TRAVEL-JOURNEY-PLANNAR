# Graph Report - TRAVEL JOURNEY PLANNER  (2026-09-30)

## Corpus Check
- 43 files · ~253,663 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 170 nodes · 189 edges · 26 communities (12 shown, 13 thin omitted)
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.87)
- Token cost: 12,500 input · 3,200 output

## Community Hubs (Navigation)
- External Services & PRD Specs
- TypeScript Configuration
- Destination Catalog Components
- MySQL Relational Schema
- Frontend Tooling & Scripts
- React Runtime Dependencies
- Destination Media & SQL Seeds
- Navigation Bar & UI Sprite
- Database Layer & Architecture
- Destination REST Endpoints
- About Page & Tech Showcase
- App Shell & Routing Hierarchy
- Home Page & Feature Showcase
- CORS & API Security Proxy
- Development Roadmap Phases
- Backend Setup Automation
- Minimal Storage Architecture
- Booking & Payment Scope
- Future Enhancements Roadmap
- Project Scope Boundaries
- External API Risk Strategy
- System Hardware Specifications
- Testing & Verification Protocols
- Server Input Sanitization
- Google Typography Assets

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `destinations` - 5 edges
3. `trips` - 5 edges
4. `DestinationDetails()` - 5 edges
5. `getDestinations()` - 5 edges
6. `scripts` - 4 edges
7. `Destinations()` - 4 edges
8. `Weather()` - 4 edges
9. `getDestination()` - 4 edges
10. `users` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Uniform JSON Response Envelope Protocol` --conceptually_related_to--> `getDestinations()`  [INFERRED]
  DOCUMENTATION/TRD.md → frontend/src/services/api.js
- `Destinations Entity Specification` --references--> `destinations`  [EXTRACTED]
  DOCUMENTATION/DATABASE.md → database/travel_planner.sql
- `Trips Entity Specification` --references--> `trips`  [EXTRACTED]
  DOCUMENTATION/DATABASE.md → database/travel_planner.sql
- `Travel Planner User Journey Flow` --references--> `NAV_LINKS`  [INFERRED]
  DOCUMENTATION/PRD.md → frontend/src/components/Navbar.jsx
- `Curated Tech Stack Selection` --conceptually_related_to--> `TECH_STACK`  [INFERRED]
  README.md → frontend/src/pages/About.jsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **External Travel API Delegation Architecture** — documentation_api_documentation_railradar_integration, documentation_api_documentation_amadeus_integration, documentation_api_documentation_gemini_integration, documentation_api_documentation_weather_integration, backend_cors [INFERRED 0.85]
- **Three Tier Full-Stack Architecture Pipeline** — documentation_trd_three_layer_architecture, frontend_src_services_api, backend_db, database_travel_planner [EXTRACTED 1.00]
- **Destination Browsing and Details Catalog Pipeline** — frontend_src_pages_destinations_destinations, frontend_src_pages_destinationdetails_destinationdetails, backend_destinations_getalldestinations, database_travel_planner_destinations [EXTRACTED 1.00]

## Communities (26 total, 13 thin omitted)

### Community 0 - "External Services & PRD Specs"
Cohesion: 0.10
Nodes (27): Amadeus Flights API Integration, Gemini AI Itinerary Integration, RailRadar API Integration, Live Weather Integration, Product Requirements Document (PRD), Project Overview & Course Principles, Budget Calculation Formula Verification, External API Graceful Degradation Strategy (+19 more)

### Community 1 - "TypeScript Configuration"
Cohesion: 0.09
Nodes (21): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution (+13 more)

### Community 2 - "Destination Catalog Components"
Cohesion: 0.16
Nodes (14): Uniform JSON Response Envelope Protocol, Agra Taj Mahal Destination Image, Goa Beach Coastline Destination Image, CATEGORY_ICONS, DestinationCard(), CATEGORY_ICONS, CATEGORY_TAGS, DestinationDetails() (+6 more)

### Community 3 - "MySQL Relational Schema"
Cohesion: 0.15
Nodes (16): contact_messages, destinations, hotels, itinerary, places, trips, users, Contact Messages Entity Specification (+8 more)

### Community 4 - "Frontend Tooling & Scripts"
Cohesion: 0.13
Nodes (14): Beginner Friendly Architecture Principle, devDependencies, typescript, vite, name, private, scripts, build (+6 more)

### Community 5 - "React Runtime Dependencies"
Cohesion: 0.18
Nodes (11): axios, dependencies, axios, react, react-dom, react-router-dom, @vitejs/plugin-react, react (+3 more)

### Community 6 - "Destination Media & SQL Seeds"
Cohesion: 0.29
Nodes (6): Delhi Red Fort Destination Image, Jaipur Hawa Mahal Destination Image, Manali Snow Mountains Destination Image, Mumbai Gateway of India Destination Image, Munnar Tea Plantations Destination Image, Varanasi Ghats Destination Image

### Community 7 - "Navigation Bar & UI Sprite"
Cohesion: 0.33
Nodes (5): Travel Planner User Journey Flow, Navbar & Secondary Route Hierarchy, UI SVG Sprite Icon Library, NAV_LINKS, Navbar()

### Community 8 - "Database Layer & Architecture"
Cohesion: 0.40
Nodes (4): Core Functional Requirements Specification, System Requirements Specification, Security Audit & SQL Injection Defense, 3-Layer Architecture Specification

### Community 10 - "About Page & Tech Showcase"
Cohesion: 0.40
Nodes (4): Curated Tech Stack Selection, About(), PAGES, TECH_STACK

### Community 11 - "App Shell & Routing Hierarchy"
Cohesion: 0.40
Nodes (4): 19 UI Page Routing Specification, HTML5 Web Application Shell, Airplane Favicon Graphic, App()

### Community 12 - "Home Page & Feature Showcase"
Cohesion: 0.40
Nodes (4): FEATURES, Home(), SAMPLE_DESTINATIONS, STEPS

## Knowledge Gaps
- **84 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 95 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `3-Layer Architecture Specification` connect `Database Layer & Architecture` to `Destination Catalog Components`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `Repository Directory Layout` connect `Destination REST Endpoints` to `External Services & PRD Specs`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `External Services & PRD Specs` be split into smaller, more focused modules?**
  _Cohesion score 0.09879032258064516 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Frontend Tooling & Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
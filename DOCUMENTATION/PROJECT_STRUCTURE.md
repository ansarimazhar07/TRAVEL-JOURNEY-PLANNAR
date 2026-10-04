# Project Structure

Keep the project beginner-friendly.

```text
travel-journey-planner/
|
+-- frontend/
|   |
|   +-- src/
|       |
|       +-- components/
|       |   +-- Navbar.jsx
|       |   +-- Footer.jsx
|       |   +-- DestinationCard.jsx
|       |   +-- PlaceCard.jsx
|       |   +-- HotelCard.jsx
|       |
|       +-- pages/
|       |   +-- Home.jsx
|       |   +-- About.jsx
|       |   +-- Destinations.jsx
|       |   +-- DestinationDetails.jsx
|       |   +-- Places.jsx
|       |   +-- PlaceDetails.jsx
|       |   +-- Hotels.jsx
|       |   +-- HotelDetails.jsx
|       |   +-- TrainSearch.jsx
|       |   +-- FlightSearch.jsx
|       |   +-- Weather.jsx
|       |   +-- AIRecommendation.jsx
|       |   +-- TripPlanner.jsx
|       |   +-- Itinerary.jsx
|       |   +-- Budget.jsx
|       |   +-- Login.jsx
|       |   +-- Register.jsx
|       |   +-- Profile.jsx
|       |   +-- Contact.jsx
|       |
|       +-- services/
|       |   +-- api.js
|       |
|       +-- App.jsx
|       +-- main.jsx
|       +-- index.css
|       |
|       +-- package.json
|
+-- backend/
|   |
|   +-- config.php
|   +-- db.php
|   |
|   +-- destinations.php
|   +-- places.php
|   +-- hotels.php
|   +-- trips.php
|   +-- itinerary.php
|   +-- contact.php
|   |
|   +-- trains.php
|   +-- flights.php
|   +-- ai.php
|   +-- weather.php
|
+-- database/
|   +-- travel_planner.sql
|
+-- docs/
|   +-- README.md
|   +-- PRD.md
|   +-- TRD.md
|   +-- API_DOCUMENTATION.md
|   +-- DATABASE.md
|   +-- UI_PAGES.md
|   +-- PROJECT_STRUCTURE.md
|   +-- SETUP.md
|   +-- TESTING.md
|   +-- FUTURE_SCOPE.md
|
+-- .gitignore
```

## Principle

Avoid unnecessary architecture such as:

- Redux
- Microservices
- Docker
- Complex state management
- Multiple backend frameworks
- Separate authentication servers

Use React state, PHP, MySQL, and simple API calls.

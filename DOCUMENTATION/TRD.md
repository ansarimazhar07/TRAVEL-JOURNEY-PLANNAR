# Technical Requirements Document (TRD)

## 1. Architecture

The project uses a simple three-layer structure.

```text
React Frontend
      |
      | HTTP / JSON
      v
PHP REST API
      |
      +------> MySQL
      |
      +------> RailRadar API
      +------> Amadeus API
      +------> Gemini API
      +------> Weather API
```

## 2. Frontend

### Required

- Node.js
- React.js
- React Router
- CSS
- Fetch API or Axios

### Suggested Structure

```text
frontend/
  src/
    components/
      Navbar.jsx
      Footer.jsx
      DestinationCard.jsx
      HotelCard.jsx
      PlaceCard.jsx
    pages/
      Home.jsx
      About.jsx
      Destinations.jsx
      DestinationDetails.jsx
      Places.jsx
      PlaceDetails.jsx
      Hotels.jsx
      HotelDetails.jsx
      TrainSearch.jsx
      FlightSearch.jsx
      Weather.jsx
      AIRecommendation.jsx
      TripPlanner.jsx
      Itinerary.jsx
      Budget.jsx
      Login.jsx
      Register.jsx
      Profile.jsx
      Contact.jsx
    services/
      api.js
    App.jsx
    main.jsx
```

## 3. Backend

PHP handles database operations and external API requests.

```text
backend/
  db.php
  config.php
  destinations.php
  places.php
  hotels.php
  trips.php
  itinerary.php
  contact.php
  trains.php
  flights.php
  ai.php
  weather.php
```

## 4. Database

MySQL is used for persistent project data.

Main tables:

- users
- destinations
- places
- hotels
- trips
- itinerary
- contact_messages

## 5. REST API

### Destinations

```http
GET /api/destinations.php
GET /api/destinations.php?id=1
```

### Places

```http
GET /api/places.php?destination_id=1
GET /api/places.php?id=1
```

### Hotels

```http
GET /api/hotels.php?destination_id=1
```

### Trips

```http
GET /api/trips.php?user_id=1
POST /api/trips.php
PUT /api/trips.php?id=1
DELETE /api/trips.php?id=1
```

### Itinerary

```http
GET /api/itinerary.php?trip_id=1
POST /api/itinerary.php
DELETE /api/itinerary.php?id=1
```

### External APIs

```http
GET /api/trains.php
GET /api/flights.php
POST /api/ai.php
GET /api/weather.php
```

## 6. JSON Response Format

Successful response:

```json
{
  "success": true,
  "data": []
}
```

Error response:

```json
{
  "success": false,
  "message": "Unable to retrieve data"
}
```

## 7. Security Requirements

- Store API keys only in PHP/server environment variables or configuration outside public frontend code.
- Never put Gemini, Amadeus, or RailRadar secrets in React source code.
- Use prepared SQL statements.
- Hash passwords using PHP password_hash().
- Validate user input.
- Escape output where required.

## 8. API Error Handling

If an external API fails:

```text
API Request
   |
   +--> Success --> Display results
   |
   +--> Failure --> Display simple message
```

Example:

> Train information is temporarily unavailable. Please try again later.

## 9. Development Environment

Recommended beginner setup:

- Windows
- VS Code
- XAMPP
- MySQL/phpMyAdmin
- Node.js
- Chrome/Edge

## 10. Deployment

For the course project, local deployment using XAMPP is sufficient.

Optional later deployment:

- React frontend on a static hosting platform.
- PHP backend on PHP-compatible hosting.
- MySQL on hosted database.

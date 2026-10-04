# API Documentation

## 1. Internal PHP REST API

The React application should communicate with PHP instead of directly exposing external API keys.

Base URL example:

```text
http://localhost/travel-planner/backend/api
```

## 2. Destinations

### Get all destinations

```http
GET /destinations.php
```

### Get one destination

```http
GET /destinations.php?id=1
```

Example response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Goa",
    "description": "Popular beach destination",
    "best_time": "November to February"
  }
}
```

## 3. Places

```http
GET /places.php?destination_id=1
```

## 4. Hotels

```http
GET /hotels.php?destination_id=1
```

## 5. Trips

### Create

```http
POST /trips.php
Content-Type: application/json
```

```json
{
  "user_id": 1,
  "destination_id": 1,
  "start_date": "2026-10-15",
  "end_date": "2026-10-19",
  "travellers": 2
}
```

### Read

```http
GET /trips.php?user_id=1
```

### Update

```http
PUT /trips.php?id=1
```

### Delete

```http
DELETE /trips.php?id=1
```

## 6. RailRadar Integration

Purpose: obtain train information between stations.

Flow:

```text
React
  |
  v
PHP trains.php
  |
  v
RailRadar
  |
  v
PHP
  |
  v
React
```

Keep the exact RailRadar URL, authentication method, and request parameters in the project configuration based on the current RailRadar API documentation.

The UI should request only the information needed by the project, such as:

- Train name/number
- Source
- Destination
- Departure
- Arrival
- Status when available

Do not build ticket booking.

## 7. Amadeus Integration

Purpose: search flight offers.

Typical inputs:

- Origin airport/city code
- Destination airport/city code
- Departure date
- Number of adults

The PHP backend handles Amadeus authentication and requests.

The React page displays simple results:

- Airline
- Departure
- Arrival
- Duration
- Price

Do not build flight booking.

## 8. Gemini Integration

Purpose: generate a simple travel recommendation.

Example request to PHP:

```json
{
  "destination": "Goa",
  "days": 4,
  "budget": 20000,
  "interests": ["beaches", "food", "historical"]
}
```

PHP creates a simple prompt and sends it to Gemini.

Example prompt:

```text
Create a simple 4-day travel recommendation for Goa.

Budget: INR 20000
Interests: beaches, food, historical

Give:
1. Daily plan
2. Places to visit
3. Simple budget tips

Keep the answer short and practical.
```

## 9. Weather Integration

Inputs:

```text
city
```

Outputs:

```text
temperature
weather
humidity
wind
```

The exact provider can be changed without affecting the rest of the application.

## 10. API Key Rule

External API keys are private.

Never do this:

```javascript
const API_KEY = "secret-key";
```

inside React.

Use:

```text
React -> PHP -> External API
```

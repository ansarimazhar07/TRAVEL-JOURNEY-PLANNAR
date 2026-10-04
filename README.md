# Travel Journey Planner ✈️

A simple travel planning web application built as a **3rd-year engineering college Web Technologies project**.

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React.js + Vite + React Router      |
| Backend   | PHP 8 + REST API + PDO              |
| Database  | MySQL                               |
| AI        | Google Gemini API                   |
| Flights   | Amadeus API                         |
| Trains    | RailRadar API                       |
| Weather   | Weather API                         |
| Maps      | Leaflet + OpenStreetMap             |

## Features

- Explore travel destinations
- View tourist places and hotels
- Search real train routes
- Search flight offers
- AI travel recommendations (Gemini)
- Live weather information
- Trip planner with itinerary
- Budget calculator
- User registration & login
- Contact form

## Project Structure

```
travel-journey-planner/
├── frontend/       ← React app (Vite)
├── backend/        ← PHP REST API
├── database/       ← MySQL schema (travel_planner.sql)
├── DOCUMENTATION/  ← Project docs
└── README.md
```

## Setup Instructions

See [DOCUMENTATION/SETUP.md](DOCUMENTATION/SETUP.md) for full setup.

### Quick Start

**1. Database**
```sql
-- In phpMyAdmin or MySQL CLI:
source database/travel_planner.sql
```

**2. Backend (PHP)**
- Copy your XAMPP/WAMP `www` or `htdocs` folder
- Open `backend/config.php` and fill in your DB credentials and API keys
- The PHP files are served via Apache

**3. Frontend (React)**
```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`

## API Keys Required

| API       | Where to get it                     | Phase |
|-----------|-------------------------------------|-------|
| Gemini    | https://ai.google.dev               | 10    |
| Amadeus   | https://developers.amadeus.com      | 9     |
| RailRadar | https://railradar.in/api            | 8     |
| Weather   | https://openweathermap.org/api      | 11    |

> ⚠️ Never commit `backend/config.php` to Git. It is listed in `.gitignore`.

## Development Phases

| Phase | Feature                     | Status      |
|-------|-----------------------------|-------------|
| 1     | Setup + Home + About        | ✅ Done     |
| 2     | Destinations                | ⏳ Upcoming |
| 3     | Places & Hotels             | ⏳ Upcoming |
| 4     | Authentication              | ⏳ Upcoming |
| 5     | Trip Planner                | ⏳ Upcoming |
| 6     | Itinerary                   | ⏳ Upcoming |
| 7     | Budget Calculator           | ⏳ Upcoming |
| 8     | Train Search (RailRadar)    | ⏳ Upcoming |
| 9     | Flight Search (Amadeus)     | ⏳ Upcoming |
| 10    | AI Recommendations (Gemini) | ⏳ Upcoming |
| 11    | Weather                     | ⏳ Upcoming |
| 12    | Maps (Leaflet)              | ⏳ Upcoming |
| 13    | Contact Form                | ⏳ Upcoming |
| 14    | UI Improvements             | ⏳ Upcoming |
| 15    | Testing & Docs              | ⏳ Upcoming |

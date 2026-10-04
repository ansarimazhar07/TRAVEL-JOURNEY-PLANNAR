# Product Requirements Document (PRD)

## 1. Product Name

**Travel Journey Planner**

## 2. Project Type

Web Technologies course project.

## 3. Problem Statement

Planning a trip often requires checking transport, places, hotels, weather, and budget from different sources. This project provides a simple website where a user can view travel information and create a basic journey plan from one place.

## 4. Product Objective

The application should:

1. Help users explore travel destinations.
2. Display useful information about places and hotels.
3. Show real train information through RailRadar.
4. Show flight offers through Amadeus.
5. Generate simple AI travel recommendations through Gemini.
6. Allow users to create a basic trip and itinerary.
7. Calculate an estimated trip budget.

## 5. Target Users

- College students
- Individual travellers
- Families planning a simple trip
- Users looking for basic travel information

## 6. Scope

### Included

- Destination browsing
- Destination details
- Tourist places
- Hotel information
- Train search
- Flight search
- AI recommendation
- Weather
- Trip creation
- Itinerary
- Budget calculator
- Basic user authentication
- Contact form

### Not Included

- Online ticket booking
- Hotel booking
- Payment gateway
- Cancellation/refund system
- Complex recommendation algorithms
- Admin analytics
- Social networking
- Real-time chat

## 7. Main Pages

1. Home
2. About
3. Destinations
4. Destination Details
5. Places
6. Place Details
7. Hotels
8. Hotel Details
9. Train Search
10. Flight Search
11. Weather
12. AI Recommendation
13. Trip Planner
14. My Itinerary
15. Budget Calculator
16. Login
17. Register
18. Profile
19. Contact

## 8. User Flow

```text
Home
  |
  +--> Explore Destinations
  |       |
  |       +--> Destination Details
  |               |
  |               +--> Places
  |               +--> Hotels
  |               +--> Weather
  |
  +--> Plan Trip
          |
          +--> Train Search
          +--> Flight Search
          +--> AI Recommendation
          +--> Itinerary
          +--> Budget
          |
          +--> My Trip
```

## 9. Functional Requirements

### FR-01 Home

The system shall display the project introduction, popular destinations, and links to important features.

### FR-02 Destinations

The system shall display destinations stored in MySQL.

### FR-03 Destination Details

The system shall display description, best time, image, and related places for a selected destination.

### FR-04 Places

The system shall display tourist places associated with a destination.

### FR-05 Hotels

The system shall display simple hotel information stored in MySQL.

### FR-06 Train Search

The system shall accept source, destination, and date and request train information through the PHP backend and RailRadar API.

### FR-07 Flight Search

The system shall accept origin, destination, date, and passengers and request flight offers through the PHP backend and Amadeus API.

### FR-08 AI Recommendation

The system shall accept destination, number of days, budget, and interests and send a simple prompt to Gemini.

### FR-09 Weather

The system shall display weather information for a selected destination.

### FR-10 Trip

A logged-in user shall be able to create and save a trip.

### FR-11 Itinerary

A user shall be able to add basic activities to a trip.

### FR-12 Budget

The system shall calculate the total of travel, hotel, food, activities, and other expenses.

### FR-13 Authentication

The system shall provide basic registration and login.

### FR-14 Contact

The system shall allow users to submit a simple contact message.

## 10. Non-Functional Requirements

- Simple and beginner-friendly interface.
- Responsive on desktop and mobile.
- API keys must not be exposed in React frontend code.
- Passwords must be stored securely using password hashing.
- API failures should show a simple error message.
- Pages should load without unnecessary complexity.

## 11. Success Criteria

The project is considered successful when:

- React frontend communicates with PHP REST APIs.
- PHP communicates with MySQL.
- Train search works with RailRadar when the API is available.
- Flight search works with Amadeus when credentials and quota are available.
- Gemini generates a basic recommendation.
- Weather information can be displayed.
- A user can create a trip and itinerary.
- Budget calculation works correctly.
- At least 15 pages are implemented.

## 12. Future Scope

Possible future improvements include online booking, payment integration, better recommendations, route optimization, notifications, and a mobile application.

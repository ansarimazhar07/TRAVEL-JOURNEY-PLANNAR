import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Auth context — wraps the whole app to share login state
import { AuthProvider } from './context/AuthContext'

// Layout components
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

// Phase 1 pages (fully implemented)
import Home  from './pages/Home.jsx'
import About from './pages/About.jsx'

// Phase 2 pages (fully implemented)
import Destinations       from './pages/Destinations.jsx'
import DestinationDetails from './pages/DestinationDetails.jsx'

// Phase 3 pages (fully implemented)
import Places       from './pages/Places.jsx'
import PlaceDetails from './pages/PlaceDetails.jsx'
import Hotels       from './pages/Hotels.jsx'
import HotelDetails from './pages/HotelDetails.jsx'

// Phase 4 pages — Authentication (fully implemented)
import Login    from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile  from './pages/Profile.jsx'

// Phase 5 pages — Trip Planner (fully implemented)
import TripPlanner from './pages/TripPlanner.jsx'
import MyTrips     from './pages/MyTrips.jsx'
import TripDetails from './pages/TripDetails.jsx'

// Phase 7 — Budget Calculator (fully implemented)
import BudgetCalculator from './pages/BudgetCalculator.jsx'

// Phase 8 — Train Search (between stations, RailRadar)
import TrainSearch from './pages/TrainSearch.jsx'
// Phase 8 — Live Train Status (RailRadar Live)
import TrainStatus from './pages/TrainStatus.jsx'

// Phase 9 — AI Travel Recommendation (Gemini)
import AIRecommendation from './pages/AIRecommendation.jsx'

// Placeholder pages (replaced in later phases)
import {
  FlightSearch,
  Weather,
  Itinerary,
  Contact,
  NotFound,
} from './pages/Placeholders.jsx'

// App layout wrapper — renders Navbar, page content, and Footer
function Layout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        {children}
      </div>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* ---- Phase 1 — Core pages ---- */}
            <Route path="/"     element={<Home />}  />
            <Route path="/about" element={<About />} />

            {/* ---- Phase 2 — Destinations ---- */}
            <Route path="/destinations"        element={<Destinations />}       />
            <Route path="/destinations/:id"    element={<DestinationDetails />} />

            {/* ---- Phase 3 — Places & Hotels ---- */}
            <Route path="/places"              element={<Places />}        />
            <Route path="/places/:id"          element={<PlaceDetails />}  />
            <Route path="/hotels"              element={<Hotels />}        />
            <Route path="/hotels/:id"          element={<HotelDetails />}  />

            {/* ---- Phase 4 — Authentication ---- */}
            <Route path="/login"    element={<Login />}    />
            <Route path="/register" element={<Register />} />
            <Route path="/profile"  element={<Profile />}  />

            {/* ---- Phase 5 — Trip Planner ---- */}
            <Route path="/plan-trip"  element={<TripPlanner />} />
            <Route path="/my-trips"   element={<MyTrips />}     />
            <Route path="/trip/:id"   element={<TripDetails />} />

            {/* ---- Phase 6 — Itinerary ---- */}
            <Route path="/itinerary" element={<Itinerary />} />

            {/* ---- Phase 7 — Budget Calculator (fully implemented) ---- */}
            <Route path="/budget" element={<BudgetCalculator />} />

            {/* ---- Train Search Between Stations ---- */}
            <Route path="/train-search" element={<TrainSearch />} />
            <Route path="/trains"       element={<TrainSearch />} />

            {/* ---- Live Train Status (RailRadar Live Tracking) ---- */}
            <Route path="/train-status" element={<TrainStatus />} />
            <Route path="/live-train"   element={<TrainStatus />} />

            {/* ---- Phase 9 — AI Travel Recommendation ---- */}
            <Route path="/ai-recommendation" element={<AIRecommendation />} />

            {/* ---- Future — Flights (placeholder) ---- */}
            <Route path="/flights" element={<FlightSearch />} />

            {/* ---- Phase 11 — Weather ---- */}
            <Route path="/weather" element={<Weather />} />

            {/* ---- Phase 13 — Contact ---- */}
            <Route path="/contact" element={<Contact />} />

            {/* ---- 404 ---- */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

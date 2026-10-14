import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Auth context — wraps the whole app to share login state
import { AuthProvider } from './context/AuthContext'

// Layout components
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

// Public informational & landing pages
import Home  from './pages/Home.jsx'
import About from './pages/About.jsx'

// Destination catalog and detailed guide pages
import Destinations       from './pages/Destinations.jsx'
import DestinationDetails from './pages/DestinationDetails.jsx'

// Tourist attractions and accommodation directory pages
import Places       from './pages/Places.jsx'
import PlaceDetails from './pages/PlaceDetails.jsx'
import Hotels       from './pages/Hotels.jsx'
import HotelDetails from './pages/HotelDetails.jsx'

// User authentication & profile management pages
import Login    from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Profile  from './pages/Profile.jsx'

// Trip planner & user itinerary management pages
import TripPlanner from './pages/TripPlanner.jsx'
import MyTrips     from './pages/MyTrips.jsx'
import TripDetails from './pages/TripDetails.jsx'

// Interactive client-side budget estimation tool
import BudgetCalculator from './pages/BudgetCalculator.jsx'

// Real-time railway services (powered by RailRadar API)
import TrainSearch from './pages/TrainSearch.jsx'
import TrainStatus from './pages/TrainStatus.jsx'

// AI-powered travel recommendation & itinerary planner (Google Gemini)
import AIRecommendation from './pages/AIRecommendation.jsx'

// Placeholder pages for future roadmap modules
import {
  FlightSearch,
  Weather,
  Itinerary,
  Contact,
  NotFound,
} from './pages/Placeholders.jsx'

// Top-level layout wrapper rendering sticky Navbar, main content view, and Footer
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
            {/* Public landing and informational routes */}
            <Route path="/"     element={<Home />}  />
            <Route path="/about" element={<About />} />

            {/* Destination discovery and detail routes */}
            <Route path="/destinations"             element={<Destinations />}       />
            <Route path="/destinations/:id"         element={<DestinationDetails />} />
            <Route path="/destination-explorer"     element={<Destinations />}       />
            <Route path="/destination-explorer/:id" element={<DestinationDetails />} />

            {/* Attractions (Places) and Accommodations (Hotels) routes */}
            <Route path="/places"              element={<Places />}        />
            <Route path="/places/:id"          element={<PlaceDetails />}  />
            <Route path="/hotels"              element={<Hotels />}        />
            <Route path="/hotels/:id"          element={<HotelDetails />}  />

            {/* User authentication routes */}
            <Route path="/login"    element={<Login />}    />
            <Route path="/register" element={<Register />} />
            <Route path="/profile"  element={<Profile />}  />

            {/* Trip management and planning routes */}
            <Route path="/plan-trip"    element={<TripPlanner />} />
            <Route path="/trip-planner" element={<TripPlanner />} />
            <Route path="/my-trips"     element={<MyTrips />}     />
            <Route path="/trip/:id"     element={<TripDetails />} />

            {/* Day-by-day itinerary roadmap placeholder */}
            <Route path="/itinerary" element={<Itinerary />} />

            {/* Trip budget calculator route */}
            <Route path="/budget" element={<BudgetCalculator />} />

            {/* Railway search & live status routes (RailRadar API) */}
            <Route path="/train-search" element={<TrainSearch />} />
            <Route path="/trains"       element={<TrainSearch />} />
            <Route path="/train-status" element={<TrainStatus />} />
            <Route path="/live-train"   element={<TrainStatus />} />

            {/* AI itinerary generator route (Google Gemini) */}
            <Route path="/ai-recommendation" element={<AIRecommendation />} />

            {/* Future roadmap placeholder routes */}
            <Route path="/flights" element={<FlightSearch />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/contact" element={<Contact />} />

            {/* Catch-all 404 Not Found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

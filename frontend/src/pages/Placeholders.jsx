import React from 'react'
import { Link } from 'react-router-dom'

// Generic placeholder shown for pages not yet implemented
// Each future phase will replace these with real content.
function ComingSoon({ title, icon, description, phase }) {
  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <h1>{icon} {title}</h1>
          <p>{description}</p>
        </div>
      </div>

      <div className="container">
        <div className="empty-state" style={{ marginTop: '40px' }}>
          <div className="empty-icon">{icon}</div>
          <h3>{title}</h3>
          <p style={{ marginBottom: '8px' }}>{description}</p>
          {phase && (
            <p style={{ marginBottom: '24px' }}>
              <span className="badge badge-accent">Coming in {phase}</span>
            </p>
          )}
          <Link to="/" className="btn btn-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}

// ---- Individual placeholder pages ----
// Note: Destinations and DestinationDetails are now real pages (Phase 2)

export function Places() {
  return <ComingSoon
    title="Tourist Places"
    icon="🏛️"
    description="Explore tourist attractions at each destination."
    phase="Phase 3"
  />
}

export function PlaceDetails() {
  return <ComingSoon
    title="Place Details"
    icon="🏛️"
    description="Detailed information about a specific tourist place."
    phase="Phase 3"
  />
}

export function Hotels() {
  return <ComingSoon
    title="Hotels"
    icon="🏨"
    description="Browse hotel options at your chosen destination."
    phase="Phase 3"
  />
}

export function HotelDetails() {
  return <ComingSoon
    title="Hotel Details"
    icon="🏨"
    description="Detailed information about a specific hotel."
    phase="Phase 3"
  />
}

export function TrainSearch() {
  return <ComingSoon
    title="Train Search"
    icon="🚂"
    description="Search real train routes between cities."
    phase="Phase 8"
  />
}

export function FlightSearch() {
  return <ComingSoon
    title="Flight Search"
    icon="✈️"
    description="Find flight offers between destinations."
    phase="Phase 9"
  />
}

export function Weather() {
  return <ComingSoon
    title="Weather"
    icon="🌤️"
    description="Check current weather at any destination."
    phase="Phase 11"
  />
}

export function AIRecommendation() {
  return <ComingSoon
    title="AI Travel Recommendations"
    icon="🤖"
    description="Get personalised travel itineraries powered by Gemini AI."
    phase="Phase 10"
  />
}

// PlanTrip and MyTrips are now real pages — implemented in Phase 5.
// See: frontend/src/pages/TripPlanner.jsx, MyTrips.jsx, TripDetails.jsx

export function Itinerary() {
  return <ComingSoon
    title="My Itinerary"
    icon="📅"
    description="View and manage day-by-day activities for your trip."
    phase="Phase 6"
  />
}

// Budget is now a real page — implemented in Phase 7.
// See: frontend/src/pages/BudgetCalculator.jsx

// Login, Register, and Profile are now real pages — implemented in Phase 4.
// See: frontend/src/pages/Login.jsx, Register.jsx, Profile.jsx

export function Contact() {
  return <ComingSoon
    title="Contact Us"
    icon="📬"
    description="Get in touch with us. We'd love to hear from you."
    phase="Phase 13"
  />
}

export function NotFound() {
  return (
    <main>
      <div className="container">
        <div className="empty-state" style={{ marginTop: '80px' }}>
          <div className="empty-icon">🔍</div>
          <h3>Page Not Found</h3>
          <p style={{ marginBottom: '24px' }}>
            The page you're looking for doesn't exist.
          </p>
          <Link to="/" className="btn btn-primary">← Back to Home</Link>
        </div>
      </div>
    </main>
  )
}

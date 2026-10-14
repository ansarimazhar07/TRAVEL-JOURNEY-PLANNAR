import React from 'react'
import { Link } from 'react-router-dom'

// Roadmap placeholder component shown for features planned in upcoming releases
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
              <span className="badge badge-accent">{phase}</span>
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

// --- Future Scope Placeholder Pages ---
export function FlightSearch() {
  return <ComingSoon
    title="Flight Search"
    icon="✈️"
    description="Find flight offers between destinations."
    phase="Future Scope"
  />
}

export function Weather() {
  return <ComingSoon
    title="Weather"
    icon="🌤️"
    description="Check current weather at any destination."
    phase="Future Scope"
  />
}

export function Itinerary() {
  return <ComingSoon
    title="My Itinerary"
    icon="📅"
    description="View and manage day-by-day activities for your trip."
    phase="Upcoming Enhancement"
  />
}

export function Contact() {
  return <ComingSoon
    title="Contact Us"
    icon="📬"
    description="Get in touch with us. We'd love to hear from you."
    phase="Upcoming Enhancement"
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

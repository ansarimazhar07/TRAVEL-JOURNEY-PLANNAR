import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

// Feature cards shown on the home page
const FEATURES = [
  {
    icon: '🗺️',
    title: 'Explore Destinations',
    desc: 'Browse popular travel destinations with detailed info, photos, and local attractions.',
  },
  {
    icon: '🚂',
    title: 'Train Search',
    desc: 'Search real train routes between cities with departure times and fare details.',
  },
  {
    icon: '✈️',
    title: 'Flight Search',
    desc: 'Find flight offers with airline, price, duration, and schedule information.',
  },
  {
    icon: '🤖',
    title: 'AI Recommendations',
    desc: 'Get personalised travel itineraries powered by Gemini AI based on your interests.',
  },
  {
    icon: '🌤️',
    title: 'Weather Check',
    desc: 'Check current weather conditions for any destination before you travel.',
  },
  {
    icon: '💰',
    title: 'Budget Calculator',
    desc: 'Plan your travel budget for hotels, food, activities and more.',
  },
]

// Sample destination previews (replaced by real data in Phase 2)
const SAMPLE_DESTINATIONS = [
  { icon: '🏯', name: 'Jaipur', country: 'India', desc: 'The Pink City — forts, palaces and rich culture.' },
  { icon: '🏖️', name: 'Goa',    country: 'India', desc: 'Sun, sand and sea — India\'s beach paradise.' },
  { icon: '🏔️', name: 'Manali', country: 'India', desc: 'Snow-capped mountains and adventure sports.' },
]

// How it works steps
const STEPS = [
  { number: '1', title: 'Choose Destination', desc: 'Browse our destination list and pick your dream location.' },
  { number: '2', title: 'Search Trains & Flights', desc: 'Find the best transport options to reach your destination.' },
  { number: '3', title: 'Plan Your Trip', desc: 'Create a trip, add an itinerary, and calculate your budget.' },
  { number: '4', title: 'Travel!', desc: 'Pack your bags and enjoy your journey!' },
]

function Home() {
  return (
    <main>

      {/* ---- Hero Section ---- */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-badge">🌍 Your Journey Starts Here</div>

          <h1>
            Plan Your Perfect <span className="highlight">Journey</span>
          </h1>

          <p>
            Explore destinations, search trains &amp; flights, get AI travel
            recommendations and create your personalised itinerary — all in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/destinations" className="hero-btn-white">
              Explore Destinations
            </Link>
            <Link to="/plan-trip" className="hero-btn-outline">
              Plan a Trip
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Stats Bar ---- */}
      <div className="hero-stats">
        <div className="container hero-stats-inner">
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Destinations</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Trips Planned</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">Real-time</div>
            <div className="stat-label">Train &amp; Flight Data</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">AI</div>
            <div className="stat-label">Powered Recommendations</div>
          </div>
        </div>
      </div>

      {/* ---- Features Section ---- */}
      <section className="features">
        <div className="container">
          <div className="features-header">
            <h2 className="section-title">Everything You Need to Travel</h2>
            <p className="section-subtitle">
              All the tools you need to plan a great trip, in one simple website.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((feature, index) => (
              <div className="feature-card" key={index}>
                <span className="feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Destinations Preview Section ---- */}
      <section className="destinations-preview">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Popular Destinations</h2>
              <p className="section-subtitle" style={{ margin: 0 }}>
                Handpicked destinations to inspire your next trip.
              </p>
            </div>
            <Link to="/destinations" className="btn btn-outline">
              View All →
            </Link>
          </div>

          <div className="dest-cards">
            {SAMPLE_DESTINATIONS.map((dest, index) => (
              <div className="dest-card" key={index}>
                {/* Placeholder image with emoji — replaced by real images in Phase 2 */}
                <div className="dest-card-img">{dest.icon}</div>
                <div className="dest-card-body">
                  <h3>{dest.name}</h3>
                  <p>{dest.desc}</p>
                  <div className="dest-card-meta">
                    <span className="badge badge-primary">{dest.country}</span>
                    <Link to="/destinations" className="btn btn-sm btn-primary">
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How It Works ---- */}
      <section className="how-it-works">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Plan your trip in 4 simple steps.</p>
          </div>

          <div className="steps-grid">
            {STEPS.map(step => (
              <div className="step-item" key={step.number}>
                <div className="step-number">{step.number}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA Section ---- */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Start Your Journey?</h2>
          <p>
            Create your free account and start planning your next adventure today.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="hero-btn-white">
              Register Free
            </Link>
            <Link to="/about" className="hero-btn-outline">
              Learn More
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}

export default Home

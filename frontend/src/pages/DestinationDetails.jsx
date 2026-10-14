import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getDestination, getPlaces } from '../services/api.js'
import './DestinationDetails.css'

// Category → emoji fallback icon
const CATEGORY_ICONS = {
  'Beach':        '🏖️',
  'Mountain':     '🏔️',
  'Heritage':     '🏯',
  'Hill Station': '🌿',
  'Spiritual':    '🛕',
  'City':         '🌆',
  'default':      '🗺️',
}

// Category → "Popular for" tags shown in sidebar
const CATEGORY_TAGS = {
  'Beach':        ['Beaches', 'Water Sports', 'Seafood', 'Nightlife', 'Sunsets'],
  'Mountain':     ['Trekking', 'Skiing', 'Adventure Sports', 'Scenic Views', 'Alpine Cafes'],
  'Heritage':     ['Forts & Palaces', 'History', 'Architecture', 'Museums', 'Bazaars'],
  'Hill Station': ['Tea Gardens', 'Nature Walks', 'Wildlife', 'Cool Climate', 'Waterfalls'],
  'Spiritual':    ['Temples', 'Ghats', 'Meditation', 'Pilgrimage', 'Aarti Ceremonies'],
  'City':         ['Street Food', 'Shopping', 'Nightlife', 'Monuments', 'Culture'],
  'default':      ['Sightseeing', 'Local Culture', 'Photography', 'Exploration'],
}

function DestinationDetails() {
  // Get the :id from URL e.g. /destinations/1
  const { id } = useParams()
  const navigate = useNavigate()

  // Destination data & places
  const [destination, setDestination] = useState(null)
  const [placesList, setPlacesList]   = useState([])

  // Active budget tier view (Backpacker, Mid-range, Luxury)
  const [budgetTier, setBudgetTier]   = useState('midrange')

  // Loading and error states
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [notFound, setNotFound]       = useState(false)
  const [imgFailed, setImgFailed]     = useState(false)

  // ---- Fetch destination details & places on load ----
  useEffect(() => {
    fetchDestinationData()
    window.scrollTo(0, 0)
  }, [id])

  async function fetchDestinationData() {
    setLoading(true)
    setError(null)
    setNotFound(false)
    setImgFailed(false)

    try {
      const data = await getDestination(id)
      setDestination(data)

      // If destination already has places array, use it; otherwise fetch places from API
      if (Array.isArray(data.places) && data.places.length > 0) {
        setPlacesList(data.places)
      } else {
        try {
          const placesData = await getPlaces(id)
          setPlacesList(placesData || [])
        } catch {
          setPlacesList([])
        }
      }
    } catch (err) {
      if (err.message === 'NOT_FOUND') {
        setNotFound(true)
      } else {
        setError(err.message || 'Failed to load destination details.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ---- Render: Loading ----
  if (loading) {
    return (
      <main className="dest-detail-page">
        <div className="container" style={{ padding: '90px 0', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p className="loading-text" style={{ marginTop: '16px' }}>
            Loading destination explorer details...
          </p>
        </div>
      </main>
    )
  }

  // ---- Render: Not Found ----
  if (notFound) {
    return (
      <main className="dest-detail-page">
        <div className="container" style={{ padding: '70px 0' }}>
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Destination Not Found</h3>
            <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
              We couldn't locate a travel destination with ID <strong>{id}</strong>.
            </p>
            <Link to="/destinations" className="btn btn-primary">
              ← Back to Destination Explorer
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ---- Render: Error ----
  if (error || !destination) {
    return (
      <main className="dest-detail-page">
        <div className="container" style={{ paddingTop: '50px' }}>
          <Link to="/destinations" className="detail-back-link">
            ← Back to Destination Explorer
          </Link>
          <div className="alert alert-error" style={{ marginTop: '14px' }}>
            ⚠️ {error || 'Something went wrong.'}
          </div>
          <button
            className="btn btn-primary"
            onClick={fetchDestinationData}
            style={{ marginTop: '16px' }}
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  const {
    name,
    state,
    country,
    description,
    image_url,
    category,
    best_time,
    ideal_duration,
    ideal_for,
    nearest_station,
    why_visit,
    budget,
    travel_tips,
  } = destination

  const fallbackIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS['default']
  const tags = CATEGORY_TAGS[category] || CATEGORY_TAGS['default']
  const hasImage = Boolean(image_url && image_url.trim() !== '' && !imgFailed)

  // Default fallback tips if not present in custom data
  const tips = travel_tips && travel_tips.length > 0 ? travel_tips : [
    {
      icon: '👟',
      title: 'Comfortable Footwear & Attire',
      desc: 'Expect substantial walking when visiting monuments, hill slopes, and bustling local markets.'
    },
    {
      icon: '🚖',
      title: 'Local Transport Options',
      desc: 'Use rideshare apps or confirm auto-rickshaw/taxi fares before embarking on journeys.'
    },
    {
      icon: '🎫',
      title: 'Book Entry Passes Online',
      desc: 'Skip long ticketing queues by reserving tickets online through official portals where applicable.'
    },
    {
      icon: '🍛',
      title: 'Sample Regional Specialties',
      desc: 'Try authentic local cuisine at reputable traditional eateries and food streets.'
    }
  ]

  // Default fallback reasons to visit if not present
  const highlights = why_visit && why_visit.length > 0 ? why_visit : [
    `Experience the rich culture and picturesque landmarks that define ${name}.`,
    `Discover renowned historic monuments, natural sceneries, and local attractions.`,
    `Delight in authentic culinary delicacies and lively shopping bazaars.`,
    `Ideal getaway offering activities suited for solo travelers, couples, and families.`
  ]

  return (
    <main className="dest-detail-page">
      {/* ============================================================
          HERO SECTION
          ============================================================ */}
      <div className="detail-hero">
        {hasImage ? (
          <img
            className="detail-hero-img"
            src={image_url}
            alt={`${name} travel destination`}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="detail-hero-fallback">{fallbackIcon}</div>
        )}

        <div className="detail-hero-overlay">
          <div className="container detail-hero-content">
            <div className="detail-hero-badges">
              {category && <span className="hero-pill hero-pill-cat">{category}</span>}
              {best_time && <span className="hero-pill hero-pill-time">🗓️ Best: {best_time}</span>}
              {ideal_duration && (
                <span className="hero-pill hero-pill-duration">⏳ {ideal_duration}</span>
              )}
            </div>

            <h1 className="detail-hero-title">{name}</h1>
            <p className="detail-location-sub">
              📍 {state ? `${state}, ` : ''}{country || 'India'}
            </p>

            <div className="detail-hero-cta">
              <Link
                to={`/plan-trip?destination=${destination.id}`}
                className="btn btn-primary hero-plan-btn"
                id="dest-hero-plan-btn"
              >
                ✈️ Plan a Trip to {name}
              </Link>
              <Link
                to={`/places?destination_id=${destination.id}`}
                className="btn btn-outline-white"
              >
                🏛️ View Places ({placesList.length})
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          MAIN BODY LAYOUT
          ============================================================ */}
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="detail-breadcrumb-bar">
          <Link to="/destinations" className="detail-back-link">
            ← Back to Destination Explorer
          </Link>
          <span className="breadcrumb-current">/ {name}</span>
        </div>

        <div className="detail-layout">
          {/* ============================================================
              LEFT / MAIN CONTENT COLUMN
              ============================================================ */}
          <div className="detail-main">
            {/* 1. ABOUT & OVERVIEW */}
            <section className="detail-section" id="about-section">
              <div className="section-title-wrap">
                <span className="section-badge-icon">🗺️</span>
                <h2>About {name}</h2>
              </div>
              <p className="detail-description">{description}</p>

              {/* Quick stats strip */}
              <div className="dest-quick-stats-strip">
                <div className="quick-stat-item">
                  <span className="quick-stat-icon">📍</span>
                  <div>
                    <div className="quick-stat-label">Location</div>
                    <div className="quick-stat-val">{state || 'India'}, {country || 'India'}</div>
                  </div>
                </div>
                <div className="quick-stat-item">
                  <span className="quick-stat-icon">🗓️</span>
                  <div>
                    <div className="quick-stat-label">Best Visiting Season</div>
                    <div className="quick-stat-val">{best_time || 'October to March'}</div>
                  </div>
                </div>
                <div className="quick-stat-item">
                  <span className="quick-stat-icon">⏳</span>
                  <div>
                    <div className="quick-stat-label">Ideal Stay</div>
                    <div className="quick-stat-val">{ideal_duration || '3 - 5 Days'}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. WHY VISIT THIS DESTINATION */}
            <section className="detail-section" id="why-visit-section">
              <div className="section-title-wrap">
                <span className="section-badge-icon">✨</span>
                <div>
                  <h2>Why Visit {name}?</h2>
                  <p className="section-subtitle-small">
                    Compelling highlights and unforgettable experiences awaiting you.
                  </p>
                </div>
              </div>

              <div className="why-visit-grid">
                {highlights.map((item, idx) => (
                  <div key={idx} className="why-visit-card">
                    <span className="why-visit-bullet">✓</span>
                    <p className="why-visit-text">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. IMPORTANT PLACES TO VISIT */}
            <section className="detail-section" id="places-to-visit-section">
              <div className="section-title-wrap section-title-between">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="section-badge-icon">🏛️</span>
                  <div>
                    <h2>Top Places to Visit in {name}</h2>
                    <p className="section-subtitle-small">
                      Must-see landmarks, heritage monuments, and attractions.
                    </p>
                  </div>
                </div>
                {placesList.length > 0 && (
                  <Link
                    to={`/places?destination_id=${destination.id}`}
                    className="view-all-places-link"
                  >
                    View All Places →
                  </Link>
                )}
              </div>

              {placesList.length > 0 ? (
                <div className="places-feature-grid">
                  {placesList.map(place => (
                    <div key={place.id} className="dest-place-card">
                      <div className="place-card-img-wrap">
                        {place.image_url ? (
                          <img
                            src={place.image_url}
                            alt={place.name}
                            className="place-card-img"
                            onError={e => {
                              e.target.style.display = 'none'
                              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div
                          className="place-card-fallback"
                          style={{ display: place.image_url ? 'none' : 'flex' }}
                        >
                          🏛️
                        </div>
                        {place.type && (
                          <span className="place-type-pill">{place.type}</span>
                        )}
                        {place.entry_fee !== undefined && (
                          <span className="place-fee-pill">
                            {Number(place.entry_fee) === 0 ? 'Free Entry' : `₹${place.entry_fee}`}
                          </span>
                        )}
                      </div>

                      <div className="dest-place-body">
                        <h3 className="dest-place-name">{place.name}</h3>
                        <p className="dest-place-desc">{place.description}</p>

                        <div className="dest-place-meta-row">
                          {place.timings && (
                            <span className="place-meta-item">
                              ⏰ {place.timings}
                            </span>
                          )}
                          <Link
                            to={`/places/${place.id}`}
                            className="place-detail-btn"
                          >
                            Explore Place →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="places-empty-box">
                  <p>Attractions are currently being updated for {name}.</p>
                  <Link to={`/places?destination_id=${destination.id}`} className="btn btn-outline">
                    Browse All Registered Places
                  </Link>
                </div>
              )}
            </section>

            {/* 4. ESTIMATED TRAVEL BUDGET */}
            <section className="detail-section" id="budget-section">
              <div className="section-title-wrap">
                <span className="section-badge-icon">💰</span>
                <div>
                  <h2>Estimated Travel Budget</h2>
                  <p className="section-subtitle-small">
                    Transparent cost estimates to help you budget your journey realistically.
                  </p>
                </div>
              </div>

              {budget ? (
                <div className="budget-explorer-card">
                  {/* Tier selector tabs */}
                  <div className="budget-tiers-selector">
                    <button
                      type="button"
                      className={`budget-tier-tab ${budgetTier === 'backpacker' ? 'active' : ''}`}
                      onClick={() => setBudgetTier('backpacker')}
                    >
                      <span className="tier-tab-icon">🎒</span>
                      <span className="tier-tab-title">Backpacker</span>
                      <span className="tier-tab-rate">
                        ₹{budget.daily_backpacker?.toLocaleString('en-IN') || '1,500'}/day
                      </span>
                    </button>

                    <button
                      type="button"
                      className={`budget-tier-tab ${budgetTier === 'midrange' ? 'active' : ''}`}
                      onClick={() => setBudgetTier('midrange')}
                    >
                      <span className="tier-tab-icon">🧳</span>
                      <span className="tier-tab-title">Mid-Range (Popular)</span>
                      <span className="tier-tab-rate">
                        ₹{budget.daily_midrange?.toLocaleString('en-IN') || '3,500'}/day
                      </span>
                    </button>

                    <button
                      type="button"
                      className={`budget-tier-tab ${budgetTier === 'luxury' ? 'active' : ''}`}
                      onClick={() => setBudgetTier('luxury')}
                    >
                      <span className="tier-tab-icon">👑</span>
                      <span className="tier-tab-title">Luxury</span>
                      <span className="tier-tab-rate">
                        ₹{budget.daily_luxury?.toLocaleString('en-IN') || '8,000'}/day
                      </span>
                    </button>
                  </div>

                  {/* Expense Breakdown Categories */}
                  <div className="budget-breakdown-grid">
                    <div className="breakdown-card">
                      <div className="breakdown-icon">🏨</div>
                      <div className="breakdown-title">Accommodation / Stay</div>
                      <div className="breakdown-value">{budget.avg_stay || '₹1,500 – ₹3,500 / night'}</div>
                      <span className="breakdown-note">Per night average</span>
                    </div>

                    <div className="breakdown-card">
                      <div className="breakdown-icon">🍲</div>
                      <div className="breakdown-title">Food & Dining</div>
                      <div className="breakdown-value">{budget.avg_food || '₹400 – ₹1,000 / day'}</div>
                      <span className="breakdown-note">Daily breakfast, lunch & dinner</span>
                    </div>

                    <div className="breakdown-card">
                      <div className="breakdown-icon">🛺</div>
                      <div className="breakdown-title">Local Transit</div>
                      <div className="breakdown-value">{budget.avg_transport || '₹300 – ₹800 / day'}</div>
                      <span className="breakdown-note">Cabs, autos, or metro</span>
                    </div>

                    <div className="breakdown-card">
                      <div className="breakdown-icon">🎟️</div>
                      <div className="breakdown-title">Sightseeing & Entry</div>
                      <div className="breakdown-value">{budget.avg_activities || '₹300 – ₹900 / day'}</div>
                      <span className="breakdown-note">Monuments, guides & passes</span>
                    </div>
                  </div>

                  {/* Typical Trip Packages */}
                  <div className="budget-trip-packages">
                    <div className="package-estimate-row">
                      <div className="package-label">
                        <strong>📅 3-Day Weekend Trip Estimate:</strong>
                        <span>Perfect for quick breaks & weekend explorations</span>
                      </div>
                      <div className="package-amount">
                        {budget.estimate_3day || '₹7,500 – ₹14,000 per person'}
                      </div>
                    </div>

                    <div className="package-estimate-row">
                      <div className="package-label">
                        <strong>📅 5-Day Complete Holiday Estimate:</strong>
                        <span>Comprehensive tour covering all top sights and experiences</span>
                      </div>
                      <div className="package-amount">
                        {budget.estimate_5day || '₹12,500 – ₹24,000 per person'}
                      </div>
                    </div>
                  </div>

                  {/* Budget CTA */}
                  <div className="budget-footer-actions">
                    <Link
                      to={`/budget?destination=${encodeURIComponent(name)}`}
                      className="btn btn-accent"
                    >
                      💰 Calculate Custom Budget for {name} →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="detail-info-card">
                  <p>Estimated average daily cost: ~₹3,500 per person per day.</p>
                  <Link to="/budget" className="btn btn-outline" style={{ marginTop: '10px' }}>
                    Open Budget Calculator
                  </Link>
                </div>
              )}
            </section>

            {/* 5. USEFUL TRAVEL TIPS & INSIDER HACKS */}
            <section className="detail-section" id="travel-tips-section">
              <div className="section-title-wrap">
                <span className="section-badge-icon">💡</span>
                <div>
                  <h2>Essential Travel Tips for {name}</h2>
                  <p className="section-subtitle-small">
                    Practical insider recommendations to make your trip effortless and safe.
                  </p>
                </div>
              </div>

              <div className="travel-tips-grid">
                {tips.map((tip, idx) => (
                  <div key={idx} className="travel-tip-card">
                    <div className="tip-header">
                      <span className="tip-icon">{tip.icon || '📌'}</span>
                      <h4 className="tip-title">{tip.title}</h4>
                    </div>
                    <p className="tip-desc">{tip.desc}</p>
                  </div>
                ))}
              </div>

              {/* Important things to know callout */}
              <div className="know-before-callout">
                <div className="callout-icon">ℹ️</div>
                <div className="callout-text">
                  <h4>Important To Know Before You Go:</h4>
                  <p>
                    Always keep a government photo ID (Aadhaar or Passport) accessible for monument entries
                    and check-ins. Keep some cash in smaller denominations handy for local auto-rickshaws,
                    temple donations, and street delicacies. Respect cultural photography guidelines at
                    religious sites.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* ============================================================
              RIGHT SIDEBAR: SNAPSHOT & ACTIONS
              ============================================================ */}
          <aside className="detail-sidebar">
            {/* Primary Action Card */}
            <div className="detail-cta-card">
              <div className="cta-card-icon">✈️</div>
              <h3>Ready to visit {name}?</h3>
              <p>Create a personalized trip with your dates, source city, and travellers in seconds.</p>
              <Link
                to={`/plan-trip?destination=${destination.id}`}
                className="btn btn-primary btn-block cta-primary-btn"
                id="sidebar-plan-trip-btn"
              >
                Plan a Trip to {name}
              </Link>
            </div>

            {/* Best Time Card */}
            {best_time && (
              <div className="detail-info-card">
                <h4>🗓️ Best Time to Visit</h4>
                <p className="detail-info-value">{best_time}</p>
                {ideal_duration && (
                  <p className="sidebar-subtext">⏳ Recommended Duration: <strong>{ideal_duration}</strong></p>
                )}
              </div>
            )}

            {/* Category & Vibe */}
            {category && (
              <div className="detail-info-card">
                <h4>🏷️ Destination Category</h4>
                <p className="detail-info-value">{category}</p>
                {ideal_for && ideal_for.length > 0 && (
                  <div className="sidebar-ideal-for">
                    <span className="ideal-label">Ideal For:</span>
                    <span className="ideal-value">{ideal_for.join(', ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Nearest Railway Station */}
            {nearest_station && (
              <div className="detail-info-card">
                <h4>🚂 Nearest Rail Hub</h4>
                <p className="detail-info-value">
                  {nearest_station.name} ({nearest_station.code})
                </p>
                <Link
                  to={`/train-search?to=${encodeURIComponent(nearest_station.code)}`}
                  className="sidebar-train-link"
                >
                  Search Trains to {nearest_station.code} →
                </Link>
              </div>
            )}

            {/* Popular tags */}
            <div className="detail-info-card">
              <h4>⭐ Popular For</h4>
              <div className="detail-tags">
                {tags.map(tag => (
                  <span key={tag} className="detail-tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Explore Further Navigation */}
            <div className="detail-info-card">
              <h4>🔍 More Tools for {name}</h4>
              <div className="sidebar-links-list">
                <Link
                  to={`/places?destination_id=${destination.id}`}
                  className="sidebar-tool-link"
                >
                  🏛️ View All Local Places
                </Link>
                <Link
                  to={`/hotels?destination_id=${destination.id}`}
                  className="sidebar-tool-link"
                >
                  🏨 Find Nearby Hotels
                </Link>
                <Link
                  to={`/train-search?to=${encodeURIComponent(name)}`}
                  className="sidebar-tool-link"
                >
                  🚂 Search Train Routes
                </Link>
                <Link
                  to={`/plan-trip?destination=${destination.id}&ai=1`}
                  className="sidebar-tool-link"
                >
                  🤖 Plan with Gemini AI
                </Link>
                <Link
                  to={`/budget?destination=${encodeURIComponent(name)}`}
                  className="sidebar-tool-link"
                >
                  💰 Open Budget Calculator
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default DestinationDetails

import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDestination } from '../services/api.js'
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
  'Beach':        ['Beaches', 'Water Sports', 'Seafood', 'Nightlife'],
  'Mountain':     ['Trekking', 'Skiing', 'Adventure Sports', 'Scenic Views'],
  'Heritage':     ['Forts & Palaces', 'History', 'Architecture', 'Museums'],
  'Hill Station': ['Tea Gardens', 'Nature Walks', 'Wildlife', 'Cool Climate'],
  'Spiritual':    ['Temples', 'Ghats', 'Meditation', 'Pilgrimage'],
  'City':         ['Street Food', 'Shopping', 'Nightlife', 'Monuments'],
  'default':      ['Sightseeing', 'Local Culture', 'Photography'],
}

function DestinationDetails() {
  // Get the :id from the URL  e.g. /destinations/3
  const { id } = useParams()

  // Destination data from the API
  const [destination, setDestination] = useState(null)

  // Loading and error states
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [notFound, setNotFound]   = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  // ---- Fetch this destination when the page loads or ID changes ----
  useEffect(() => {
    fetchDestination()
    // Scroll to top when navigating between destinations
    window.scrollTo(0, 0)
  }, [id])

  async function fetchDestination() {
    setLoading(true)
    setError(null)
    setNotFound(false)
    setImgFailed(false)

    try {
      const data = await getDestination(id)
      setDestination(data)
    } catch (err) {
      if (err.message === 'NOT_FOUND') {
        setNotFound(true)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // ---- Render: Loading ----
  if (loading) {
    return (
      <main>
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p className="loading-text">Loading destination details...</p>
        </div>
      </main>
    )
  }

  // ---- Render: Not Found ----
  if (notFound) {
    return (
      <main>
        <div className="container">
          <div className="empty-state" style={{ marginTop: '60px' }}>
            <div className="empty-icon">🔍</div>
            <h3>Destination Not Found</h3>
            <p style={{ marginBottom: '24px' }}>
              We couldn't find a destination with ID <strong>{id}</strong>.
            </p>
            <Link to="/destinations" className="btn btn-primary">
              ← Back to Destinations
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ---- Render: Error ----
  if (error) {
    return (
      <main>
        <div className="container" style={{ paddingTop: '40px' }}>
          <Link to="/destinations" className="detail-back-link">
            ← Back to Destinations
          </Link>
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
          <button className="btn btn-primary" onClick={fetchDestination}
            style={{ marginTop: '12px' }}>
            Try Again
          </button>
        </div>
      </main>
    )
  }

  // ---- Render: Destination ----
  const {
    name, state, country, description,
    image_url, category, best_time,
  } = destination

  const fallbackIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS['default']
  const tags = CATEGORY_TAGS[category] || CATEGORY_TAGS['default']
  const hasImage = image_url && image_url.trim() !== '' && !imgFailed

  return (
    <main>
      {/* ---- Hero image with destination name overlay ---- */}
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

        {/* Overlay with name and location */}
        {hasImage && (
          <div className="detail-hero-overlay">
            <div className="detail-hero-text">
              <h1>{name}</h1>
              <p className="detail-location">📍 {state ? `${state}, ` : ''}{country || 'India'}</p>
            </div>
          </div>
        )}
      </div>

      {/* ---- Page content ---- */}
      <div className="container">

        {/* Show name below image when image is missing */}
        {!hasImage && (
          <div style={{ paddingTop: '32px' }}>
            <h1 style={{ marginBottom: '4px' }}>{name}</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0' }}>
              📍 {state ? `${state}, ` : ''}{country || 'India'}
            </p>
          </div>
        )}

        <div className="detail-layout">
          {/* ---- Main left column ---- */}
          <div className="detail-main">
            {/* Back link */}
            <Link to="/destinations" className="detail-back-link">
              ← Back to Destinations
            </Link>

            <h2>About {name}</h2>
            <p className="detail-description">{description}</p>
          </div>

          {/* ---- Right sidebar ---- */}
          <aside className="detail-sidebar">

            {/* Best time to visit */}
            {best_time && (
              <div className="detail-info-card">
                <h4>🗓️ Best Time to Visit</h4>
                <p className="detail-info-value">{best_time}</p>
              </div>
            )}

            {/* Category */}
            {category && (
              <div className="detail-info-card">
                <h4>🏷️ Category</h4>
                <p className="detail-info-value">{category}</p>
              </div>
            )}

            {/* Location */}
            <div className="detail-info-card">
              <h4>📍 Location</h4>
              <p className="detail-info-value">
                {state ? `${state}, ` : ''}{country || 'India'}
              </p>
            </div>

            {/* Popular for */}
            <div className="detail-info-card">
              <h4>⭐ Popular For</h4>
              <div className="detail-tags">
                {tags.map(tag => (
                  <span key={tag} className="detail-tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="detail-actions">
              <Link to={`/places?destination_id=${destination.id}`} className="btn btn-primary">
                🏛️ Explore Places
              </Link>
              <Link to={`/hotels?destination_id=${destination.id}`} className="btn btn-accent">
                🏨 Find Hotels
              </Link>
              <Link to="/plan-trip" className="btn btn-outline">
                📋 Plan a Trip Here
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </main>
  )
}

export default DestinationDetails

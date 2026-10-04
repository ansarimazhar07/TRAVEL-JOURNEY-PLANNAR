import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPlace } from '../services/api.js'
import './PlaceDetails.css'

// Category → emoji icon
const CATEGORY_ICONS = {
  'Beach':      '🏖️',
  'Historical': '🏰',
  'Heritage':   '🏯',
  'Nature':     '🌿',
  'Adventure':  '🏔️',
  'Spiritual':  '🛕',
  'Garden':     '🌸',
  'Scenic':     '🌅',
  'Market':     '🛍️',
  'default':    '📍',
}

function PlaceDetails() {
  const { id } = useParams()

  const [place, setPlace]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [notFound, setNotFound]   = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    fetchPlace()
    window.scrollTo(0, 0)
  }, [id])

  async function fetchPlace() {
    setLoading(true)
    setError(null)
    setNotFound(false)
    setImgFailed(false)

    try {
      const data = await getPlace(id)
      setPlace(data)
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

  // ---- Loading ----
  if (loading) {
    return (
      <main>
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p className="loading-text">Loading place details...</p>
        </div>
      </main>
    )
  }

  // ---- Not Found ----
  if (notFound) {
    return (
      <main>
        <div className="container">
          <div className="empty-state" style={{ marginTop: '60px' }}>
            <div className="empty-icon">🔍</div>
            <h3>Place Not Found</h3>
            <p style={{ marginBottom: '24px' }}>
              We couldn't find a place with ID <strong>{id}</strong>.
            </p>
            <Link to="/places" className="btn btn-primary">← Back to Places</Link>
          </div>
        </div>
      </main>
    )
  }

  // ---- Error ----
  if (error) {
    return (
      <main>
        <div className="container" style={{ paddingTop: '40px' }}>
          <Link to="/places" className="detail-back-link">← Back to Places</Link>
          <div className="alert alert-error">⚠️ {error}</div>
          <button className="btn btn-primary" onClick={fetchPlace} style={{ marginTop: '12px' }}>
            Try Again
          </button>
        </div>
      </main>
    )
  }

  // ---- Render Place ----
  const {
    destination_id,
    name,
    description,
    image,
    image_url,
    location,
    entry_fee,
    category,
  } = place

  const fallbackIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS['default']
  const imageSrc = image_url || image
  const hasImage = Boolean(imageSrc && imageSrc.trim() !== '' && !imgFailed)
  const isFree = entry_fee == 0

  return (
    <main>
      {/* ---- Hero ---- */}
      <div className="pd-hero">
        {hasImage ? (
          <img
            className="pd-hero-img"
            src={imageSrc}
            alt={`${name} tourist place`}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="pd-hero-fallback">{fallbackIcon}</div>
        )}

        {hasImage && (
          <div className="pd-hero-overlay">
            <div className="pd-hero-text">
              <h1>{name}</h1>
              {location && <p className="pd-location">📍 {location}</p>}
            </div>
          </div>
        )}
      </div>

      {/* ---- Content ---- */}
      <div className="container">
        {/* Name below image if no image */}
        {!hasImage && (
          <div style={{ paddingTop: '32px' }}>
            <h1 style={{ marginBottom: '4px' }}>{name}</h1>
            {location && <p style={{ color: 'var(--text-muted)' }}>📍 {location}</p>}
          </div>
        )}

        <div className="pd-layout">
          {/* ---- Main left ---- */}
          <div className="pd-main">
            {/* Back link */}
            <Link
              to={destination_id ? `/places?destination_id=${destination_id}` : '/places'}
              className="detail-back-link"
            >
              ← Back to Places
            </Link>

            <h2>About {name}</h2>
            <p className="pd-description">{description}</p>
          </div>

          {/* ---- Right sidebar ---- */}
          <aside className="pd-sidebar">

            {/* Entry fee */}
            <div className="detail-info-card">
              <h4>🎟️ Entry Fee</h4>
              <p className={`pd-fee-value ${isFree ? 'free' : ''}`}>
                {isFree ? 'Free Entry' : `₹${Number(entry_fee).toFixed(0)} per person`}
              </p>
            </div>

            {/* Category */}
            {category && (
              <div className="detail-info-card">
                <h4>🏷️ Category</h4>
                <p className="detail-info-value">{category}</p>
              </div>
            )}

            {/* Location */}
            {location && (
              <div className="detail-info-card">
                <h4>📍 Location</h4>
                <p className="detail-info-value">{location}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="detail-actions">
              {destination_id && (
                <Link
                  to={`/destinations/${destination_id}`}
                  className="btn btn-primary"
                >
                  🗺️ View Destination
                </Link>
              )}
              {destination_id && (
                <Link
                  to={`/hotels?destination_id=${destination_id}`}
                  className="btn btn-outline"
                >
                  🏨 View Hotels Nearby
                </Link>
              )}
              {destination_id && (
                <Link
                  to={`/places?destination_id=${destination_id}`}
                  className="btn btn-outline"
                >
                  ← More Places Here
                </Link>
              )}
            </div>

          </aside>
        </div>
      </div>
    </main>
  )
}

export default PlaceDetails

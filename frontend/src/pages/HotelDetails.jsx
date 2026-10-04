import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getHotel } from '../services/api.js'
import './HotelDetails.css'

function HotelDetails() {
  const { id } = useParams()

  const [hotel, setHotel]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [notFound, setNotFound]   = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    fetchHotel()
    window.scrollTo(0, 0)
  }, [id])

  async function fetchHotel() {
    setLoading(true)
    setError(null)
    setNotFound(false)
    setImgFailed(false)

    try {
      const data = await getHotel(id)
      setHotel(data)
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

  // ---- Render star rating ----
  function renderStars(rating) {
    const stars = []
    const full = Math.floor(rating)
    const hasHalf = rating - full >= 0.5

    for (let i = 0; i < full; i++) {
      stars.push(<span key={`f${i}`} className="hd-star filled">★</span>)
    }
    if (hasHalf) {
      stars.push(<span key="h" className="hd-star half">★</span>)
    }
    const empty = 5 - full - (hasHalf ? 1 : 0)
    for (let i = 0; i < empty; i++) {
      stars.push(<span key={`e${i}`} className="hd-star empty">☆</span>)
    }
    return stars
  }

  // ---- Loading ----
  if (loading) {
    return (
      <main>
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p className="loading-text">Loading hotel details...</p>
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
            <h3>Hotel Not Found</h3>
            <p style={{ marginBottom: '24px' }}>
              We couldn't find a hotel with ID <strong>{id}</strong>.
            </p>
            <Link to="/hotels" className="btn btn-primary">← Back to Hotels</Link>
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
          <Link to="/hotels" className="detail-back-link">← Back to Hotels</Link>
          <div className="alert alert-error">⚠️ {error}</div>
          <button className="btn btn-primary" onClick={fetchHotel} style={{ marginTop: '12px' }}>
            Try Again
          </button>
        </div>
      </main>
    )
  }

  // ---- Render Hotel ----
  const {
    destination_id,
    name,
    description,
    image,
    image_url,
    location,
    address,
    price_per_night,
    rating,
    facilities,
  } = hotel

  const imageSrc = image_url || image
  const hasImage = Boolean(imageSrc && imageSrc.trim() !== '' && !imgFailed)
  const hotelLocation = location || address

  // Split facilities string into an array
  const facilitiesList = facilities
    ? facilities.split(',').map(f => f.trim()).filter(Boolean)
    : []

  return (
    <main>
      {/* ---- Hero ---- */}
      <div className="hd-hero">
        {hasImage ? (
          <img
            className="hd-hero-img"
            src={imageSrc}
            alt={`${name} hotel`}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="hd-hero-fallback">🏨</div>
        )}

        {hasImage && (
          <div className="hd-hero-overlay">
            <div className="hd-hero-text">
              <h1>{name}</h1>
              {hotelLocation && <p className="hd-location">📍 {hotelLocation}</p>}
            </div>
          </div>
        )}
      </div>

      {/* ---- Content ---- */}
      <div className="container">
        {/* Name when no image */}
        {!hasImage && (
          <div style={{ paddingTop: '32px' }}>
            <h1 style={{ marginBottom: '4px' }}>{name}</h1>
            {location && <p style={{ color: 'var(--text-muted)' }}>📍 {location}</p>}
          </div>
        )}

        <div className="hd-layout">
          {/* ---- Main left ---- */}
          <div className="hd-main">
            <Link
              to={destination_id ? `/hotels?destination_id=${destination_id}` : '/hotels'}
              className="detail-back-link"
            >
              ← Back to Hotels
            </Link>

            <h2>About {name}</h2>
            <p className="hd-description">{description}</p>

            {/* Facilities section */}
            {facilitiesList.length > 0 && (
              <div className="hd-facilities">
                <h3>🏷️ Facilities</h3>
                <div className="hd-facilities-grid">
                  {facilitiesList.map((facility, idx) => (
                    <div key={idx} className="hd-facility-item">
                      ✓ {facility}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ---- Right sidebar ---- */}
          <aside className="hd-sidebar">

            {/* Price */}
            <div className="detail-info-card hd-price-card">
              <h4>💰 Price</h4>
              <div className="hd-price-display">
                <span className="hd-price-amount">
                  ₹{Number(price_per_night).toLocaleString('en-IN')}
                </span>
                <span className="hd-price-night">/ night</span>
              </div>
            </div>

            {/* Rating */}
            {rating > 0 && (
              <div className="detail-info-card">
                <h4>⭐ Rating</h4>
                <div className="hd-stars-row">
                  {renderStars(rating)}
                  <span className="hd-rating-num">{Number(rating).toFixed(1)} / 5.0</span>
                </div>
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
                  to={`/places?destination_id=${destination_id}`}
                  className="btn btn-outline"
                >
                  🏛️ View Places Nearby
                </Link>
              )}
              {destination_id && (
                <Link
                  to={`/hotels?destination_id=${destination_id}`}
                  className="btn btn-outline"
                >
                  ← More Hotels Here
                </Link>
              )}
            </div>

          </aside>
        </div>
      </div>
    </main>
  )
}

export default HotelDetails

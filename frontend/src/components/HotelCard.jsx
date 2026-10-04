import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './HotelCard.css'

/**
 * HotelCard
 *
 * Displays a single hotel as a card with image, name, rating, price, and a link.
 *
 * Props:
 *   hotel  {Object}  A hotel object from the API
 */
function HotelCard({ hotel }) {
  const {
    id,
    name,
    description,
    image,
    image_url,
    location,
    address,
    price_per_night,
    rating,
  } = hotel

  const [imgFailed, setImgFailed] = useState(false)

  const imageSrc = image_url || image
  const hasImage = Boolean(imageSrc && imageSrc.trim() !== '' && !imgFailed)
  const hotelLocation = location || address

  // Render star rating (filled and empty stars)
  function renderStars(rating) {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating - fullStars >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`f${i}`} className="star filled">★</span>)
    }
    if (hasHalf) {
      stars.push(<span key="half" className="star half">★</span>)
    }
    const remaining = 5 - fullStars - (hasHalf ? 1 : 0)
    for (let i = 0; i < remaining; i++) {
      stars.push(<span key={`e${i}`} className="star empty">☆</span>)
    }
    return stars
  }

  return (
    <div className="hotel-card">
      {/* ---- Image section ---- */}
      <div className="hotel-card-image-wrap">
        {hasImage ? (
          <img
            src={imageSrc}
            alt={`${name} hotel`}
            onError={() => setImgFailed(true)}
          />
        ) : null}

        {/* Fallback */}
        <div
          className="hotel-card-img-fallback"
          style={{ display: hasImage ? 'none' : 'flex' }}
        >
          🏨
        </div>

        {/* Rating badge */}
        {rating > 0 && (
          <span className="hotel-card-rating-badge">⭐ {Number(rating).toFixed(1)}</span>
        )}
      </div>

      {/* ---- Card body ---- */}
      <div className="hotel-card-body">
        <h3 className="hotel-card-name">{name}</h3>

        {hotelLocation && (
          <p className="hotel-card-location">📍 {hotelLocation}</p>
        )}

        {/* Star display */}
        <div className="hotel-card-stars">
          {renderStars(rating)}
          <span className="hotel-card-rating-text">{Number(rating).toFixed(1)}</span>
        </div>

        <p className="hotel-card-desc">{description}</p>

        {/* Price */}
        <div className="hotel-card-price-row">
          <div className="hotel-card-price">
            <span className="hotel-card-price-amount">
              ₹{Number(price_per_night).toLocaleString('en-IN')}
            </span>
            <span className="hotel-card-price-night"> / night</span>
          </div>
          <Link to={`/hotels/${id}`} className="hotel-card-btn">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HotelCard

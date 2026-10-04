import React from 'react'
import { Link } from 'react-router-dom'
import './DestinationCard.css'

// Emoji fallback icons per category (shown when image is missing)
const CATEGORY_ICONS = {
  'Beach':       '🏖️',
  'Mountain':    '🏔️',
  'Heritage':    '🏯',
  'Hill Station':'🌿',
  'Spiritual':   '🛕',
  'City':        '🌆',
  'default':     '🗺️',
}

/**
 * DestinationCard
 * 
 * Shows a single destination as a card with image, name, 
 * short description, best time, and a "View Details" link.
 * 
 * Props:
 *   destination  {Object}  A destination object from the API
 */
function DestinationCard({ destination }) {
  const {
    id,
    name,
    state,
    description,
    image_url,
    category,
    best_time,
  } = destination

  // Pick the fallback emoji based on category
  const fallbackIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS['default']

  // Decide whether to show image or fallback emoji
  const hasImage = image_url && image_url.trim() !== ''

  return (
    <div className="dest-card">
      {/* ---- Image section ---- */}
      <div className="dest-card-image-wrap">
        {hasImage ? (
          <img
            src={image_url}
            alt={`${name} travel destination`}
            onError={(e) => {
              // If image fails to load, hide it and show fallback below
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}

        {/* Fallback — shown when no image or image fails to load */}
        <div
          className="dest-card-img-fallback"
          style={{ display: hasImage ? 'none' : 'flex' }}
        >
          {fallbackIcon}
        </div>

        {/* Category badge on top of image */}
        {category && (
          <span className="dest-card-category">{category}</span>
        )}
      </div>

      {/* ---- Card body ---- */}
      <div className="dest-card-body">
        <h3 className="dest-card-name">{name}</h3>

        {/* State/location */}
        {state && (
          <p className="dest-card-state">📍 {state}, India</p>
        )}

        {/* Short description — clamped to 2 lines via CSS */}
        <p className="dest-card-desc">{description}</p>

        {/* Best time to visit */}
        {best_time && (
          <div className="dest-card-meta">
            <span className="dest-card-meta-icon">🗓️</span>
            <span>Best time: {best_time}</span>
          </div>
        )}

        {/* Navigate to Destination Details page */}
        <Link to={`/destinations/${id}`} className="dest-card-btn">
          View Details →
        </Link>
      </div>
    </div>
  )
}

export default DestinationCard

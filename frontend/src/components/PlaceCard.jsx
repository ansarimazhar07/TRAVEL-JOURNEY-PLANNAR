import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './PlaceCard.css'

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

/**
 * PlaceCard
 *
 * Displays a single tourist place as a card.
 *
 * Props:
 *   place  {Object}  A place object from the API
 */
function PlaceCard({ place }) {
  const {
    id,
    name,
    description,
    image,
    image_url,
    location,
    entry_fee,
    category,
  } = place

  const [imgFailed, setImgFailed] = useState(false)

  const fallbackIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS['default']
  const imageSrc = image_url || image
  const hasImage = Boolean(imageSrc && imageSrc.trim() !== '' && !imgFailed)

  // Format entry fee
  const feeLabel = entry_fee == 0 ? 'Free Entry' : `₹${Number(entry_fee).toFixed(0)} entry`

  return (
    <div className="place-card">
      {/* ---- Image section ---- */}
      <div className="place-card-image-wrap">
        {hasImage ? (
          <img
            src={imageSrc}
            alt={`${name}`}
            onError={() => setImgFailed(true)}
          />
        ) : null}

        {/* Fallback emoji */}
        <div
          className="place-card-img-fallback"
          style={{ display: hasImage ? 'none' : 'flex' }}
        >
          {fallbackIcon}
        </div>

        {/* Category badge */}
        {category && (
          <span className="place-card-category">{category}</span>
        )}

        {/* Entry fee badge */}
        <span className={`place-card-fee ${entry_fee == 0 ? 'free' : ''}`}>
          {feeLabel}
        </span>
      </div>

      {/* ---- Card body ---- */}
      <div className="place-card-body">
        <h3 className="place-card-name">{name}</h3>

        {location && (
          <p className="place-card-location">📍 {location}</p>
        )}

        <p className="place-card-desc">{description}</p>

        <Link to={`/places/${id}`} className="place-card-btn">
          View Details →
        </Link>
      </div>
    </div>
  )
}

export default PlaceCard

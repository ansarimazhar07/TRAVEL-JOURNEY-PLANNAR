import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './TrainCard.css'

const ALL_DAYS = [
  { key: 'mon', label: 'M', full: 'Mon' },
  { key: 'tue', label: 'T', full: 'Tue' },
  { key: 'wed', label: 'W', full: 'Wed' },
  { key: 'thu', label: 'T', full: 'Thu' },
  { key: 'fri', label: 'F', full: 'Fri' },
  { key: 'sat', label: 'S', full: 'Sat' },
  { key: 'sun', label: 'S', full: 'Sun' },
]

export default function TrainCard({ train, onSelect }) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  if (!train) return null

  const {
    train_number,
    train_name,
    train_type,
    from_code,
    from_name,
    from_city,
    to_code,
    to_name,
    to_city,
    departure,
    arrival,
    departure_day = 1,
    arrival_day = 1,
    duration,
    distance_km,
    halts,
    run_days = []
  } = train

  // Next day arrival indicator (e.g. +1 day, +2 days)
  const dayDiff = arrival_day - departure_day

  const handleUseTrain = () => {
    if (onSelect) {
      onSelect(train)
      return
    }

    // Copy summary & offer navigation
    const summary = `${train_number} - ${train_name} (${from_code} → ${to_code}, Dep: ${departure}, Arr: ${arrival})`
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(summary)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <article className="train-card" data-train-number={train_number}>
      {/* Top Header */}
      <div className="train-card-header">
        <div className="train-meta-main">
          <span className="train-badge-number">{train_number}</span>
          <h3 className="train-title">{train_name}</h3>
        </div>
        {train_type && (
          <span className={`train-type-badge ${train_type.toLowerCase().includes('vande') ? 'type-vande' : train_type.toLowerCase().includes('superfast') || train_type.toLowerCase().includes('rajdhani') ? 'type-fast' : ''}`}>
            {train_type}
          </span>
        )}
      </div>

      {/* Main Schedule Timeline */}
      <div className="train-schedule-grid">
        {/* Source */}
        <div className="train-stop train-stop-origin">
          <span className="train-time">{departure || '--:--'}</span>
          <span className="train-station-name">{from_name || from_code}</span>
          <span className="train-station-code">
            {from_code} {from_city && from_city !== from_name ? `• ${from_city}` : ''}
          </span>
        </div>

        {/* Path Indicator */}
        <div className="train-path-indicator">
          <span className="train-duration-pill">⏱ {duration || 'N/A'}</span>
          <div className="train-line">
            <span className="train-dot start-dot"></span>
            <div className="train-track-line">
              <span className="train-icon-transit">🚆</span>
            </div>
            <span className="train-dot end-dot"></span>
          </div>
          <div className="train-subdetails">
            {distance_km ? <span>{distance_km} km</span> : null}
            {distance_km && halts !== undefined ? <span>•</span> : null}
            {halts !== undefined ? <span>{halts} {halts === 1 ? 'halt' : 'halts'}</span> : null}
          </div>
        </div>

        {/* Destination */}
        <div className="train-stop train-stop-dest">
          <div className="train-arrival-wrap">
            <span className="train-time">{arrival || '--:--'}</span>
            {dayDiff > 0 && (
              <span className="train-next-day" title={`Arrives ${dayDiff} day${dayDiff > 1 ? 's' : ''} later`}>
                +{dayDiff}d
              </span>
            )}
          </div>
          <span className="train-station-name">{to_name || to_code}</span>
          <span className="train-station-code">
            {to_code} {to_city && to_city !== to_name ? `• ${to_city}` : ''}
          </span>
        </div>
      </div>

      {/* Footer: Running Days & Action */}
      <div className="train-card-footer">
        <div className="train-runs-wrap">
          <span className="train-runs-label">Runs On:</span>
          <div className="train-days-list" aria-label="Days of operation">
            {ALL_DAYS.map(day => {
              const runs = run_days.map(d => d.toLowerCase()).includes(day.key)
              return (
                <span
                  key={day.key}
                  className={`train-day-chip ${runs ? 'active' : 'inactive'}`}
                  title={`${day.full}: ${runs ? 'Runs' : 'Does not run'}`}
                >
                  {day.label}
                </span>
              )
            })}
          </div>
        </div>

        <button
          type="button"
          className="train-action-btn"
          onClick={handleUseTrain}
          title="Use or copy train details"
        >
          {copied ? '✓ Copied Details' : 'Use This Train'}
        </button>
      </div>
    </article>
  )
}

/**
 * TripCard.jsx
 *
 * A single trip card shown in the My Trips list.
 * Clearly displays:
 * - Source location & Destination (Route)
 * - Dates and Duration
 * - Number of travellers
 * - Journey Status (Upcoming, In Progress, Completed)
 * - Action buttons: View, Edit, Delete
 */

import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { deleteTrip } from '../services/api'
import '../pages/Trips.css'

// Helper: calculate trip duration in days
function calcDays(start, end) {
  if (!start || !end) return 0
  const ms = new Date(end) - new Date(start)
  const days = Math.round(ms / (1000 * 60 * 60 * 24)) + 1
  return days > 0 ? days : 1
}

// Helper: format a date string as "10 Oct 2026"
function fmtDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Helper: determine status based on today's date
function getTripStatus(start, end) {
  if (!start || !end) return null
  const today = new Date().toISOString().split('T')[0]
  if (today < start) return { label: 'Upcoming', class: 'status-upcoming' }
  if (today >= start && today <= end) return { label: 'In Progress', class: 'status-active' }
  return { label: 'Completed', class: 'status-past' }
}

function TripCard({ trip, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting,    setDeleting]    = useState(false)

  const days = useMemo(() => calcDays(trip.start_date, trip.end_date), [trip.start_date, trip.end_date])
  const status = useMemo(() => getTripStatus(trip.start_date, trip.end_date), [trip.start_date, trip.end_date])

  const sourceName = trip.source_location || 'Departure'
  const destinationName = trip.destination_name || trip.trip_name || 'Destination'

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteTrip(trip.id)
    setDeleting(false)
    setShowConfirm(false)

    if (result.success) {
      onDelete(trip.id)
    } else {
      alert(result.error || 'Failed to delete trip.')
    }
  }

  return (
    <>
      <div className="trip-card">
        <div className="trip-card-left">
          {/* Header Row: Status badge + Duration pill */}
          <div className="trip-card-badges-row">
            {status && (
              <span className={`trip-status-badge ${status.class}`}>
                {status.label}
              </span>
            )}
            <span className="trip-card-duration">⏳ {days} day{days !== 1 ? 's' : ''}</span>
          </div>

          {/* Route: Source -> Destination */}
          <div className="trip-card-dest">
            <span className="trip-route-src" title="Departure">🛫 {sourceName}</span>
            <span className="trip-route-arrow">➔</span>
            <span className="trip-route-dest" title="Destination">📍 {destinationName}</span>
          </div>

          {/* Date range & Travellers */}
          <div className="trip-card-meta-row">
            <span className="trip-card-dates">
              📅 {fmtDate(trip.start_date)} → {fmtDate(trip.end_date)}
            </span>
            <span className="trip-card-travellers">
              👥 {trip.num_travellers} traveller{trip.num_travellers !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Optional custom trip name / notes preview */}
          {trip.trip_name && trip.trip_name !== `${sourceName} to ${destinationName} Trip` && (
            <div className="trip-card-custom-name">
              🏷️ <em>"{trip.trip_name}"</em>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="trip-card-actions">
          <Link
            to={`/trip/${trip.id}`}
            className="trip-card-btn trip-card-btn-view"
            title="View complete trip details"
          >
            👁 View
          </Link>
          <Link
            to={`/plan-trip?edit=${trip.id}`}
            className="trip-card-btn trip-card-btn-edit"
            title="Edit trip parameters"
          >
            ✏️ Edit
          </Link>
          <button
            type="button"
            className="trip-card-btn trip-card-btn-delete"
            onClick={() => setShowConfirm(true)}
            title="Delete this trip"
          >
            🗑 Delete
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div className="delete-overlay" onClick={() => !deleting && setShowConfirm(false)}>
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            <div className="delete-modal-icon">⚠️</div>
            <h3>Delete Trip?</h3>
            <p>
              Are you sure you want to remove your trip from{' '}
              <strong>{sourceName}</strong> to{' '}
              <strong>{destinationName}</strong>?
              This action cannot be undone.
            </p>
            <div className="delete-modal-btns">
              <button
                type="button"
                className="delete-modal-cancel"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-modal-confirm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Yes, Delete Trip'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TripCard

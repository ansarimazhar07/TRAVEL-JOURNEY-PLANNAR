/**
 * TripCard.jsx
 *
 * A single trip card shown in the My Trips list.
 *
 * Props:
 *   trip        {Object}   Trip object from API
 *   onDelete    {Function} Called with trip.id when user confirms delete
 *   onEdit      {Function} Called with trip.id to navigate to edit form
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteTrip } from '../services/api'
import '../pages/Trips.css'

// Helper: calculate trip duration in days
function calcDays(start, end) {
  const ms = new Date(end) - new Date(start)
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1
}

// Helper: format a date string as "10 Oct 2026"
function fmtDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function TripCard({ trip, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting,    setDeleting]    = useState(false)

  const days = calcDays(trip.start_date, trip.end_date)

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteTrip(trip.id)
    setDeleting(false)
    setShowConfirm(false)

    if (result.success) {
      onDelete(trip.id)   // Tell parent to remove this card from the list
    } else {
      alert(result.error || 'Failed to delete trip.')
    }
  }

  return (
    <>
      <div className="trip-card">
        <div className="trip-card-left">
          {/* Destination name + duration badge */}
          <div className="trip-card-dest">
            🧳 {trip.destination_name || trip.trip_name || 'Trip'}
            <span className="trip-card-duration">{days} day{days !== 1 ? 's' : ''}</span>
          </div>

          {/* Date range */}
          <div className="trip-card-dates">
            📅 {fmtDate(trip.start_date)} → {fmtDate(trip.end_date)}
          </div>

          {/* Travellers */}
          <div className="trip-card-travellers">
            👥 {trip.num_travellers} traveller{trip.num_travellers !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Action buttons */}
        <div className="trip-card-actions">
          <Link
            to={`/trip/${trip.id}`}
            className="trip-card-btn trip-card-btn-view"
          >
            👁 View
          </Link>
          <Link
            to={`/plan-trip?edit=${trip.id}`}
            className="trip-card-btn trip-card-btn-edit"
          >
            ✏️ Edit
          </Link>
          <button
            className="trip-card-btn trip-card-btn-delete"
            onClick={() => setShowConfirm(true)}
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
              Are you sure you want to delete your trip to{' '}
              <strong>{trip.destination_name || trip.trip_name}</strong>?
              This cannot be undone.
            </p>
            <div className="delete-modal-btns">
              <button
                className="delete-modal-cancel"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="delete-modal-confirm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TripCard

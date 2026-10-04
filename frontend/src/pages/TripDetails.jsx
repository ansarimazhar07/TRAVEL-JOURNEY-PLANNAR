/**
 * TripDetails.jsx — Phase 5
 *
 * Route: /trip/:id
 * Displays detailed information about a single trip.
 * Requires login. Only the trip owner can view it (enforced by PHP).
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTrip, deleteTrip } from '../services/api'
import './Trips.css'

// Format "2026-10-10" → "10 October 2026"
function fmtDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Calculate trip duration in days
function calcDays(start, end) {
  if (!start || !end) return 0
  const ms = new Date(end) - new Date(start)
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1
}

function TripDetails() {
  const { id } = useParams()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [trip,         setTrip]         = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [deleting,     setDeleting]     = useState(false)

  // ---- Redirect if not logged in ----
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, authLoading, navigate])

  // ---- Load trip details ----
  useEffect(() => {
    if (!user) return

    setLoading(true)
    setError('')

    getTrip(id)
      .then(result => {
        if (result.success && result.data) {
          setTrip(result.data)
        } else {
          setError(result.error || 'Trip not found.')
        }
      })
      .catch(() => setError('Unable to load trip. Please try again.'))
      .finally(() => setLoading(false))
  }, [id, user])

  // ---- Delete handler ----
  async function handleDelete() {
    setDeleting(true)
    try {
      const result = await deleteTrip(id)
      if (result.success) {
        navigate('/my-trips')
      } else {
        setError(result.error || 'Failed to delete trip.')
        setShowConfirm(false)
      }
    } finally {
      setDeleting(false)
    }
  }

  // ---- Auth loading ----
  if (authLoading) {
    return (
      <main className="tripdetails-page">
        <div className="tripdetails-loading">
          <div className="tripdetails-spinner"></div>
          Loading…
        </div>
      </main>
    )
  }

  if (!user) return null

  // ---- Trip loading ----
  if (loading) {
    return (
      <main className="tripdetails-page">
        <div className="tripdetails-loading">
          <div className="tripdetails-spinner"></div>
          Loading trip…
        </div>
      </main>
    )
  }

  // ---- Error (trip not found / not authorized) ----
  if (error || !trip) {
    return (
      <main className="tripdetails-page">
        <div className="tripdetails-container">
          <Link to="/my-trips" className="tripdetails-back">← Back to My Trips</Link>
          <div className="tripdetails-error-wrap">
            <div style={{ fontSize: '2.5rem', marginBottom: '14px' }}>🔍</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
              {error || 'Trip not found'}
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              This trip may not exist or you don't have permission to view it.
            </p>
            <Link to="/my-trips" className="mytrips-plan-btn">← Back to My Trips</Link>
          </div>
        </div>
      </main>
    )
  }

  const days = calcDays(trip.start_date, trip.end_date)
  const tripLabel = trip.destination_name || trip.trip_name || 'Trip'

  return (
    <main className="tripdetails-page">
      <div className="tripdetails-container">
        {/* Back link */}
        <Link to="/my-trips" className="tripdetails-back">← Back to My Trips</Link>

        <div className="tripdetails-card">
          {/* Coloured header */}
          <div className="tripdetails-header">
            <div className="tripdetails-header-icon">🧳</div>
            <h1 className="tripdetails-trip-name">{tripLabel}</h1>
            <p className="tripdetails-trip-sub">
              Trip #{trip.id} · Created {fmtDate(trip.created_at?.split(' ')[0])}
            </p>
          </div>

          {/* Details */}
          <div className="tripdetails-body">
            {/* Duration badge */}
            <div className="tripdetails-duration-badge">
              📅 {days} day{days !== 1 ? 's' : ''}
            </div>

            {/* Info grid */}
            <div className="tripdetails-info-grid">
              <div className="tripdetails-info-item">
                <div className="tripdetails-info-label">Destination</div>
                <div className="tripdetails-info-value">
                  📍 {trip.destination_name || '—'}
                </div>
              </div>

              <div className="tripdetails-info-item">
                <div className="tripdetails-info-label">Travellers</div>
                <div className="tripdetails-info-value">
                  👥 {trip.num_travellers}
                </div>
              </div>

              <div className="tripdetails-info-item">
                <div className="tripdetails-info-label">Start Date</div>
                <div className="tripdetails-info-value">{fmtDate(trip.start_date)}</div>
              </div>

              <div className="tripdetails-info-item">
                <div className="tripdetails-info-label">End Date</div>
                <div className="tripdetails-info-value">{fmtDate(trip.end_date)}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="tripdetails-actions">
              <Link
                to={`/plan-trip?edit=${trip.id}`}
                className="tripdetails-btn tripdetails-btn-edit"
              >
                ✏️ Edit Trip
              </Link>
              <Link
                to={`/budget?trip_id=${trip.id}`}
                className="tripdetails-btn tripdetails-btn-budget"
                id="tripdetails-budget-btn"
              >
                💰 Calculate Budget
              </Link>
              <Link
                to={`/ai-recommendation?destination=${encodeURIComponent(trip.destination_name || '')}&days=${days}&travellers=${trip.num_travellers}`}
                className="tripdetails-btn tripdetails-btn-ai"
                id="tripdetails-ai-btn"
              >
                🤖 Get AI Recommendation
              </Link>
              <button
                className="tripdetails-btn tripdetails-btn-delete"
                onClick={() => setShowConfirm(true)}
              >
                🗑 Delete Trip
              </button>
            </div>

            {/* Inline delete confirmation */}
            {showConfirm && (
              <div className="tripdetails-confirm">
                <p>Are you sure you want to delete this trip? This cannot be undone.</p>
                <div className="tripdetails-confirm-btns">
                  <button
                    className="tripdetails-confirm-yes"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting…' : 'Yes, Delete'}
                  </button>
                  <button
                    className="tripdetails-confirm-no"
                    onClick={() => setShowConfirm(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default TripDetails

/**
 * MyTrips.jsx — Phase 5
 *
 * Route: /my-trips
 * Lists all trips created by the logged-in user.
 * Requires login.
 */

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTrips } from '../services/api'
import TripCard from '../components/TripCard'
import './Trips.css'

function MyTrips() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [trips,   setTrips]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  // ---- Redirect if not logged in ----
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, authLoading, navigate])

  // ---- Load trips ----
  useEffect(() => {
    if (!user) return

    setLoading(true)
    setError('')

    getTrips()
      .then(result => {
        if (result.success) {
          setTrips(result.data || [])
        } else {
          setError(result.error || 'Failed to load trips.')
        }
      })
      .catch(() => setError('Unable to connect to server. Please try again.'))
      .finally(() => setLoading(false))
  }, [user])

  // ---- Called by TripCard after successful deletion ----
  function handleTripDeleted(deletedId) {
    setTrips(prev => prev.filter(t => t.id !== deletedId))
  }

  // ---- Loading: waiting for auth ----
  if (authLoading) {
    return (
      <main className="mytrips-page">
        <div className="mytrips-loading">
          <div className="mytrips-spinner"></div>
          Loading…
        </div>
      </main>
    )
  }

  if (!user) return null

  return (
    <main className="mytrips-page">
      <div className="mytrips-header">
        <div className="mytrips-title-row">
          <div>
            <h1 className="mytrips-title">🧳 My Trips</h1>
            <p className="mytrips-subtitle">
              {loading
                ? 'Loading your trips…'
                : `${trips.length} trip${trips.length !== 1 ? 's' : ''} saved`}
            </p>
          </div>
          <Link to="/plan-trip" className="mytrips-plan-btn">
            + Plan New Trip
          </Link>
        </div>
      </div>

      {/* Loading trips */}
      {loading && (
        <div className="mytrips-loading">
          <div className="mytrips-spinner"></div>
          Loading trips…
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mytrips-error">{error}</div>
      )}

      {/* Empty state */}
      {!loading && !error && trips.length === 0 && (
        <div className="mytrips-empty">
          <div className="mytrips-empty-icon">✈️</div>
          <h3>No trips yet</h3>
          <p>You haven't planned any trips yet. Start planning your first adventure!</p>
          <Link to="/plan-trip" className="mytrips-plan-btn">
            Plan Your First Trip
          </Link>
        </div>
      )}

      {/* Trip cards */}
      {!loading && !error && trips.length > 0 && (
        <div className="mytrips-grid">
          {trips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDelete={handleTripDeleted}
            />
          ))}
        </div>
      )}
    </main>
  )
}

export default MyTrips

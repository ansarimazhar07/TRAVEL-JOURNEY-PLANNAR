/**
 * MyTrips.jsx — Manage Trips
 *
 * Route: /my-trips
 * Lists all trips created by the user.
 * Allows filtering (All, Upcoming, Past), search by destination/source,
 * and managing multiple trips.
 */

import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTrips } from '../services/api'
import TripCard from '../components/TripCard'
import './Trips.css'

function MyTrips() {
  const { user, login, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [trips,       setTrips]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [searchTerm,  setSearchTerm]  = useState('')
  const [activeFilter, setActiveFilter] = useState('all') // 'all', 'upcoming', 'past'

  // Ensure user exists so My Trips is always accessible
  useEffect(() => {
    if (!authLoading && !user) {
      const guestUser = { id: 1, name: 'Explorer', email: 'explorer@travelplanner.local' }
      try { localStorage.setItem('travel_planner_user', JSON.stringify(guestUser)) } catch {}
      login(guestUser)
    }
  }, [user, authLoading, login])

  // ---- Load trips ----
  useEffect(() => {
    fetchTripList()
  }, [])

  function fetchTripList() {
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
  }

  // ---- Called by TripCard after successful deletion ----
  function handleTripDeleted(deletedId) {
    setTrips(prev => prev.filter(t => t.id !== deletedId))
  }

  // ---- Filter trips based on search term and timing filter ----
  const filteredTrips = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const term = searchTerm.trim().toLowerCase()

    return trips.filter(trip => {
      // Search matching
      const matchesSearch =
        term === '' ||
        (trip.destination_name && trip.destination_name.toLowerCase().includes(term)) ||
        (trip.source_location && trip.source_location.toLowerCase().includes(term)) ||
        (trip.trip_name && trip.trip_name.toLowerCase().includes(term))

      // Timing filter
      let matchesTiming = true
      if (activeFilter === 'upcoming') {
        matchesTiming = trip.start_date >= today
      } else if (activeFilter === 'past') {
        matchesTiming = trip.end_date < today
      }

      return matchesSearch && matchesTiming
    })
  }, [trips, searchTerm, activeFilter])

  // Statistics
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const upcoming = trips.filter(t => t.start_date >= today).length
    const totalPeople = trips.reduce((acc, t) => acc + (t.num_travellers || 1), 0)
    return {
      total: trips.length,
      upcoming,
      totalPeople,
    }
  }, [trips])

  // ---- Loading state ----
  if (authLoading) {
    return (
      <main className="mytrips-page">
        <div className="mytrips-loading">
          <div className="mytrips-spinner"></div>
          Loading your travel plans…
        </div>
      </main>
    )
  }

  return (
    <main className="mytrips-page">
      {/* Header */}
      <div className="mytrips-header">
        <div className="mytrips-title-row">
          <div>
            <h1 className="mytrips-title">🧳 My Planned Trips</h1>
            <p className="mytrips-subtitle">
              Manage your upcoming adventures, past journeys, and customized travel itineraries.
            </p>
          </div>
          <Link to="/plan-trip" className="mytrips-plan-btn" id="mytrips-new-trip-btn">
            + Plan New Trip
          </Link>
        </div>

        {/* Stats Strip */}
        {trips.length > 0 && (
          <div className="mytrips-stats-strip">
            <div className="mytrip-stat-card">
              <span className="stat-num">{stats.total}</span>
              <span className="stat-label">Total Trips Planned</span>
            </div>
            <div className="mytrip-stat-card">
              <span className="stat-num">{stats.upcoming}</span>
              <span className="stat-label">Upcoming Adventures</span>
            </div>
            <div className="mytrip-stat-card">
              <span className="stat-num">{stats.totalPeople}</span>
              <span className="stat-label">Travellers Moving</span>
            </div>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        {trips.length > 0 && (
          <div className="mytrips-filter-toolbar">
            <div className="mytrips-search-wrap">
              <span className="mytrips-search-icon">🔍</span>
              <input
                type="text"
                className="mytrips-search-input"
                placeholder="Search by destination or departure city..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="mytrips-clear-btn"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="mytrips-tabs">
              <button
                type="button"
                className={`mytrips-tab ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Trips ({trips.length})
              </button>
              <button
                type="button"
                className={`mytrips-tab ${activeFilter === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveFilter('upcoming')}
              >
                Upcoming ({stats.upcoming})
              </button>
              <button
                type="button"
                className={`mytrips-tab ${activeFilter === 'past' ? 'active' : ''}`}
                onClick={() => setActiveFilter('past')}
              >
                Completed
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="mytrips-loading">
          <div className="mytrips-spinner"></div>
          Loading your trips…
        </div>
      )}

      {/* Error display */}
      {!loading && error && (
        <div className="mytrips-error">
          ⚠️ {error}
          <button
            className="btn btn-sm btn-outline"
            style={{ marginLeft: '12px' }}
            onClick={fetchTripList}
          >
            Retry
          </button>
        </div>
      )}

      {/* Zero trips planned yet */}
      {!loading && !error && trips.length === 0 && (
        <div className="mytrips-empty">
          <div className="mytrips-empty-icon">🗺️</div>
          <h3>No trips planned yet</h3>
          <p>
            You haven't planned any journeys yet. Pick your starting city, choose an exciting
            destination, and create your personalized trip!
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
            <Link to="/plan-trip" className="mytrips-plan-btn">
              ✈️ Plan Your First Trip
            </Link>
            <Link to="/destinations" className="btn btn-outline">
              Explore Destinations
            </Link>
          </div>
        </div>
      )}

      {/* No results matching search/filter */}
      {!loading && !error && trips.length > 0 && filteredTrips.length === 0 && (
        <div className="mytrips-empty" style={{ padding: '40px 20px' }}>
          <div className="mytrips-empty-icon">🔍</div>
          <h3>No matching trips found</h3>
          <p>Try clearing your search query or switching your status filter.</p>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: '12px' }}
            onClick={() => { setSearchTerm(''); setActiveFilter('all'); }}
          >
            Show All Trips
          </button>
        </div>
      )}

      {/* Trip Cards Grid */}
      {!loading && !error && filteredTrips.length > 0 && (
        <div className="mytrips-grid">
          {filteredTrips.map(trip => (
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

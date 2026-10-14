/**
 * TripDetails.jsx — View Single Trip with Integrated Gemini AI Planning
 *
 * Route: /trip/:id
 * Displays complete details about a single trip:
 * - Route: Source location -> Destination
 * - Journey dates & duration
 * - Number of travellers
 * - Destination summary snapshot
 * - Integrated Gemini AI Day-by-Day Journey Itinerary
 * - Estimated budget overview
 * - Actions (Edit, Train Search, Budget, Delete)
 */

import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTrip, deleteTrip, updateTrip, generateAITripPlan } from '../services/api'
import { getDestinationById, DESTINATIONS_DATA } from '../data/travelData'
import AIItineraryDisplay from '../components/AIItineraryDisplay'
import './Trips.css'

// Format "2026-10-10" → "10 October 2026"
function fmtDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
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
  const days = Math.round(ms / (1000 * 60 * 60 * 24)) + 1
  return days > 0 ? days : 1
}

// Status badge helper
function getStatusBadge(start, end) {
  if (!start || !end) return null
  const today = new Date().toISOString().split('T')[0]
  if (today < start) return { label: 'Upcoming Journey', class: 'status-upcoming' }
  if (today >= start && today <= end) return { label: 'Journey in Progress', class: 'status-active' }
  return { label: 'Completed Trip', class: 'status-past' }
}

function TripDetails() {
  const { id } = useParams()
  const { user, login, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [trip,         setTrip]         = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [showConfirm,  setShowConfirm]  = useState(false)
  const [deleting,     setDeleting]     = useState(false)

  // AI Itinerary State
  const [aiPlan,       setAiPlan]       = useState('')
  const [aiLoading,    setAiLoading]    = useState(false)

  // Ensure user session exists so details is always accessible
  useEffect(() => {
    if (!authLoading && !user) {
      const guestUser = { id: 1, name: 'Explorer', email: 'explorer@travelplanner.local' }
      try { localStorage.setItem('travel_planner_user', JSON.stringify(guestUser)) } catch {}
      login(guestUser)
    }
  }, [user, authLoading, login])

  // ---- Load trip details ----
  useEffect(() => {
    setLoading(true)
    setError('')

    getTrip(id)
      .then(result => {
        if (result.success && result.data) {
          const t = result.data
          setTrip(t)
          // Extract existing AI plan if stored in notes
          if (t.notes && (t.notes.includes('## 🗺️') || t.notes.includes('Journey Itinerary') || t.notes.includes('Day-by-Day'))) {
            setAiPlan(t.notes)
          }
        } else {
          setError(result.error || 'Trip not found.')
        }
      })
      .catch(() => setError('Unable to load trip. Please try again.'))
      .finally(() => setLoading(false))
  }, [id])

  // Destination metadata if matched (by ID or destination name)
  const destInfo = useMemo(() => {
    if (!trip) return null
    if (trip.destination_id) {
      const match = getDestinationById(trip.destination_id)
      if (match) return match
    }
    if (trip.destination_name) {
      return DESTINATIONS_DATA.find(d => d.name.toLowerCase() === trip.destination_name.toLowerCase()) || null
    }
    return null
  }, [trip])

  const days = useMemo(() => {
    return trip ? calcDays(trip.start_date, trip.end_date) : 0
  }, [trip])

  const status = useMemo(() => {
    return trip ? getStatusBadge(trip.start_date, trip.end_date) : null
  }, [trip])

  // Estimated budget based on days and travellers
  const estimatedBudget = useMemo(() => {
    if (!trip || days <= 0) return null
    const dailyRate = destInfo?.budget?.daily_midrange || 3500
    return dailyRate * days * (trip.num_travellers || 1)
  }, [trip, days, destInfo])

  // ---- Generate / Refresh AI Plan on Trip Details ----
  async function handleGenerateAI() {
    if (!trip) return
    setAiLoading(true)
    try {
      const sourceName = trip.source_location || 'New Delhi'
      const destName   = trip.destination_name || (destInfo ? destInfo.name : 'Destination')
      const planRes = await generateAITripPlan({
        source_location: sourceName,
        destination: destName,
        destination_name: destName,
        destination_id: trip.destination_id,
        days: days || 3,
        travellers: trip.num_travellers || 1,
        budget: estimatedBudget || (days * 3500 * (trip.num_travellers || 1)),
        start_date: trip.start_date,
        end_date: trip.end_date,
      })

      if (planRes && planRes.recommendation) {
        setAiPlan(planRes.recommendation)
        // Also persist to trip notes
        updateTrip(trip.id, {
          destination_id: trip.destination_id,
          destination_name: destName,
          source_location: sourceName,
          start_date: trip.start_date,
          end_date: trip.end_date,
          num_travellers: trip.num_travellers,
          trip_name: trip.trip_name,
          notes: planRes.recommendation
        }).catch(() => {})
      }
    } catch {
      // Ignored
    } finally {
      setAiLoading(false)
    }
  }

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

  // Auth loading
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

  // Trip loading
  if (loading) {
    return (
      <main className="tripdetails-page">
        <div className="tripdetails-container">
          <div className="tripdetails-spinner"></div>
          Loading trip details…
        </div>
      </main>
    )
  }

  // Error state
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
              This trip may have been removed or is no longer available.
            </p>
            <Link to="/my-trips" className="mytrips-plan-btn">← Back to My Trips</Link>
          </div>
        </div>
      </main>
    )
  }

  const sourceName = trip.source_location || 'Departure City'
  const destName   = trip.destination_name || 'Destination'
  const tripLabel  = trip.trip_name || `${sourceName} to ${destName} Trip`

  return (
    <main className="tripdetails-page">
      <div className="tripdetails-container">
        {/* Back Link */}
        <div className="tripdetails-nav-row">
          <Link to="/my-trips" className="tripdetails-back">
            ← Back to My Trips
          </Link>
          <span className="tripdetails-id-tag">Trip #{trip.id}</span>
        </div>

        <div className="tripdetails-card">
          {/* Header Banner */}
          <div className="tripdetails-header">
            <div className="tripdetails-header-badges">
              {status && (
                <span className={`trip-status-badge ${status.class}`}>
                  {status.label}
                </span>
              )}
              <span className="tripdetails-duration-pill">
                ⏳ {days} day{days !== 1 ? 's' : ''} journey
              </span>
            </div>

            {/* Prominent Route Banner */}
            <div className="tripdetails-route-banner">
              <div className="route-banner-item">
                <span className="route-banner-icon">🛫</span>
                <span className="route-banner-city">{sourceName}</span>
                <span className="route-banner-sub">Departure Point</span>
              </div>
              <div className="route-banner-divider">➔</div>
              <div className="route-banner-item">
                <span className="route-banner-icon">📍</span>
                <span className="route-banner-city">{destName}</span>
                <span className="route-banner-sub">Destination</span>
              </div>
            </div>

            <h1 className="tripdetails-trip-name">{tripLabel}</h1>
            <p className="tripdetails-trip-sub">
              Created on {fmtDate(trip.created_at?.split(' ')[0] || trip.created_at)}
            </p>
          </div>

          {/* Details Body */}
          <div className="tripdetails-body">
            {/* Visual Journey Breakdown */}
            <div className="tripdetails-journey-breakdown">
              <h3 className="section-small-title">🗺️ Planned Journey Overview</h3>
              <div className="journey-timeline-grid">
                <div className="timeline-item">
                  <div className="timeline-icon">🛫</div>
                  <div className="timeline-content">
                    <div className="timeline-label">Departure From</div>
                    <div className="timeline-val">{sourceName}</div>
                    <div className="timeline-date">{fmtDate(trip.start_date)}</div>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-icon">🏨</div>
                  <div className="timeline-content">
                    <div className="timeline-label">Exploring & Stay</div>
                    <div className="timeline-val">{destName}</div>
                    <div className="timeline-date">{days} Days Total Duration</div>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-icon">👥</div>
                  <div className="timeline-content">
                    <div className="timeline-label">Travellers</div>
                    <div className="timeline-val">{trip.num_travellers} Person{trip.num_travellers !== 1 ? 's' : ''}</div>
                    <div className="timeline-date">Group Size</div>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-icon">🏁</div>
                  <div className="timeline-content">
                    <div className="timeline-label">Return Date</div>
                    <div className="timeline-val">{fmtDate(trip.end_date)}</div>
                    <div className="timeline-date">Trip Conclusion</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Destination Snapshot Card */}
            {destInfo && (
              <div className="tripdetails-dest-snapshot">
                <div className="snapshot-img-wrap">
                  {destInfo.image_url ? (
                    <img
                      src={destInfo.image_url}
                      alt={destInfo.name}
                      className="snapshot-img"
                    />
                  ) : (
                    <div className="snapshot-fallback">📍</div>
                  )}
                  {destInfo.category && (
                    <span className="snapshot-cat-badge">{destInfo.category}</span>
                  )}
                </div>
                <div className="snapshot-body">
                  <div className="snapshot-title-row">
                    <h4>Destination: {destInfo.name}</h4>
                    {destInfo.best_time && (
                      <span className="snapshot-time">🗓️ Best: {destInfo.best_time}</span>
                    )}
                  </div>
                  <p className="snapshot-desc">{destInfo.description}</p>
                  <div className="snapshot-actions">
                    <Link
                      to={`/destinations/${destInfo.id}`}
                      className="btn btn-sm btn-outline"
                    >
                      Explore {destInfo.name} Guide ↗
                    </Link>
                    <Link
                      to={`/places?destination_id=${destInfo.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      View Attractions
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Estimated Trip Budget Banner */}
            {estimatedBudget !== null && (
              <div className="tripdetails-budget-banner">
                <div className="budget-banner-left">
                  <span className="budget-banner-icon">💰</span>
                  <div>
                    <div className="budget-banner-title">Estimated Total Trip Budget</div>
                    <div className="budget-banner-sub">
                      Based on ~₹{destInfo?.budget?.daily_midrange?.toLocaleString('en-IN') || '3,500'}/day
                      for {days} days and {trip.num_travellers} traveller{trip.num_travellers !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="budget-banner-amount">
                  ₹{estimatedBudget.toLocaleString('en-IN')}
                </div>
              </div>
            )}

            {/* Integrated Gemini AI Day-by-Day Journey Itinerary */}
            <div className="tripdetails-ai-section">
              <div className="tripdetails-ai-header">
                <div>
                  <h3 className="section-small-title" style={{ margin: 0 }}>
                    🤖 Gemini AI Day-by-Day Journey Plan
                  </h3>
                  <p className="ai-subtext">
                    Customized planning from {sourceName} to {destName} with transit, attractions, food &amp; schedule.
                  </p>
                </div>

                {!aiPlan && !aiLoading && (
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleGenerateAI}
                  >
                    ✨ Generate Gemini AI Plan
                  </button>
                )}
              </div>

              {aiLoading && (
                <div className="ai-itinerary-loading-card">
                  <div className="ai-magic-spinner"></div>
                  <h4>Gemini AI is crafting your trip plan…</h4>
                  <p>Organizing day-by-day itinerary and transit details from {sourceName} to {destName}.</p>
                </div>
              )}

              {aiPlan && (
                <AIItineraryDisplay
                  plan={aiPlan}
                  sourceLocation={sourceName}
                  destinationName={destName}
                  days={days}
                  onRegenerate={handleGenerateAI}
                />
              )}
            </div>

            {/* Notes if provided (and not duplicate of AI plan) */}
            {trip.notes && !aiPlan && (
              <div className="tripdetails-notes-box">
                <h4>📝 Trip Notes &amp; Itinerary Plans:</h4>
                <p>{trip.notes}</p>
              </div>
            )}

            {/* Action Buttons Toolbar */}
            <div className="tripdetails-actions">
              <Link
                to={`/plan-trip?edit=${trip.id}`}
                className="tripdetails-btn tripdetails-btn-edit"
              >
                ✏️ Edit Trip Details
              </Link>
              <Link
                to={`/train-search?from=${encodeURIComponent(sourceName)}&to=${encodeURIComponent(destName)}`}
                className="tripdetails-btn tripdetails-btn-train"
                id="tripdetails-train-btn"
              >
                🚂 Search Trains ({sourceName} ➔ {destName})
              </Link>
              <Link
                to={`/budget?trip_id=${trip.id}`}
                className="tripdetails-btn tripdetails-btn-budget"
                id="tripdetails-budget-btn"
              >
                💰 Calculate Budget
              </Link>
              <button
                type="button"
                className="tripdetails-btn tripdetails-btn-delete"
                onClick={() => setShowConfirm(true)}
              >
                🗑 Delete Trip
              </button>
            </div>

            {/* Inline delete confirmation */}
            {showConfirm && (
              <div className="tripdetails-confirm">
                <p>
                  Are you sure you want to delete your trip from{' '}
                  <strong>{sourceName}</strong> to <strong>{destName}</strong>?
                  This cannot be undone.
                </p>
                <div className="tripdetails-confirm-btns">
                  <button
                    type="button"
                    className="tripdetails-confirm-yes"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting…' : 'Yes, Delete Trip'}
                  </button>
                  <button
                    type="button"
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

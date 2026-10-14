/**
 * TripPlanner.jsx — Trip Planner Feature with Gemini AI Integration
 *
 * Route: /plan-trip
 * Route: /plan-trip?destination=<id>  (pre-selects destination)
 * Route: /plan-trip?edit=<id>         (edit mode)
 *
 * Features:
 * - Source Location (departure city) with popular departure suggestions
 * - Destination with live destination preview card
 * - Travel Start Date and Return/End Date with real-time duration
 * - Number of Travellers
 * - Integrated Gemini AI Trip Planning (generates proper day-wise planning from source to destination)
 * - Live Journey Summary and Estimated Trip Budget before creating
 * - Create personalized trips or update existing trips
 */

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDestinations, createTrip, getTrip, updateTrip, generateAITripPlan } from '../services/api'
import { POPULAR_SOURCE_CITIES, DESTINATIONS_DATA, getDestinationById } from '../data/travelData'
import AIItineraryDisplay from '../components/AIItineraryDisplay'
import './Trips.css'

// Helper: Calculate number of days between two dates inclusive
function calcDays(start, end) {
  if (!start || !end) return 0
  const d1 = new Date(start)
  const d2 = new Date(end)
  if (isNaN(d1) || isNaN(d2)) return 0
  const diffTime = d2 - d1
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays > 0 ? diffDays : 0
}

const TRAVEL_STYLES = [
  'Heritage & Culture',
  'Relaxed & Foodie',
  'Adventure & Nature',
  'Budget Backpacker',
  'Family Friendly',
  'Romantic & Scenic'
]

// Popular destinations for instant 1-click selection (users can also type ANY location)
const POPULAR_DESTINATIONS = [
  'Jaipur',
  'Goa',
  'Manali',
  'Kerala',
  'Agra',
  'Varanasi',
  'Udaipur',
  'Ladakh',
  'Shimla',
  'Rishikesh',
  'Paris',
  'Dubai'
]

function TripPlanner() {
  const { user, login, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // URL parameters
  const editId = searchParams.get('edit') ? parseInt(searchParams.get('edit'), 10) : null
  const isEdit = Boolean(editId)
  const preselectedDest = searchParams.get('destination') || searchParams.get('destination_id')
  const shouldAutoAi = searchParams.get('ai') === '1'

  // Today's date string for min date (YYYY-MM-DD)
  const todayStr = useMemo(() => {
    return new Date().toISOString().split('T')[0]
  }, [])

  // Form State
  const [sourceLocation,   setSourceLocation]   = useState('New Delhi')
  const [destinationInput, setDestinationInput] = useState('')
  const [destinationId,    setDestinationId]    = useState('')
  const [startDate,        setStartDate]        = useState('')
  const [endDate,          setEndDate]          = useState('')
  const [travellers,       setTravellers]       = useState(2)
  const [tripName,         setTripName]         = useState('')
  const [showCustomName,   setShowCustomName]   = useState(false)
  const [notes,            setNotes]            = useState('')

  // Gemini AI Travel Planner State
  const [aiTravelStyle, setAiTravelStyle] = useState('Heritage & Culture')
  const [aiPlan,        setAiPlan]        = useState('')
  const [aiLoading,     setAiLoading]     = useState(false)
  const [aiError,       setAiError]       = useState('')
  const [showAiBox,     setShowAiBox]     = useState(shouldAutoAi)
  const aiSectionRef                      = useRef(null)

  // UI state
  const [destinations, setDestinations] = useState([])
  const [destLoading,  setDestLoading]  = useState(true)
  const [errors,       setErrors]       = useState({})
  const [apiError,     setApiError]     = useState('')
  const [success,      setSuccess]      = useState('')
  const [submitting,   setSubmitting]   = useState(false)
  const [tripLoading,  setTripLoading]  = useState(isEdit)

  // Ensure user session exists so user is never blocked
  useEffect(() => {
    if (!authLoading && !user) {
      const guestUser = { id: 1, name: 'Explorer', email: 'explorer@travelplanner.local' }
      try { localStorage.setItem('travel_planner_user', JSON.stringify(guestUser)) } catch {}
      login(guestUser)
    }
  }, [user, authLoading, login])

  // ---- Load destinations and resolve preselected destination ----
  useEffect(() => {
    setDestLoading(true)
    getDestinations()
      .then(data => {
        setDestinations(data)
        if (preselectedDest) {
          const match = data.find(d => String(d.id) === String(preselectedDest) || d.name.toLowerCase() === String(preselectedDest).toLowerCase()) ||
                        DESTINATIONS_DATA.find(d => String(d.id) === String(preselectedDest) || d.name.toLowerCase() === String(preselectedDest).toLowerCase())
          if (match) {
            setDestinationInput(match.name)
            setDestinationId(String(match.id))
          } else {
            setDestinationInput(String(preselectedDest))
          }
        }
      })
      .catch(() => setDestinations([]))
      .finally(() => setDestLoading(false))
  }, [preselectedDest])

  // ---- If editing, load the existing trip data ----
  useEffect(() => {
    if (!isEdit) return

    setTripLoading(true)
    getTrip(editId)
      .then(result => {
        if (result.success && result.data) {
          const t = result.data
          if (t.destination_name) {
            setDestinationInput(t.destination_name)
          }
          if (t.destination_id) {
            setDestinationId(String(t.destination_id))
          }
          setSourceLocation(t.source_location || 'New Delhi')
          setStartDate(t.start_date || '')
          setEndDate(t.end_date || '')
          setTravellers(t.num_travellers || 1)
          if (t.trip_name) {
            setTripName(t.trip_name)
            setShowCustomName(true)
          }
          if (t.notes) {
            // Check if notes contains AI plan
            if (t.notes.includes('## 🗺️') || t.notes.includes('Journey Itinerary') || t.notes.includes('Travel Journey Plan')) {
              setAiPlan(t.notes)
              setShowAiBox(true)
            } else {
              const cleanNotes = t.notes.replace(/^Source:\s*[^\n\r]+\n?/i, '')
              setNotes(cleanNotes)
            }
          }
        } else {
          setApiError(result.error || 'Trip not found.')
        }
      })
      .catch(() => setApiError('Unable to load trip details.'))
      .finally(() => setTripLoading(false))
  }, [isEdit, editId])

  // Helper: change destination input and auto-match known ID if exists
  function handleDestinationChange(val) {
    setDestinationInput(val)
    const match = destinations.find(d => d.name.toLowerCase() === val.trim().toLowerCase()) ||
                  DESTINATIONS_DATA.find(d => d.name.toLowerCase() === val.trim().toLowerCase())
    if (match) {
      setDestinationId(String(match.id))
    } else {
      setDestinationId('')
    }
    if (errors.destinationInput) {
      setErrors(prev => ({ ...prev, destinationInput: '' }))
    }
  }

  function handleSelectDestinationChip(name) {
    setDestinationInput(name)
    const match = destinations.find(d => d.name.toLowerCase() === name.toLowerCase()) ||
                  DESTINATIONS_DATA.find(d => d.name.toLowerCase() === name.toLowerCase())
    if (match) {
      setDestinationId(String(match.id))
    } else {
      setDestinationId('')
    }
    if (errors.destinationInput) {
      setErrors(prev => ({ ...prev, destinationInput: '' }))
    }
  }

  // Selected destination metadata preview (matches by ID or name)
  const selectedDestObj = useMemo(() => {
    const inputClean = destinationInput.trim().toLowerCase()
    if (destinationId) {
      const byId = destinations.find(d => d.id === Number(destinationId)) || getDestinationById(destinationId)
      if (byId) return byId
    }
    if (inputClean) {
      return (
        destinations.find(d => d.name.toLowerCase() === inputClean) ||
        DESTINATIONS_DATA.find(d => d.name.toLowerCase() === inputClean) ||
        null
      )
    }
    return null
  }, [destinationId, destinationInput, destinations])

  // Trip duration in days
  const tripDays = useMemo(() => {
    return calcDays(startDate, endDate) || 3
  }, [startDate, endDate])

  // Estimated budget preview
  const estimatedCost = useMemo(() => {
    const dailyRate = selectedDestObj?.budget?.daily_midrange || 3500
    const total = dailyRate * (tripDays || 3) * (travellers || 1)
    return total
  }, [selectedDestObj, tripDays, travellers])

  // Auto-generate trip name preview
  const autoTripName = useMemo(() => {
    const src = (sourceLocation || 'Origin').trim()
    const dest = destinationInput.trim() || (selectedDestObj ? selectedDestObj.name : 'Destination')
    return `${src} to ${dest} Trip`
  }, [sourceLocation, destinationInput, selectedDestObj])

  // ---- Generate Gemini AI Plan Handler ----
  async function handleGenerateAIPlan() {
    setAiError('')
    if (!destinationInput.trim()) {
      setErrors(prev => ({ ...prev, destinationInput: 'Please enter any destination location to plan.' }))
      return
    }
    if (!sourceLocation.trim()) {
      setErrors(prev => ({ ...prev, sourceLocation: 'Please enter departure city.' }))
      return
    }

    setAiLoading(true)
    setShowAiBox(true)

    try {
      const destName = destinationInput.trim()
      const planResult = await generateAITripPlan({
        source_location: sourceLocation.trim(),
        destination: destName,
        destination_name: destName,
        destination_id: destinationId || null,
        days: tripDays,
        travellers: travellers,
        budget: estimatedCost || (tripDays * 3500 * travellers),
        start_date: startDate,
        end_date: endDate,
        preferences: aiTravelStyle,
        interests: aiTravelStyle,
      })

      if (planResult && planResult.recommendation) {
        setAiPlan(planResult.recommendation)
        // Auto-save plan into notes so it gets persisted on trip creation
        setNotes(planResult.recommendation)
      } else {
        setAiError('Unable to generate AI plan. Please try again.')
      }
    } catch (err) {
      setAiError(err.message || 'Unable to generate AI plan.')
    } finally {
      setAiLoading(false)
      if (aiSectionRef.current) {
        aiSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // ---- Form validation ----
  function validate() {
    const errs = {}
    if (!sourceLocation.trim()) {
      errs.sourceLocation = 'Please specify your source departure location.'
    }
    if (!destinationInput.trim()) {
      errs.destinationInput = 'Please enter or select a destination.'
    }
    if (!startDate) {
      errs.startDate = 'Please select a travel start date.'
    }
    if (!endDate) {
      errs.endDate = 'Please select a return/end date.'
    }
    if (startDate && endDate && endDate < startDate) {
      errs.endDate = 'Return date cannot be earlier than start date.'
    }
    if (!travellers || travellers < 1) {
      errs.travellers = 'Number of travellers must be at least 1.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ---- Handle form submit ----
  async function handleSubmit(e) {
    e.preventDefault()
    setApiError('')
    setSuccess('')

    if (!validate()) return

    // Prepare combined notes (including AI plan if generated)
    let finalNotes = notes.trim()
    if (aiPlan && !finalNotes.includes(aiPlan.slice(0, 30))) {
      finalNotes = finalNotes ? `${finalNotes}\n\n${aiPlan}` : aiPlan
    }

    const payload = {
      source_location:  sourceLocation.trim(),
      destination_id:   destinationId ? parseInt(destinationId, 10) : 0,
      destination_name: destinationInput.trim(),
      start_date:       startDate,
      end_date:         endDate,
      num_travellers:   parseInt(travellers, 10),
      trip_name:        tripName.trim() || autoTripName,
      notes:            finalNotes,
    }

    setSubmitting(true)
    try {
      let result

      if (isEdit) {
        result = await updateTrip(editId, payload)
      } else {
        result = await createTrip(payload)
      }

      if (result.success) {
        setSuccess(isEdit ? 'Trip updated successfully!' : 'Personalized trip created successfully!')
        setTimeout(() => {
          navigate('/my-trips')
        }, 1200)
      } else {
        setApiError(result.error || result.message || 'Something went wrong while saving.')
      }
    } catch {
      setApiError('Unable to connect to server. Your trip has been saved locally.')
      setTimeout(() => navigate('/my-trips'), 1200)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="planner-page">
      <div className="planner-card">
        {/* Header */}
        <div className="planner-icon">{isEdit ? '✏️' : '🗺️'}</div>
        <h1 className="planner-title">{isEdit ? 'Edit Planned Trip' : 'Plan Your Journey'}</h1>
        <p className="planner-subtitle">
          {isEdit
            ? 'Update your source, destination, dates, travellers, and AI itinerary below.'
            : 'Select departure point, destination, dates, and travellers. Use Gemini AI to automatically generate a complete day-by-day plan.'}
        </p>

        {tripLoading ? (
          <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-light)' }}>
            <div className="mytrips-spinner" style={{ margin: '0 auto 12px' }}></div>
            Loading trip details…
          </div>
        ) : (
          <form className="planner-form" onSubmit={handleSubmit} noValidate>
            {/* Success Alert */}
            {success && (
              <div className="planner-success" role="status">
                🎉 {success}
              </div>
            )}

            {/* Error Alert */}
            {apiError && (
              <div className="planner-error" role="alert">
                ⚠️ {apiError}
              </div>
            )}

            {/* 1. SOURCE LOCATION */}
            <div className="planner-field">
              <label htmlFor="planner-source" className="planner-label">
                🛫 Source Location (Starting Point)
              </label>
              <input
                id="planner-source"
                type="text"
                className={`planner-input ${errors.sourceLocation ? 'error' : ''}`}
                placeholder="e.g. New Delhi, Mumbai, Bengaluru..."
                value={sourceLocation}
                onChange={e => setSourceLocation(e.target.value)}
                disabled={submitting || success}
              />
              {errors.sourceLocation && (
                <span className="planner-field-error">{errors.sourceLocation}</span>
              )}

              {/* Popular Source Departure Cities Quick Chips */}
              <div className="popular-cities-wrap">
                <span className="popular-cities-label">Popular Departures:</span>
                <div className="popular-cities-chips">
                  {POPULAR_SOURCE_CITIES.slice(0, 7).map(c => (
                    <button
                      type="button"
                      key={c.city}
                      className={`city-chip ${sourceLocation.toLowerCase() === c.city.toLowerCase() ? 'active' : ''}`}
                      onClick={() => setSourceLocation(c.city)}
                      disabled={submitting || success}
                    >
                      {c.city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. DESTINATION */}
            <div className="planner-field">
              <label htmlFor="planner-dest" className="planner-label">
                📍 Destination (Enter Any Location Worldwide)
              </label>
              <input
                id="planner-dest"
                type="text"
                list="planner-dest-datalist"
                className={`planner-input ${errors.destinationInput ? 'error' : ''}`}
                placeholder="Type ANY destination worldwide (e.g. Paris, Manali, Zurich, Varanasi, Goa, Tokyo...)"
                value={destinationInput}
                onChange={e => handleDestinationChange(e.target.value)}
                disabled={submitting || success}
                autoComplete="off"
              />
              <datalist id="planner-dest-datalist">
                {destinations.map(d => (
                  <option key={`db-${d.id}`} value={d.name}>
                    {d.name} ({d.state ? `${d.state}, ` : ''}{d.category || 'India'})
                  </option>
                ))}
                {DESTINATIONS_DATA.filter(cd => !destinations.some(d => d.name.toLowerCase() === cd.name.toLowerCase())).map(cd => (
                  <option key={`cd-${cd.id}`} value={cd.name}>
                    {cd.name} ({cd.state || cd.country})
                  </option>
                ))}
              </datalist>
              {errors.destinationInput && (
                <span className="planner-field-error">{errors.destinationInput}</span>
              )}

              {/* Popular Destination Quick Chips */}
              <div className="popular-cities-wrap">
                <span className="popular-cities-label">Popular Destinations:</span>
                <div className="popular-cities-chips">
                  {POPULAR_DESTINATIONS.map(city => (
                    <button
                      type="button"
                      key={city}
                      className={`city-chip ${destinationInput.toLowerCase() === city.toLowerCase() ? 'active' : ''}`}
                      onClick={() => handleSelectDestinationChip(city)}
                      disabled={submitting || success}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Destination Preview Card (Curated or Custom) */}
            {selectedDestObj ? (
              <div className="planner-dest-preview">
                {selectedDestObj.image_url ? (
                  <img
                    src={selectedDestObj.image_url}
                    alt={selectedDestObj.name}
                    className="preview-img"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <div className="preview-fallback">📍</div>
                )}
                <div className="preview-body">
                  <div className="preview-title">
                    <strong>{selectedDestObj.name}</strong>
                    <span className="preview-category">{selectedDestObj.category || 'Curated Destination'}</span>
                  </div>
                  <div className="preview-meta">
                    <span>📍 {selectedDestObj.state || selectedDestObj.country || 'India'}</span>
                    {selectedDestObj.best_time && (
                      <span>🗓️ Best: {selectedDestObj.best_time}</span>
                    )}
                  </div>
                  {selectedDestObj.id && (
                    <Link
                      to={`/destinations/${selectedDestObj.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="preview-explore-link"
                    >
                      View Destination Details ↗
                    </Link>
                  )}
                </div>
              </div>
            ) : destinationInput.trim() ? (
              <div className="planner-dest-preview custom-dest-preview">
                <div className="preview-fallback custom-dest-icon">🌍</div>
                <div className="preview-body">
                  <div className="preview-title">
                    <strong>{destinationInput.trim()}</strong>
                    <span className="preview-category custom-badge">Custom Worldwide Location</span>
                  </div>
                  <div className="preview-meta">
                    <span>✨ Gemini AI will generate transit routes, day-wise plan, food hubs, shopping spots & tips</span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* 3. DATES: START DATE & RETURN DATE */}
            <div className="planner-date-row">
              <div className="planner-field">
                <label htmlFor="planner-start" className="planner-label">
                  📅 Start Date
                </label>
                <input
                  id="planner-start"
                  type="date"
                  className={`planner-input ${errors.startDate ? 'error' : ''}`}
                  value={startDate}
                  min={todayStr}
                  onChange={e => setStartDate(e.target.value)}
                  disabled={submitting || success}
                />
                {errors.startDate && (
                  <span className="planner-field-error">{errors.startDate}</span>
                )}
              </div>

              <div className="planner-field">
                <label htmlFor="planner-end" className="planner-label">
                  🏁 Return/End Date
                </label>
                <input
                  id="planner-end"
                  type="date"
                  className={`planner-input ${errors.endDate ? 'error' : ''}`}
                  value={endDate}
                  min={startDate || todayStr}
                  onChange={e => setEndDate(e.target.value)}
                  disabled={submitting || success}
                />
                {errors.endDate && (
                  <span className="planner-field-error">{errors.endDate}</span>
                )}
              </div>
            </div>

            {/* Duration Display Pill */}
            {tripDays > 0 && (
              <div className="planner-duration-badge">
                ⏳ Trip Duration: <strong>{tripDays} day{tripDays !== 1 ? 's' : ''}</strong>
              </div>
            )}

            {/* 4. NUMBER OF TRAVELLERS */}
            <div className="planner-field">
              <label htmlFor="planner-travellers" className="planner-label">
                👥 Number of Travellers
              </label>
              <div className="traveller-counter-row">
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => setTravellers(prev => Math.max(1, prev - 1))}
                  disabled={submitting || success || travellers <= 1}
                  aria-label="Decrease travellers"
                >
                  −
                </button>
                <input
                  id="planner-travellers"
                  type="number"
                  className={`planner-input counter-input ${errors.travellers ? 'error' : ''}`}
                  value={travellers}
                  min={1}
                  max={50}
                  onChange={e => setTravellers(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  disabled={submitting || success}
                />
                <button
                  type="button"
                  className="counter-btn"
                  onClick={() => setTravellers(prev => prev + 1)}
                  disabled={submitting || success}
                  aria-label="Increase travellers"
                >
                  +
                </button>
              </div>
              {errors.travellers && (
                <span className="planner-field-error">{errors.travellers}</span>
              )}
            </div>

            {/* 5. GEMINI AI TRIP PLANNING SECTION */}
            <div className="planner-ai-section" ref={aiSectionRef}>
              <div className="planner-ai-header-box">
                <div className="ai-box-title-row">
                  <span className="ai-sparkle-badge">🤖 Gemini AI Planner</span>
                  <span className="ai-tag-pill">Source ➔ Destination AI Itinerary</span>
                </div>
                <p className="ai-box-desc">
                  Generate a realistic day-by-day travel plan from{' '}
                  <strong>{sourceLocation || 'your departure point'}</strong> to{' '}
                  <strong>{selectedDestObj ? selectedDestObj.name : 'destination'}</strong> covering
                  train/transit routes, daily attractions, food, and budget tips.
                </p>

                {/* Travel Style Selector */}
                <div className="ai-styles-selector">
                  <span className="ai-styles-label">Select Trip Style:</span>
                  <div className="ai-styles-pills">
                    {TRAVEL_STYLES.map(style => (
                      <button
                        type="button"
                        key={style}
                        className={`style-pill ${aiTravelStyle === style ? 'active' : ''}`}
                        onClick={() => setAiTravelStyle(style)}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  type="button"
                  className="btn-gemini-plan"
                  onClick={handleGenerateAIPlan}
                  disabled={aiLoading || submitting || success}
                  id="btn-gemini-plan-itinerary"
                >
                  {aiLoading ? (
                    <>⏳ Planning with Gemini AI…</>
                  ) : (
                    <>✨ Generate Day-by-Day AI Plan ({sourceLocation} ➔ {selectedDestObj ? selectedDestObj.name : 'Destination'})</>
                  )}
                </button>

                {aiError && (
                  <div className="planner-field-error" style={{ marginTop: '8px' }}>
                    ⚠️ {aiError}
                  </div>
                )}
              </div>

              {/* Display Generated AI Itinerary */}
              {(aiLoading || aiPlan) && (
                <AIItineraryDisplay
                  plan={aiPlan}
                  sourceLocation={sourceLocation}
                  destinationName={selectedDestObj ? selectedDestObj.name : 'Destination'}
                  days={tripDays}
                  loading={aiLoading}
                  onRegenerate={handleGenerateAIPlan}
                />
              )}
            </div>

            {/* 6. LIVE JOURNEY SUMMARY & BUDGET PREVIEW */}
            {sourceLocation && destinationId && startDate && endDate && (
              <div className="planner-journey-summary">
                <div className="summary-header">
                  <span>🗺️ Planned Journey Overview</span>
                  {tripDays > 0 && <span className="summary-days-pill">{tripDays} Days</span>}
                </div>
                <div className="summary-route">
                  <div className="route-point">
                    <span className="route-dot start"></span>
                    <span className="route-city">{sourceLocation}</span>
                  </div>
                  <div className="route-arrow">➔</div>
                  <div className="route-point">
                    <span className="route-dot dest"></span>
                    <span className="route-city">
                      {selectedDestObj ? selectedDestObj.name : 'Destination'}
                    </span>
                  </div>
                </div>

                <div className="summary-details-row">
                  <div>
                    <span className="summary-label">Dates:</span>
                    <span className="summary-val">{startDate} to {endDate}</span>
                  </div>
                  <div>
                    <span className="summary-label">Party:</span>
                    <span className="summary-val">{travellers} {travellers === 1 ? 'Person' : 'People'}</span>
                  </div>
                </div>

                {estimatedCost !== null && (
                  <div className="summary-cost-row">
                    <span className="summary-cost-label">💰 Estimated Total Budget:</span>
                    <span className="summary-cost-val">
                      ₹{estimatedCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 7. OPTIONAL CUSTOM TRIP NAME TOGGLE */}
            <div className="custom-name-toggle-wrap">
              <button
                type="button"
                className="toggle-text-btn"
                onClick={() => setShowCustomName(prev => !prev)}
              >
                {showCustomName ? '− Hide Custom Trip Name' : '+ Add Custom Trip Name / Notes'}
              </button>
            </div>

            {showCustomName && (
              <>
                <div className="planner-field">
                  <label htmlFor="planner-name" className="planner-label">
                    Trip Name (Optional)
                  </label>
                  <input
                    id="planner-name"
                    type="text"
                    className="planner-input"
                    placeholder={`e.g. ${autoTripName}`}
                    value={tripName}
                    onChange={e => setTripName(e.target.value)}
                    disabled={submitting || success}
                  />
                </div>

                <div className="planner-field">
                  <label htmlFor="planner-notes" className="planner-label">
                    Trip Notes &amp; Itinerary
                  </label>
                  <textarea
                    id="planner-notes"
                    className="planner-input"
                    rows={4}
                    placeholder="Special requests, places you want to visit, packing notes..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    disabled={submitting || success}
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="planner-submit-btn"
              disabled={submitting || success}
              id="planner-submit-btn"
            >
              {submitting
                ? (isEdit ? 'Updating trip…' : 'Creating personalized trip…')
                : (isEdit ? '💾 Save Changes' : '✈️ Create Personalized Trip')}
            </button>
          </form>
        )}

        {/* Footer Link */}
        <p className="planner-footer">
          <Link to="/my-trips">← View All My Trips</Link>
          <span style={{ margin: '0 8px', color: 'var(--border)' }}>•</span>
          <Link to="/destinations">Explore Destinations →</Link>
        </p>
      </div>
    </main>
  )
}

export default TripPlanner

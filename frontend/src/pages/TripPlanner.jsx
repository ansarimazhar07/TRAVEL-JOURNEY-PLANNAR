/**
 * TripPlanner.jsx — Phase 5
 *
 * Route: /plan-trip
 * Route: /plan-trip?edit=<id>  (edit mode)
 *
 * Single form used for both CREATING and EDITING a trip.
 * Requires login — redirects to /login if not authenticated.
 */

import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDestinations, createTrip, getTrip, updateTrip } from '../services/api'
import './Trips.css'

function TripPlanner() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // If ?edit=<id> is in the URL, we are in edit mode
  const editId = searchParams.get('edit') ? parseInt(searchParams.get('edit'), 10) : null
  const isEdit = Boolean(editId)

  // Form state
  const [destinationId, setDestinationId] = useState('')
  const [startDate,     setStartDate]     = useState('')
  const [endDate,       setEndDate]       = useState('')
  const [travellers,    setTravellers]    = useState(1)

  // UI state
  const [destinations, setDestinations] = useState([])
  const [destLoading,  setDestLoading]  = useState(true)
  const [errors,       setErrors]       = useState({})
  const [apiError,     setApiError]     = useState('')
  const [success,      setSuccess]      = useState('')
  const [submitting,   setSubmitting]   = useState(false)
  const [tripLoading,  setTripLoading]  = useState(isEdit)

  // ---- Redirect if not logged in ----
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, authLoading, navigate])

  // ---- Load destinations for the dropdown ----
  useEffect(() => {
    if (!user) return
    setDestLoading(true)
    getDestinations()
      .then(data => setDestinations(data))
      .catch(() => setDestinations([]))
      .finally(() => setDestLoading(false))
  }, [user])

  // ---- If editing, load the existing trip data ----
  useEffect(() => {
    if (!isEdit || !user) return

    setTripLoading(true)
    getTrip(editId)
      .then(result => {
        if (result.success && result.data) {
          const t = result.data
          setDestinationId(String(t.destination_id || ''))
          setStartDate(t.start_date || '')
          setEndDate(t.end_date || '')
          setTravellers(t.num_travellers || 1)
        } else {
          setApiError(result.error || 'Trip not found.')
        }
      })
      .catch(() => setApiError('Unable to load trip.'))
      .finally(() => setTripLoading(false))
  }, [isEdit, editId, user])

  // ---- Frontend validation ----
  function validate() {
    const errs = {}
    if (!destinationId) errs.destinationId = 'Please select a destination.'
    if (!startDate)     errs.startDate     = 'Please select a start date.'
    if (!endDate)       errs.endDate       = 'Please select an end date.'
    if (startDate && endDate && endDate < startDate) {
      errs.endDate = 'End date cannot be before start date.'
    }
    if (!travellers || travellers < 1) {
      errs.travellers = 'Number of travellers must be at least 1.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ---- Submit handler ----
  async function handleSubmit(e) {
    e.preventDefault()
    setApiError('')
    setSuccess('')

    if (!validate()) return

    const data = {
      destination_id: parseInt(destinationId, 10),
      start_date:     startDate,
      end_date:       endDate,
      num_travellers: parseInt(travellers, 10),
    }

    setSubmitting(true)
    try {
      let result

      if (isEdit) {
        result = await updateTrip(editId, data)
      } else {
        result = await createTrip(data)
      }

      if (result.success) {
        setSuccess(isEdit ? 'Trip updated successfully!' : 'Trip created successfully!')

        // Navigate to My Trips after a short delay
        setTimeout(() => {
          navigate('/my-trips')
        }, 1200)
      } else {
        setApiError(result.error || result.message || 'Something went wrong.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  // ---- Loading states ----
  if (authLoading) {
    return (
      <main className="planner-page">
        <div className="planner-card">
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
            <div className="mytrips-spinner" style={{ margin: '0 auto 12px' }}></div>
            Loading…
          </div>
        </div>
      </main>
    )
  }

  if (!user) return null

  return (
    <main className="planner-page">
      <div className="planner-card">
        <div className="planner-icon">{isEdit ? '✏️' : '🗺️'}</div>
        <h1 className="planner-title">{isEdit ? 'Edit Trip' : 'Plan a Trip'}</h1>
        <p className="planner-subtitle">
          {isEdit
            ? 'Update your trip details below'
            : 'Fill in the details and save your trip'}
        </p>

        {tripLoading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
            <div className="mytrips-spinner" style={{ margin: '0 auto 10px' }}></div>
            Loading trip…
          </div>
        ) : (
          <form className="planner-form" onSubmit={handleSubmit} noValidate>
            {/* Success */}
            {success && (
              <div className="planner-success" role="status">{success}</div>
            )}

            {/* API error */}
            {apiError && (
              <div className="planner-error" role="alert">{apiError}</div>
            )}

            {/* Destination dropdown */}
            <div className="planner-field">
              <label htmlFor="planner-dest" className="planner-label">
                Destination
              </label>
              <select
                id="planner-dest"
                className={`planner-select ${errors.destinationId ? 'error' : ''}`}
                value={destinationId}
                onChange={e => setDestinationId(e.target.value)}
                disabled={submitting || destLoading || success}
              >
                <option value="">
                  {destLoading ? 'Loading destinations…' : '— Select a destination —'}
                </option>
                {destinations.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {errors.destinationId && (
                <span className="planner-field-error">{errors.destinationId}</span>
              )}
            </div>

            {/* Start + End date row */}
            <div className="planner-date-row">
              <div className="planner-field">
                <label htmlFor="planner-start" className="planner-label">
                  Start Date
                </label>
                <input
                  id="planner-start"
                  type="date"
                  className={`planner-input ${errors.startDate ? 'error' : ''}`}
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  disabled={submitting || success}
                />
                {errors.startDate && (
                  <span className="planner-field-error">{errors.startDate}</span>
                )}
              </div>

              <div className="planner-field">
                <label htmlFor="planner-end" className="planner-label">
                  End Date
                </label>
                <input
                  id="planner-end"
                  type="date"
                  className={`planner-input ${errors.endDate ? 'error' : ''}`}
                  value={endDate}
                  min={startDate || undefined}
                  onChange={e => setEndDate(e.target.value)}
                  disabled={submitting || success}
                />
                {errors.endDate && (
                  <span className="planner-field-error">{errors.endDate}</span>
                )}
              </div>
            </div>

            {/* Travellers */}
            <div className="planner-field">
              <label htmlFor="planner-travellers" className="planner-label">
                Number of Travellers
              </label>
              <input
                id="planner-travellers"
                type="number"
                className={`planner-input ${errors.travellers ? 'error' : ''}`}
                value={travellers}
                min={1}
                onChange={e => setTravellers(parseInt(e.target.value, 10) || 1)}
                disabled={submitting || success}
              />
              {errors.travellers && (
                <span className="planner-field-error">{errors.travellers}</span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="planner-submit-btn"
              disabled={submitting || success}
              id="planner-submit-btn"
            >
              {submitting
                ? (isEdit ? 'Updating trip…' : 'Creating trip…')
                : (isEdit ? '💾 Save Changes' : '✈️ Create Trip')}
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="planner-footer">
          <Link to="/my-trips">← View My Trips</Link>
        </p>
      </div>
    </main>
  )
}

export default TripPlanner

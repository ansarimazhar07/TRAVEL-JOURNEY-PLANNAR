import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchTrains } from '../services/api'
import TrainCard from '../components/TrainCard'
import StationInput from '../components/StationInput'
import './TrainSearch.css'

// Popular train routes in India for quick selection / testing
const POPULAR_ROUTES = [
  { from: 'UJN', to: 'INDB', label: 'Ujjain → Indore' },
  { from: 'PUNE', to: 'CSMT', label: 'Pune → Mumbai CSMT' },
  { from: 'NDLS', to: 'MMCT', label: 'Delhi → Mumbai' },
  { from: 'NDLS', to: 'HWH', label: 'Delhi → Kolkata' },
  { from: 'MAS', to: 'SBC', label: 'Chennai → Bengaluru' },
]

export default function TrainSearch() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Form inputs
  const [fromStation, setFromStation] = useState(searchParams.get('from') || '')
  const [toStation, setToStation] = useState(searchParams.get('to') || '')
  const [travelDate, setTravelDate] = useState(searchParams.get('date') || '')

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [searchedRoute, setSearchedRoute] = useState(null)
  const [sortBy, setSortBy] = useState('departure') // 'departure' | 'duration' | 'name'

  // Dynamic minimum date (today) in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0]

  // SEO document title
  useEffect(() => {
    document.title = 'Train Search | Travel Journey Planner'
  }, [])

  // Auto-search if from and to query params are present in URL
  useEffect(() => {
    const qFrom = searchParams.get('from')
    const qTo = searchParams.get('to')
    const qDate = searchParams.get('date')
    if (qFrom && qTo) {
      setFromStation(qFrom)
      setToStation(qTo)
      if (qDate) setTravelDate(qDate)
      performSearch(qFrom, qTo, qDate)
    }
  }, [])

  // Swap stations function
  const handleSwapStations = () => {
    const temp = fromStation
    setFromStation(toStation)
    setToStation(temp)
    setError('')
  }

  // Quick route picker
  const handleSelectPopularRoute = (route) => {
    setFromStation(route.from)
    setToStation(route.to)
    setError('')
  }

  // Core search execution
  const performSearch = async (source, dest, date) => {
    const s = (source || fromStation).trim()
    const d = (dest || toStation).trim()
    const dt = date !== undefined ? date : travelDate

    // Validation
    if (!s && !d) {
      setError('Please enter both source and destination stations.')
      return
    }
    if (!s) {
      setError('Please enter source station.')
      return
    }
    if (!d) {
      setError('Please enter destination station.')
      return
    }
    if (s.toUpperCase() === d.toUpperCase()) {
      setError('Source and destination cannot be the same.')
      return
    }

    if (dt) {
      if (dt < todayStr) {
        setError('Past dates are not accepted. Please select today or a future date.')
        return
      }
    }

    setError('')
    setLoading(true)
    setResults(null)

    // Update URL query params
    const newParams = { from: s, to: d }
    if (dt) newParams.date = dt
    setSearchParams(newParams, { replace: true })

    try {
      const response = await searchTrains({ from: s, to: d, date: dt || undefined })
      setResults(response.data || [])
      setSearchedRoute(response.route || { from_code: s, to_code: d, date: dt })
    } catch (err) {
      setError(err.message || 'Unable to connect to train service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    performSearch()
  }

  // Sorting
  const sortedResults = results ? [...results].sort((a, b) => {
    if (sortBy === 'departure') {
      return (a.departure || '').localeCompare(b.departure || '')
    }
    if (sortBy === 'duration') {
      return (a.duration_minutes || 0) - (b.duration_minutes || 0)
    }
    if (sortBy === 'name') {
      return (a.train_name || '').localeCompare(b.train_name || '')
    }
    return 0
  }) : []

  return (
    <main className="train-search-page">
      {/* Hero Banner */}
      <section className="train-search-hero">
        <div className="container">
          <div className="train-hero-content">
            <span className="train-hero-pill">🚆 Trains Between Stations</span>
            <h1 className="train-hero-title">Train Search</h1>
            <p className="train-hero-desc">
              Search Indian Railways trains between any two stations. Check departure schedules, transit durations, halts, and running days.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container train-search-container">
        {/* Search Card */}
        <section className="train-search-card" aria-label="Search trains form">
          <form onSubmit={handleSubmit} className="train-search-form" id="train-search-form">
            <div className="train-form-grid">
              {/* Source Station with Suggestion Dropdown */}
              <StationInput
                id="source-station"
                name="from"
                label="From (Source Station)"
                icon="📍"
                placeholder="e.g. UJN, NDLS, Mumbai"
                value={fromStation}
                onChange={(val) => {
                  setFromStation(val)
                  if (error) setError('')
                }}
                hint="Station code or city name"
              />

              {/* Swap Button */}
              <div className="train-swap-wrap">
                <button
                  type="button"
                  id="train-swap-btn"
                  className="train-swap-btn"
                  onClick={handleSwapStations}
                  title="Swap source and destination stations"
                  aria-label="Swap source and destination"
                >
                  ⇄
                </button>
              </div>

              {/* Destination Station with Suggestion Dropdown */}
              <StationInput
                id="dest-station"
                name="to"
                label="To (Destination Station)"
                icon="🏁"
                placeholder="e.g. INDB, MMCT, Delhi"
                value={toStation}
                onChange={(val) => {
                  setToStation(val)
                  if (error) setError('')
                }}
                hint="Station code or city name"
              />

              {/* Travel Date */}
              <div className="train-input-group">
                <label htmlFor="travel-date" className="train-input-label">
                  Date of Journey
                </label>
                <div className="train-input-field-wrap">
                  <span className="train-input-icon">📅</span>
                  <input
                    id="travel-date"
                    name="date"
                    type="date"
                    className="train-input-text"
                    min={todayStr}
                    value={travelDate}
                    onChange={(e) => {
                      setTravelDate(e.target.value)
                      if (error) setError('')
                    }}
                  />
                </div>
                <span className="train-input-hint">Optional: filters running days</span>
              </div>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="train-error-alert" id="train-search-error" role="alert">
                <span className="train-error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="train-form-actions">
              <button
                type="submit"
                id="train-search-submit-btn"
                className="train-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="train-spinner"></span>
                    <span>Searching trains...</span>
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    <span>Search Trains</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Route Suggestions */}
          <div className="train-popular-routes-bar">
            <span className="popular-routes-label">Popular Routes:</span>
            <div className="popular-routes-chips">
              {POPULAR_ROUTES.map((route) => (
                <button
                  key={`${route.from}-${route.to}`}
                  type="button"
                  className="route-chip-btn"
                  onClick={() => handleSelectPopularRoute(route)}
                >
                  {route.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results Area */}
        <section className="train-results-section" aria-live="polite">
          {/* Loading State */}
          {loading && (
            <div className="train-state-card train-loading-state" id="train-loading-indicator">
              <div className="train-large-spinner"></div>
              <h3>Searching trains between stations...</h3>
              <p>Fetching real-time schedules from RailRadar API.</p>
            </div>
          )}

          {/* Initial State (No search performed yet) */}
          {!loading && results === null && !error && (
            <div className="train-state-card train-initial-state">
              <span className="state-card-icon">🚆</span>
              <h3>Ready to plan your railway journey?</h3>
              <p>
                Enter source and destination station codes (e.g., <strong>UJN</strong> to <strong>INDB</strong> or <strong>PUNE</strong> to <strong>CSMT</strong>) and click Search Trains.
              </p>
            </div>
          )}

          {/* Empty Results State */}
          {!loading && results !== null && results.length === 0 && (
            <div className="train-state-card train-empty-state" id="train-no-results">
              <span className="state-card-icon">🔍</span>
              <h3>No trains found for this search.</h3>
              <p>Try another station or travel date.</p>
              <p className="state-card-hint">
                Tip: Indian Railways station codes like <strong>NDLS</strong>, <strong>MMCT</strong>, <strong>PUNE</strong>, <strong>CSMT</strong>, <strong>UJN</strong>, <strong>INDB</strong> yield the most precise results.
              </p>
            </div>
          )}

          {/* Results List */}
          {!loading && results !== null && results.length > 0 && (
            <div className="train-results-container">
              {/* Results Header Bar */}
              <div className="train-results-header">
                <div>
                  <h2 className="train-results-heading">Available Trains</h2>
                  <p className="train-results-subheading">
                    Found <strong>{results.length}</strong> {results.length === 1 ? 'train' : 'trains'} on route{' '}
                    <span className="route-tag">
                      {searchedRoute?.from_name || searchedRoute?.from_code} → {searchedRoute?.to_name || searchedRoute?.to_code}
                    </span>
                    {searchedRoute?.date && <span> for <strong>{searchedRoute.date}</strong></span>}
                  </p>
                </div>

                {/* Sort control */}
                <div className="train-sort-control">
                  <label htmlFor="train-sort-select">Sort by:</label>
                  <select
                    id="train-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="train-sort-select"
                  >
                    <option value="departure">Departure Time</option>
                    <option value="duration">Fastest (Duration)</option>
                    <option value="name">Train Name</option>
                  </select>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="train-cards-list" id="train-cards-list">
                {sortedResults.map((train) => (
                  <TrainCard
                    key={`${train.train_number}-${train.departure}`}
                    train={train}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

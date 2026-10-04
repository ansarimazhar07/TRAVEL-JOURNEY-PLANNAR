import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import PlaceCard from '../components/PlaceCard.jsx'
import { getPlaces, getDestination } from '../services/api.js'
import './Places.css'

function Places() {
  // Read ?destination_id=X from the URL
  const [searchParams] = useSearchParams()
  const destinationId = searchParams.get('destination_id')

  // Data states
  const [places, setPlaces]           = useState([])
  const [destination, setDestination] = useState(null)

  // UI states
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [search, setSearch]   = useState('')

  // ---- Load places (and destination info for the heading) ----
  useEffect(() => {
    fetchData()
    window.scrollTo(0, 0)
  }, [destinationId])

  async function fetchData() {
    setLoading(true)
    setError(null)

    try {
      // Always fetch places (with or without destination filter)
      const placesData = await getPlaces(destinationId)
      setPlaces(placesData)

      // If filtering by destination, also get its name for the heading
      if (destinationId) {
        try {
          const destData = await getDestination(destinationId)
          setDestination(destData)
        } catch {
          // Not a critical failure — we still show the places
          setDestination(null)
        }
      } else {
        setDestination(null)
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ---- Frontend search filter ----
  const filtered = places.filter(place =>
    place.name.toLowerCase().includes(search.toLowerCase()) ||
    (place.location && place.location.toLowerCase().includes(search.toLowerCase())) ||
    (place.category && place.category.toLowerCase().includes(search.toLowerCase()))
  )

  // Heading text
  const headingName = destination ? destination.name : 'All Destinations'

  return (
    <main>
      {/* ---- Page Hero ---- */}
      <div className="places-hero">
        <div className="container">
          <h1>🏛️ Places to Visit</h1>
          <p>
            {destination
              ? `Explore tourist attractions in ${destination.name}`
              : 'Browse tourist places across all destinations'}
          </p>
        </div>
      </div>

      {/* ---- Toolbar ---- */}
      <div className="places-toolbar">
        <div className="container places-toolbar-inner">
          {/* Back link to destination */}
          {destinationId && (
            <Link to={`/destinations/${destinationId}`} className="back-link">
              ← Back to {headingName}
            </Link>
          )}

          {/* Search input */}
          <div className="search-input-wrap" style={{ flex: 1 }}>
            <span className="search-icon">🔍</span>
            <input
              id="places-search"
              type="text"
              className="search-input"
              placeholder="Search places..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Result count */}
          {!loading && !error && (
            <span className="results-count">
              {filtered.length} {filtered.length === 1 ? 'place' : 'places'}
            </span>
          )}
        </div>
      </div>

      {/* ---- Main Content ---- */}
      <div className="places-main">
        <div className="container">

          {/* Section heading */}
          {!loading && !error && (
            <div className="places-section-heading">
              <h2>
                {destination ? `Places in ${destination.name}` : 'All Places'}
              </h2>
              {destination && (
                <div className="places-section-actions">
                  <Link
                    to={`/hotels?destination_id=${destinationId}`}
                    className="btn btn-outline btn-sm"
                  >
                    🏨 View Hotels Instead
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <div className="spinner"></div>
              <p className="loading-text">Loading places...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div style={{ maxWidth: '500px', margin: '40px auto' }}>
              <div className="alert alert-error">⚠️ {error}</div>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button className="btn btn-primary" onClick={fetchData}>
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Places grid */}
          {!loading && !error && (
            <div className="places-grid">
              {filtered.length > 0 ? (
                filtered.map(place => (
                  <PlaceCard key={place.id} place={place} />
                ))
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>
                    {search
                      ? 'No places match your search'
                      : 'No places found for this destination'}
                  </h3>
                  <p>
                    {search
                      ? 'Try a different search term.'
                      : 'Places will be added soon.'}
                  </p>
                  {search && (
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ marginTop: '12px' }}
                      onClick={() => setSearch('')}
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  )
}

export default Places

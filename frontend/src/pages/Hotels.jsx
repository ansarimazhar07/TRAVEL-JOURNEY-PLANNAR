import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import HotelCard from '../components/HotelCard.jsx'
import { getHotels, getDestination } from '../services/api.js'
import './Hotels.css'

function Hotels() {
  // Read ?destination_id=X from URL
  const [searchParams] = useSearchParams()
  const destinationId = searchParams.get('destination_id')

  // Data states
  const [hotels, setHotels]           = useState([])
  const [destination, setDestination] = useState(null)

  // UI states
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [search, setSearch]   = useState('')

  // ---- Load hotels ----
  useEffect(() => {
    fetchData()
    window.scrollTo(0, 0)
  }, [destinationId])

  async function fetchData() {
    setLoading(true)
    setError(null)

    try {
      const hotelsData = await getHotels(destinationId)
      setHotels(hotelsData)

      if (destinationId) {
        try {
          const destData = await getDestination(destinationId)
          setDestination(destData)
        } catch {
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
  const filtered = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(search.toLowerCase()) ||
    (hotel.location && hotel.location.toLowerCase().includes(search.toLowerCase()))
  )

  const headingName = destination ? destination.name : 'All Destinations'

  return (
    <main>
      {/* ---- Page Hero ---- */}
      <div className="hotels-hero">
        <div className="container">
          <h1>🏨 Hotels</h1>
          <p>
            {destination
              ? `Find the best places to stay in ${destination.name}`
              : 'Browse hotels across all destinations'}
          </p>
        </div>
      </div>

      {/* ---- Toolbar ---- */}
      <div className="hotels-toolbar">
        <div className="container hotels-toolbar-inner">
          {/* Back link */}
          {destinationId && (
            <Link to={`/destinations/${destinationId}`} className="back-link">
              ← Back to {headingName}
            </Link>
          )}

          {/* Search input */}
          <div className="search-input-wrap" style={{ flex: 1 }}>
            <span className="search-icon">🔍</span>
            <input
              id="hotels-search"
              type="text"
              className="search-input"
              placeholder="Search hotels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Result count */}
          {!loading && !error && (
            <span className="results-count">
              {filtered.length} {filtered.length === 1 ? 'hotel' : 'hotels'}
            </span>
          )}
        </div>
      </div>

      {/* ---- Main Content ---- */}
      <div className="hotels-main">
        <div className="container">

          {/* Section heading + switch-to-places link */}
          {!loading && !error && (
            <div className="hotels-section-heading">
              <h2>
                {destination ? `Hotels in ${destination.name}` : 'All Hotels'}
              </h2>
              {destination && (
                <div className="hotels-section-actions">
                  <Link
                    to={`/places?destination_id=${destinationId}`}
                    className="btn btn-outline btn-sm"
                  >
                    🏛️ View Places Instead
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <div className="spinner"></div>
              <p className="loading-text">Loading hotels...</p>
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

          {/* Hotels grid */}
          {!loading && !error && (
            <div className="hotels-grid">
              {filtered.length > 0 ? (
                filtered.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>
                    {search
                      ? 'No hotels match your search'
                      : 'No hotels found for this destination'}
                  </h3>
                  <p>
                    {search
                      ? 'Try a different search term.'
                      : 'Hotels will be added soon.'}
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

export default Hotels

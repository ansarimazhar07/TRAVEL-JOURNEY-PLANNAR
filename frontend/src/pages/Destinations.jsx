import React, { useState, useEffect } from 'react'
import DestinationCard from '../components/DestinationCard.jsx'
import { getDestinations } from '../services/api.js'
import './Destinations.css'

// Category filter options — "All" shows everything
const CATEGORIES = ['All', 'Beach', 'Mountain', 'Heritage', 'Hill Station', 'Spiritual', 'City']

function Destinations() {
  // All destinations fetched from the API
  const [destinations, setDestinations] = useState([])

  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // Search box value (typed by user)
  const [search, setSearch] = useState('')

  // Active category filter
  const [activeCategory, setActiveCategory] = useState('All')

  // ---- Fetch destinations from PHP API on page load ----
  useEffect(() => {
    fetchDestinations()
  }, [])

  async function fetchDestinations() {
    setLoading(true)
    setError(null)

    try {
      const data = await getDestinations()
      setDestinations(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ---- Filter destinations based on search text and category ----
  const filtered = destinations.filter(dest => {
    // Search filter — matches against name, state, category
    const searchLower = search.toLowerCase()
    const matchesSearch =
      search === '' ||
      dest.name.toLowerCase().includes(searchLower) ||
      (dest.state  && dest.state.toLowerCase().includes(searchLower)) ||
      (dest.category && dest.category.toLowerCase().includes(searchLower))

    // Category filter
    const matchesCategory =
      activeCategory === 'All' || dest.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <main>
      {/* ---- Page Hero ---- */}
      <div className="destinations-hero">
        <div className="container">
          <h1>Explore Destinations</h1>
          <p>Discover amazing places across India — pick your next adventure.</p>
        </div>
      </div>

      {/* ---- Search & Filter Toolbar ---- */}
      <div className="destinations-toolbar">
        <div className="container destinations-toolbar-inner">
          {/* Search input */}
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              id="destination-search"
              type="text"
              className="search-input"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category filter pills */}
          <div className="filter-pills">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          {!loading && !error && (
            <span className="results-count">
              {filtered.length} {filtered.length === 1 ? 'destination' : 'destinations'}
            </span>
          )}
        </div>
      </div>

      {/* ---- Main Content ---- */}
      <div className="destinations-main">
        <div className="container">

          {/* Loading state */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <div className="spinner"></div>
              <p className="loading-text">Loading destinations...</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div style={{ maxWidth: '500px', margin: '40px auto' }}>
              <div className="alert alert-error">
                ⚠️ {error}
              </div>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button className="btn btn-primary" onClick={fetchDestinations}>
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Destinations grid */}
          {!loading && !error && (
            <div className="destinations-grid">
              {filtered.length > 0 ? (
                filtered.map(destination => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                  />
                ))
              ) : (
                /* No results */
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No destinations found</h3>
                  <p>
                    Try a different search term or select a different category.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  )
}

export default Destinations

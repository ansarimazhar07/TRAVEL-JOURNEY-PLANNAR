import React, { useState, useEffect, useMemo } from 'react'
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
  const [search, setSearch]   = useState('')

  // Active category filter
  const [activeCategory, setActiveCategory] = useState('All')

  // Sorting option
  const [sortBy, setSortBy]   = useState('default')

  // ---- Fetch destinations from PHP API or rich data on page load ----
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
      setError(err.message || 'Unable to fetch destinations.')
    } finally {
      setLoading(false)
    }
  }

  // ---- Filter and sort destinations ----
  const filteredAndSorted = useMemo(() => {
    const searchLower = search.trim().toLowerCase()

    const list = destinations.filter(dest => {
      // Matches against name, state, country, category, description, and highlights
      const matchesSearch =
        searchLower === '' ||
        dest.name.toLowerCase().includes(searchLower) ||
        (dest.state && dest.state.toLowerCase().includes(searchLower)) ||
        (dest.country && dest.country.toLowerCase().includes(searchLower)) ||
        (dest.category && dest.category.toLowerCase().includes(searchLower)) ||
        (dest.description && dest.description.toLowerCase().includes(searchLower))

      // Category filter
      const matchesCategory =
        activeCategory === 'All' || dest.category === activeCategory

      return matchesSearch && matchesCategory
    })

    // Sort
    return list.sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name)
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name)
      }
      if (sortBy === 'budget-asc') {
        const costA = a.budget?.daily_backpacker || 0
        const costB = b.budget?.daily_backpacker || 0
        return costA - costB
      }
      if (sortBy === 'budget-desc') {
        const costA = a.budget?.daily_backpacker || 0
        const costB = b.budget?.daily_backpacker || 0
        return costB - costA
      }
      return 0 // default order
    })
  }, [destinations, search, activeCategory, sortBy])

  function handleClearFilters() {
    setSearch('')
    setActiveCategory('All')
    setSortBy('default')
  }

  return (
    <main className="destinations-page">
      {/* ---- Page Hero ---- */}
      <div className="destinations-hero">
        <div className="container">
          <div className="destinations-hero-badge">🌍 Discover Incredible India</div>
          <h1>Destination Explorer</h1>
          <p>
            Browse popular travel destinations, uncover top attractions, find the best visiting
            seasons, estimate travel budgets, and get insider travel tips for your dream trip.
          </p>
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
              placeholder="Search by destination, state, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearch('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="sort-dropdown-wrap">
            <label htmlFor="sort-select" className="sort-label">Sort:</label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">✨ Recommended</option>
              <option value="name-asc">🔤 Name (A - Z)</option>
              <option value="name-desc">🔤 Name (Z - A)</option>
              <option value="budget-asc">💰 Budget (Low to High)</option>
              <option value="budget-desc">💎 Budget (High to Low)</option>
            </select>
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

          {/* Results count & reset */}
          {!loading && !error && (
            <div className="toolbar-stats-row">
              <span className="results-count">
                Showing <strong>{filteredAndSorted.length}</strong> of {destinations.length} destinations
              </span>
              {(search || activeCategory !== 'All' || sortBy !== 'default') && (
                <button
                  type="button"
                  className="reset-filters-btn"
                  onClick={handleClearFilters}
                >
                  Reset Filters
                </button>
              )}
            </div>
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
              <p className="loading-text" style={{ marginTop: '16px' }}>
                Loading destinations...
              </p>
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
              {filteredAndSorted.length > 0 ? (
                filteredAndSorted.map(destination => (
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
                    We couldn't find any destinations matching "<strong>{search}</strong>" in the selected filter.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={handleClearFilters}
                    style={{ marginTop: '14px' }}
                  >
                    Clear Search &amp; Show All
                  </button>
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

/**
 * BudgetCalculator.jsx — Phase 7
 *
 * Route: /budget  (also /budget?trip_id=<id> from TripDetails)
 * A frontend-only trip budget calculator.
 * No API calls, no database. Pure React state + JavaScript maths.
 */

import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import './BudgetCalculator.css'

// ---- Category config: key, label, emoji ----
const CATEGORIES = [
  { key: 'travel',     label: 'Travel / Transport', emoji: '🚌' },
  { key: 'hotel',      label: 'Hotel',               emoji: '🏨' },
  { key: 'food',       label: 'Food',                emoji: '🍽️' },
  { key: 'activities', label: 'Activities',          emoji: '🎯' },
  { key: 'other',      label: 'Other Expenses',      emoji: '📦' },
]

// Initial state — all empty (treated as 0 in total)
const INITIAL_BUDGET = {
  travel:     '',
  hotel:      '',
  food:       '',
  activities: '',
  other:      '',
}

// Parse a field value to a safe non-negative number
function toNum(val) {
  const n = parseFloat(val)
  if (isNaN(n) || n < 0) return 0
  return n
}

// Format a number as Indian Rupees with commas
// e.g. 190000 → "1,90,000"
function formatINR(num) {
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

function BudgetCalculator() {
  const [searchParams] = useSearchParams()
  const tripId = searchParams.get('trip_id') // optional — from TripDetails

  const [budget, setBudget]       = useState(INITIAL_BUDGET)
  const [errors, setErrors]       = useState({})
  const [resetAnim, setResetAnim] = useState(false)

  // --- Derive total live ---
  const total = CATEGORIES.reduce((sum, cat) => sum + toNum(budget[cat.key]), 0)

  // --- Handle input change ---
  function handleChange(key, rawVal) {
    // Clear error for this field on every change
    setErrors(prev => ({ ...prev, [key]: '' }))

    // Allow empty string
    if (rawVal === '') {
      setBudget(prev => ({ ...prev, [key]: '' }))
      return
    }

    const num = parseFloat(rawVal)

    if (num < 0) {
      setErrors(prev => ({ ...prev, [key]: 'Expense cannot be negative.' }))
      setBudget(prev => ({ ...prev, [key]: '' }))
      return
    }

    setBudget(prev => ({ ...prev, [key]: rawVal }))
  }

  // --- Handle blur — normalise the displayed value ---
  function handleBlur(key) {
    const val = budget[key]
    if (val === '' || val === undefined) return
    const num = parseFloat(val)
    if (isNaN(num) || num < 0) {
      setBudget(prev => ({ ...prev, [key]: '' }))
    }
  }

  // --- Reset ---
  function handleReset() {
    setBudget(INITIAL_BUDGET)
    setErrors({})
    setResetAnim(true)
    setTimeout(() => setResetAnim(false), 400)
  }

  // Percentage breakdown (only if total > 0)
  function pct(key) {
    if (total === 0) return 0
    return Math.round((toNum(budget[key]) / total) * 100)
  }

  return (
    <main className="budget-page">
      <div className="budget-container">

        {/* Back link — goes to trip if we came from TripDetails */}
        {tripId ? (
          <Link to={`/trip/${tripId}`} className="budget-back">
            ← Back to Trip
          </Link>
        ) : (
          <Link to="/my-trips" className="budget-back">
            ← My Trips
          </Link>
        )}

        {/* ---- Header Card ---- */}
        <div className={`budget-card ${resetAnim ? 'budget-reset-flash' : ''}`}>

          {/* Card header */}
          <div className="budget-header">
            <div className="budget-header-icon">💰</div>
            <h1 className="budget-title">Trip Budget Calculator</h1>
            <p className="budget-subtitle">
              Enter your estimated costs — the total updates instantly.
            </p>
          </div>

          {/* ---- Input rows ---- */}
          <div className="budget-body">
            <div className="budget-fields">
              {CATEGORIES.map(cat => (
                <div className="budget-field" key={cat.key}>
                  <label
                    className="budget-label"
                    htmlFor={`budget-input-${cat.key}`}
                  >
                    <span className="budget-label-emoji">{cat.emoji}</span>
                    {cat.label}
                  </label>

                  <div className="budget-input-wrap">
                    <span className="budget-rupee">₹</span>
                    <input
                      id={`budget-input-${cat.key}`}
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      value={budget[cat.key]}
                      onChange={e => handleChange(cat.key, e.target.value)}
                      onBlur={() => handleBlur(cat.key)}
                      className={`budget-input ${errors[cat.key] ? 'budget-input-error' : ''}`}
                    />
                    {/* live % badge */}
                    {total > 0 && toNum(budget[cat.key]) > 0 && (
                      <span className="budget-pct-badge">{pct(cat.key)}%</span>
                    )}
                  </div>

                  {errors[cat.key] && (
                    <p className="budget-field-error" role="alert">
                      ⚠ {errors[cat.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* ---- Breakdown bar ---- */}
            {total > 0 && (
              <div className="budget-bar-section">
                <div className="budget-bar-label">Spending Breakdown</div>
                <div className="budget-bar" aria-label="Budget breakdown bar">
                  {CATEGORIES.map(cat => {
                    const p = pct(cat.key)
                    if (p === 0) return null
                    return (
                      <div
                        key={cat.key}
                        className={`budget-bar-segment budget-bar-${cat.key}`}
                        style={{ width: `${p}%` }}
                        title={`${cat.label}: ${p}%`}
                      />
                    )
                  })}
                </div>
                {/* Legend */}
                <div className="budget-bar-legend">
                  {CATEGORIES.map(cat => {
                    const p = pct(cat.key)
                    if (p === 0) return null
                    return (
                      <div className="budget-legend-item" key={cat.key}>
                        <span className={`budget-legend-dot budget-legend-${cat.key}`} />
                        <span className="budget-legend-text">
                          {cat.emoji} {cat.label} — {p}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ---- Total display ---- */}
            <div className="budget-total-section">
              <div className="budget-total-label">Estimated Trip Cost</div>
              <div
                className={`budget-total-amount ${total > 0 ? 'budget-total-active' : ''}`}
                aria-live="polite"
                aria-label={`Total: rupees ${formatINR(total)}`}
              >
                ₹{formatINR(total)}
              </div>

              {total > 0 && (
                <p className="budget-total-note">
                  That's the estimated cost for your entire trip.
                </p>
              )}
            </div>

            {/* ---- Itemised summary ---- */}
            {total > 0 && (
              <div className="budget-summary">
                <div className="budget-summary-title">Cost Breakdown</div>
                <ul className="budget-summary-list">
                  {CATEGORIES.map(cat => {
                    const amt = toNum(budget[cat.key])
                    return (
                      <li key={cat.key} className="budget-summary-row">
                        <span className="budget-summary-label">
                          {cat.emoji} {cat.label}
                        </span>
                        <span className="budget-summary-amount">
                          ₹{formatINR(amt)}
                        </span>
                      </li>
                    )
                  })}
                  <li className="budget-summary-row budget-summary-total-row">
                    <span className="budget-summary-label">
                      📊 Total
                    </span>
                    <span className="budget-summary-amount budget-summary-total-amount">
                      ₹{formatINR(total)}
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {/* ---- Reset button ---- */}
            <div className="budget-actions">
              <button
                id="budget-reset-btn"
                className="budget-reset-btn"
                onClick={handleReset}
                type="button"
              >
                🔄 Reset
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}

export default BudgetCalculator

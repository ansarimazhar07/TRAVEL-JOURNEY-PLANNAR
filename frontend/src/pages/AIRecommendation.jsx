/**
 * AIRecommendation.jsx — Phase 9
 *
 * Route: /ai-recommendation
 *
 * AI-powered travel recommendation page.
 * User fills in travel preferences → PHP backend → Gemini API → Recommendation displayed.
 *
 * Security: Gemini API key is NEVER in React — it lives only in backend/config.php.
 */

import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getDestinations, generateAIRecommendation } from '../services/api'
import './AIRecommendation.css'

// ---- Simple Markdown → HTML renderer ----
// Converts common Gemini output (headings, bold, bullets, hr) to HTML.
// Avoids installing a heavy library while keeping the output readable.
function renderMarkdown(text) {
  if (!text) return ''

  // Escape HTML entities first to prevent XSS from the AI output
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Process line by line for block elements
  const lines = html.split('\n')
  const result = []
  let inList = false
  let listTag = ''

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Headings
    if (line.startsWith('#### ')) {
      if (inList) { result.push(`</${listTag}>`); inList = false }
      result.push(`<h4>${line.slice(5)}</h4>`)
      continue
    }
    if (line.startsWith('### ')) {
      if (inList) { result.push(`</${listTag}>`); inList = false }
      result.push(`<h3>${line.slice(4)}</h3>`)
      continue
    }
    if (line.startsWith('## ')) {
      if (inList) { result.push(`</${listTag}>`); inList = false }
      result.push(`<h2>${line.slice(3)}</h2>`)
      continue
    }
    if (line.startsWith('# ')) {
      if (inList) { result.push(`</${listTag}>`); inList = false }
      result.push(`<h1>${line.slice(2)}</h1>`)
      continue
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
      if (inList) { result.push(`</${listTag}>`); inList = false }
      result.push('<hr/>')
      continue
    }

    // Unordered list items (-, *, •)
    if (/^(\s*)[-*•] /.test(line)) {
      if (!inList || listTag !== 'ul') {
        if (inList) result.push(`</${listTag}>`)
        result.push('<ul>')
        inList = true
        listTag = 'ul'
      }
      const content = line.replace(/^(\s*)[-*•] /, '')
      result.push(`<li>${inlineFormat(content)}</li>`)
      continue
    }

    // Ordered list items
    if (/^\d+\. /.test(line)) {
      if (!inList || listTag !== 'ol') {
        if (inList) result.push(`</${listTag}>`)
        result.push('<ol>')
        inList = true
        listTag = 'ol'
      }
      const content = line.replace(/^\d+\. /, '')
      result.push(`<li>${inlineFormat(content)}</li>`)
      continue
    }

    // Close list on blank / non-list line
    if (inList) {
      result.push(`</${listTag}>`)
      inList = false
      listTag = ''
    }

    // Empty line → paragraph separator
    if (line.trim() === '') {
      result.push('<br/>')
      continue
    }

    // Regular paragraph line
    result.push(`<p>${inlineFormat(line)}</p>`)
  }

  if (inList) result.push(`</${listTag}>`)

  return result.join('\n')
}

// Apply inline Markdown: **bold**, *italic*, `code`
function inlineFormat(text) {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
}

// ============================================================
// Main Component
// ============================================================

export default function AIRecommendation() {
  const [searchParams] = useSearchParams()

  // ---- Form state ----
  const [destination,  setDestination]  = useState(searchParams.get('destination') || '')
  const [days,         setDays]         = useState(searchParams.get('days')         || '4')
  const [travellers,   setTravellers]   = useState(searchParams.get('travellers')   || '2')
  const [budget,       setBudget]       = useState(searchParams.get('budget')       || '15000')
  const [interests,    setInterests]    = useState(searchParams.get('interests')    || '')
  const [preferences,  setPreferences]  = useState('')

  // ---- Destinations dropdown ----
  const [destinations,  setDestinations] = useState([])
  const [destLoading,   setDestLoading]  = useState(true)

  // ---- UI state ----
  const [loading,         setLoading]         = useState(false)
  const [error,           setError]           = useState('')
  const [recommendation,  setRecommendation]  = useState(null)  // null = no result yet

  const resultRef = useRef(null)

  // SEO title
  useEffect(() => {
    document.title = 'AI Travel Recommendation | Travel Journey Planner'
  }, [])

  // ---- Load destinations from existing API ----
  useEffect(() => {
    setDestLoading(true)
    getDestinations()
      .then(data => setDestinations(Array.isArray(data) ? data : []))
      .catch(() => setDestinations([]))   // fail silently — user can still type
      .finally(() => setDestLoading(false))
  }, [])

  // ---- Scroll to result when it appears ----
  useEffect(() => {
    if (recommendation && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [recommendation])

  // ---- Form submit ----
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // ---- Frontend validation (mirrors PHP backend) ----
    if (!destination.trim()) {
      setError('Please select a destination.')
      return
    }

    const daysNum = parseInt(days, 10)
    if (isNaN(daysNum) || daysNum < 1 || daysNum > 30) {
      setError('Number of days must be between 1 and 30.')
      return
    }

    const travNum = parseInt(travellers, 10)
    if (isNaN(travNum) || travNum < 1) {
      setError('Number of travellers must be at least 1.')
      return
    }

    const budgetNum = parseFloat(budget)
    if (isNaN(budgetNum) || budgetNum < 0) {
      setError('Budget cannot be negative.')
      return
    }

    setLoading(true)
    setRecommendation(null)

    try {
      const result = await generateAIRecommendation({
        destination: destination.trim(),
        days:        daysNum,
        travellers:  travNum,
        budget:      budgetNum,
        interests:   interests.trim(),
        preferences: preferences.trim(),
      })
      setRecommendation(result.recommendation)
    } catch (err) {
      setError(err.message || 'AI recommendation service is temporarily unavailable. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // ---- Render ----
  return (
    <main className="ai-page">

      {/* Hero Banner */}
      <section className="ai-hero">
        <div className="container">
          <div className="ai-hero-content">
            <span className="ai-hero-pill">🤖 Powered by Google Gemini</span>
            <h1 className="ai-hero-title">
              AI <span>Travel Recommendation</span>
            </h1>
            <p className="ai-hero-desc">
              Enter your travel preferences and let Gemini AI create a personalised
              day-by-day itinerary, food guide, and budget tips — instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container ai-container">

        {/* ---- Form Card ---- */}
        <section className="ai-form-card" aria-label="AI recommendation form">
          <h2 className="ai-form-title">
            ✈️ Your Travel Preferences
          </h2>

          <form onSubmit={handleSubmit} id="ai-recommendation-form">
            <div className="ai-form-grid">

              {/* Destination */}
              <div className="ai-form-group">
                <label htmlFor="ai-destination" className="ai-form-label">
                  Destination *
                </label>
                <div className="ai-input-wrap">
                  <span className="ai-input-icon">📍</span>
                  <select
                    id="ai-destination"
                    className="ai-select"
                    value={destination}
                    onChange={e => { setDestination(e.target.value); setError('') }}
                    disabled={destLoading}
                    required
                  >
                    <option value="">
                      {destLoading ? 'Loading destinations…' : '— Select destination —'}
                    </option>
                    {destinations.map(d => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Number of Days */}
              <div className="ai-form-group">
                <label htmlFor="ai-days" className="ai-form-label">
                  Number of Days *
                </label>
                <div className="ai-input-wrap">
                  <span className="ai-input-icon">📅</span>
                  <input
                    id="ai-days"
                    type="number"
                    className="ai-input"
                    min="1"
                    max="30"
                    value={days}
                    onChange={e => { setDays(e.target.value); setError('') }}
                    placeholder="e.g. 4"
                    required
                  />
                </div>
              </div>

              {/* Travellers */}
              <div className="ai-form-group">
                <label htmlFor="ai-travellers" className="ai-form-label">
                  Travellers *
                </label>
                <div className="ai-input-wrap">
                  <span className="ai-input-icon">👥</span>
                  <input
                    id="ai-travellers"
                    type="number"
                    className="ai-input"
                    min="1"
                    max="50"
                    value={travellers}
                    onChange={e => { setTravellers(e.target.value); setError('') }}
                    placeholder="e.g. 2"
                    required
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="ai-form-group">
                <label htmlFor="ai-budget" className="ai-form-label">
                  Total Budget (₹) *
                </label>
                <div className="ai-input-wrap ai-budget-wrap">
                  <span className="ai-budget-prefix">₹</span>
                  <input
                    id="ai-budget"
                    type="number"
                    className="ai-input ai-input-budget"
                    min="0"
                    step="500"
                    value={budget}
                    onChange={e => { setBudget(e.target.value); setError('') }}
                    placeholder="e.g. 15000"
                    required
                  />
                </div>
              </div>

              {/* Interests */}
              <div className="ai-form-group ai-form-grid-full">
                <label htmlFor="ai-interests" className="ai-form-label">
                  Interests <span>(optional)</span>
                </label>
                <div className="ai-input-wrap">
                  <span className="ai-input-icon">🎯</span>
                  <input
                    id="ai-interests"
                    type="text"
                    className="ai-input"
                    value={interests}
                    onChange={e => setInterests(e.target.value)}
                    placeholder="e.g. beaches, sightseeing, food, adventure, photography"
                    maxLength={300}
                  />
                </div>
              </div>

              {/* Travel Preferences */}
              <div className="ai-form-group ai-form-grid-full">
                <label htmlFor="ai-preferences" className="ai-form-label">
                  Travel Preferences <span>(optional)</span>
                </label>
                <div className="ai-input-wrap">
                  <span className="ai-input-icon">💬</span>
                  <textarea
                    id="ai-preferences"
                    className="ai-textarea"
                    value={preferences}
                    onChange={e => setPreferences(e.target.value)}
                    placeholder="e.g. I prefer a relaxed trip with less travel between places. Family-friendly activities preferred."
                    maxLength={500}
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="ai-error-alert" id="ai-error-message" role="alert">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <div className="ai-form-actions">
              <button
                type="submit"
                id="ai-generate-btn"
                className="ai-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="ai-btn-spinner" />
                    <span>Generating recommendation…</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Generate AI Recommendation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* ---- Result / State Area ---- */}
        <section aria-live="polite">

          {/* Loading State */}
          {loading && (
            <div className="ai-state-card ai-loading-state" id="ai-loading-state">
              <div className="ai-large-spinner" />
              <h3>Generating your travel recommendation…</h3>
              <p>Gemini AI is crafting a personalised plan for your trip. This may take a few seconds.</p>
            </div>
          )}

          {/* Initial Empty State — before any generation */}
          {!loading && recommendation === null && !error && (
            <div className="ai-state-card" id="ai-initial-state">
              <span className="ai-state-icon">🗺️</span>
              <h3>Your AI itinerary will appear here</h3>
              <p>
                Fill in your destination, days, travellers, and budget above,
                then click <strong>Generate AI Recommendation</strong>.
              </p>
            </div>
          )}

          {/* AI Recommendation Result */}
          {!loading && recommendation !== null && (
            <div className="ai-result-card" id="ai-result-card" ref={resultRef}>
              <div className="ai-result-header">
                <div className="ai-result-header-info">
                  <h2>✈️ AI Travel Recommendation</h2>
                  <p>
                    Generated for <strong>{destination}</strong> · {days} day{parseInt(days) !== 1 ? 's' : ''} ·
                    {' '}{travellers} traveller{parseInt(travellers) !== 1 ? 's' : ''} · ₹{parseInt(budget).toLocaleString('en-IN')}
                  </p>
                </div>
                <span className="ai-result-badge">
                  🤖 Gemini AI
                </span>
              </div>

              {/* Rendered Markdown */}
              <div
                className="ai-recommendation-body"
                id="ai-recommendation-content"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(recommendation) }}
              />

              {/* Actions */}
              <div className="ai-result-actions">
                <button
                  className="ai-regen-btn"
                  id="ai-regenerate-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  🔄 Generate Again
                </button>
              </div>
            </div>
          )}

        </section>
      </div>
    </main>
  )
}

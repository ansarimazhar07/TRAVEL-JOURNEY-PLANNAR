import React, { useState, useEffect } from 'react'
import { getLiveTrainStatus } from '../services/api'
import './TrainStatus.css'

/* ------------------------------------------------------------------ */
/* HELPERS                                                              */
/* ------------------------------------------------------------------ */

/** Format an ISO/time string into a readable time (e.g. "10:30 AM") */
function fmtTime(str) {
  if (!str) return null
  // Already in HH:MM format (e.g. "10:30")
  if (/^\d{2}:\d{2}$/.test(str)) {
    const [h, m] = str.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
  }
  // ISO string
  try {
    const d = new Date(str)
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    }
  } catch (_) {}
  return str
}

/** "2 minutes ago" relative time from an ISO timestamp */
function relativeTime(str) {
  if (!str) return null
  try {
    const d = new Date(str)
    if (isNaN(d.getTime())) return null
    const diffMs = Date.now() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'just now'
    if (diffMins === 1) return '1 minute ago'
    if (diffMins < 60) return `${diffMins} minutes ago`
    const diffHrs = Math.floor(diffMins / 60)
    if (diffHrs === 1) return '1 hour ago'
    return `${diffHrs} hours ago`
  } catch (_) { return null }
}

/** Status display mapping */
function getStatusInfo(status) {
  if (!status) return { label: 'Unknown', className: 'status-unknown' }
  const s = status.toLowerCase()
  if (s.includes('cancel')) return { label: 'Cancelled', className: 'status-cancelled' }
  if (s.includes('divert')) return { label: 'Diverted', className: 'status-diverted' }
  if (s.includes('at station') || s === 'at_station') return { label: 'At Station', className: 'status-at-station' }
  if (s.includes('depart')) return { label: 'Departed', className: 'status-running' }
  if (s.includes('run') || s === 'running') return { label: 'Running', className: 'status-running' }
  if (s.includes('arriv')) return { label: 'Arrived', className: 'status-at-station' }
  if (s.includes('upcoming') || s.includes('not yet')) return { label: 'Not Yet Started', className: 'status-upcoming' }
  return { label: status, className: 'status-unknown' }
}

/** Determine halt display status icon */
function haltIcon(stop) {
  if (stop.isCurrent) return '●'
  const s = (stop.haltStatus || '').toLowerCase()
  if (s.includes('depart') || s.includes('passed')) return '✓'
  return '○'
}

/* ------------------------------------------------------------------ */
/* MAIN PAGE                                                             */
/* ------------------------------------------------------------------ */

export default function TrainStatus() {
  const [trainNumber, setTrainNumber] = useState('')
  const [journeyDate, setJourneyDate] = useState('')

  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [liveData, setLiveData] = useState(null)

  // SEO title
  useEffect(() => {
    document.title = 'Live Train Status | Travel Journey Planner'
  }, [])

  /* ---- Validation ---- */
  function validate(num) {
    if (!num || num.trim() === '') {
      setError('Please enter a train number.')
      return false
    }
    const clean = num.trim().replace(/\D/g, '')
    if (clean.length < 4 || clean.length > 5) {
      setError('Please enter a valid 5-digit train number (e.g. 12919).')
      return false
    }
    return true
  }

  /* ---- Core fetch ---- */
  async function fetchLiveStatus(num, date) {
    const n = (num || trainNumber).trim()
    const d = date !== undefined ? date : journeyDate

    if (!validate(n)) return

    setError('')
    setLoading(true)
    setLiveData(null)

    try {
      const result = await getLiveTrainStatus(n, d || undefined)
      setLiveData(result)
    } catch (err) {
      setError(err.message || 'Train service is temporarily unavailable. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchLiveStatus()
  }

  const handleRefresh = () => {
    if (liveData) fetchLiveStatus(liveData.trainNumber || trainNumber)
  }

  /* ---------------------------------------------------------------- */
  /* RENDER                                                             */
  /* ---------------------------------------------------------------- */

  const statusInfo = liveData ? getStatusInfo(liveData.status) : null
  const isCancelled = liveData && (liveData.status || '').toLowerCase().includes('cancel')
  const isDiverted  = liveData && (liveData.status || '').toLowerCase().includes('divert')

  return (
    <main className="ts-page">

      {/* ---- Hero ---- */}
      <section className="ts-hero">
        <div className="container">
          <div className="ts-hero-content">
            <span className="ts-hero-pill">🔴 Live Train Running Status</span>
            <h1 className="ts-hero-title">Live <span>Train Status</span></h1>
            <p className="ts-hero-desc">
              Real-time running status, delay, current location, next halt, and platform details — powered by RailRadar.
            </p>
          </div>
        </div>
      </section>

      <div className="container ts-container">

        {/* ---- Search Card ---- */}
        <section className="ts-search-card" aria-label="Live train status search">
          <form onSubmit={handleSubmit} className="ts-form" id="live-train-status-form">
            <div className="ts-form-row">

              {/* Train Number */}
              <div className="ts-input-group ts-input-number-group">
                <label htmlFor="train-number-input" className="ts-label">
                  <span className="ts-label-icon">🚂</span>
                  Train Number
                </label>
                <input
                  id="train-number-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{4,5}"
                  maxLength={5}
                  className="ts-input"
                  placeholder="e.g. 12919"
                  value={trainNumber}
                  onChange={(e) => {
                    setTrainNumber(e.target.value.replace(/\D/g, ''))
                    if (error) setError('')
                  }}
                  autoComplete="off"
                  aria-describedby="train-number-hint"
                />
                <span id="train-number-hint" className="ts-input-hint">Enter 5-digit train number</span>
              </div>

              {/* Journey Date (optional) */}
              <div className="ts-input-group">
                <label htmlFor="journey-date-input" className="ts-label">
                  <span className="ts-label-icon">📅</span>
                  Journey Date
                  <span className="ts-optional-badge">Optional</span>
                </label>
                <input
                  id="journey-date-input"
                  type="date"
                  className="ts-input ts-date-input"
                  value={journeyDate}
                  onChange={(e) => {
                    setJourneyDate(e.target.value)
                    if (error) setError('')
                  }}
                  aria-describedby="journey-date-hint"
                />
                <span id="journey-date-hint" className="ts-input-hint">Leave blank for today's journey</span>
              </div>

              {/* Submit Button */}
              <div className="ts-input-group ts-submit-group">
                <label className="ts-label ts-label-spacer">&nbsp;</label>
                <button
                  type="submit"
                  id="check-live-status-btn"
                  className="ts-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="ts-spinner" aria-hidden="true"></span>
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">🔍</span>
                      <span>Check Live Status</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="ts-error-alert" id="train-status-error" role="alert" aria-live="polite">
                <span className="ts-error-icon" aria-hidden="true">⚠️</span>
                <span>{error}</span>
              </div>
            )}
          </form>

          {/* Popular trains quick-fill */}
          <div className="ts-popular-bar">
            <span className="ts-popular-label">Quick Fill:</span>
            <div className="ts-popular-chips">
              {[
                { number: '12919', label: '12919 — Malwa SF' },
                { number: '12952', label: '12952 — Rajdhani' },
                { number: '12002', label: '12002 — Bhopal SF' },
                { number: '12301', label: '12301 — Howrah Raj' },
              ].map((t) => (
                <button
                  key={t.number}
                  type="button"
                  className="ts-chip-btn"
                  onClick={() => {
                    setTrainNumber(t.number)
                    setError('')
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Results Area ---- */}
        <section className="ts-results" aria-live="polite" aria-label="Live train status results">

          {/* Loading state */}
          {loading && (
            <div className="ts-state-card ts-loading-state" id="train-status-loading">
              <div className="ts-large-spinner" aria-hidden="true"></div>
              <h3>Fetching live status…</h3>
              <p>Connecting to RailRadar for real-time data.</p>
            </div>
          )}

          {/* Initial (no search yet) */}
          {!loading && !liveData && !error && (
            <div className="ts-state-card ts-initial-state">
              <span className="ts-state-icon" aria-hidden="true">🚆</span>
              <h3>Enter a train number to get started</h3>
              <p>
                Type any 5-digit Indian Railways train number above (e.g. <strong>12919</strong>) and click{' '}
                <strong>Check Live Status</strong>.
              </p>
            </div>
          )}

          {/* ---- Live Status Result ---- */}
          {!loading && liveData && (
            <div className="ts-result-wrapper" id="live-status-result">

              {/* ---- Live Header ---- */}
              <div className="ts-result-header">
                <div className="ts-train-identity">
                  <span className="ts-train-number-badge">{liveData.trainNumber}</span>
                  <div>
                    <h2 className="ts-train-name">{liveData.trainName}</h2>
                    {liveData.trainType && (
                      <span className="ts-train-type">{liveData.trainType}</span>
                    )}
                  </div>
                </div>

                {/* LIVE indicator */}
                {liveData.isLive !== false && (
                  <div className="ts-live-badge" aria-label="Live data indicator">
                    <span className="ts-live-dot" aria-hidden="true"></span>
                    <span>LIVE</span>
                  </div>
                )}
              </div>

              {/* ---- Source to Destination ---- */}
              {(liveData.source || liveData.destination) && (
                <div className="ts-route-banner">
                  <div className="ts-route-station ts-route-source">
                    <span className="ts-route-station-code">{liveData.source?.stationCode || '—'}</span>
                    <span className="ts-route-station-name">{liveData.source?.stationName || ''}</span>
                  </div>
                  <div className="ts-route-arrow" aria-hidden="true">
                    <span className="ts-route-line"></span>
                    <span>🚆</span>
                    <span className="ts-route-line"></span>
                  </div>
                  <div className="ts-route-station ts-route-dest">
                    <span className="ts-route-station-code">{liveData.destination?.stationCode || '—'}</span>
                    <span className="ts-route-station-name">{liveData.destination?.stationName || ''}</span>
                  </div>
                </div>
              )}

              {/* ---- Cancellation / Diversion Banners ---- */}
              {isCancelled && (
                <div className="ts-exception-banner ts-exception-cancelled" role="alert">
                  <span>🚫</span>
                  <div>
                    <strong>Train Cancelled</strong>
                    {liveData.exception?.description && (
                      <p>{liveData.exception.description}</p>
                    )}
                  </div>
                </div>
              )}
              {!isCancelled && isDiverted && (
                <div className="ts-exception-banner ts-exception-diverted" role="alert">
                  <span>⚠️</span>
                  <div>
                    <strong>Train Diverted</strong>
                    {liveData.exception?.description && (
                      <p>{liveData.exception.description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* ---- Status Grid ---- */}
              <div className="ts-status-grid">

                {/* Status */}
                {statusInfo && (
                  <div className="ts-stat-card ts-stat-status">
                    <span className="ts-stat-label">Status</span>
                    <span className={`ts-status-badge ${statusInfo.className}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                )}

                {/* Delay */}
                <div className="ts-stat-card ts-stat-delay">
                  <span className="ts-stat-label">Delay</span>
                  {liveData.delayMinutes === null || liveData.delayMinutes === undefined ? (
                    <span className="ts-stat-value ts-delay-na">—</span>
                  ) : liveData.delayMinutes === 0 ? (
                    <span className="ts-stat-value ts-on-time">On Time</span>
                  ) : (
                    <span className="ts-stat-value ts-delayed">
                      {liveData.delayMinutes > 0 ? `+${liveData.delayMinutes}` : liveData.delayMinutes} min late
                    </span>
                  )}
                </div>

                {/* Current Location */}
                {liveData.currentLocation && (
                  <div className="ts-stat-card ts-stat-location">
                    <span className="ts-stat-label">Current Location</span>
                    <span className="ts-stat-value ts-location-name">
                      {liveData.currentLocation.stationName || liveData.currentLocation.stationCode || '—'}
                    </span>
                    {liveData.currentLocation.stationCode && liveData.currentLocation.stationName && (
                      <span className="ts-stat-subvalue">{liveData.currentLocation.stationCode}</span>
                    )}
                  </div>
                )}

                {/* Next Station */}
                {liveData.nextHalt && (
                  <div className="ts-stat-card ts-stat-next">
                    <span className="ts-stat-label">Next Station</span>
                    <span className="ts-stat-value">
                      {liveData.nextHalt.stationName || liveData.nextHalt.stationCode || '—'}
                    </span>
                    {liveData.nextHalt.stationCode && liveData.nextHalt.stationName && (
                      <span className="ts-stat-subvalue">{liveData.nextHalt.stationCode}</span>
                    )}
                    {liveData.nextHalt.scheduledArrival && (
                      <span className="ts-stat-subvalue">
                        Arr: {fmtTime(liveData.nextHalt.scheduledArrival)}
                      </span>
                    )}
                    {liveData.nextHalt.distanceFromCurrent != null && (
                      <span className="ts-stat-subvalue">{liveData.nextHalt.distanceFromCurrent} km</span>
                    )}
                  </div>
                )}

                {/* Platform */}
                <div className="ts-stat-card ts-stat-platform">
                  <span className="ts-stat-label">Platform</span>
                  <span className="ts-stat-value">
                    {liveData.platform != null && liveData.platform !== ''
                      ? `Platform ${liveData.platform}`
                      : 'Not available'}
                  </span>
                </div>

                {/* Speed */}
                {liveData.currentLocation?.speed != null && (
                  <div className="ts-stat-card ts-stat-speed">
                    <span className="ts-stat-label">Current Speed</span>
                    <span className="ts-stat-value">{liveData.currentLocation.speed} km/h</span>
                  </div>
                )}

              </div>

              {/* ---- Last Updated ---- */}
              {liveData.lastUpdatedAt && (
                <div className="ts-last-updated" aria-label="Data freshness">
                  <span className="ts-last-updated-icon" aria-hidden="true">🕐</span>
                  <span>
                    Last updated:{' '}
                    <strong>{fmtTime(liveData.lastUpdatedAt)}</strong>
                    {relativeTime(liveData.lastUpdatedAt) && (
                      <span className="ts-relative-time"> ({relativeTime(liveData.lastUpdatedAt)})</span>
                    )}
                  </span>
                </div>
              )}

              {/* ---- Route Progress Table ---- */}
              {liveData.route && liveData.route.length > 0 && (
                <div className="ts-route-section">
                  <h3 className="ts-route-heading">
                    <span aria-hidden="true">📍</span> Journey Progress
                  </h3>
                  <div className="ts-route-table-wrap">
                    <table className="ts-route-table" aria-label="Route progress">
                      <thead>
                        <tr>
                          <th scope="col">Station</th>
                          <th scope="col">Scheduled</th>
                          <th scope="col">Status</th>
                          <th scope="col">Delay</th>
                          <th scope="col">Platform</th>
                        </tr>
                      </thead>
                      <tbody>
                        {liveData.route.map((stop, idx) => {
                          const icon = haltIcon(stop)
                          const passed = icon === '✓'
                          const isCurr = stop.isCurrent
                          return (
                            <tr
                              key={`${stop.stationCode}-${idx}`}
                              className={`ts-route-row ${isCurr ? 'ts-route-current' : passed ? 'ts-route-passed' : 'ts-route-upcoming'}`}
                            >
                              <td className="ts-route-station-cell">
                                <span className="ts-route-icon" aria-hidden="true">{icon}</span>
                                <div>
                                  <span className="ts-route-stn-name">{stop.stationName || stop.stationCode}</span>
                                  {stop.stationName && stop.stationCode && (
                                    <span className="ts-route-stn-code">{stop.stationCode}</span>
                                  )}
                                </div>
                              </td>
                              <td className="ts-route-time-cell">
                                {stop.scheduledArrival ? fmtTime(stop.scheduledArrival) : '—'}
                              </td>
                              <td className="ts-route-status-cell">
                                {isCurr
                                  ? <span className="ts-route-badge ts-route-badge-current">Current</span>
                                  : passed
                                  ? <span className="ts-route-badge ts-route-badge-passed">Passed</span>
                                  : <span className="ts-route-badge ts-route-badge-upcoming">Upcoming</span>
                                }
                              </td>
                              <td className="ts-route-delay-cell">
                                {stop.delayMinutes == null
                                  ? '—'
                                  : stop.delayMinutes === 0
                                  ? <span className="ts-route-on-time">On Time</span>
                                  : <span className="ts-route-late">+{stop.delayMinutes} min</span>
                                }
                              </td>
                              <td className="ts-route-platform-cell">
                                {stop.platform != null && stop.platform !== '' ? stop.platform : '—'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ---- Refresh Button ---- */}
              <div className="ts-refresh-bar">
                <button
                  type="button"
                  id="refresh-status-btn"
                  className="ts-refresh-btn"
                  onClick={handleRefresh}
                  disabled={loading}
                  aria-label="Refresh live train status"
                >
                  {loading ? (
                    <>
                      <span className="ts-spinner-sm" aria-hidden="true"></span>
                      Refreshing…
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">🔄</span>
                      Refresh Status
                    </>
                  )}
                </button>
                <span className="ts-refresh-note">Manual refresh — tap any time for the latest data</span>
              </div>

            </div>
          )}

        </section>
      </div>
    </main>
  )
}

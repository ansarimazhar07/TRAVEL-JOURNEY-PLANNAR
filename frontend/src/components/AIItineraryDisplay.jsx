/**
 * AIItineraryDisplay.jsx
 *
 * Renders Gemini AI trip plans and itineraries with clean Markdown formatting,
 * copy-to-clipboard, and print features.
 */

import React, { useState } from 'react'
import './AIItineraryDisplay.css'

// Helper: Escape HTML entities
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Inline formatting: **bold**, *italic*
function formatInline(text) {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

// Convert Gemini Markdown output to clean HTML
export function renderItineraryHtml(text) {
  if (!text) return ''

  const safe = escapeHtml(text)
  const lines = safe.split('\n')
  const out = []
  let inList = false
  let listType = ''

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const trimmed = raw.trim()

    // Headers
    if (trimmed.startsWith('#### ')) {
      if (inList) { out.push(`</${listType}>`); inList = false }
      out.push(`<h4>${formatInline(trimmed.slice(5))}</h4>`)
      continue
    }
    if (trimmed.startsWith('### ')) {
      if (inList) { out.push(`</${listType}>`); inList = false }
      out.push(`<h3>${formatInline(trimmed.slice(4))}</h3>`)
      continue
    }
    if (trimmed.startsWith('## ')) {
      if (inList) { out.push(`</${listType}>`); inList = false }
      out.push(`<h2>${formatInline(trimmed.slice(3))}</h2>`)
      continue
    }
    if (trimmed.startsWith('# ')) {
      if (inList) { out.push(`</${listType}>`); inList = false }
      out.push(`<h1>${formatInline(trimmed.slice(2))}</h1>`)
      continue
    }

    // Dividers
    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      if (inList) { out.push(`</${listType}>`); inList = false }
      out.push('<hr className="ai-divider"/>')
      continue
    }

    // Bullet points
    if (/^[-*•] /.test(trimmed)) {
      if (!inList || listType !== 'ul') {
        if (inList) out.push(`</${listType}>`)
        out.push('<ul>')
        inList = true
        listType = 'ul'
      }
      const itemText = trimmed.replace(/^[-*•] /, '')
      out.push(`<li>${formatInline(itemText)}</li>`)
      continue
    }

    // Numbered lists
    if (/^\d+\. /.test(trimmed)) {
      if (!inList || listType !== 'ol') {
        if (inList) out.push(`</${listType}>`)
        out.push('<ol>')
        inList = true
        listType = 'ol'
      }
      const itemText = trimmed.replace(/^\d+\. /, '')
      out.push(`<li>${formatInline(itemText)}</li>`)
      continue
    }

    // Close list on non-list line
    if (inList) {
      out.push(`</${listType}>`)
      inList = false
      listType = ''
    }

    // Empty lines
    if (trimmed === '') {
      continue
    }

    // Paragraph
    out.push(`<p>${formatInline(trimmed)}</p>`)
  }

  if (inList) out.push(`</${listType}>`)

  return out.join('\n')
}

function AIItineraryDisplay({
  plan,
  sourceLocation,
  destinationName,
  days,
  loading = false,
  onRegenerate,
  compact = false
}) {
  const [copied, setCopied] = useState(false)

  if (loading) {
    return (
      <div className="ai-itinerary-loading-card">
        <div className="ai-magic-spinner"></div>
        <h4>Gemini AI is crafting your trip plan…</h4>
        <p>
          Organizing route transit from <strong>{sourceLocation || 'origin'}</strong> to{' '}
          <strong>{destinationName || 'destination'}</strong>, daily activities, attractions, and budget recommendations.
        </p>
      </div>
    )
  }

  if (!plan) return null

  function handleCopy() {
    navigator.clipboard.writeText(plan).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const html = renderItineraryHtml(plan)

  return (
    <div className={`ai-itinerary-card ${compact ? 'compact' : ''}`}>
      {/* Header Bar */}
      <div className="ai-itinerary-header">
        <div className="ai-header-left">
          <span className="ai-gemini-sparkle">✨</span>
          <div>
            <h3 className="ai-header-title">Gemini AI Trip Itinerary</h3>
            <span className="ai-header-subtitle">
              {sourceLocation ? `${sourceLocation} ➔ ` : ''}{destinationName || 'Destination'} {days ? `(${days} Days)` : ''}
            </span>
          </div>
        </div>

        <div className="ai-header-actions">
          <button
            type="button"
            className="ai-action-btn"
            onClick={handleCopy}
            title="Copy itinerary text"
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
          {onRegenerate && (
            <button
              type="button"
              className="ai-action-btn ai-action-regen"
              onClick={onRegenerate}
              title="Regenerate plan with Gemini AI"
            >
              🔄 Refresh Plan
            </button>
          )}
        </div>
      </div>

      {/* Rendered HTML Itinerary Body */}
      <div
        className="ai-itinerary-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

export default AIItineraryDisplay

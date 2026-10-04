import React, { useState, useEffect, useRef } from 'react'
import { filterStations } from '../data/stations'
import './StationInput.css'

export default function StationInput({
  id,
  name,
  label,
  icon = '📍',
  placeholder = 'Type station or city...',
  value = '',
  onChange,
  hint = 'Station code or city name',
  required = false
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  // Filter stations based on user input
  const suggestions = filterStations(value, 8)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    onChange(e.target.value)
    setIsOpen(true)
    setHighlightedIndex(-1)
  }

  const handleSelectStation = (station) => {
    onChange(station.code)
    setIsOpen(false)
    setHighlightedIndex(-1)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleClear = () => {
    onChange('')
    setIsOpen(true)
    setHighlightedIndex(-1)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true)
        return
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      )
    } else if (e.key === 'Enter') {
      if (isOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        e.preventDefault()
        handleSelectStation(suggestions[highlightedIndex])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="station-autocomplete-group" ref={containerRef}>
      <label htmlFor={id} className="station-input-label">
        {label}
      </label>

      <div className="station-input-wrapper">
        <span className="station-input-icon">{icon}</span>

        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          className="station-input-field"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          required={required}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={`${id}-suggestions-list`}
        />

        {value && (
          <button
            type="button"
            className="station-clear-btn"
            onClick={handleClear}
            title="Clear station"
            aria-label="Clear station input"
          >
            ✕
          </button>
        )}

        {/* Suggestion Dropdown */}
        {isOpen && (
          <div className="station-dropdown-box" id={`${id}-suggestions-list`} role="listbox">
            <div className="station-dropdown-header">
              <span>{value.trim() ? 'Suggested Stations' : 'Popular Railway Stations'}</span>
              <span className="station-dropdown-count">{suggestions.length} available</span>
            </div>

            {suggestions.length > 0 ? (
              <ul className="station-suggestions-list">
                {suggestions.map((st, index) => {
                  const isSelected = value.toUpperCase() === st.code
                  const isHighlighted = highlightedIndex === index

                  return (
                    <li
                      key={st.code}
                      role="option"
                      aria-selected={isSelected}
                      className={`station-suggestion-item ${isHighlighted ? 'highlighted' : ''} ${isSelected ? 'selected' : ''}`}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onMouseDown={(e) => {
                        // Prevent input onBlur before onClick fires
                        e.preventDefault()
                        handleSelectStation(st)
                      }}
                    >
                      <div className="suggestion-main-info">
                        <span className="suggestion-train-icon">🚉</span>
                        <div className="suggestion-text-wrap">
                          <span className="suggestion-name">{st.name}</span>
                          <span className="suggestion-location">
                            {st.city}, {st.state}
                          </span>
                        </div>
                      </div>

                      <span className="suggestion-code-pill" title={`Station Code: ${st.code}`}>
                        {st.code}
                      </span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="station-no-matches">
                <span>No station found for "{value}"</span>
                <span className="station-no-matches-hint">
                  You can still search with this code or try another station name.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <span className="station-input-hint">{hint}</span>
    </div>
  )
}

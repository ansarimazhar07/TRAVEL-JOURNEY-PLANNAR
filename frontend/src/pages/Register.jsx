/**
 * Register.jsx — Phase 4
 *
 * Route: /register
 * Allows new users to create an account.
 * On success, shows a success message and navigates to /login.
 */

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../services/api'
import './Auth.css'

function Register() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Form state
  const [name,            setName]            = useState('')
  const [email,           setEmail]           = useState('')
  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI state
  const [errors,  setErrors]  = useState({})   // Field-level errors
  const [apiError, setApiError] = useState('')  // Global API error
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // If already logged in, redirect to profile
  useEffect(() => {
    if (user) navigate('/profile', { replace: true })
  }, [user, navigate])

  // ---- Frontend validation ----
  function validate() {
    const errs = {}

    if (!name.trim()) {
      errs.name = 'Name is required.'
    } else if (name.trim().length > 100) {
      errs.name = 'Name is too long (max 100 characters).'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      errs.email = 'Email is required.'
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address.'
    }

    if (!password) {
      errs.password = 'Password is required.'
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.'
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.'
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ---- Handle form submission ----
  async function handleSubmit(e) {
    e.preventDefault()
    setApiError('')
    setSuccess(false)

    if (!validate()) return

    setLoading(true)
    try {
      const result = await registerUser(name.trim(), email.trim(), password)

      if (result.success) {
        setSuccess(true)
        // Short delay, then navigate to login
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setApiError(result.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">📝</div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join to start planning your dream trips</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Success message */}
          {success && (
            <div className="auth-success" role="status">
              ✅ Account created! Redirecting to login…
            </div>
          )}

          {/* Global API error */}
          {apiError && (
            <div className="auth-error" role="alert">{apiError}</div>
          )}

          {/* Name field */}
          <div className="auth-field">
            <label htmlFor="reg-name" className="auth-label">Full Name</label>
            <input
              id="reg-name"
              type="text"
              className={`auth-input ${errors.name ? 'error' : ''}`}
              placeholder="Your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="name"
              disabled={loading || success}
            />
            {errors.name && (
              <span className="auth-field-error">{errors.name}</span>
            )}
          </div>

          {/* Email field */}
          <div className="auth-field">
            <label htmlFor="reg-email" className="auth-label">Email</label>
            <input
              id="reg-email"
              type="email"
              className={`auth-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading || success}
            />
            {errors.email && (
              <span className="auth-field-error">{errors.email}</span>
            )}
          </div>

          {/* Password field */}
          <div className="auth-field">
            <label htmlFor="reg-password" className="auth-label">Password</label>
            <input
              id="reg-password"
              type="password"
              className={`auth-input ${errors.password ? 'error' : ''}`}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading || success}
            />
            {errors.password && (
              <span className="auth-field-error">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password field */}
          <div className="auth-field">
            <label htmlFor="reg-confirm" className="auth-label">Confirm Password</label>
            <input
              id="reg-confirm"
              type="password"
              className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading || success}
            />
            {errors.confirmPassword && (
              <span className="auth-field-error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading || success}
            id="register-submit-btn"
          >
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        {/* Footer link */}
        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  )
}

export default Register

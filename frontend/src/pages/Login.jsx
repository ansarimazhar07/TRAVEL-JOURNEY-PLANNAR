/**
 * Login.jsx — Phase 4
 *
 * Route: /login
 * Allows users to log in with email + password.
 * On success, stores user in AuthContext and navigates to /.
 */

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../services/api'
import './Auth.css'

function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  // Form state
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')

  // UI state
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  // If already logged in, redirect to profile
  useEffect(() => {
    if (user) navigate('/profile', { replace: true })
  }, [user, navigate])

  // ---- Validate fields before sending to server ----
  function validate() {
    if (!email.trim()) {
      setError('Please enter your email address.')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.')
      return false
    }
    if (!password) {
      setError('Please enter your password.')
      return false
    }
    return true
  }

  // ---- Handle form submission ----
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!validate()) return

    setLoading(true)
    try {
      const result = await loginUser(email.trim(), password)

      if (result.success) {
        login(result.user)    // Update AuthContext
        navigate('/')         // Go to Home
      } else {
        setError(result.message || 'Invalid email or password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">🔐</div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Login to access your trips and profile</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Global error banner */}
          {error && <div className="auth-error" role="alert">{error}</div>}

          {/* Email field */}
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">Email</label>
            <input
              id="login-email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
          </div>

          {/* Password field */}
          <div className="auth-field">
            <label htmlFor="login-password" className="auth-label">Password</label>
            <input
              id="login-password"
              type="password"
              className="auth-input"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        {/* Footer link */}
        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  )
}

export default Login

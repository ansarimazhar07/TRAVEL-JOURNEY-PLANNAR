/**
 * Profile.jsx — Phase 4
 *
 * Route: /profile
 * Shows the currently logged-in user's information.
 * Protected: redirects to /login if not logged in.
 */

import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutUser, getProfile } from '../services/api'
import './Auth.css'

function Profile() {
  const { user, loading: authLoading, logout } = useAuth()
  const navigate = useNavigate()

  // Profile data fetched from PHP
  const [profile,        setProfile]        = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError,   setProfileError]   = useState('')

  // For logout button
  const [logoutLoading, setLogoutLoading] = useState(false)

  // ---- Redirect to login if not authenticated ----
  // Wait for the auth check to finish first (authLoading)
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, authLoading, navigate])

  // ---- Fetch profile from PHP when user is confirmed logged in ----
  useEffect(() => {
    if (!user) return

    setProfileLoading(true)
    setProfileError('')

    getProfile()
      .then(result => {
        if (result.success) {
          setProfile(result.user)
        } else {
          setProfileError(result.message || 'Unable to load profile.')
        }
      })
      .catch(() => {
        setProfileError('Unable to load profile. Please try again.')
      })
      .finally(() => {
        setProfileLoading(false)
      })
  }, [user])

  // ---- Logout handler ----
  async function handleLogout() {
    setLogoutLoading(true)
    try {
      await logoutUser()   // Destroy PHP session
      logout()             // Clear React state
      navigate('/')        // Go to Home
    } finally {
      setLogoutLoading(false)
    }
  }



  // ---- Loading: waiting for auth check ----
  if (authLoading) {
    return (
      <main className="profile-page">
        <div className="profile-card">
          <div className="auth-loading">
            <div className="auth-loading-spinner"></div>
            Loading…
          </div>
        </div>
      </main>
    )
  }

  // ---- Not logged in (about to redirect) ----
  if (!user) return null

  return (
    <main className="profile-page">
      <div className="profile-card">

        {/* Avatar */}
        <div className="profile-avatar">👤</div>

        {profileLoading ? (
          <div className="auth-loading">
            <div className="auth-loading-spinner"></div>
            Loading profile…
          </div>
        ) : profileError ? (
          <div className="auth-error" style={{ marginBottom: '20px' }}>
            {profileError}
          </div>
        ) : profile ? (
          <>
            {/* Name and email */}
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-email-display">{profile.email}</p>

            {/* Member badge */}
            <div className="profile-member-badge">
              ✈️ Travel Planner Member
            </div>

            {/* Info rows */}
            <div className="profile-info">
              <div className="profile-info-row">
                <span className="profile-info-label">Full Name</span>
                <span className="profile-info-value">{profile.name}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-value">{profile.email}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Member Since</span>
                <span className="profile-info-value">
                  {new Date(profile.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">User ID</span>
                <span className="profile-info-value">#{profile.id}</span>
              </div>
            </div>

            {/* Logout button */}
            <button
              className="profile-logout-btn"
              onClick={handleLogout}
              disabled={logoutLoading}
              id="profile-logout-btn"
            >
              {logoutLoading ? 'Logging out…' : '🚪 Logout'}
            </button>
          </>
        ) : null}

      </div>
    </main>
  )
}

export default Profile

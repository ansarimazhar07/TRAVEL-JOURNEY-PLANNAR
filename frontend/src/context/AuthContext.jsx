/**
 * AuthContext.jsx
 *
 * A simple React Context that stores and shares the current user's
 * authentication state across the whole app.
 *
 * HOW TO USE:
 *   import { useAuth } from '../context/AuthContext'
 *   const { user, login, logout, loading } = useAuth()
 *
 * The 'user' object is either:
 *   null                  → not logged in
 *   { id, name, email }   → logged in
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import { checkAuth } from '../services/api'

// Create the context
const AuthContext = createContext(null)

/**
 * AuthProvider wraps the whole app and provides auth state to all children.
 * Place it around <App> in main.jsx (or inside App itself).
 */
export function AuthProvider({ children }) {
  // null = not logged in, object = logged in user
  const [user, setUser]       = useState(null)
  // true while we are checking the session on app startup
  const [loading, setLoading] = useState(true)

  // On first load — ask the PHP backend if there is an active session.
  // This restores login state after a page refresh.
  useEffect(() => {
    checkAuth()
      .then(result => {
        if (result.loggedIn && result.user) {
          setUser(result.user)
        } else {
          setUser(null)
        }
      })
      .catch(() => {
        // Network error or backend down — treat as logged out
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  /**
   * Call this after a successful login API response.
   * @param {Object} userData - { id, name, email }
   */
  function login(userData) {
    setUser(userData)
  }

  /**
   * Call this after a successful logout API response.
   */
  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * useAuth — custom hook to access auth state in any component.
 * Example:
 *   const { user, logout, loading } = useAuth()
 */
export function useAuth() {
  return useContext(AuthContext)
}

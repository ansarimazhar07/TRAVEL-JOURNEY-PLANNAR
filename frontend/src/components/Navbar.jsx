import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/api'
import './Navbar.css'

// Links always visible to everyone
const PUBLIC_LINKS = [
  { label: 'Home',              path: '/' },
  { label: 'Destinations',      path: '/destinations' },
  { label: 'Places',            path: '/places' },
  { label: 'Hotels',            path: '/hotels' },
  { label: 'Train Search',      path: '/train-search' },
  { label: 'Live Train Status', path: '/train-status' },
  { label: 'AI Recommendation', path: '/ai-recommendation' },
]

// Links only shown when the user is logged in
const AUTH_LINKS = [
  { label: 'Plan Trip', path: '/plan-trip' },
  { label: 'My Trips',  path: '/my-trips'  },
  { label: 'Budget',    path: '/budget'    },
]

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Controls whether mobile menu is open or closed
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleMobile = () => setMobileOpen(prev => !prev)
  const closeMobile  = () => setMobileOpen(false)

  // Called when the user clicks Logout
  async function handleLogout() {
    closeMobile()
    await logoutUser()   // Tell PHP to destroy the session
    logout()             // Clear React auth state
    navigate('/')        // Go to Home
  }

  // Helper to render a NavLink with active class
  function NavItem({ path, label, end = false, extraClass = '' }) {
    return (
      <NavLink
        to={path}
        className={({ isActive }) =>
          isActive ? `nav-link ${extraClass} active`.trim() : `nav-link ${extraClass}`.trim()
        }
        end={end}
      >
        {label}
      </NavLink>
    )
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">

        {/* Brand logo */}
        <NavLink to="/" className="navbar-brand" onClick={closeMobile}>
          <span className="navbar-logo-icon">✈️</span>
          <span>Travel Planner</span>
        </NavLink>

        {/* Desktop navigation links */}
        <nav className="navbar-links">
          {/* Public links — always visible */}
          {PUBLIC_LINKS.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              end={link.path === '/'}
            >
              {link.label}
            </NavLink>
          ))}

          {/* Auth-only links — only when logged in */}
          {user && AUTH_LINKS.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              {link.label}
            </NavLink>
          ))}

          {/* Auth section — changes based on login state */}
          {user ? (
            // ---- Logged in ----
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-user-greeting active' : 'nav-link nav-user-greeting'
                }
              >
                👤 Hi, {user.name.split(' ')[0]}
              </NavLink>
              <button
                className="nav-link nav-link-btn nav-logout-btn"
                onClick={handleLogout}
                id="navbar-logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            // ---- Logged out ----
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link-btn active' : 'nav-link nav-link-btn'
                }
              >
                Register
              </NavLink>
            </>
          )}
        </nav>

        {/* Hamburger button for mobile */}
        <button
          className="navbar-toggle"
          onClick={toggleMobile}
          aria-label="Toggle navigation"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <nav className={`navbar-mobile ${mobileOpen ? 'open' : ''}`}>
        {/* Public links */}
        {PUBLIC_LINKS.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? 'nav-link-mobile active' : 'nav-link-mobile'
            }
            end={link.path === '/'}
            onClick={closeMobile}
          >
            {link.label}
          </NavLink>
        ))}

        {/* Auth-only links in mobile — Plan Trip, My Trips */}
        {user && AUTH_LINKS.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? 'nav-link-mobile active' : 'nav-link-mobile'
            }
            onClick={closeMobile}
          >
            {link.label}
          </NavLink>
        ))}

        {/* Mobile auth section */}
        {user ? (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? 'nav-link-mobile active' : 'nav-link-mobile'
              }
              onClick={closeMobile}
            >
              👤 {user.name}
            </NavLink>
            <button
              className="nav-link-mobile nav-logout-mobile"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'nav-link-mobile active' : 'nav-link-mobile'
              }
              onClick={closeMobile}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? 'nav-link-mobile active' : 'nav-link-mobile'
              }
              onClick={closeMobile}
            >
              Register
            </NavLink>
          </>
        )}
      </nav>

    </header>
  )
}

export default Navbar

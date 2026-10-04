import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand description */}
          <div className="footer-brand">
            <h3>✈️ Travel Planner</h3>
            <p>
              A simple travel journey planner for exploring destinations,
              planning trips, searching trains &amp; flights, and getting
              AI-powered travel recommendations.
            </p>
          </div>

          {/* Quick links column */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/destinations">Destinations</Link></li>
              <li><Link to="/train-search">Train Search</Link></li>
              <li><Link to="/train-status">Live Train Status</Link></li>
              <li><Link to="/flights">Flight Search</Link></li>
              <li><Link to="/weather">Weather</Link></li>
            </ul>
          </div>

          {/* Services column */}
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/plan-trip">Plan a Trip</Link></li>
              <li><Link to="/ai-recommendation">AI Recommendations</Link></li>
              <li><Link to="/budget">Budget Calculator</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© {year} Travel Journey Planner. College Web Technologies Project.</span>
          <span>Built with React + PHP + MySQL</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

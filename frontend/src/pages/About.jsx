import React from 'react'
import { Link } from 'react-router-dom'

// Tech stack items shown on the about page
const TECH_STACK = [
  { icon: '⚛️', name: 'React.js',  desc: 'Frontend UI library'   },
  { icon: '🐘', name: 'PHP 8',     desc: 'Backend REST API'       },
  { icon: '🗄️', name: 'MySQL',     desc: 'Relational database'    },
  { icon: '🤖', name: 'Gemini AI', desc: 'Travel recommendations' },
  { icon: '✈️', name: 'Amadeus',   desc: 'Flight data API'        },
  { icon: '🚂', name: 'RailRadar', desc: 'Train search API'       },
  { icon: '🌤️', name: 'Weather API', desc: 'Live weather data'   },
  { icon: '🗺️', name: 'Leaflet',   desc: 'Interactive maps'       },
]

// Pages / features list
const PAGES = [
  'Home', 'About', 'Destinations', 'Destination Details',
  'Places', 'Place Details', 'Hotels', 'Hotel Details',
  'Train Search', 'Flight Search', 'Weather', 'AI Recommendations',
  'Trip Planner', 'My Itinerary', 'Budget Calculator',
  'Login', 'Register', 'Profile', 'Contact',
]

function About() {
  return (
    <main>
      {/* Page header */}
      <div className="page-hero">
        <div className="container">
          <h1>About This Project</h1>
          <p>
            A college Web Technologies project built with React, PHP, MySQL and real-world APIs.
          </p>
        </div>
      </div>

      <div className="container">

        {/* Project description */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="grid-2" style={{ alignItems: 'center', gap: '48px' }}>
            <div>
              <h2>What is Travel Journey Planner?</h2>
              <br />
              <p style={{ marginBottom: '16px' }}>
                <strong>Travel Journey Planner</strong> is a simple web application
                developed as a 3rd-year engineering college project for the
                Web Technologies subject.
              </p>
              <p style={{ marginBottom: '16px' }}>
                The goal is to demonstrate how a student can build a functional
                full-stack website using modern technologies — connecting a
                React frontend to a PHP REST API backend, a MySQL database,
                and several real-world APIs.
              </p>
              <p>
                The project lets users explore travel destinations, search for trains
                and flights, get AI-powered itinerary suggestions, check the weather,
                plan trips and calculate their travel budget.
              </p>
            </div>

            {/* Stats box */}
            <div className="card">
              <div className="card-body">
                <h3 style={{ marginBottom: '20px' }}>Project At a Glance</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    ['📄', 'Pages / Routes', '19 pages'],
                    ['🗄️', 'Database Tables', '7 tables'],
                    ['🔌', 'REST API Endpoints', '12+ endpoints'],
                    ['🌐', 'External APIs', '4 integrations'],
                    ['📱', 'Responsive Design', 'Mobile + Tablet + Desktop'],
                    ['🎓', 'Project Level', '3rd Year Engineering'],
                  ].map(([icon, label, value]) => (
                    <div key={label} style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: '1px solid var(--border)'
                    }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {icon} {label}
                      </span>
                      <span style={{
                        fontWeight: 600, fontSize: '0.88rem', color: 'var(--primary)'
                      }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* Technology Stack */}
        <section className="section">
          <h2 className="section-title">Technology Stack</h2>
          <p className="section-subtitle">
            Technologies used to build this project.
          </p>

          <div className="grid-4">
            {TECH_STACK.map(tech => (
              <div className="card" key={tech.name}>
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{tech.icon}</div>
                  <h4 className="card-title">{tech.name}</h4>
                  <p className="card-text">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" />

        {/* Pages list */}
        <section className="section">
          <h2 className="section-title">All Pages</h2>
          <p className="section-subtitle" style={{ marginBottom: '28px' }}>
            This project contains {PAGES.length} pages/routes.
          </p>

          <div className="grid-4" style={{ gap: '10px' }}>
            {PAGES.map((page, i) => (
              <div key={page} style={{
                background: 'var(--white)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.88rem',
                color: 'var(--text)'
              }}>
                <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {page}
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" />

        {/* Architecture */}
        <section className="section">
          <h2 className="section-title">Architecture Overview</h2>
          <p className="section-subtitle">
            How the different layers of the application connect.
          </p>

          <div className="card">
            <div className="card-body">
              <pre style={{
                fontFamily: 'monospace',
                fontSize: '0.88rem',
                color: 'var(--text)',
                background: '#f8fafc',
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                overflow: 'auto',
                lineHeight: '1.8'
              }}>
{`React Frontend  (Vite + React Router)
        ↓
  Fetch / Axios
        ↓
   PHP REST API  (backend/)
        ↓
 ┌──────┬──────┬──────────┬──────────┐
 │      │      │          │          │
MySQL  RailRadar  Amadeus  Gemini  Weather
       (Trains)  (Flights) (AI)    API`}
              </pre>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ paddingBottom: '64px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '12px' }}>Explore the Application</h3>
          <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
            Start by exploring destinations or planning your first trip.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/destinations" className="btn btn-primary btn-lg">Explore Destinations</Link>
            <Link to="/plan-trip" className="btn btn-outline btn-lg">Plan a Trip</Link>
          </div>
        </section>

      </div>
    </main>
  )
}

export default About

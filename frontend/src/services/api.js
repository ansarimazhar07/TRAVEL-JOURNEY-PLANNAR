import {
  DESTINATIONS_DATA,
  getDestinationById,
  getPlacesByDestinationId
} from '../data/travelData.js'
import {
  getSpecificRouteData,
  getSpecificDestinationGuide
} from '../data/routePlannerData.js'


// Base URL for the PHP backend.
// In production (Netlify), set VITE_API_URL in your Netlify site settings.
// In local development, it defaults to the local XAMPP Apache path.
const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost/travel-journey-planner/backend';
const API_URL = RAW_API_URL.replace(/\/+$/, '');

// ============================================================
// DESTINATIONS
// ============================================================

/**
 * Fetch all destinations from the database or rich fallback dataset.
 * Merges API data with curated metadata (budget, tips, highlights, places).
 * @returns {Promise<Array>} Array of destination objects
 */
export async function getDestinations() {
  try {
    const response = await fetch(`${API_URL}/destinations.php`);

    if (response.ok) {
      const result = await response.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        // Merge API record with rich local travelData
        return result.data.map(apiDest => {
          const localMatch = DESTINATIONS_DATA.find(
            d => d.id === Number(apiDest.id) || d.name.toLowerCase() === apiDest.name.toLowerCase()
          );
          return localMatch ? { ...localMatch, ...apiDest } : apiDest;
        });
      }
    }
  } catch (error) {
    // Backend offline / network unreachable -> fallback gracefully to curated data
  }

  return DESTINATIONS_DATA;
}

/**
 * Fetch a single destination by its ID.
 * Merges API data with rich local details or returns curated fallback.
 * @param {number|string} id  The destination ID
 * @returns {Promise<Object>} A single destination object
 */
export async function getDestination(id) {
  const numId = Number(id);

  try {
    const response = await fetch(`${API_URL}/destinations.php?id=${id}`);

    if (response.status === 404) {
      const local = getDestinationById(numId);
      if (local) return local;
      throw new Error('NOT_FOUND');
    }

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        const localMatch = getDestinationById(numId);
        return localMatch ? { ...localMatch, ...result.data } : result.data;
      }
    }
  } catch (error) {
    if (error.message === 'NOT_FOUND') throw error;
  }

  const local = getDestinationById(numId);
  if (local) return local;
  throw new Error('NOT_FOUND');
}

// ============================================================
// PLACES
// ============================================================

/**
 * Fetch all places for a destination, or all places if no ID given.
 * Falls back to curated places dataset if server is offline.
 * @param {number|string} [destinationId]  Optional destination ID
 * @returns {Promise<Array>} Array of place objects
 */
export async function getPlaces(destinationId) {
  try {
    const url = destinationId
      ? `${API_URL}/places.php?destination_id=${destinationId}`
      : `${API_URL}/places.php`;

    const response = await fetch(url);

    if (response.ok) {
      const result = await response.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        return result.data;
      }
    }
  } catch (error) {
    // Offline fallback
  }

  if (destinationId) {
    return getPlacesByDestinationId(Number(destinationId));
  }
  return DESTINATIONS_DATA.flatMap(d => d.places || []);
}

/**
 * Fetch a single place by its ID.
 * @param {number|string} id  The place ID
 * @returns {Promise<Object>} A single place object
 */
export async function getPlace(id) {
  const numId = Number(id);

  try {
    const response = await fetch(`${API_URL}/places.php?id=${id}`);

    if (response.status === 404) {
      const all = DESTINATIONS_DATA.flatMap(d => d.places || []);
      const match = all.find(p => p.id === numId);
      if (match) return match;
      throw new Error('NOT_FOUND');
    }

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch (error) {
    if (error.message === 'NOT_FOUND') throw error;
  }

  const all = DESTINATIONS_DATA.flatMap(d => d.places || []);
  const match = all.find(p => p.id === numId);
  if (match) return match;
  throw new Error('NOT_FOUND');
}

// ============================================================
// HOTELS
// ============================================================

/**
 * Fetch all hotels for a destination, or all hotels if no ID given.
 * @param {number|string} [destinationId]  Optional destination ID
 * @returns {Array} Array of hotel objects
 */
export async function getHotels(destinationId) {
  try {
    const url = destinationId
      ? `${API_URL}/hotels.php?destination_id=${destinationId}`
      : `${API_URL}/hotels.php`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to load hotels.');
    }

    return result.data;

  } catch (error) {
    throw new Error('Unable to load hotels. Please check your connection and try again.');
  }
}

/**
 * Fetch a single hotel by its ID.
 * @param {number|string} id  The hotel ID
 * @returns {Object} A single hotel object
 */
export async function getHotel(id) {
  try {
    const response = await fetch(`${API_URL}/hotels.php?id=${id}`);

    if (response.status === 404) {
      throw new Error('NOT_FOUND');
    }

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to load hotel.');
    }

    return result.data;

  } catch (error) {
    if (error.message === 'NOT_FOUND') throw error;
    throw new Error('Unable to load hotel details. Please check your connection and try again.');
  }
}

// ============================================================
// USER AUTHENTICATION & SESSION MANAGEMENT
// ============================================================
// All auth requests use credentials: 'include' so the browser
// automatically transmits and receives the PHP session cookie.
// ============================================================

/**
 * Register a new user account.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {{ success, message, user? }}
 */
export async function registerUser(name, email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/register.php`, {
      method: 'POST',
      credentials: 'include',                       // Send session cookie
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (data.success && data.user) {
      try { localStorage.setItem('travel_planner_user', JSON.stringify(data.user)); } catch {}
    }
    return data;

  } catch {
    // Offline local register fallback
    const localUser = { id: Date.now(), name, email };
    try { localStorage.setItem('travel_planner_user', JSON.stringify(localUser)); } catch {}
    return { success: true, message: 'Account created successfully (Local Mode)', user: localUser };
  }
}

/**
 * Log in with email and password.
 * On success, the PHP server creates a session cookie.
 * @param {string} email
 * @param {string} password
 * @returns {{ success, message, user? }}
 */
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login.php`, {
      method: 'POST',
      credentials: 'include',                       // Receive session cookie
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success && data.user) {
      try { localStorage.setItem('travel_planner_user', JSON.stringify(data.user)); } catch {}
      return data;
    }
    if (data.error || !data.success) {
      return data;
    }
  } catch {
    // Server down/offline fallback
  }

  const userName = email.split('@')[0];
  const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);
  const localUser = { id: 1, name: formattedName, email };
  try { localStorage.setItem('travel_planner_user', JSON.stringify(localUser)); } catch {}
  return { success: true, message: 'Welcome back!', user: localUser };
}

/**
 * Log out the current user.
 * PHP destroys the session on the server side.
 * @returns {{ success, message }}
 */
export async function logoutUser() {
  try {
    localStorage.removeItem('travel_planner_user');
    const response = await fetch(`${API_URL}/auth/logout.php`, {
      method: 'POST',
      credentials: 'include',                       // Send session cookie to destroy
    });
    return await response.json();
  } catch {
    return { success: true, message: 'Logged out successfully.' };
  }
}

/**
 * Check whether the user is currently logged in.
 * React calls this on app startup to restore session state.
 * @returns {{ success, loggedIn, user? }}
 */
export async function checkAuth() {
  try {
    const response = await fetch(`${API_URL}/auth/check.php`, {
      method: 'GET',
      credentials: 'include',                       // Send session cookie
    });

    if (response.ok) {
      const data = await response.json();
      if (data.loggedIn && data.user) {
        try { localStorage.setItem('travel_planner_user', JSON.stringify(data.user)); } catch {}
        return data;
      }
    }
  } catch {
    // Offline check
  }

  try {
    const saved = localStorage.getItem('travel_planner_user');
    if (saved) {
      return { success: true, loggedIn: true, user: JSON.parse(saved) };
    }
  } catch {}

  // Default guest session so testing & planning trips is immediately accessible
  const guestUser = { id: 1, name: 'Explorer', email: 'explorer@travelplanner.local' };
  try { localStorage.setItem('travel_planner_user', JSON.stringify(guestUser)); } catch {}
  return { success: true, loggedIn: true, user: guestUser };
}

/**
 * Fetch the current user's profile from the database.
 * Returns 401 JSON if not logged in.
 * @returns {{ success, user? }}
 */
export async function getProfile() {
  try {
    const response = await fetch(`${API_URL}/auth/profile.php`, {
      method: 'GET',
      credentials: 'include',                       // Send session cookie
    });

    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Offline
  }

  const saved = localStorage.getItem('travel_planner_user');
  if (saved) {
    return { success: true, user: JSON.parse(saved) };
  }
  return { success: false, message: 'Please log in to view profile.' };
}

// ============================================================
// TRIP PERSISTENCE & ITINERARY CRUD OPERATIONS
// ============================================================

const TRIPS_STORAGE_KEY = 'travel_planner_saved_trips';

// Helper: initial default trips if none exist in localStorage
function getLocalTrips() {
  try {
    const raw = localStorage.getItem(TRIPS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  const defaultTrips = [
    {
      id: 101,
      destination_id: 1,
      destination_name: 'Jaipur',
      source_location: 'New Delhi',
      trip_name: 'New Delhi to Jaipur Cultural Tour',
      start_date: '2026-11-10',
      end_date: '2026-11-14',
      num_travellers: 2,
      notes: 'Source: New Delhi\nExploring Amer Fort, Hawa Mahal and local handicrafts.',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 102,
      destination_id: 2,
      destination_name: 'Goa',
      source_location: 'Mumbai',
      trip_name: 'Mumbai to Goa Beach Getaway',
      start_date: '2026-12-05',
      end_date: '2026-12-10',
      num_travellers: 4,
      notes: 'Source: Mumbai\nSunsets, water sports, and beach shacks.',
      created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ];

  try { localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(defaultTrips)); } catch {}
  return defaultTrips;
}

function saveLocalTrips(trips) {
  try {
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
  } catch {}
}

/**
 * Fetch all trips belonging to the user.
 * Returns trips with source_location, destination_name, dates, and travellers.
 */
export async function getTrips() {
  try {
    const response = await fetch(`${API_URL}/trips.php`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const enriched = result.data.map(t => {
          const dest = DESTINATIONS_DATA.find(d => d.id === Number(t.destination_id));
          return {
            ...t,
            destination_name: t.destination_name || (dest ? dest.name : 'Trip'),
            source_location: t.source_location || 'New Delhi'
          };
        });
        saveLocalTrips(enriched);
        return { success: true, data: enriched };
      }
    }
  } catch {
    // Offline or network error
  }

  const localTrips = getLocalTrips();
  return { success: true, data: localTrips };
}

/**
 * Fetch a single trip by ID.
 * @param {number|string} id
 */
export async function getTrip(id) {
  const numId = Number(id);

  try {
    const response = await fetch(`${API_URL}/trips.php?id=${id}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        const dest = DESTINATIONS_DATA.find(d => d.id === Number(result.data.destination_id));
        return {
          success: true,
          data: {
            ...result.data,
            destination_name: result.data.destination_name || (dest ? dest.name : 'Trip'),
            source_location: result.data.source_location || 'New Delhi'
          }
        };
      }
    }
  } catch {
    // Offline
  }

  const localTrips = getLocalTrips();
  const match = localTrips.find(t => t.id === numId);
  if (match) {
    return { success: true, data: match };
  }
  return { error: 'Trip not found.' };
}

/**
 * Create a new trip.
 * @param {{ source_location, destination_id, start_date, end_date, num_travellers, trip_name?, notes? }} data
 */
export async function createTrip(data) {
  const dest = DESTINATIONS_DATA.find(d => d.id === Number(data.destination_id));
  const destName = (data.destination_name || data.destination || (dest ? dest.name : 'Destination')).trim();
  const sourceLoc = (data.source_location || data.source || 'New Delhi').trim();
  const tripName = data.trip_name || `${sourceLoc} to ${destName} Trip`;

  const payload = {
    destination_id: data.destination_id ? Number(data.destination_id) : 0,
    destination_name: destName,
    source_location: sourceLoc,
    start_date: data.start_date,
    end_date: data.end_date,
    num_travellers: Number(data.num_travellers) || 1,
    trip_name: tripName,
    notes: data.notes || `Source: ${sourceLoc}`
  };

  try {
    const response = await fetch(`${API_URL}/trips.php`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        const localTrips = getLocalTrips();
        const created = {
          ...payload,
          id: result.trip_id || Date.now(),
          destination_name: destName,
          created_at: new Date().toISOString()
        };
        saveLocalTrips([created, ...localTrips]);
        return result;
      }
    }
  } catch {
    // Offline
  }

  // Local storage save
  const localTrips = getLocalTrips();
  const newTrip = {
    ...payload,
    id: Date.now(),
    destination_name: destName,
    created_at: new Date().toISOString()
  };
  saveLocalTrips([newTrip, ...localTrips]);

  return {
    success: true,
    message: 'Trip created successfully!',
    trip_id: newTrip.id,
    data: newTrip
  };
}

/**
 * Update a trip by ID.
 * @param {number|string} id
 * @param {{ source_location, destination_id, start_date, end_date, num_travellers, trip_name?, notes? }} data
 */
export async function updateTrip(id, data) {
  const numId = Number(id);
  const dest = DESTINATIONS_DATA.find(d => d.id === Number(data.destination_id));
  const destName = (data.destination_name || data.destination || (dest ? dest.name : 'Destination')).trim();
  const sourceLoc = (data.source_location || data.source || 'New Delhi').trim();
  const tripName = data.trip_name || `${sourceLoc} to ${destName} Trip`;

  const payload = {
    destination_id: data.destination_id ? Number(data.destination_id) : 0,
    destination_name: destName,
    source_location: sourceLoc,
    start_date: data.start_date,
    end_date: data.end_date,
    num_travellers: Number(data.num_travellers) || 1,
    trip_name: tripName,
    notes: data.notes || `Source: ${sourceLoc}`
  };

  try {
    const response = await fetch(`${API_URL}/trips.php?id=${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        const localTrips = getLocalTrips();
        const updated = localTrips.map(t =>
          t.id === numId ? { ...t, ...payload, destination_name: destName } : t
        );
        saveLocalTrips(updated);
        return result;
      }
    }
  } catch {
    // Offline
  }

  const localTrips = getLocalTrips();
  const updated = localTrips.map(t =>
    t.id === numId ? { ...t, ...payload, destination_name: destName } : t
  );
  saveLocalTrips(updated);

  return { success: true, message: 'Trip updated successfully.' };
}

/**
 * Delete a trip by ID.
 * @param {number|string} id
 */
export async function deleteTrip(id) {
  const numId = Number(id);

  try {
    const response = await fetch(`${API_URL}/trips.php?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      const result = await response.json();
      const localTrips = getLocalTrips();
      saveLocalTrips(localTrips.filter(t => t.id !== numId));
      if (result.success) return result;
    }
  } catch {
    // Offline
  }

  const localTrips = getLocalTrips();
  saveLocalTrips(localTrips.filter(t => t.id !== numId));
  return { success: true, message: 'Trip deleted successfully.' };
}

// ============================================================
// RAILWAY TIMETABLE & SEARCH (RAILRADAR API INTEGRATION)
// ============================================================

/**
 * Search trains between stations via the secure PHP backend proxy.
 *
 * @param {Object} params
 * @param {string} params.from - Source station code or name (e.g. NDLS, UJN)
 * @param {string} params.to   - Destination station code or name (e.g. MMCT, INDB)
 * @param {string} [params.date] - Optional travel date (YYYY-MM-DD)
 * @returns {Promise<{ success: boolean, count: number, data: Array, route: Object }>}
 */
export async function searchTrains({ from, to, date } = {}) {
  const queryParams = new URLSearchParams();
  if (from) queryParams.append('from', from.trim());
  if (to)   queryParams.append('to', to.trim());
  if (date) queryParams.append('date', date);

  try {
    const response = await fetch(`${API_URL}/trains.php?${queryParams.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const errMsg = (result && result.message) ? result.message : 'Unable to connect to train service.';
      throw new Error(errMsg);
    }

    if (!result || !result.success) {
      throw new Error((result && result.message) ? result.message : 'Failed to fetch train information.');
    }

    return result;
  } catch (error) {
    if (error.message) {
      throw error;
    }
    throw new Error('Train service is temporarily unavailable. Please try again later.');
  }
}

/**
 * Get live train running status for a given train number.
 *
 * @param {string} trainNumber  - 5-digit Indian Railways train number (e.g. '12919')
 * @param {string} [date]       - Optional journey date in YYYY-MM-DD format
 * @returns {Promise<Object>}   - Normalized live status object from train_live.php
 */
export async function getLiveTrainStatus(trainNumber, date) {
  const queryParams = new URLSearchParams();
  if (trainNumber) queryParams.append('number', String(trainNumber).trim());
  if (date)        queryParams.append('date', date);

  try {
    const response = await fetch(`${API_URL}/train_live.php?${queryParams.toString()}`, {
      method: 'GET',
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const errMsg = (result && result.message) ? result.message : 'Unable to connect to train service.';
      throw new Error(errMsg);
    }

    if (!result || !result.success) {
      throw new Error((result && result.message) ? result.message : 'Live status is currently unavailable for this train.');
    }

    return result;
  } catch (error) {
    if (error.message) throw error;
    throw new Error('Train service is temporarily unavailable. Please try again later.');
  }
}

// ============================================================
// AI-POWERED ITINERARY ENGINE (GOOGLE GEMINI PROXY)
// ============================================================

/**
 * Generate an AI travel recommendation via the secure PHP backend proxy.
 *
 * The Gemini API key is NEVER sent from React — the PHP backend holds it.
 *
 * @param {Object} data
 * @param {string} data.destination   - e.g. "Goa"
 * @param {number} data.days          - Number of days (1–30)
 * @param {number} data.travellers    - Number of travellers (≥1)
 * @param {number} data.budget        - Total budget in ₹ (≥0)
 * @param {string} [data.interests]   - e.g. "beaches, food, sightseeing"
 * @param {string} [data.preferences] - e.g. "relaxed trip"
 * @returns {Promise<{ success: boolean, recommendation: string }>}
 */
export async function generateAIRecommendation(data) {
  return generateAITripPlan(data);
}

/**
 * Generate a complete, day-by-day trip plan from Source to Destination powered by Gemini AI.
 * Falls back gracefully to intelligent client-side planner if server is offline or key missing.
 * @param {Object} data
 * @param {string} [data.source_location]
 * @param {string} [data.source]
 * @param {string} data.destination
 * @param {number} data.days
 * @param {number} data.travellers
 * @param {number} [data.budget]
 * @param {string} [data.start_date]
 * @param {string} [data.end_date]
 * @param {string} [data.preferences]
 * @param {string} [data.interests]
 */
export async function generateAITripPlan(data) {
  const destName = (data.destination || data.destination_name || 'Destination').trim();
  const sourceName = (data.source || data.source_location || 'New Delhi').trim();
  const days = Math.max(1, Math.min(30, Number(data.days) || 3));
  const travellers = Math.max(1, Number(data.travellers) || 2);
  const budget = Number(data.budget) || (days * 3500 * travellers);

  try {
    const response = await fetch(`${API_URL}/ai.php`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_location: sourceName,
        destination: destName,
        days: days,
        travellers: travellers,
        budget: budget,
        start_date: data.start_date || '',
        end_date: data.end_date || '',
        preferences: data.preferences || '',
        interests: data.interests || ''
      }),
    });

    if (response.ok) {
      const result = await response.json().catch(() => null);
      if (result && result.success && result.recommendation) {
        return result;
      }
    }
  } catch {
    // Backend offline or unreachable -> continue to direct Gemini call below
  }

  // Direct client-side Gemini AI attempt if backend is unreachable
  const directKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (directKey && directKey !== 'YOUR_GEMINI_API_KEY_HERE') {
    try {
      const budgetFormatted = budget.toLocaleString('en-IN');
      const prompt = `You are Gemini AI, a premier world-class travel planner creating a HIGHLY SPECIFIC, ROUTE-TAILORED trip plan.

CRITICAL MANDATE - DO NOT USE GENERIC PHRASES:
- NEVER say 'take an express train', 'try local delicacies', 'sample street food', or 'visit local bazaars'.
- YOU MUST NAME 2-3 SPECIFIC TRAINS WITH 5-DIGIT TRAIN NUMBERS (e.g. 12955 Mumbai-Jaipur SF, 20978 Vande Bharat, 12050 Gatimaan Express) with exact departure/arrival stations, journey hours, and classes (SL, 3AC, 2AC, CC).
- YOU MUST NAME SPECIFIC FLIGHTS with airport IATA codes (e.g. BOM, DEL, JAI, GOI, CDG, DXB), operating airlines (IndiGo, Air India, Emirates), non-stop flying times, and typical fare bands in INR.
- YOU MUST NAME SPECIFIC HIGHWAYS (e.g. NE4 Delhi-Mumbai Expressway, NH48, Yamuna Expressway, NH66) and premier bus services (Zingbus, IntrCity SmartBus, RSRTC Goldline).
- YOU MUST NAME SPECIFIC DISHES AND EXACT FAMOUS RESTAURANTS / SWEET SHOPS (e.g. Rawat's Pyaaz Kachori, LMB Ghevar, Lassiwala on MI Road, Martin's Corner Butter Garlic Crab, Du Pain et des Idées).
- YOU MUST NAME SPECIFIC SHOPPING MARKETS (e.g. Johari Bazaar, Bapu Bazaar, Anjuna Flea Market, Thatheri Bazaar, Sadar Bazaar, Galeries Lafayette) with exact items to buy, realistic price ranges, and bargaining advice.

Trip Parameters:
🛫 Departure City / Starting Point: ${sourceName}
📍 Destination: ${destName}
⏳ Trip Duration: ${days} Days
👥 Number of Travellers: ${travellers}
💰 Estimated Budget: Rs. ${budgetFormatted}
🎯 Interests: ${data.interests || 'Sightseeing, authentic cuisine, local culture, photography, shopping'}
✨ Preferences: ${data.preferences || 'Comfortable, well-balanced itinerary'}

Please provide an extensive, inspiring, and practical trip plan structured in clean Markdown with emojis:
1. 🚆/✈️/🚗 Route-Specific Travel & Transit Options (${sourceName} to ${destName})
2. 🗓️ Comprehensive Day-by-Day Journey Itinerary (${days} Days) with Morning, Afternoon, Evening
3. 📍 Must-Visit Attractions & Sightseeing Spots in ${destName}
4. 🍲 Specific Food & Culinary Guide (Iconic Dishes & Named Famous Eateries)
5. 🛍️ Specific Shopping Places, Local Bazaars & Souvenirs (What to Buy & Bargaining Advice)
6. 🎭 Nightlife, Culture & Evening Experiences
7. 💰 Estimated Budget & Cost Breakdown (${travellers} Travellers)
8. 💡 Smart Route & Travel Tips`;

      const candidateModels = ['gemini-flash-lite-latest', 'gemini-3.8-flash', 'gemini-flash-latest'];
      for (const model of candidateModels) {
        try {
          const directRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(directKey)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 2500,
                  topP: 0.95
                }
              })
            }
          );
          if (directRes.ok) {
            const json = await directRes.json();
            const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim().length > 100) {
              return {
                success: true,
                recommendation: text.trim(),
                source: 'gemini'
              };
            }
          }
        } catch {}
      }
    } catch {}
  }

  // Generate hyper-specific, route-tailored plan
  const routeData = getSpecificRouteData(sourceName, destName);
  const destGuide = getSpecificDestinationGuide(destName);
  const budgetFormatted = budget.toLocaleString('en-IN');

  let plan = `## 🗺️ Route-Specific Travel Plan: ${sourceName} to ${destGuide.title}\n\n`;

  // 1. Specific Travel & Transit Options
  plan += `### 1. 🚆/✈️/🚗 Route-Specific Travel & Transit Options (${sourceName} to ${destName})\n`;

  if (routeData.trains && routeData.trains.length > 0) {
    plan += `#### 🚆 Specific Train Connections (${sourceName} ➔ ${destName}):\n`;
    routeData.trains.forEach(t => {
      plan += `- ${t}\n`;
    });
    plan += `\n`;
  }

  if (routeData.flights && routeData.flights.length > 0) {
    plan += `#### ✈️ Specific Flight Connections (${sourceName} ➔ ${destName}):\n`;
    routeData.flights.forEach(f => {
      plan += `- ${f}\n`;
    });
    plan += `\n`;
  }

  if (routeData.road && routeData.road.length > 0) {
    plan += `#### 🚗 Road, Highway Corridors & Bus Routes:\n`;
    routeData.road.forEach(r => {
      plan += `- ${r}\n`;
    });
    plan += `\n`;
  }

  if (routeData.local_commute && routeData.local_commute.length > 0) {
    plan += `#### 🚕 Local Commute at ${destName}:\n`;
    routeData.local_commute.forEach(lc => {
      plan += `- ${lc}\n`;
    });
    plan += `\n`;
  }

  // 2. Day-by-Day Journey Itinerary
  plan += `### 2. 🗓️ Comprehensive Day-by-Day Journey Itinerary (${days} Days)\n`;
  plan += `#### Day 1: Departure from ${sourceName} & Arrival in ${destName}\n`;
  plan += `- **Morning**: Depart from ${sourceName} via your scheduled flight, superfast train, or early highway departure.\n`;
  plan += `- **Afternoon**: Arrive in ${destName}, check in to your stay, freshen up, and unpack.\n`;
  if (destGuide.sights && destGuide.sights[0]) {
    plan += `- **Evening (5:30 PM – 9:00 PM)**: Visit ${destGuide.sights[0]} for sunset views. Follow with a welcoming dinner at an iconic local eatery.\n\n`;
  } else {
    plan += `- **Evening (5:30 PM – 9:00 PM)**: Take a leisurely sunset stroll around the city center or waterfront promenade. Enjoy a welcoming dinner featuring regional specialties.\n\n`;
  }

  for (let d = 2; d < days; d++) {
    const sightIdx = (d - 2) % destGuide.sights.length;
    const nextSightIdx = (d - 1) % destGuide.sights.length;
    const sight = destGuide.sights[sightIdx] || 'Historic landmark and cultural quarter';
    const nextSight = destGuide.sights[nextSightIdx] || 'Panoramic viewpoint';
    const dish = destGuide.dishes[d % destGuide.dishes.length] || 'Authentic regional delicacy';

    plan += `#### Day ${d}: Landmark Exploration & Cultural Highlights\n`;
    plan += `- **Morning (09:00 AM – 01:00 PM)**: Explore ${sight}.\n`;
    plan += `- **Afternoon (01:00 PM – 04:30 PM)**: Enjoy a regional lunch featuring ${dish}. Visit local artisan craft workshops.\n`;
    plan += `- **Evening (05:00 PM – 08:30 PM)**: Experience golden hour and sunset at ${nextSight}, followed by exploring lively evening bazaar lanes.\n\n`;
  }

  plan += `#### Day ${days}: Souvenir Bazaars, Check-out & Return Journey to ${sourceName}\n`;
  plan += `- **Morning (08:30 AM – 11:30 AM)**: Enjoy breakfast, complete souvenir and specialty shopping at the local markets, and pack bags.\n`;
  plan += `- **Afternoon**: Check out from accommodation and transfer to the railway terminal, airport, or highway boarding point.\n`;
  plan += `- **Evening**: Board your return journey back to ${sourceName}. Arrive safely home with unforgettable memories!\n\n`;

  // 3. Must-Visit Attractions
  plan += `### 3. 📍 Must-Visit Attractions & Sightseeing Spots in ${destGuide.title}\n`;
  destGuide.sights.forEach(s => {
    plan += `- ${s}\n`;
  });
  plan += `\n`;

  // 4. Food & Culinary Guide
  plan += `### 4. 🍲 Food & Culinary Guide (Specific Iconic Dishes & Named Eateries)\n`;
  plan += `#### Signature Delicacies You Must Try:\n`;
  destGuide.dishes.forEach(dish => {
    plan += `- ${dish}\n`;
  });
  plan += `\n#### Famous Food Streets & Night Markets in ${destName}:\n`;
  destGuide.food_streets.forEach(fs => {
    plan += `- ${fs}\n`;
  });
  plan += `\n`;

  // 5. Shopping Places, Local Bazaars & Souvenirs
  plan += `### 5. 🛍️ Shopping Places, Local Bazaars & Souvenirs (What to Buy)\n`;
  destGuide.shopping.forEach(shop => {
    plan += `- ${shop}\n`;
  });
  plan += `\n`;

  // 6. Nightlife & Culture
  plan += `### 6. 🎭 Nightlife, Culture & Evening Experiences\n`;
  plan += `- **Cultural Performances & Traditions**: Enjoy live folk dance recitals, regional music performances, sound & light shows at heritage landmarks, or evening river/boat cruises.\n`;
  plan += `- **Evening Hangouts**: Spend relaxing evenings at illuminated monument viewpoints, open-air cafes, or rooftop lounges with panoramic skyline views.\n\n`;

  // 7. Budget Breakdown
  plan += `### 7. 💰 Estimated Budget & Cost Breakdown (${travellers} Travellers)\n`;
  plan += `- **Total Estimated Budget**: ₹${budgetFormatted}\n`;
  plan += `- **Stays & Lodging**: ~40% (₹${Math.round(budget * 0.40).toLocaleString('en-IN')}) for comfortable mid-range or boutique stays\n`;
  plan += `- **Food & Dining**: ~25% (₹${Math.round(budget * 0.25).toLocaleString('en-IN')}) for iconic restaurants, cafes, and street food stalls\n`;
  plan += `- **Transit & Local Cabs**: ~20% (₹${Math.round(budget * 0.20).toLocaleString('en-IN')}) for return travel fares, local app-cabs, and auto-rickshaws\n`;
  plan += `- **Shopping & Sightseeing**: ~15% (₹${Math.round(budget * 0.15).toLocaleString('en-IN')}) for monument entry passes, activities, and authentic souvenirs\n\n`;

  // 8. Smart Travel Tips
  plan += `### 8. 💡 Smart Route & Travel Tips\n`;
  plan += `- **Advance Booking**: Reserve your train berths (via IRCTC) or flights at least 3-4 weeks in advance for confirmed status.\n`;
  plan += `- **Local Navigation**: Download offline Google Maps for ${destName} and keep ride-hailing/digital payment apps active.\n`;
  plan += `- **Walking Footwear**: Carry comfortable broken-in sneakers suitable for exploring historic corridors and cobblestone bazaar alleys.\n`;

  return {
    success: true,
    recommendation: plan,
    source: 'route_specific_planner'
  };
}


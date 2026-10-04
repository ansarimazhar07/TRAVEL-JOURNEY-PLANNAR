/**
 * api.js
 * 
 * Central place for all API calls from React to the PHP backend.
 * 
 * HOW TO USE:
 *   import { getDestinations, getDestination } from '../services/api'
 * 
 * All functions return the parsed JSON from the PHP API.
 * Error handling is done inside each function — they throw an
 * Error with a user-friendly message if something goes wrong.
 */

// Base URL for the PHP backend.
// In production (Netlify), set VITE_API_URL in your Netlify site settings.
// In local development, it defaults to the local XAMPP Apache path.
const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost/travel-journey-planner/backend';
const API_URL = RAW_API_URL.replace(/\/+$/, '');

// ============================================================
// DESTINATIONS
// ============================================================

/**
 * Fetch all destinations from the database.
 * @returns {Array} Array of destination objects
 */
export async function getDestinations() {
  try {
    const response = await fetch(`${API_URL}/destinations.php`);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to load destinations.');
    }

    return result.data;

  } catch (error) {
    // Re-throw with a clean, user-friendly message
    throw new Error('Unable to load destinations. Please check your connection and try again.');
  }
}

/**
 * Fetch a single destination by its ID.
 * @param {number|string} id  The destination ID
 * @returns {Object} A single destination object
 */
export async function getDestination(id) {
  try {
    const response = await fetch(`${API_URL}/destinations.php?id=${id}`);

    // 404 from PHP means "destination not found"
    if (response.status === 404) {
      throw new Error('NOT_FOUND');
    }

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to load destination.');
    }

    return result.data;

  } catch (error) {
    // Pass through our NOT_FOUND signal so the UI can show a specific message
    if (error.message === 'NOT_FOUND') throw error;
    throw new Error('Unable to load destination details. Please check your connection and try again.');
  }
}

// ============================================================
// PLACES
// ============================================================

/**
 * Fetch all places for a destination, or all places if no ID given.
 * @param {number|string} [destinationId]  Optional destination ID
 * @returns {Array} Array of place objects
 */
export async function getPlaces(destinationId) {
  try {
    const url = destinationId
      ? `${API_URL}/places.php?destination_id=${destinationId}`
      : `${API_URL}/places.php`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to load places.');
    }

    return result.data;

  } catch (error) {
    throw new Error('Unable to load places. Please check your connection and try again.');
  }
}

/**
 * Fetch a single place by its ID.
 * @param {number|string} id  The place ID
 * @returns {Object} A single place object
 */
export async function getPlace(id) {
  try {
    const response = await fetch(`${API_URL}/places.php?id=${id}`);

    if (response.status === 404) {
      throw new Error('NOT_FOUND');
    }

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to load place.');
    }

    return result.data;

  } catch (error) {
    if (error.message === 'NOT_FOUND') throw error;
    throw new Error('Unable to load place details. Please check your connection and try again.');
  }
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
// PHASE 4 — AUTHENTICATION
// ============================================================
// All auth requests use credentials: 'include' so the browser
// sends the PHP session cookie automatically.
// ============================================================

/**
 * Register a new user account.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {{ success, message }}
 */
export async function registerUser(name, email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/register.php`, {
      method: 'POST',
      credentials: 'include',                       // Send session cookie
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    return await response.json();

  } catch {
    return { success: false, message: 'Unable to connect to server. Please try again.' };
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

    return await response.json();

  } catch {
    return { success: false, message: 'Unable to connect to server. Please try again.' };
  }
}

/**
 * Log out the current user.
 * PHP destroys the session on the server side.
 * @returns {{ success, message }}
 */
export async function logoutUser() {
  try {
    const response = await fetch(`${API_URL}/auth/logout.php`, {
      method: 'POST',
      credentials: 'include',                       // Send session cookie to destroy
    });

    return await response.json();

  } catch {
    return { success: false, message: 'Unable to connect to server.' };
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

    return await response.json();

  } catch {
    return { success: false, loggedIn: false };
  }
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

    return await response.json();

  } catch {
    return { success: false, message: 'Unable to load profile. Please try again.' };
  }
}

// ============================================================
// PHASE 5 — TRIPS
// ============================================================

/**
 * Fetch all trips belonging to the logged-in user.
 */
export async function getTrips() {
  try {
    const response = await fetch(`${API_URL}/trips.php`, {
      method: 'GET',
      credentials: 'include',
    });
    return await response.json();
  } catch {
    return { error: 'Unable to load trips. Please try again.' };
  }
}

/**
 * Fetch a single trip by ID.
 * Backend verifies the trip belongs to the logged-in user.
 */
export async function getTrip(id) {
  try {
    const response = await fetch(`${API_URL}/trips.php?id=${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    return await response.json();
  } catch {
    return { error: 'Unable to load trip. Please try again.' };
  }
}

/**
 * Create a new trip.
 * Do NOT pass user_id — backend reads it from the PHP session.
 * @param {{ destination_id, start_date, end_date, num_travellers }} data
 */
export async function createTrip(data) {
  try {
    const response = await fetch(`${API_URL}/trips.php`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch {
    return { error: 'Unable to create trip. Please try again.' };
  }
}

/**
 * Update a trip by ID.
 * Backend verifies ownership.
 * @param {number} id
 * @param {{ destination_id, start_date, end_date, num_travellers }} data
 */
export async function updateTrip(id, data) {
  try {
    const response = await fetch(`${API_URL}/trips.php?id=${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch {
    return { error: 'Unable to update trip. Please try again.' };
  }
}

/**
 * Delete a trip by ID.
 * Backend verifies ownership.
 */
export async function deleteTrip(id) {
  try {
    const response = await fetch(`${API_URL}/trips.php?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return await response.json();
  } catch {
    return { error: 'Unable to delete trip. Please try again.' };
  }
}

// ============================================================
// PHASE 8 — TRAIN SEARCH (RAILRADAR INTEGRATION)
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
// PHASE 9 — AI TRAVEL RECOMMENDATION (GEMINI)
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
  try {
    const response = await fetch(`${API_URL}/ai.php`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      // Surface user-friendly error from PHP if available
      const errMsg = (result && result.error) ? result.error : 'AI recommendation service is temporarily unavailable.';
      throw new Error(errMsg);
    }

    if (!result || !result.success) {
      throw new Error((result && result.error) ? result.error : 'Unable to generate recommendation.');
    }

    return result;
  } catch (error) {
    if (error.message) throw error;
    throw new Error('AI recommendation service is temporarily unavailable. Please try again later.');
  }
}


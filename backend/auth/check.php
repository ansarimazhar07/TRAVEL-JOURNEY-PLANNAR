<?php
/**
 * auth/check.php — Active Session Verification Endpoint
 *
 * GET /auth/check.php
 * Verifies whether the incoming HTTP request contains a valid, authenticated PHP session cookie.
 * React's AuthContext calls this during application boot to restore logged-in state across page refreshes.
 *
 * Response (authenticated):
 *   { "success": true, "loggedIn": true, "user": { id, name, email } }
 *
 * Response (unauthenticated / guest):
 *   { "success": true, "loggedIn": false }
 */

// --- Middleware Initialization ---
// Restore session context and set cross-origin headers
require_once __DIR__ . '/../session.php';
require_once '../cors.php';

// --- Session State Evaluation ---
// Inspect the server-side $_SESSION superglobal populated from the client's PHPSESSID cookie
if (isset($_SESSION['user_id'])) {
    // Session is active and authenticated — return public profile details
    echo json_encode([
        'success'  => true,
        'loggedIn' => true,
        'user'     => [
            'id'    => $_SESSION['user_id'],
            'name'  => $_SESSION['user_name'],
            'email' => $_SESSION['user_email'],
        ],
    ]);
} else {
    // No active session — inform the frontend so it treats the user as a guest
    echo json_encode([
        'success'  => true,
        'loggedIn' => false,
    ]);
}

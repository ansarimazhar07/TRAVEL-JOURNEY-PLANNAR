<?php
/**
 * auth/check.php
 *
 * GET /auth/check.php
 * Checks whether the user currently has an active PHP session.
 * React calls this on app startup to restore login state.
 *
 * Response (logged in):
 *   { "success": true, "loggedIn": true, "user": { id, name, email } }
 *
 * Response (not logged in):
 *   { "success": true, "loggedIn": false }
 */

// Start session BEFORE any output or headers
session_start();

// Include CORS headers
require_once '../cors.php';

// Check if a user session exists
if (isset($_SESSION['user_id'])) {
    // User is logged in
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
    // Not logged in
    echo json_encode([
        'success'  => true,
        'loggedIn' => false,
    ]);
}

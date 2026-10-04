<?php
/**
 * auth/logout.php
 *
 * POST /auth/logout.php
 * Destroys the PHP session and logs the user out.
 *
 * Response:
 *   { "success": true, "message": "Logged out successfully" }
 */

// Start session BEFORE any output or headers
session_start();

// Include CORS headers
require_once '../cors.php';

// Destroy the session completely
session_unset();    // Clear all session variables
session_destroy();  // Destroy the session on the server

echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully.',
]);

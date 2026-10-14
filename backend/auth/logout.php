<?php
/**
 * auth/logout.php — User Session Invalidation Endpoint
 *
 * POST /auth/logout.php
 * Completely invalidates the server-side session and clears stored session variables.
 *
 * Response:
 *   { "success": true, "message": "Logged out successfully." }
 */

// --- Middleware & Session Access ---
// Access the active session context
require_once __DIR__ . '/../session.php';
require_once '../cors.php';

// --- Session Destruction ---
// 1. Wipe all data stored in the $_SESSION superglobal array
session_unset();
// 2. Destroy the session storage record on the server
session_destroy();

// --- Success Notification ---
echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully.',
]);

<?php
/**
 * auth/profile.php — Authenticated User Profile Endpoint
 *
 * GET /auth/profile.php
 * Retrieves user profile metadata (ID, name, email, account creation date).
 * Strictly requires an active PHP session; rejects unauthorized requests with HTTP 401.
 *
 * Response (Success):
 *   { "success": true, "user": { "id": 1, "name": "...", "email": "...", "created_at": "..." } }
 *
 * Response (Unauthorized):
 *   { "success": false, "message": "Not logged in." }
 */

// --- Middleware & Database Initialization ---
require_once __DIR__ . '/../session.php';
require_once '../cors.php';
require_once '../db.php';

// --- Authentication Guard ---
// Enforce session presence — unauthenticated clients cannot access profile data
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not logged in. Please login to view your profile.']);
    exit;
}

// --- Fetch Fresh Profile Record from Database ---
try {
    // Select user metadata using session ID; password column is intentionally omitted for safety
    $stmt = $conn->prepare(
        "SELECT id, name, email, created_at FROM users WHERE id = ?"
    );
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();

    if (!$user) {
        // Edge case: session exists but database record was deleted
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User account not found.']);
        exit;
    }

    // Return safe user profile payload
    echo json_encode([
        'success' => true,
        'user'    => [
            'id'         => $user['id'],
            'name'       => $user['name'],
            'email'      => $user['email'],
            'created_at' => $user['created_at'],
        ],
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Unable to load profile. Please try again.']);
}

<?php
/**
 * auth/profile.php
 *
 * GET /auth/profile.php
 * Returns the currently logged-in user's profile data.
 * Only available to authenticated users (session required).
 *
 * Response (logged in):
 *   { "success": true, "user": { id, name, email, created_at } }
 *
 * Response (not logged in):
 *   { "success": false, "message": "Not logged in." }
 */

// Start session with secure cross-origin settings
require_once __DIR__ . '/../session.php';

// Include CORS headers and database connection
require_once '../cors.php';
require_once '../db.php';

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Not logged in. Please login to view your profile.']);
    exit;
}

// Fetch fresh user data from the database using their session user_id
try {
    $stmt = $conn->prepare(
        "SELECT id, name, email, created_at FROM users WHERE id = ?"
    );
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();

    if (!$user) {
        // This shouldn't normally happen, but handle it gracefully
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User account not found.']);
        exit;
    }

    // Return user data — note: password is NOT selected or returned
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

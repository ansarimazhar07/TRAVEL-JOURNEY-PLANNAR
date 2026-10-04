<?php
/**
 * auth/register.php
 *
 * POST /auth/register.php
 * Creates a new user account.
 *
 * Request body (JSON):
 *   { "name": "...", "email": "...", "password": "..." }
 *
 * Response:
 *   { "success": true,  "message": "Registration successful" }
 *   { "success": false, "message": "..." }
 */

// Start session with secure cross-origin settings
require_once __DIR__ . '/../session.php';

// Include CORS headers and database connection
require_once '../cors.php';
require_once '../db.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Read and decode the JSON body sent by React
$body = json_decode(file_get_contents('php://input'), true);

// Extract fields (trim whitespace)
$name     = isset($body['name'])     ? trim($body['name'])     : '';
$email    = isset($body['email'])    ? trim($body['email'])    : '';
$password = isset($body['password']) ? trim($body['password']) : '';

// ---- Input validation ----

if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Name is required.']);
    exit;
}

if (strlen($name) > 100) {
    echo json_encode(['success' => false, 'message' => 'Name is too long (max 100 characters).']);
    exit;
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

if (strlen($email) > 150) {
    echo json_encode(['success' => false, 'message' => 'Email is too long (max 150 characters).']);
    exit;
}

if (empty($password) || strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
    exit;
}

// ---- Check if email already registered ----
try {
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $existing = $stmt->fetch();

    if ($existing) {
        echo json_encode(['success' => false, 'message' => 'Email already registered. Please login instead.']);
        exit;
    }

    // ---- Hash password and insert user ----
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $insert = $conn->prepare(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
    );
    $insert->execute([$name, $email, $hashedPassword]);

    echo json_encode([
        'success' => true,
        'message' => 'Registration successful. You can now login.',
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
}

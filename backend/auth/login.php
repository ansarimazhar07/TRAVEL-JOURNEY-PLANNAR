<?php
/**
 * auth/login.php
 *
 * POST /auth/login.php
 * Logs the user in by verifying credentials and starting a PHP session.
 *
 * Request body (JSON):
 *   { "email": "...", "password": "..." }
 *
 * Response (success):
 *   { "success": true, "message": "Login successful", "user": { id, name, email } }
 *
 * Response (failure):
 *   { "success": false, "message": "Invalid email or password" }
 */

// Start session BEFORE any output or headers
session_start();

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

// Extract fields
$email    = isset($body['email'])    ? trim($body['email'])    : '';
$password = isset($body['password']) ? trim($body['password']) : '';

// ---- Basic input validation ----

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please enter your email and password.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    exit;
}

// ---- Find user by email (using prepared statement) ----
try {
    $stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // If no user found OR password doesn't match — give the same error message
    // (Do NOT say "email not found" or "wrong password" separately — security best practice)
    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
        exit;
    }

    // ---- Create PHP session ----
    // Store only basic info — never store the password
    $_SESSION['user_id']    = $user['id'];
    $_SESSION['user_name']  = $user['name'];
    $_SESSION['user_email'] = $user['email'];

    // Return user info (without password)
    echo json_encode([
        'success' => true,
        'message' => 'Login successful.',
        'user'    => [
            'id'    => $user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
        ],
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Login failed. Please try again.']);
}

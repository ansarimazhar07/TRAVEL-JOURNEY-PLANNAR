<?php
/**
 * auth/login.php — User Authentication & Session Creation Endpoint
 *
 * POST /auth/login.php
 * Authenticates user credentials by querying MySQL with a parameterized PDO statement,
 * verifying the password against a bcrypt hash, and establishing a persistent PHP session.
 *
 * Request Body (JSON):
 *   { "email": "traveler@example.com", "password": "secretPassword" }
 *
 * Response (Success - 200 OK):
 *   { "success": true, "message": "Login successful.", "user": { "id": 1, "name": "...", "email": "..." } }
 *
 * Response (Failure - 401 Unauthorized):
 *   { "success": false, "message": "Invalid email or password." }
 */

// --- Session & Security Middleware ---
// Start or resume session with secure cookie flags (HttpOnly, SameSite)
require_once __DIR__ . '/../session.php';
// Set CORS headers and establish PDO database connection
require_once '../cors.php';
require_once '../db.php';

// --- HTTP Method Enforcement ---
// Restrict endpoint to POST requests only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// --- Request Body Parsing ---
// Read raw php://input stream and decode JSON sent by React fetch client
$body = json_decode(file_get_contents('php://input'), true);

// Extract and sanitize input fields
$email    = isset($body['email'])    ? trim($body['email'])    : '';
$password = isset($body['password']) ? trim($body['password']) : '';

// --- Input Validation ---
// Reject empty fields before executing database queries
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Please enter your email and password.']);
    exit;
}

// Validate email format using PHP's built-in filter
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    exit;
}

// --- Database Verification & Credential Matching ---
try {
    // Parameterized prepared query to prevent SQL Injection
    $stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // Security Best Practice: Use a generic error message whether the user exists or the password was wrong
    // This prevents username/email enumeration attacks.
    // password_verify() safely checks the plain text against the bcrypt hash with salt.
    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
        exit;
    }

    // --- Session Persistence ---
    // Store authenticated user ID and name in server-side session
    // Passwords or sensitive hashes are NEVER stored in the session
    $_SESSION['user_id']    = $user['id'];
    $_SESSION['user_name']  = $user['name'];
    $_SESSION['user_email'] = $user['email'];

    // --- Return Success Payload to Frontend ---
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

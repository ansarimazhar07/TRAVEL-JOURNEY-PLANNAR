<?php
/**
 * auth/register.php — New User Account Registration Endpoint
 *
 * POST /auth/register.php
 * Creates a new user record in the MySQL users table. Validates field presence,
 * formats, checks for duplicate email addresses, and securely hashes passwords using bcrypt.
 *
 * Request Body (JSON):
 *   { "name": "Jane Traveler", "email": "jane@example.com", "password": "securePassword123" }
 *
 * Response (Success):
 *   { "success": true, "message": "Registration successful. You can now login." }
 *
 * Response (Failure):
 *   { "success": false, "message": "..." }
 */

// --- Middleware & Dependencies ---
require_once __DIR__ . '/../session.php';
require_once '../cors.php';
require_once '../db.php';

// --- HTTP Method Enforcement ---
// Restrict endpoint to POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// --- Request Body Parsing ---
// Decode incoming JSON from React frontend
$body = json_decode(file_get_contents('php://input'), true);

// Extract and trim whitespace from credentials
$name     = isset($body['name'])     ? trim($body['name'])     : '';
$email    = isset($body['email'])    ? trim($body['email'])    : '';
$password = isset($body['password']) ? trim($body['password']) : '';

// --- Input Validation & Boundary Checks ---
// Verify user name is present and within database column bounds
if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Name is required.']);
    exit;
}

if (strlen($name) > 100) {
    echo json_encode(['success' => false, 'message' => 'Name is too long (max 100 characters).']);
    exit;
}

// Validate email presence and syntactic correctness
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

if (strlen($email) > 150) {
    echo json_encode(['success' => false, 'message' => 'Email is too long (max 150 characters).']);
    exit;
}

// Enforce minimum password strength (at least 6 characters)
if (empty($password) || strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
    exit;
}

// --- Database Operations & Uniqueness Verification ---
try {
    // Check if an account already exists with this email address
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $existing = $stmt->fetch();

    if ($existing) {
        echo json_encode(['success' => false, 'message' => 'Email already registered. Please login instead.']);
        exit;
    }

    // --- Cryptographic Password Hashing ---
    // PASSWORD_DEFAULT utilizes bcrypt (or Argon2 in newer PHP configurations)
    // Automatically generates an unpredictable cryptographic salt
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user record into database using prepared parameters
    $insert = $conn->prepare(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
    );
    $insert->execute([$name, $email, $hashedPassword]);

    // Return success message to client
    echo json_encode([
        'success' => true,
        'message' => 'Registration successful. You can now login.',
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
}

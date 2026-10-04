<?php
/**
 * cors.php
 * 
 * Sets CORS headers so the React frontend
 * can make requests to this PHP backend.
 * 
 * Supports localhost dev server on any port (5173, 5174, 5175, etc.).
 */

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = 'http://localhost:5173';

if ($origin !== '' && (preg_match('/^https?:\/\/localhost(:\d+)?$/', $origin) || preg_match('/^https?:\/\/127\.0\.0\.1(:\d+)?$/', $origin))) {
    $allowedOrigin = $origin;
}

header("Access-Control-Allow-Origin: $allowedOrigin");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');   // Required for PHP sessions
header('Content-Type: application/json');

// Handle browser pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

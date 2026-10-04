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

$frontendUrl = getenv('FRONTEND_URL') ?: getenv('ALLOWED_ORIGIN');

if ($origin !== '') {
    if (
        preg_match('/^https?:\/\/localhost(:\d+)?$/', $origin) ||
        preg_match('/^https?:\/\/127\.0\.0\.1(:\d+)?$/', $origin) ||
        preg_match('/^https:\/\/([a-zA-Z0-9_-]+\.)?netlify\.app$/', $origin) ||
        preg_match('/^https:\/\/([a-zA-Z0-9_-]+\.)?onrender\.com$/', $origin) ||
        ($frontendUrl && ($origin === rtrim($frontendUrl, '/') || $frontendUrl === '*'))
    ) {
        $allowedOrigin = $origin;
    }
}

header("Access-Control-Allow-Origin: $allowedOrigin");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept');
header('Access-Control-Allow-Credentials: true');   // Required for cross-site auth/sessions
header('Content-Type: application/json; charset=utf-8');

// Handle browser pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

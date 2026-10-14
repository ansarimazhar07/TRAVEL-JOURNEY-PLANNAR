<?php
/**
 * cors.php — Cross-Origin Resource Sharing (CORS) & Preflight Middleware
 * 
 * Sets HTTP headers enabling the React single-page frontend (running on Vite dev ports
 * or production domains) to communicate asynchronously with this PHP backend.
 * Handles HTTP OPTIONS preflight handshakes required for complex cross-origin requests.
 */

// --- Dynamic Origin Inspection ---
// Read the incoming HTTP Origin header sent by the client's browser
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = 'http://localhost:5173'; // Default local development client origin

$frontendUrl = getenv('FRONTEND_URL') ?: getenv('ALLOWED_ORIGIN');

// Validate if the requesting origin matches localhost development or authorized deployment domains
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

// --- Emit CORS Security & Response Type Headers ---
header("Access-Control-Allow-Origin: $allowedOrigin");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept');
// Required so the browser will transmit and accept session cookies (PHPSESSID) across origins
header('Access-Control-Allow-Credentials: true');
// Standardize API response format as JSON encoded in UTF-8
header('Content-Type: application/json; charset=utf-8');

// --- HTTP OPTIONS Preflight Responder ---
// Browsers send an automated OPTIONS request before POST/PUT/DELETE to verify server permissions.
// Returning 200 OK immediately authorizes the subsequent real API request.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

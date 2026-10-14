<?php
/**
 * index.php — Root API Gateway & System Health Check
 *
 * Provides a discovery index of all available REST endpoints and checks
 * database connectivity status. Useful for verifying deployment health.
 */

// Load CORS headers and environment configuration
require_once 'cors.php';
require_once 'config.php';

// --- Database Connectivity Verification ---
$dbStatus = 'untested';
$dbMessage = '';

try {
    require_once 'db.php';
    if (isset($conn) && $conn) {
        $dbStatus = 'connected';
        $dbMessage = 'Successfully connected to database (' . DB_NAME . ' on ' . DB_HOST . ')';
    }
} catch (Exception $e) {
    $dbStatus = 'error';
    $dbMessage = $e->getMessage();
}

// --- Output System Discovery & Endpoint Map ---
echo json_encode([
    'service'     => 'Travel Journey Planner API',
    'status'      => 'online',
    'database'    => [
        'status'  => $dbStatus,
        'message' => $dbMessage,
    ],
    'endpoints'   => [
        'destinations' => '/destinations.php',
        'places'       => '/places.php',
        'hotels'       => '/hotels.php',
        'trips'        => '/trips.php',
        'trains'       => '/trains.php',
        'train_live'   => '/train_live.php',
        'ai'           => '/ai.php',
        'auth_login'   => '/auth/login.php',
        'auth_register'=> '/auth/register.php',
        'auth_check'   => '/auth/check.php',
        'auth_profile' => '/auth/profile.php',
    ],
    'timestamp'   => date('c')
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

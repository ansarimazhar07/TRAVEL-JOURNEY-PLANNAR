<?php
/**
 * train_live.php
 *
 * REST API proxy for LIVE TRAIN RUNNING STATUS via RailRadar API.
 *
 * Endpoint: GET /v1/trains/{number}/live
 *
 * Flow:
 *   React → GET /train_live.php?number=12919&date=2026-10-04 → PHP → RailRadar → JSON → React
 *
 * Security:
 *   The RailRadar API key is stored on the server (config.php) and is NEVER sent to the client.
 */

// Suppress PHP error display — always return clean JSON
ini_set('display_errors', '0');
error_reporting(E_ALL);

require_once 'cors.php';   // CORS headers + Content-Type: application/json
require_once 'config.php'; // Defines RAILRADAR_API_KEY

// ---- Only GET is supported ----
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only GET is supported.'
    ]);
    exit;
}

// ---- Read and validate query parameters ----
$rawNumber = isset($_GET['number']) ? trim($_GET['number']) : '';
$rawDate   = isset($_GET['date'])   ? trim($_GET['date'])   : '';

// 1. Train number must not be empty
if ($rawNumber === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a train number.'
    ]);
    exit;
}

// 2. Sanitize: only digits allowed, and must be 4–5 digits (Indian Railways)
$cleanNumber = preg_replace('/[^0-9]/', '', $rawNumber);
if ($cleanNumber === '' || strlen($cleanNumber) < 4 || strlen($cleanNumber) > 5) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid 5-digit train number (e.g. 12919).'
    ]);
    exit;
}

// 3. Optional date validation (YYYY-MM-DD)
$dateParam = null;
if ($rawDate !== '') {
    $dateObj   = DateTime::createFromFormat('Y-m-d', $rawDate);
    $dateErrors = DateTime::getLastErrors();
    if (!$dateObj || ($dateErrors && ($dateErrors['warning_count'] > 0 || $dateErrors['error_count'] > 0))) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid date format. Please use YYYY-MM-DD.'
        ]);
        exit;
    }
    $dateParam = $dateObj->format('Y-m-d');
}

// ---- API Key Check ----
$apiKey = defined('RAILRADAR_API_KEY') ? trim(RAILRADAR_API_KEY) : '';
if ($apiKey === '' || $apiKey === 'YOUR_RAILRADAR_API_KEY_HERE') {
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'message' => 'Train service is not configured. Please contact the administrator.'
    ]);
    exit;
}

// ---- Build RailRadar Live Request URL ----
// GET /v1/trains/{number}/live
$railradarUrl = "https://api.railradar.in/v1/trains/{$cleanNumber}/live";

$queryParts = [];
if ($dateParam !== null) {
    $queryParts[] = 'date=' . urlencode($dateParam);
}
// Request haltsOnly=true to get a cleaner route array for our progress display
$queryParts[] = 'haltsOnly=true';

if (!empty($queryParts)) {
    $railradarUrl .= '?' . implode('&', $queryParts);
}

// ---- HTTP Request via cURL ----
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $railradarUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 15,
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_HTTPHEADER     => [
        "Authorization: Bearer {$apiKey}",
        "Accept: application/json",
        "User-Agent: TravelJourneyPlanner/1.0"
    ],
    CURLOPT_SSL_VERIFYPEER => true
]);

$responseBody = curl_exec($ch);
$httpCode     = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError    = curl_error($ch);
curl_close($ch);

// ---- Handle cURL / network errors ----
if ($responseBody === false || $httpCode === 0) {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'message' => 'Train service is temporarily unavailable. Please try again later.'
    ]);
    exit;
}

// ---- Handle HTTP error codes ----
if ($httpCode === 401 || $httpCode === 403) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to connect to train service.'
    ]);
    exit;
}

if ($httpCode === 404) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Train information could not be found. Please verify the train number.'
    ]);
    exit;
}

if ($httpCode === 429) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Train service request limit reached. Please try again later.'
    ]);
    exit;
}

if ($httpCode >= 500) {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'message' => 'Train service is temporarily unavailable. Please try again later.'
    ]);
    exit;
}

// ---- Parse JSON response ----
$rawJson = json_decode($responseBody, true);
if (!is_array($rawJson)) {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to connect to train service.'
    ]);
    exit;
}

// RailRadar returns { success: true, data: {...}, meta: {...} }
if (!isset($rawJson['success']) || !$rawJson['success']) {
    $apiMsg = $rawJson['message'] ?? $rawJson['error'] ?? null;

    // Check for "not found" type messages
    if ($httpCode === 404 || (is_string($apiMsg) && stripos($apiMsg, 'not found') !== false)) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Train information could not be found. Please verify the train number.'
        ]);
        exit;
    }

    // Live data unavailable (train not yet started / already completed)
    if (is_string($apiMsg) && (
        stripos($apiMsg, 'not running') !== false ||
        stripos($apiMsg, 'unavailable') !== false ||
        stripos($apiMsg, 'no live') !== false
    )) {
        http_response_code(200);
        echo json_encode([
            'success' => false,
            'message' => 'Live status is currently unavailable for this train.'
        ]);
        exit;
    }

    http_response_code(502);
    echo json_encode([
        'success' => false,
        'message' => 'Live status is currently unavailable for this train.'
    ]);
    exit;
}

// ---- Extract and normalize the live data ----
$d = $rawJson['data'] ?? [];

// Train identity
$trainNumber = (string)($d['trainNumber'] ?? $d['number'] ?? $cleanNumber);
$trainName   = (string)($d['trainName']   ?? $d['name']   ?? 'Unknown Train');
$trainType   = (string)($d['trainType']   ?? $d['type']   ?? '');

// Status
$status       = (string)($d['status']       ?? '');
$delayMinutes = isset($d['delayMinutes']) ? (int)$d['delayMinutes'] : null;

// Location
$currentLocation = null;
if (isset($d['currentLocation']) && is_array($d['currentLocation'])) {
    $cl = $d['currentLocation'];
    $currentLocation = [
        'stationCode' => (string)($cl['stationCode'] ?? ''),
        'stationName' => (string)($cl['stationName'] ?? ''),
        'speed'       => isset($cl['speed'])   ? (float)$cl['speed']   : null,
        'latitude'    => isset($cl['latitude']) ? (float)$cl['latitude'] : null,
        'longitude'   => isset($cl['longitude'])? (float)$cl['longitude']: null,
        'updatedAt'   => (string)($cl['updatedAt'] ?? $cl['lastUpdatedAt'] ?? ''),
    ];
}

// Next halt
$nextHalt = null;
if (isset($d['nextHalt']) && is_array($d['nextHalt'])) {
    $nh = $d['nextHalt'];
    $nextHalt = [
        'stationCode'        => (string)($nh['stationCode'] ?? ''),
        'stationName'        => (string)($nh['stationName'] ?? ''),
        'scheduledArrival'   => (string)($nh['scheduledArrival']   ?? ''),
        'scheduledDeparture' => (string)($nh['scheduledDeparture'] ?? ''),
        'platform'           => isset($nh['platform']) ? (string)$nh['platform'] : null,
        'distanceFromCurrent'=> isset($nh['distanceFromCurrent']) ? (float)$nh['distanceFromCurrent'] : null,
    ];
}

// Previous halt
$prevHalt = null;
if (isset($d['previousHalt']) && is_array($d['previousHalt'])) {
    $ph = $d['previousHalt'];
    $prevHalt = [
        'stationCode'     => (string)($ph['stationCode'] ?? ''),
        'stationName'     => (string)($ph['stationName'] ?? ''),
        'actualDeparture' => (string)($ph['actualDeparture'] ?? ''),
    ];
}

// Source and destination
$source = null;
if (isset($d['source']) && is_array($d['source'])) {
    $src = $d['source'];
    $source = [
        'stationCode' => (string)($src['stationCode'] ?? ''),
        'stationName' => (string)($src['stationName'] ?? ''),
    ];
}

$destination = null;
if (isset($d['destination']) && is_array($d['destination'])) {
    $dst = $d['destination'];
    $destination = [
        'stationCode' => (string)($dst['stationCode'] ?? ''),
        'stationName' => (string)($dst['stationName'] ?? ''),
    ];
}

// Exception info (diversion / cancellation)
$exception = null;
if (isset($d['exception']) && is_array($d['exception'])) {
    $exc = $d['exception'];
    $exception = [
        'type'        => (string)($exc['type']        ?? ''),
        'description' => (string)($exc['description'] ?? ''),
    ];
}

// Last updated timestamp
$lastUpdatedAt = (string)($d['lastUpdatedAt'] ?? $d['updatedAt'] ?? '');

// isLive indicator
$isLive = isset($d['isLive']) ? (bool)$d['isLive'] : true;

// Platform at next halt or current station
$platform = null;
if ($nextHalt && isset($nextHalt['platform'])) {
    $platform = $nextHalt['platform'];
}

// Route / journey stops
$route = [];
if (isset($d['route']) && is_array($d['route'])) {
    foreach ($d['route'] as $stop) {
        if (!is_array($stop)) continue;
        $route[] = [
            'stationCode'        => (string)($stop['stationCode']        ?? ''),
            'stationName'        => (string)($stop['stationName']        ?? ''),
            'scheduledArrival'   => (string)($stop['scheduledArrival']   ?? ''),
            'scheduledDeparture' => (string)($stop['scheduledDeparture'] ?? ''),
            'actualArrival'      => isset($stop['actualArrival'])   ? (string)$stop['actualArrival']   : null,
            'actualDeparture'    => isset($stop['actualDeparture']) ? (string)$stop['actualDeparture'] : null,
            'haltStatus'         => (string)($stop['haltStatus']  ?? $stop['status'] ?? ''),
            'delayMinutes'       => isset($stop['delayMinutes']) ? (int)$stop['delayMinutes'] : null,
            'platform'           => isset($stop['platform'])     ? (string)$stop['platform'] : null,
            'isCurrent'          => isset($stop['isCurrent'])    ? (bool)$stop['isCurrent']  : false,
            'distanceFromSource' => isset($stop['distanceFromSource']) ? (float)$stop['distanceFromSource'] : null,
        ];
    }
}

// ---- Return normalized response ----
echo json_encode([
    'success'         => true,
    'trainNumber'     => $trainNumber,
    'trainName'       => $trainName,
    'trainType'       => $trainType,
    'status'          => $status,
    'delayMinutes'    => $delayMinutes,
    'isLive'          => $isLive,
    'lastUpdatedAt'   => $lastUpdatedAt,
    'source'          => $source,
    'destination'     => $destination,
    'currentLocation' => $currentLocation,
    'nextHalt'        => $nextHalt,
    'previousHalt'    => $prevHalt,
    'platform'        => $platform,
    'exception'       => $exception,
    'route'           => $route,
]);

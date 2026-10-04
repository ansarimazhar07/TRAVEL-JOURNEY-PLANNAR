<?php
/**
 * trains.php
 * 
 * REST API proxy for searching trains between stations via RailRadar API.
 * 
 * Flow:
 * React -> GET /trains.php?from=...&to=...&date=... -> PHP trains.php -> RailRadar API -> Normalized JSON -> React
 * 
 * Security:
 * The RailRadar API key is kept securely on the server and is NEVER sent to the client.
 */

// Enable error reporting for logic, but never display PHP errors in output
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

// ---- City name to IR station code dictionary for user convenience ----
$cityStationMap = [
    'MUMBAI'         => 'MMCT',
    'BOMBAY'         => 'MMCT',
    'MUMBAI CENTRAL' => 'MMCT',
    'MUMBAI CSMT'    => 'CSMT',
    'DELHI'          => 'NDLS',
    'NEW DELHI'      => 'NDLS',
    'PUNE'           => 'PUNE',
    'INDORE'         => 'INDB',
    'UJJAIN'         => 'UJN',
    'JAIPUR'         => 'JP',
    'KOLKATA'        => 'HWH',
    'HOWRAH'         => 'HWH',
    'CALCUTTA'       => 'HWH',
    'BANGALORE'      => 'SBC',
    'BENGALURU'      => 'SBC',
    'CHENNAI'        => 'MAS',
    'MADRAS'         => 'MAS',
    'HYDERABAD'      => 'SC',
    'SECUNDERABAD'   => 'SC',
    'AHMEDABAD'      => 'ADI',
    'GOA'            => 'MAO',
    'MADGAON'        => 'MAO',
    'AGRA'           => 'AGC',
    'VARANASI'       => 'BSB',
    'LUCKNOW'        => 'LKO',
    'CHANDIGARH'     => 'CDG',
    'AMRITSAR'       => 'ASR',
    'PATNA'          => 'PNBE',
    'BHOPAL'         => 'BPL',
    'NAGPUR'         => 'NGP',
    'SURAT'          => 'ST',
    'VADODARA'       => 'BRC',
    'KANPUR'         => 'CNB'
];

/**
 * Normalize station input to a clean uppercase code
 */
function resolveStationCode($input, $map) {
    $trimmed = trim((string)$input);
    if ($trimmed === '') {
        return '';
    }
    $upper = strtoupper($trimmed);
    if (isset($map[$upper])) {
        return $map[$upper];
    }
    // If it's already an IR code (e.g. NDLS, CSMT, UJN), sanitize alphanumeric
    return preg_replace('/[^A-Z0-9]/', '', $upper);
}

/**
 * Format minutes into "Xh Ym" string
 */
function formatMinutesToHours($minutes) {
    if (!is_numeric($minutes) || $minutes <= 0) {
        return 'N/A';
    }
    $h = floor($minutes / 60);
    $m = $minutes % 60;
    if ($h > 0 && $m > 0) {
        return "{$h}h {$m}m";
    } elseif ($h > 0) {
        return "{$h}h";
    } else {
        return "{$m}m";
    }
}

// ---- Read and validate query parameters ----
$rawFrom = isset($_GET['from']) ? trim($_GET['from']) : '';
$rawTo   = isset($_GET['to'])   ? trim($_GET['to'])   : '';
$rawDate = isset($_GET['date']) ? trim($_GET['date']) : '';

// 1. Check for empty inputs
if ($rawFrom === '' && $rawTo === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please enter both source and destination stations.'
    ]);
    exit;
}

if ($rawFrom === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please enter source station.'
    ]);
    exit;
}

if ($rawTo === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please enter destination station.'
    ]);
    exit;
}

$fromCode = resolveStationCode($rawFrom, $cityStationMap);
$toCode   = resolveStationCode($rawTo, $cityStationMap);

if ($fromCode === '' || $toCode === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid station code provided.'
    ]);
    exit;
}

// 2. Check source !== destination
if ($fromCode === $toCode) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Source and destination cannot be the same.'
    ]);
    exit;
}

// 3. Date validation (if provided)
$dateParam = null;
if ($rawDate !== '') {
    $dateObj = DateTime::createFromFormat('Y-m-d', $rawDate);
    $errors = DateTime::getLastErrors();
    if (!$dateObj || ($errors && ($errors['warning_count'] > 0 || $errors['error_count'] > 0))) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid travel date format. Please use YYYY-MM-DD.'
        ]);
        exit;
    }

    // Past date check
    $today = new DateTime('today');
    if ($dateObj < $today) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Past dates are not accepted. Please select today or a future date.'
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
        'message' => 'Train service is not configured.'
    ]);
    exit;
}

// ---- Build RailRadar Request ----
$railradarUrl = "https://api.railradar.in/v1/trains/between/{$fromCode}/{$toCode}";
if ($dateParam !== null) {
    $railradarUrl .= "?date=" . urlencode($dateParam);
}

// Perform HTTP request using cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $railradarUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 12,
    CURLOPT_CONNECTTIMEOUT => 6,
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

// If cURL failed to execute (network down / DNS error)
if ($responseBody === false || $httpCode === 0) {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'message' => 'Train service is temporarily unavailable. Please try again later.'
    ]);
    exit;
}

// Handle specific status codes without leaking credentials or raw data
if ($httpCode === 401 || $httpCode === 403) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to connect to train service.'
    ]);
    exit;
}

if ($httpCode === 429) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Train search limit reached. Please try again later.'
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

$rawJson = json_decode($responseBody, true);
if (!is_array($rawJson) || !isset($rawJson['success'])) {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to connect to train service.'
    ]);
    exit;
}

// ---- Normalize train results ----
$rawTrains = isset($rawJson['data']['trains']) && is_array($rawJson['data']['trains']) 
    ? $rawJson['data']['trains'] 
    : [];

$normalizedTrains = [];
foreach ($rawTrains as $item) {
    if (!isset($item['train'])) {
        continue;
    }

    $tInfo    = $item['train'];
    $fromInfo = $item['from'] ?? [];
    $toInfo   = $item['to']   ?? [];
    $duration = $item['duration'] ?? 0;

    $normalizedTrains[] = [
        'train_number'     => (string)($tInfo['number'] ?? 'N/A'),
        'train_name'       => (string)($tInfo['name'] ?? 'Express Train'),
        'train_type'       => (string)($tInfo['type'] ?? 'Express'),
        'from_code'        => (string)($fromInfo['code'] ?? $fromCode),
        'from_name'        => (string)($fromInfo['name'] ?? $fromCode),
        'from_city'        => (string)($fromInfo['city'] ?? ''),
        'to_code'          => (string)($toInfo['code'] ?? $toCode),
        'to_name'          => (string)($toInfo['name'] ?? $toCode),
        'to_city'          => (string)($toInfo['city'] ?? ''),
        'departure'        => (string)($fromInfo['departure'] ?? '--:--'),
        'departure_day'    => (int)($fromInfo['day'] ?? 1),
        'arrival'          => (string)($toInfo['arrival'] ?? '--:--'),
        'arrival_day'      => (int)($toInfo['day'] ?? 1),
        'duration'         => formatMinutesToHours($duration),
        'duration_minutes' => (int)$duration,
        'distance_km'      => isset($item['distance']) ? (float)$item['distance'] : null,
        'halts'            => isset($item['totalHaltsBetween']) ? (int)$item['totalHaltsBetween'] : 0,
        'run_days'         => isset($tInfo['runDays']) && is_array($tInfo['runDays']) ? $tInfo['runDays'] : []
    ];
}

// Return normalized response
echo json_encode([
    'success' => true,
    'count'   => count($normalizedTrains),
    'data'    => $normalizedTrains,
    'route'   => [
        'from_code' => $fromCode,
        'from_name' => $rawJson['data']['from']['name'] ?? $fromCode,
        'to_code'   => $toCode,
        'to_name'   => $rawJson['data']['to']['name'] ?? $toCode,
        'date'      => $dateParam
    ]
]);

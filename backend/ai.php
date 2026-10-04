<?php
/**
 * ai.php — Phase 9
 *
 * AI Travel Recommendation proxy endpoint.
 *
 * Flow:
 *   React → POST /ai.php (JSON body) → PHP → Gemini API → Recommendation → React
 *
 * Security:
 *   The Gemini API key is kept ONLY on the server.
 *   It is NEVER sent to, or exposed in, the React frontend.
 *
 * Method: POST (GET returns active status info)
 * Body (JSON):
 *   destination  (string, required)
 *   days         (int,    required, 1–30)
 *   travellers   (int,    required, ≥1)
 *   budget       (number, required, ≥0)
 *   interests    (string, optional)
 *   preferences  (string, optional)
 *
 * Response:
 *   { "success": true,  "recommendation": "..." }
 *   { "success": false, "error": "..." }
 */

// Suppress PHP error output — never leak internals to the client
ini_set('display_errors', '0');
error_reporting(E_ALL);

require_once 'cors.php';   // CORS headers + Content-Type: application/json
require_once 'config.php'; // Defines GEMINI_API_KEY

// ---- GET health check / browser visit ----
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'success' => true,
        'message' => 'Travel Journey Planner AI Recommendation API is active. Send a POST request with JSON body to generate recommendations.'
    ]);
    exit;
}

// ---- Only POST is supported for generating recommendations ----
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error'   => 'Method not allowed. Use POST.'
    ]);
    exit;
}

// ---- Parse JSON body ----
$raw = file_get_contents('php://input');
$body = json_decode($raw, true);

if (!is_array($body)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Invalid JSON request body.'
    ]);
    exit;
}

// ---- Input validation ----

// Destination (required, string)
$destination = isset($body['destination']) ? trim((string)$body['destination']) : '';
if ($destination === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Please select a destination.'
    ]);
    exit;
}
if (mb_strlen($destination) > 100) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Destination name is too long.'
    ]);
    exit;
}

// Days (required, 1-30)
$days = isset($body['days']) ? (int)$body['days'] : 0;
if ($days < 1 || $days > 30) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Number of days must be between 1 and 30.'
    ]);
    exit;
}

// Travellers (required, 1-50)
$travellers = isset($body['travellers']) ? (int)$body['travellers'] : 0;
if ($travellers < 1 || $travellers > 50) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Number of travellers must be at least 1 (maximum 50).'
    ]);
    exit;
}

// Budget (required, >= 0)
$budget = isset($body['budget']) ? (float)$body['budget'] : -1;
if ($budget < 0) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error'   => 'Budget cannot be negative.'
    ]);
    exit;
}

// Interests (optional)
$interests   = isset($body['interests'])   ? trim(strip_tags((string)$body['interests']))   : '';
$preferences = isset($body['preferences']) ? trim(strip_tags((string)$body['preferences'])) : '';

// Limit lengths to prevent huge prompts
if (mb_strlen($interests)   > 300) $interests   = mb_substr($interests,   0, 300);
if (mb_strlen($preferences) > 500) $preferences = mb_substr($preferences, 0, 500);

// ---- API Key Check ----
$geminiKey = defined('GEMINI_API_KEY') ? trim(GEMINI_API_KEY) : '';
if ($geminiKey === '' || $geminiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'error'   => 'AI recommendation service is not configured.'
    ]);
    exit;
}

// ---- Build the Gemini prompt ----
$budgetFormatted = number_format($budget, 0, '.', ',');
$interestLine    = $interests   !== '' ? "Interests: {$interests}"           : 'Interests: General sightseeing and local culture';
$prefLine        = $preferences !== '' ? "Travel Preferences: {$preferences}" : '';

$prompt  = "You are a helpful travel planning assistant for Indian destinations.\n\n";
$prompt .= "Create a practical travel recommendation for the following trip:\n\n";
$prompt .= "Destination: {$destination}\n";
$prompt .= "Number of Days: {$days}\n";
$prompt .= "Travellers: {$travellers}\n";
$prompt .= "Total Budget: Rs.{$budgetFormatted}\n";
$prompt .= "{$interestLine}\n";
if ($prefLine !== '') $prompt .= "{$prefLine}\n";
$prompt .= "\nPlease provide:\n";
$prompt .= "1. **Overview** - A short summary of what makes this destination great for this trip.\n";
$prompt .= "2. **Day-by-Day Plan** - A simple itinerary for each day.\n";
$prompt .= "3. **Must-Visit Places** - Top attractions to include.\n";
$prompt .= "4. **Food Suggestions** - Local dishes and types of eateries to try.\n";
$prompt .= "5. **Budget Tips** - Practical advice to stay within Rs.{$budgetFormatted} total.\n";
$prompt .= "6. **Travel Tips** - Useful tips for the destination and group size.\n\n";
$prompt .= "Guidelines:\n";
$prompt .= "- Keep the recommendation practical and realistic.\n";
$prompt .= "- Do NOT invent specific hotel bookings, train reservations, or claim exact prices.\n";
$prompt .= "- Do NOT claim any bookings have been made.\n";
$prompt .= "- Use Markdown headings and bullet points for clear formatting.\n";
$prompt .= "- Write in a friendly, helpful tone suitable for college students.\n";

// ---- Call Gemini API with model fallback ----
$candidateModels = [
    'gemini-flash-lite-latest',
    'gemini-3.8-flash',
    'gemini-flash-latest'
];

$requestPayload = json_encode([
    'contents' => [
        [
            'parts' => [
                ['text' => $prompt]
            ]
        ]
    ],
    'generationConfig' => [
        'temperature'     => 0.7,
        'maxOutputTokens' => 2048,
        'topP'            => 0.95
    ]
]);

$recommendation = '';
$isRateLimit    = false;

foreach ($candidateModels as $geminiModel) {
    $geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$geminiModel}:generateContent?key=" . urlencode($geminiKey);

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $geminiEndpoint,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $requestPayload,
        CURLOPT_TIMEOUT        => 35,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Accept: application/json',
            'User-Agent: TravelJourneyPlanner/1.0'
        ],
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false
    ]);

    $responseBody = curl_exec($ch);
    $httpCode     = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError    = curl_error($ch);
    curl_close($ch);

    if ($httpCode === 401 || $httpCode === 403) {
        http_response_code(503);
        echo json_encode([
            'success' => false,
            'error'   => 'AI recommendation service is not configured.'
        ]);
        exit;
    }

    if ($httpCode === 429) {
        $isRateLimit = true;
        continue;
    }

    if ($httpCode === 200 && $responseBody !== false) {
        $geminiData = json_decode($responseBody, true);
        if (is_array($geminiData) && isset($geminiData['candidates'][0]['content']['parts'])) {
            $extracted = '';
            foreach ($geminiData['candidates'][0]['content']['parts'] as $part) {
                if (isset($part['text']) && is_string($part['text'])) {
                    $extracted .= $part['text'];
                }
            }
            $extracted = trim($extracted);
            if ($extracted !== '') {
                $recommendation = $extracted;
                break;
            }
        }
    }
}

// ---- Return response ----
if ($recommendation !== '') {
    echo json_encode([
        'success'        => true,
        'recommendation' => $recommendation
    ]);
    exit;
}

if ($isRateLimit) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'error'   => 'AI service limit reached. Please try again later.'
    ]);
    exit;
}

http_response_code(502);
echo json_encode([
    'success' => false,
    'error'   => 'AI recommendation service is temporarily unavailable. Please try again later.'
]);
exit;

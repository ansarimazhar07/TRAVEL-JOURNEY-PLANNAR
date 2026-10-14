<?php
/**
 * ai.php — AI Travel Planner Endpoint
 *
 * Flow:
 *   React → POST /ai.php (JSON body) → PHP → Gemini API → Comprehensive Trip Plan → React
 *
 * Parameters:
 *   source / source_location (string, e.g. "New Delhi")
 *   destination             (string, required, e.g. "Jaipur")
 *   days                    (int,    required, 1–30)
 *   travellers              (int,    required, ≥1)
 *   budget                  (number, optional, ≥0)
 *   start_date              (string, optional)
 *   end_date                (string, optional)
 *   preferences / interests (string, optional)
 */

ini_set('display_errors', '0');
error_reporting(E_ALL);

require_once 'cors.php';   // CORS headers + Content-Type: application/json
require_once 'config.php'; // Defines GEMINI_API_KEY
require_once __DIR__ . '/route_planner_data.php';

// ---- GET health check / info ----
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        'success' => true,
        'message' => 'Travel Journey Planner AI Service is active.'
    ]);
    exit;
}

// ---- Only POST is supported ----
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

// Destination (required)
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

// Source location (departure city)
$sourceLocation = isset($body['source_location']) ? trim((string)$body['source_location']) : (isset($body['source']) ? trim((string)$body['source']) : 'New Delhi');
if ($sourceLocation === '') {
    $sourceLocation = 'New Delhi';
}

// Days (1-30)
$days = isset($body['days']) ? (int)$body['days'] : 3;
if ($days < 1)  $days = 1;
if ($days > 30) $days = 30;

// Travellers (1-50)
$travellers = isset($body['travellers']) ? (int)$body['travellers'] : 2;
if ($travellers < 1)  $travellers = 1;
if ($travellers > 50) $travellers = 50;

// Budget
$budget = isset($body['budget']) ? (float)$body['budget'] : 0;
if ($budget <= 0) {
    $budget = $days * 3500 * $travellers;
}

// Dates
$startDate = isset($body['start_date']) ? trim((string)$body['start_date']) : '';
$endDate   = isset($body['end_date'])   ? trim((string)$body['end_date'])   : '';

// Preferences & interests
$interests   = isset($body['interests'])   ? trim(strip_tags((string)$body['interests']))   : '';
$preferences = isset($body['preferences']) ? trim(strip_tags((string)$body['preferences'])) : '';

if (mb_strlen($interests)   > 300) $interests   = mb_substr($interests,   0, 300);
if (mb_strlen($preferences) > 500) $preferences = mb_substr($preferences, 0, 500);

// API Key check
$geminiKey = defined('GEMINI_API_KEY') ? trim(GEMINI_API_KEY) : '';

// Helper for building structured prompt
$budgetFormatted = number_format($budget, 0, '.', ',');
$interestLine    = $interests !== '' ? "Interests: {$interests}" : 'Interests: Heritage, sightseeing, culture, local cuisine, shopping, and hidden gems';
$prefLine        = $preferences !== '' ? "Preferences: {$preferences}" : 'Style: Well-balanced, memorable, authentic, and comfortable';
$datesLine       = ($startDate !== '' && $endDate !== '') ? "Dates: {$startDate} to {$endDate}" : '';

$prompt  = "You are Gemini AI, a premier world-class travel planner creating a HIGHLY SPECIFIC, ROUTE-TAILORED trip plan.\n\n";
$prompt .= "CRITICAL MANDATE - DO NOT USE GENERIC PHRASES:\n";
$prompt .= "- NEVER say 'take an express train', 'try local delicacies', 'sample street food', or 'visit local bazaars'.\n";
$prompt .= "- YOU MUST NAME 2-3 SPECIFIC TRAINS WITH 5-DIGIT TRAIN NUMBERS (e.g. 12955 Mumbai-Jaipur SF, 20978 Vande Bharat, 12050 Gatimaan Express) with exact departure/arrival stations, journey hours, and classes (SL, 3AC, 2AC, CC).\n";
$prompt .= "- YOU MUST NAME SPECIFIC FLIGHTS with airport IATA codes (e.g. BOM, DEL, JAI, GOI, CDG, DXB), operating airlines (IndiGo, Air India, Emirates), non-stop flying times, and typical fare bands in INR.\n";
$prompt .= "- YOU MUST NAME SPECIFIC HIGHWAYS (e.g. NE4 Delhi-Mumbai Expressway, NH48, Yamuna Expressway, NH66) and premier bus services (Zingbus, IntrCity SmartBus, RSRTC Goldline).\n";
$prompt .= "- YOU MUST NAME SPECIFIC DISHES AND EXACT FAMOUS RESTAURANTS / SWEET SHOPS (e.g. Rawat's Pyaaz Kachori, LMB Ghevar, Lassiwala on MI Road, Martin's Corner Butter Garlic Crab, Du Pain et des Idées).\n";
$prompt .= "- YOU MUST NAME SPECIFIC SHOPPING MARKETS (e.g. Johari Bazaar, Bapu Bazaar, Anjuna Flea Market, Thatheri Bazaar, Sadar Bazaar, Galeries Lafayette) with exact items to buy, realistic price ranges, and bargaining advice.\n\n";

$prompt .= "Trip Parameters:\n";
$prompt .= "🛫 Departure City / Starting Point: {$sourceLocation}\n";
$prompt .= "📍 Destination (Any Location): {$destination}\n";
$prompt .= "⏳ Trip Duration: {$days} Days\n";
if ($datesLine !== '') $prompt .= "📅 {$datesLine}\n";
$prompt .= "👥 Number of Travellers: {$travellers}\n";
$prompt .= "💰 Estimated Budget: Rs. {$budgetFormatted}\n";
$prompt .= "🎯 {$interestLine}\n";
$prompt .= "✨ {$prefLine}\n\n";

$prompt .= "Please provide an extensive, inspiring, and practical trip plan structured in clean GitHub-style Markdown with emojis:\n\n";
$prompt .= "1. **🚆/✈️/🚗 Route-Specific Travel & Transit Options ({$sourceLocation} to {$destination})**\n";
$prompt .= "   - Specific Trains: 2-3 exact trains with train numbers, stations, journey times, and class fares.\n";
$prompt .= "   - Specific Flights: Airport codes, airlines, flight times, and fare ranges.\n";
$prompt .= "   - Specific Road & Bus: Highway corridors, distance in km, driving hours, and bus operators.\n";
$prompt .= "   - Local Transit at {$destination}: Exact metro lines, auto-rickshaw fare norms, scooter/bike rental rates, and app cabs.\n\n";

$prompt .= "2. **🗓️ Comprehensive Day-by-Day Journey Itinerary ({$days} Days)**\n";
$prompt .= "   - Each day broken into Morning (09:00 AM - 01:00 PM), Afternoon (01:00 PM - 05:00 PM), and Evening (05:00 PM - 09:00 PM) with real monument names, exact timings, and photography spots.\n";
$prompt .= "   - Day 1: Departure from {$sourceLocation}, arrival, check-in, sunset viewpoint, welcoming dinner.\n";
$prompt .= "   - Day {$days}: Souvenir shopping, check-out, return transit to {$sourceLocation}.\n\n";

$prompt .= "3. **📍 Must-Visit Attractions & Sightseeing Spots in {$destination}**\n";
$prompt .= "   - Major landmarks and off-beat hidden gems with best hours to visit.\n\n";

$prompt .= "4. **🍲 Specific Food & Culinary Guide (Iconic Dishes & Named Eateries)**\n";
$prompt .= "   - Specific authentic dishes and the EXACT famous restaurants, sweet shops, or food stalls where they are best tasted.\n";
$prompt .= "   - Famous food streets and night markets.\n\n";

$prompt .= "5. **🛍️ Specific Shopping Places, Local Bazaars & What to Buy**\n";
$prompt .= "   - Specific markets and bazaars with exact items to buy, realistic prices, and bargaining rules.\n\n";

$prompt .= "6. **🎭 Nightlife, Culture & Evening Experiences**\n";
$prompt .= "7. **💰 Estimated Budget & Cost Breakdown ({$travellers} Travellers)**\n";
$prompt .= "8. **💡 Smart Route & Travel Tips**\n";

$recommendation = '';

if ($geminiKey !== '' && $geminiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
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
            'maxOutputTokens' => 2500,
            'topP'            => 0.95
        ]
    ]);

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
        curl_close($ch);

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
}

// If Gemini produced a plan, return it
if ($recommendation !== '') {
    echo json_encode([
        'success'        => true,
        'recommendation' => $recommendation,
        'source'         => 'gemini'
    ]);
    exit;
}

// Fallback: Generate extensive, route-tailored and specific expert itinerary
$routeData = getSpecificRouteData($sourceLocation, $destination);
$destGuide = getSpecificDestinationGuide($destination);

$fallbackPlan  = "## 🗺️ Route-Specific Travel Plan: {$sourceLocation} to {$destGuide['title']}\n\n";

// 1. Specific Travel & Transit Options
$fallbackPlan .= "### 1. 🚆/✈️/🚗 Route-Specific Travel & Transit Options ({$sourceLocation} to {$destination})\n";

if (!empty($routeData['trains'])) {
    $fallbackPlan .= "#### 🚆 Specific Train Connections ({$sourceLocation} ➔ {$destination}):\n";
    foreach ($routeData['trains'] as $t) {
        $fallbackPlan .= "- {$t}\n";
    }
    $fallbackPlan .= "\n";
}

if (!empty($routeData['flights'])) {
    $fallbackPlan .= "#### ✈️ Specific Flight Connections ({$sourceLocation} ➔ {$destination}):\n";
    foreach ($routeData['flights'] as $f) {
        $fallbackPlan .= "- {$f}\n";
    }
    $fallbackPlan .= "\n";
}

if (!empty($routeData['road'])) {
    $fallbackPlan .= "#### 🚗 Road, Highway Corridors & Bus Routes:\n";
    foreach ($routeData['road'] as $r) {
        $fallbackPlan .= "- {$r}\n";
    }
    $fallbackPlan .= "\n";
}

if (!empty($routeData['local_commute'])) {
    $fallbackPlan .= "#### 🚕 Local Commute at {$destination}:\n";
    foreach ($routeData['local_commute'] as $lc) {
        $fallbackPlan .= "- {$lc}\n";
    }
    $fallbackPlan .= "\n";
}

// 2. Day-by-Day Journey Itinerary
$fallbackPlan .= "### 2. 🗓️ Comprehensive Day-by-Day Journey Itinerary ({$days} Days)\n";
$fallbackPlan .= "#### Day 1: Departure from {$sourceLocation} & Arrival in {$destination}\n";
$fallbackPlan .= "- **Morning**: Depart from {$sourceLocation} via your booked train/flight or morning highway departure.\n";
$fallbackPlan .= "- **Afternoon**: Arrive in {$destination}, transfer to your accommodation, check-in, unpack, and freshen up.\n";
if (!empty($destGuide['sights'][0])) {
    $fallbackPlan .= "- **Evening (5:30 PM – 9:00 PM)**: Visit {$destGuide['sights'][0]} for orientation and sunset views. Follow with a welcoming dinner at an iconic local eatery.\n\n";
} else {
    $fallbackPlan .= "- **Evening (5:30 PM – 9:00 PM)**: Stroll through the central town square or promenade at sunset. Enjoy an authentic orientation dinner.\n\n";
}

for ($d = 2; $d < $days; $d++) {
    $sightIdx = ($d - 2) % count($destGuide['sights']);
    $nextSightIdx = ($d - 1) % count($destGuide['sights']);
    $sight = $destGuide['sights'][$sightIdx];
    $nextSight = $destGuide['sights'][$nextSightIdx];
    $dish = $destGuide['dishes'][$d % count($destGuide['dishes'])];

    $fallbackPlan .= "#### Day {$d}: Landmark Exploration & Cultural Highlights\n";
    $fallbackPlan .= "- **Morning (09:00 AM – 01:00 PM)**: Explore {$sight}.\n";
    $fallbackPlan .= "- **Afternoon (01:00 PM – 04:30 PM)**: Enjoy a regional lunch featuring {$dish}. Visit local artisan craft workshops.\n";
    $fallbackPlan .= "- **Evening (05:00 PM – 08:30 PM)**: Experience sunset views at {$nextSight}, followed by exploring lively evening bazaar lanes.\n\n";
}

$fallbackPlan .= "#### Day {$days}: Souvenir Bazaars, Check-out & Return Journey to {$sourceLocation}\n";
$fallbackPlan .= "- **Morning (08:30 AM – 11:30 AM)**: Enjoy breakfast, complete souvenir and specialty shopping at the local markets, and pack bags.\n";
$fallbackPlan .= "- **Afternoon**: Check out from accommodation and transfer to the railway terminal, airport, or highway boarding point.\n";
$fallbackPlan .= "- **Evening**: Board your return journey back to {$sourceLocation}. Arrive safely home with unforgettable memories!\n\n";

// 3. Must-Visit Attractions
$fallbackPlan .= "### 3. 📍 Must-Visit Attractions & Sightseeing Spots in {$destGuide['title']}\n";
foreach ($destGuide['sights'] as $s) {
    $fallbackPlan .= "- {$s}\n";
}
$fallbackPlan .= "\n";

// 4. Food & Culinary Guide
$fallbackPlan .= "### 4. 🍲 Food & Culinary Guide (Specific Iconic Dishes & Named Eateries)\n";
$fallbackPlan .= "#### Signature Delicacies You Must Try:\n";
foreach ($destGuide['dishes'] as $dish) {
    $fallbackPlan .= "- {$dish}\n";
}
$fallbackPlan .= "\n#### Famous Food Streets & Night Markets in {$destination}:\n";
foreach ($destGuide['food_streets'] as $fs) {
    $fallbackPlan .= "- {$fs}\n";
}
$fallbackPlan .= "\n";

// 5. Shopping Places, Local Bazaars & Souvenirs
$fallbackPlan .= "### 5. 🛍️ Shopping Places, Local Bazaars & Souvenirs (What to Buy)\n";
foreach ($destGuide['shopping'] as $shop) {
    $fallbackPlan .= "- {$shop}\n";
}
$fallbackPlan .= "\n";

// 6. Nightlife & Culture
$fallbackPlan .= "### 6. 🎭 Nightlife, Culture & Evening Experiences\n";
$fallbackPlan .= "- **Cultural Performances & Traditions**: Enjoy live folk dance recitals, regional music performances, sound & light shows at heritage landmarks, or evening river/boat cruises.\n";
$fallbackPlan .= "- **Evening Hangouts**: Spend relaxing evenings at illuminated monument viewpoints, open-air cafes, or rooftop lounges with panoramic skyline views.\n\n";

// 7. Budget Breakdown
$fallbackPlan .= "### 7. 💰 Estimated Budget & Cost Breakdown ({$travellers} Travellers)\n";
$fallbackPlan .= "- **Total Estimated Budget**: Rs. {$budgetFormatted}\n";
$fallbackPlan .= "- **Stays & Lodging**: ~40% (₹" . number_format($budget * 0.40, 0) . ") for comfortable mid-range or boutique stays\n";
$fallbackPlan .= "- **Food & Dining**: ~25% (₹" . number_format($budget * 0.25, 0) . ") for iconic restaurants, cafes, and street food stalls\n";
$fallbackPlan .= "- **Transit & Local Cabs**: ~20% (₹" . number_format($budget * 0.20, 0) . ") for return travel fares, local app-cabs, and auto-rickshaws\n";
$fallbackPlan .= "- **Shopping & Sightseeing**: ~15% (₹" . number_format($budget * 0.15, 0) . ") for monument entry passes, activities, and authentic souvenirs\n\n";

// 8. Smart Travel Tips
$fallbackPlan .= "### 8. 💡 Smart Route & Travel Tips\n";
$fallbackPlan .= "- **Advance Booking**: Reserve your train berths (via IRCTC) or flights at least 3-4 weeks in advance for confirmed status.\n";
$fallbackPlan .= "- **Local Navigation**: Download offline Google Maps for {$destination} and keep ride-hailing/digital payment apps active.\n";
$fallbackPlan .= "- **Walking Footwear**: Carry comfortable broken-in sneakers suitable for exploring historic corridors and cobblestone bazaar alleys.\n";

echo json_encode([
    'success'        => true,
    'recommendation' => $fallbackPlan,
    'source'         => 'route_specific_planner'
]);
exit;

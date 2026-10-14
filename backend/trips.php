<?php
/**
 * trips.php — Trip Itinerary Management REST API Controller
 *
 * Provides complete CRUD (Create, Read, Update, Delete) capabilities for user travel itineraries.
 *
 * REST Endpoints:
 *   GET    /trips.php          → List all trips belonging strictly to the authenticated user
 *   GET    /trips.php?id=1     → Retrieve single trip details (ownership verified via session)
 *   POST   /trips.php          → Create and persist a new trip with source, destination & dates
 *   PUT    /trips.php?id=1     → Update existing trip details (ownership verified via session)
 *   DELETE /trips.php?id=1     → Permanently delete a trip (ownership verified via session)
 *
 * Critical Security Invariant:
 *   User ID is ALWAYS retrieved from $_SESSION['user_id'] on the server.
 *   The client cannot spoof or modify the user ownership of any trip.
 */

// --- Session & Cross-Origin Middleware ---
require_once __DIR__ . '/session.php';
require_once 'cors.php';
require_once 'db.php';

// --- Global Authentication Enforcement ---
// Every trip management operation requires an active, verified session
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Please login to manage trips.']);
    exit;
}

// Extract authenticated user ID from server-side session
$userId = (int) $_SESSION['user_id'];

// --- REST Method Dispatching ---
// Inspect HTTP verb and optional query parameter 'id' to route to dedicated action handlers
$method = $_SERVER['REQUEST_METHOD'];
$tripId = isset($_GET['id']) ? (int) $_GET['id'] : null;

switch ($method) {
    case 'GET':
        // Read: single trip if 'id' provided, otherwise all trips for user
        if ($tripId) {
            getOneTrip($conn, $userId, $tripId);
        } else {
            getAllTrips($conn, $userId);
        }
        break;

    case 'POST':
        // Create: insert a new trip record into database
        createTrip($conn, $userId);
        break;

    case 'PUT':
        // Update: modify an existing trip record
        if (!$tripId) {
            http_response_code(400);
            echo json_encode(['error' => 'Trip ID is required for update.']);
            exit;
        }
        updateTrip($conn, $userId, $tripId);
        break;

    case 'DELETE':
        // Delete: remove an existing trip record
        if (!$tripId) {
            http_response_code(400);
            echo json_encode(['error' => 'Trip ID is required for deletion.']);
            exit;
        }
        deleteTrip($conn, $userId, $tripId);
        break;

    default:
        // Reject unsupported HTTP verbs
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed.']);
        break;
}

// Helper: Check if source_location column exists in trips table
function hasSourceLocationColumn($conn) {
    static $has = null;
    if ($has !== null) return $has;
    try {
        $check = $conn->query("SHOW COLUMNS FROM `trips` LIKE 'source_location'");
        $has = ($check && $check->rowCount() > 0);
    } catch (Exception $e) {
        $has = false;
    }
    return $has;
}

// ============================================================
// GET ALL TRIPS for the logged-in user
// ============================================================
function getAllTrips($conn, $userId) {
    try {
        $hasSource = hasSourceLocationColumn($conn);
        $sourceCol = $hasSource ? "t.source_location," : "'' AS source_location,";

        // JOIN with destinations so the frontend gets the destination name
        $stmt = $conn->prepare(
            "SELECT t.id, t.destination_id, d.name AS destination_name,
                    t.trip_name, {$sourceCol} t.start_date, t.end_date,
                    t.num_travellers, t.notes, t.created_at
             FROM trips t
             LEFT JOIN destinations d ON t.destination_id = d.id
             WHERE t.user_id = ?
             ORDER BY t.start_date ASC"
        );
        $stmt->execute([$userId]);
        $trips = $stmt->fetchAll();

        // If source_location was empty but notes contains Source info, parse it
        foreach ($trips as &$t) {
            if (empty($t['source_location']) && !empty($t['notes'])) {
                if (preg_match('/(?:^|\n)Source:\s*([^\n\r]+)/i', $t['notes'], $m)) {
                    $t['source_location'] = trim($m[1]);
                }
            }
        }

        echo json_encode([
            'success' => true,
            'data'    => $trips,
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to load trips. Please try again.']);
    }
}

// ============================================================
// GET SINGLE TRIP by ID
// Only returns the trip if it belongs to the logged-in user
// ============================================================
function getOneTrip($conn, $userId, $tripId) {
    if ($tripId <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid trip ID.']);
        return;
    }

    try {
        $hasSource = hasSourceLocationColumn($conn);
        $sourceCol = $hasSource ? "t.source_location," : "'' AS source_location,";

        $stmt = $conn->prepare(
            "SELECT t.id, t.destination_id, d.name AS destination_name,
                    t.trip_name, {$sourceCol} t.start_date, t.end_date,
                    t.num_travellers, t.notes, t.created_at
             FROM trips t
             LEFT JOIN destinations d ON t.destination_id = d.id
             WHERE t.id = ? AND t.user_id = ?"
        );
        $stmt->execute([$tripId, $userId]);
        $trip = $stmt->fetch();

        if (!$trip) {
            http_response_code(404);
            echo json_encode(['error' => 'Trip not found.']);
            return;
        }

        if (empty($trip['source_location']) && !empty($trip['notes'])) {
            if (preg_match('/(?:^|\n)Source:\s*([^\n\r]+)/i', $trip['notes'], $m)) {
                $trip['source_location'] = trim($m[1]);
            }
        }

        echo json_encode([
            'success' => true,
            'data'    => $trip,
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to load trip. Please try again.']);
    }
}

// ============================================================
// CREATE a new trip
// ============================================================
function createTrip($conn, $userId) {
    // Read JSON body from React
    $body = json_decode(file_get_contents('php://input'), true);

    // Extract fields
    $destinationId   = isset($body['destination_id'])   ? (int) $body['destination_id'] : 0;
    $destinationName = isset($body['destination_name']) ? trim((string)$body['destination_name']) : (isset($body['destination']) ? trim((string)$body['destination']) : '');
    $sourceLocation  = isset($body['source_location'])  ? trim($body['source_location']) : (isset($body['source']) ? trim($body['source']) : '');
    $startDate       = isset($body['start_date'])       ? trim($body['start_date'])     : '';
    $endDate         = isset($body['end_date'])         ? trim($body['end_date'])       : '';
    $travellers      = isset($body['num_travellers'])   ? (int) $body['num_travellers']  : 1;
    $customTripName  = isset($body['trip_name'])        ? trim($body['trip_name'])      : '';

    // ---- Validate ----
    if ($destinationId <= 0 && empty($destinationName)) {
        http_response_code(400);
        echo json_encode(['error' => 'Please enter or select a destination.']);
        return;
    }

    if (empty($startDate)) {
        http_response_code(400);
        echo json_encode(['error' => 'Please select a start date.']);
        return;
    }

    if (empty($endDate)) {
        http_response_code(400);
        echo json_encode(['error' => 'Please select an end date.']);
        return;
    }

    if ($endDate < $startDate) {
        http_response_code(400);
        echo json_encode(['error' => 'End date cannot be before start date.']);
        return;
    }

    if ($travellers < 1) {
        http_response_code(400);
        echo json_encode(['error' => 'Number of travellers must be at least 1.']);
        return;
    }

    // ---- Resolve destination (predefined or custom) ----
    try {
        $destination = null;
        if ($destinationId > 0) {
            $destCheck = $conn->prepare("SELECT id, name FROM destinations WHERE id = ?");
            $destCheck->execute([$destinationId]);
            $destination = $destCheck->fetch();
        }

        // If not found by ID or ID was not provided, look up or create by name
        if (!$destination && !empty($destinationName)) {
            $destFind = $conn->prepare("SELECT id, name FROM destinations WHERE LOWER(name) = LOWER(?) LIMIT 1");
            $destFind->execute([$destinationName]);
            $destination = $destFind->fetch();

            if (!$destination) {
                // Auto-create destination record to satisfy foreign key
                $destInsert = $conn->prepare("INSERT INTO destinations (name, country, category, description) VALUES (?, 'World', 'Custom', ?)");
                $destInsert->execute([$destinationName, 'Custom destination planned by traveler']);
                $destinationId = (int)$conn->lastInsertId();
                $destination = ['id' => $destinationId, 'name' => $destinationName];
            } else {
                $destinationId = (int)$destination['id'];
            }
        }

        if (!$destination) {
            http_response_code(400);
            echo json_encode(['error' => 'Please enter a valid destination.']);
            return;
        }

        // Generate trip name
        if (!empty($customTripName)) {
            $tripName = $customTripName;
        } elseif (!empty($sourceLocation)) {
            $tripName = $sourceLocation . ' to ' . $destination['name'] . ' Trip';
        } else {
            $tripName = $destination['name'] . ' Trip';
        }

        // Prepare notes
        $notes = isset($body['notes']) ? trim($body['notes']) : '';
        if (!empty($sourceLocation)) {
            $notes = "Source: " . $sourceLocation . ($notes ? "\n" . $notes : '');
        }

        $hasSource = hasSourceLocationColumn($conn);

        // ---- Insert the trip ----
        if ($hasSource) {
            $stmt = $conn->prepare(
                "INSERT INTO trips (user_id, destination_id, trip_name, source_location, start_date, end_date, num_travellers, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
            );
            $stmt->execute([$userId, $destinationId, $tripName, $sourceLocation, $startDate, $endDate, $travellers, $notes]);
        } else {
            $stmt = $conn->prepare(
                "INSERT INTO trips (user_id, destination_id, trip_name, start_date, end_date, num_travellers, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?)"
            );
            $stmt->execute([$userId, $destinationId, $tripName, $startDate, $endDate, $travellers, $notes]);
        }

        $newTripId = $conn->lastInsertId();

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Trip created successfully.',
            'trip_id' => (int) $newTripId,
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create trip. Please try again.']);
    }
}

// ============================================================
// UPDATE an existing trip
// Only updates if the trip belongs to the logged-in user
// ============================================================
function updateTrip($conn, $userId, $tripId) {
    if ($tripId <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid trip ID.']);
        return;
    }

    // Read JSON body
    $body = json_decode(file_get_contents('php://input'), true);

    $destinationId   = isset($body['destination_id'])   ? (int) $body['destination_id'] : 0;
    $destinationName = isset($body['destination_name']) ? trim((string)$body['destination_name']) : (isset($body['destination']) ? trim((string)$body['destination']) : '');
    $sourceLocation  = isset($body['source_location'])  ? trim($body['source_location']) : (isset($body['source']) ? trim($body['source']) : '');
    $startDate       = isset($body['start_date'])       ? trim($body['start_date'])     : '';
    $endDate         = isset($body['end_date'])         ? trim($body['end_date'])       : '';
    $travellers      = isset($body['num_travellers'])   ? (int) $body['num_travellers']  : 1;
    $customTripName  = isset($body['trip_name'])        ? trim($body['trip_name'])      : '';

    // ---- Validate ----
    if ($destinationId <= 0 && empty($destinationName)) {
        http_response_code(400);
        echo json_encode(['error' => 'Please enter or select a destination.']);
        return;
    }

    if (empty($startDate)) {
        http_response_code(400);
        echo json_encode(['error' => 'Please select a start date.']);
        return;
    }

    if (empty($endDate)) {
        http_response_code(400);
        echo json_encode(['error' => 'Please select an end date.']);
        return;
    }

    if ($endDate < $startDate) {
        http_response_code(400);
        echo json_encode(['error' => 'End date cannot be before start date.']);
        return;
    }

    if ($travellers < 1) {
        http_response_code(400);
        echo json_encode(['error' => 'Number of travellers must be at least 1.']);
        return;
    }

    try {
        // Resolve destination
        $destination = null;
        if ($destinationId > 0) {
            $destCheck = $conn->prepare("SELECT id, name FROM destinations WHERE id = ?");
            $destCheck->execute([$destinationId]);
            $destination = $destCheck->fetch();
        }

        if (!$destination && !empty($destinationName)) {
            $destFind = $conn->prepare("SELECT id, name FROM destinations WHERE LOWER(name) = LOWER(?) LIMIT 1");
            $destFind->execute([$destinationName]);
            $destination = $destFind->fetch();

            if (!$destination) {
                $destInsert = $conn->prepare("INSERT INTO destinations (name, country, category, description) VALUES (?, 'World', 'Custom', ?)");
                $destInsert->execute([$destinationName, 'Custom destination planned by traveler']);
                $destinationId = (int)$conn->lastInsertId();
                $destination = ['id' => $destinationId, 'name' => $destinationName];
            } else {
                $destinationId = (int)$destination['id'];
            }
        }

        if (!$destination) {
            http_response_code(400);
            echo json_encode(['error' => 'Please enter a valid destination.']);
            return;
        }

        if (!empty($customTripName)) {
            $tripName = $customTripName;
        } elseif (!empty($sourceLocation)) {
            $tripName = $sourceLocation . ' to ' . $destination['name'] . ' Trip';
        } else {
            $tripName = $destination['name'] . ' Trip';
        }

        $notes = isset($body['notes']) ? trim($body['notes']) : '';
        if (!empty($sourceLocation)) {
            $notes = "Source: " . $sourceLocation . ($notes ? "\n" . $notes : '');
        }

        $hasSource = hasSourceLocationColumn($conn);

        // Update — WHERE includes user_id so a user cannot edit another user's trip
        if ($hasSource) {
            $stmt = $conn->prepare(
                "UPDATE trips
                 SET destination_id = ?, trip_name = ?, source_location = ?, start_date = ?, end_date = ?, num_travellers = ?, notes = ?
                 WHERE id = ? AND user_id = ?"
            );
            $stmt->execute([$destinationId, $tripName, $sourceLocation, $startDate, $endDate, $travellers, $notes, $tripId, $userId]);
        } else {
            $stmt = $conn->prepare(
                "UPDATE trips
                 SET destination_id = ?, trip_name = ?, start_date = ?, end_date = ?, num_travellers = ?, notes = ?
                 WHERE id = ? AND user_id = ?"
            );
            $stmt->execute([$destinationId, $tripName, $startDate, $endDate, $travellers, $notes, $tripId, $userId]);
        }

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Trip not found or you do not have permission to edit it.']);
            return;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Trip updated successfully.',
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update trip. Please try again.']);
    }
}

// ============================================================
// DELETE a trip
// Only deletes if the trip belongs to the logged-in user
// ============================================================
function deleteTrip($conn, $userId, $tripId) {
    if ($tripId <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid trip ID.']);
        return;
    }

    try {
        // WHERE includes user_id — prevents deleting another user's trip
        $stmt = $conn->prepare(
            "DELETE FROM trips WHERE id = ? AND user_id = ?"
        );
        $stmt->execute([$tripId, $userId]);

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Trip not found or you do not have permission to delete it.']);
            return;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Trip deleted successfully.',
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete trip. Please try again.']);
    }
}

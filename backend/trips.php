<?php
/**
 * trips.php
 *
 * REST API for the trips table.
 * All operations require an active PHP session (user must be logged in).
 * User ID is ALWAYS taken from $_SESSION — never from the request body.
 *
 * GET    /trips.php          → all trips for the logged-in user
 * GET    /trips.php?id=1     → single trip (must belong to logged-in user)
 * POST   /trips.php          → create a new trip
 * PUT    /trips.php?id=1     → update a trip (must belong to logged-in user)
 * DELETE /trips.php?id=1     → delete a trip (must belong to logged-in user)
 */

// Start session BEFORE any output or headers
session_start();

// Include CORS headers (includes Content-Type: application/json)
require_once 'cors.php';

// Include database connection
require_once 'db.php';

// ---- Check authentication ----
// All trip endpoints require a logged-in user
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Please login to manage trips.']);
    exit;
}

// The logged-in user's ID — taken from the session, never from the client
$userId = (int) $_SESSION['user_id'];

// ---- Route to the correct handler ----
$method = $_SERVER['REQUEST_METHOD'];
$tripId = isset($_GET['id']) ? (int) $_GET['id'] : null;

switch ($method) {
    case 'GET':
        if ($tripId) {
            getOneTrip($conn, $userId, $tripId);
        } else {
            getAllTrips($conn, $userId);
        }
        break;

    case 'POST':
        createTrip($conn, $userId);
        break;

    case 'PUT':
        if (!$tripId) {
            http_response_code(400);
            echo json_encode(['error' => 'Trip ID is required for update.']);
            exit;
        }
        updateTrip($conn, $userId, $tripId);
        break;

    case 'DELETE':
        if (!$tripId) {
            http_response_code(400);
            echo json_encode(['error' => 'Trip ID is required for deletion.']);
            exit;
        }
        deleteTrip($conn, $userId, $tripId);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed.']);
        break;
}

// ============================================================
// GET ALL TRIPS for the logged-in user
// ============================================================
function getAllTrips($conn, $userId) {
    try {
        // JOIN with destinations so the frontend gets the destination name
        $stmt = $conn->prepare(
            "SELECT t.id, t.destination_id, d.name AS destination_name,
                    t.trip_name, t.start_date, t.end_date,
                    t.num_travellers, t.created_at
             FROM trips t
             LEFT JOIN destinations d ON t.destination_id = d.id
             WHERE t.user_id = ?
             ORDER BY t.start_date ASC"
        );
        $stmt->execute([$userId]);
        $trips = $stmt->fetchAll();

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
        $stmt = $conn->prepare(
            "SELECT t.id, t.destination_id, d.name AS destination_name,
                    t.trip_name, t.start_date, t.end_date,
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
    $destinationId = isset($body['destination_id']) ? (int) $body['destination_id'] : 0;
    $startDate     = isset($body['start_date'])     ? trim($body['start_date'])     : '';
    $endDate       = isset($body['end_date'])       ? trim($body['end_date'])       : '';
    $travellers    = isset($body['num_travellers'])  ? (int) $body['num_travellers']  : 1;

    // ---- Validate ----
    if ($destinationId <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Please select a destination.']);
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

    // ---- Verify destination exists ----
    try {
        $destCheck = $conn->prepare("SELECT id, name FROM destinations WHERE id = ?");
        $destCheck->execute([$destinationId]);
        $destination = $destCheck->fetch();

        if (!$destination) {
            http_response_code(400);
            echo json_encode(['error' => 'Selected destination does not exist.']);
            return;
        }

        // Auto-generate a trip name from the destination
        $tripName = $destination['name'] . ' Trip';

        // ---- Insert the trip ----
        // NOTE: user_id comes from the session, NOT from the request body
        $stmt = $conn->prepare(
            "INSERT INTO trips (user_id, destination_id, trip_name, start_date, end_date, num_travellers)
             VALUES (?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([$userId, $destinationId, $tripName, $startDate, $endDate, $travellers]);

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

    $destinationId = isset($body['destination_id']) ? (int) $body['destination_id'] : 0;
    $startDate     = isset($body['start_date'])     ? trim($body['start_date'])     : '';
    $endDate       = isset($body['end_date'])       ? trim($body['end_date'])       : '';
    $travellers    = isset($body['num_travellers'])  ? (int) $body['num_travellers']  : 1;

    // ---- Validate ----
    if ($destinationId <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Please select a destination.']);
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
        // Verify destination exists
        $destCheck = $conn->prepare("SELECT id, name FROM destinations WHERE id = ?");
        $destCheck->execute([$destinationId]);
        $destination = $destCheck->fetch();

        if (!$destination) {
            http_response_code(400);
            echo json_encode(['error' => 'Selected destination does not exist.']);
            return;
        }

        $tripName = $destination['name'] . ' Trip';

        // Update — WHERE includes user_id so a user cannot edit another user's trip
        $stmt = $conn->prepare(
            "UPDATE trips
             SET destination_id = ?, trip_name = ?, start_date = ?, end_date = ?, num_travellers = ?
             WHERE id = ? AND user_id = ?"
        );
        $stmt->execute([$destinationId, $tripName, $startDate, $endDate, $travellers, $tripId, $userId]);

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

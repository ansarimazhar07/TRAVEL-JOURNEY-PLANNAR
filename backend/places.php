<?php
/**
 * places.php
 *
 * REST API endpoint for the places table.
 *
 * GET /places.php                       → all places
 * GET /places.php?destination_id=1      → places for a destination
 * GET /places.php?id=1                  → single place by ID
 *
 * Used by: React Places page, Place Details page
 */

require_once 'cors.php';   // CORS headers + Content-Type: application/json
require_once 'db.php';     // Creates $conn (PDO connection)

// ---- Only GET is supported ----
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only GET is supported.'
    ]);
    exit;
}

// ---- Route to the correct handler ----
if (isset($_GET['id'])) {
    getOnePlace($conn, $_GET['id']);
} elseif (isset($_GET['destination_id'])) {
    getPlacesByDestination($conn, $_GET['destination_id']);
} else {
    getAllPlaces($conn);
}

// ============================================================
// Get all places
// ============================================================
function getAllPlaces($conn) {
    try {
        $stmt = $conn->prepare(
            "SELECT id, destination_id, name, description, image_url,
                    timings, entry_fee
             FROM places
             ORDER BY destination_id ASC, name ASC"
        );
        $stmt->execute();
        $places = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'data'    => $places
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to fetch places. Please try again.'
        ]);
    }
}

// ============================================================
// Get all places for a specific destination
// ============================================================
function getPlacesByDestination($conn, $rawId) {
    $destinationId = filter_var($rawId, FILTER_VALIDATE_INT);

    if ($destinationId === false || $destinationId <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid destination ID.'
        ]);
        return;
    }

    try {
        $stmt = $conn->prepare(
            "SELECT id, destination_id, name, description, image_url,
                    timings, entry_fee
             FROM places
             WHERE destination_id = ?
             ORDER BY name ASC"
        );
        $stmt->execute([$destinationId]);
        $places = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'data'    => $places
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to fetch places. Please try again.'
        ]);
    }
}

// ============================================================
// Get one place by ID
// ============================================================
function getOnePlace($conn, $rawId) {
    $id = filter_var($rawId, FILTER_VALIDATE_INT);

    if ($id === false || $id <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid place ID.'
        ]);
        return;
    }

    try {
        $stmt = $conn->prepare(
            "SELECT id, destination_id, name, description, image_url,
                    timings, entry_fee
             FROM places
             WHERE id = ?"
        );
        $stmt->execute([$id]);
        $place = $stmt->fetch();

        if (!$place) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Place not found.'
            ]);
            return;
        }

        echo json_encode([
            'success' => true,
            'data'    => $place
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to fetch place. Please try again.'
        ]);
    }
}

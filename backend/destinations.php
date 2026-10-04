<?php
/**
 * destinations.php
 * 
 * REST API endpoint for the destinations table.
 * 
 * GET /destinations.php         → returns all destinations
 * GET /destinations.php?id=1    → returns one destination by ID
 * 
 * Used by: React Destinations page, Destination Details page
 */

require_once 'cors.php';   // Set CORS headers + Content-Type: application/json
require_once 'db.php';     // Creates $conn (PDO connection)

// ---- Read the request method ----
$method = $_SERVER['REQUEST_METHOD'];

// ---- Only GET is supported on this endpoint ----
if ($method !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only GET is supported.'
    ]);
    exit;
}

// ---- Check if a specific ID was requested ----
if (isset($_GET['id'])) {
    getOneDestination($conn, $_GET['id']);
} else {
    getAllDestinations($conn);
}

// ============================================================
// Get all destinations
// ============================================================
function getAllDestinations($conn) {
    try {
        // Select all destinations, newest first
        $stmt = $conn->prepare(
            "SELECT id, name, country, state, description, image_url, category, best_time
             FROM destinations
             ORDER BY name ASC"
        );
        $stmt->execute();
        $destinations = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'data'    => $destinations
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to fetch destinations. Please try again.'
        ]);
    }
}

// ============================================================
// Get one destination by ID
// ============================================================
function getOneDestination($conn, $rawId) {
    // Validate: ID must be a positive integer
    $id = filter_var($rawId, FILTER_VALIDATE_INT);

    if ($id === false || $id <= 0) {
        http_response_code(400); // Bad Request
        echo json_encode([
            'success' => false,
            'message' => 'Invalid destination ID.'
        ]);
        return;
    }

    try {
        // Use a prepared statement to prevent SQL injection
        $stmt = $conn->prepare(
            "SELECT id, name, country, state, description, image_url, category, best_time
             FROM destinations
             WHERE id = ?"
        );
        $stmt->execute([$id]);
        $destination = $stmt->fetch();

        if (!$destination) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Destination not found.'
            ]);
            return;
        }

        echo json_encode([
            'success' => true,
            'data'    => $destination
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to fetch destination. Please try again.'
        ]);
    }
}

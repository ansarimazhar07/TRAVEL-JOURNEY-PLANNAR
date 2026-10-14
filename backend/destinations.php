<?php
/**
 * destinations.php — Destination Catalog REST API Controller
 * 
 * Provides read access to the catalog of travel destinations.
 * 
 * REST Endpoints:
 *   GET /destinations.php         → Returns complete array of destinations sorted alphabetically
 *   GET /destinations.php?id=1    → Returns a single destination record by its primary key ID
 * 
 * Consumer Components:
 *   - React Destinations Catalog (/destinations)
 *   - React Destination Details (/destinations/:id)
 *   - React Trip Planner Dropdown (/plan-trip)
 */

// --- Middleware & Dependencies ---
require_once 'cors.php';   // Injects CORS headers + Content-Type: application/json
require_once 'db.php';     // Instantiates $conn PDO database handle

// --- HTTP Method Enforcement ---
$method = $_SERVER['REQUEST_METHOD'];

// Destinations catalog is read-only for public visitors
if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only GET is supported.'
    ]);
    exit;
}

// --- Query Routing ---
// If 'id' query parameter is present, route to single destination handler; otherwise fetch all.
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

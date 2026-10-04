<?php
/**
 * hotels.php
 *
 * REST API endpoint for the hotels table.
 *
 * GET /hotels.php                       → all hotels
 * GET /hotels.php?destination_id=1      → hotels for a destination
 * GET /hotels.php?id=1                  → single hotel by ID
 *
 * Used by: React Hotels page, Hotel Details page
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
    getOneHotel($conn, $_GET['id']);
} elseif (isset($_GET['destination_id'])) {
    getHotelsByDestination($conn, $_GET['destination_id']);
} else {
    getAllHotels($conn);
}

// ============================================================
// Get all hotels
// ============================================================
function getAllHotels($conn) {
    try {
        $stmt = $conn->prepare(
            "SELECT id, destination_id, name, description, image_url,
                    address, phone, price_per_night, rating
             FROM hotels
             ORDER BY destination_id ASC, rating DESC"
        );
        $stmt->execute();
        $hotels = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'data'    => $hotels
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to fetch hotels. Please try again.'
        ]);
    }
}

// ============================================================
// Get all hotels for a specific destination
// ============================================================
function getHotelsByDestination($conn, $rawId) {
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
                    address, phone, price_per_night, rating
             FROM hotels
             WHERE destination_id = ?
             ORDER BY rating DESC"
        );
        $stmt->execute([$destinationId]);
        $hotels = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'data'    => $hotels
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to fetch hotels. Please try again.'
        ]);
    }
}

// ============================================================
// Get one hotel by ID
// ============================================================
function getOneHotel($conn, $rawId) {
    $id = filter_var($rawId, FILTER_VALIDATE_INT);

    if ($id === false || $id <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid hotel ID.'
        ]);
        return;
    }

    try {
        $stmt = $conn->prepare(
            "SELECT id, destination_id, name, description, image_url,
                    address, phone, price_per_night, rating
             FROM hotels
             WHERE id = ?"
        );
        $stmt->execute([$id]);
        $hotel = $stmt->fetch();

        if (!$hotel) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Hotel not found.'
            ]);
            return;
        }

        echo json_encode([
            'success' => true,
            'data'    => $hotel
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to fetch hotel. Please try again.'
        ]);
    }
}

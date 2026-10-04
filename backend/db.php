<?php
/**
 * db.php
 * 
 * Creates a PDO database connection using credentials from config.php.
 * Every PHP API file includes this to get the $conn variable.
 * 
 * Usage in other files:
 *   require_once 'db.php';
 *   // $conn is now available
 */

require_once 'config.php';

// Build the PDO Data Source Name (DSN)
$dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;

// PDO options for better error handling
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on error
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Return rows as associative arrays
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Use real prepared statements
];

try {
    // Create the database connection
    $conn = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    // Return a JSON error and stop execution
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed. Please check your configuration.',
    ]);
    exit;
}

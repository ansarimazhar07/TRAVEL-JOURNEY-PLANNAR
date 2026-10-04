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
$port = defined('DB_PORT') ? DB_PORT : '3306';
$dsn = "mysql:host=" . DB_HOST . ";port=" . $port . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;

// PDO options for better error handling
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on error
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Return rows as associative arrays
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Use real prepared statements
];

// If connecting to cloud databases (TiDB Cloud, Aiven, etc.) with SSL
if (defined('DB_SSL') && DB_SSL) {
    if (defined('PDO::MYSQL_ATTR_SSL_CA')) {
        $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
    }
}

try {
    // Create the database connection
    $conn = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    // Return a JSON error and stop execution
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $e->getMessage(),
    ]);
    exit;
}

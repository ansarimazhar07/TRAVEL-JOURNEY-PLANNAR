<?php
/**
 * db.php — Centralized PDO Database Connection Factory
 * 
 * Establishes a secure PHP Data Objects (PDO) connection to the relational database.
 * Every API endpoint script includes this file to obtain the active `$conn` database handle.
 * 
 * Security Features:
 * - Parameterized prepared statements (ATTR_EMULATE_PREPARES => false) prevent SQL Injection.
 * - Error mode configured to throw exceptions (ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION).
 * - Automatic associative array fetching (ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC).
 */

// Load database credentials and constants
require_once 'config.php';

// --- Database Engine Auto-Detection ---
// Detects whether the target database is PostgreSQL (port 5432/6543) or MySQL/MariaDB (port 3306).
$port = defined('DB_PORT') ? (string)DB_PORT : '3306';
$driver = getenv('DB_DRIVER') ?: (in_array($port, ['5432', '6543']) ? 'pgsql' : 'mysql');

// --- Build Data Source Name (DSN) & PDO Options ---
if ($driver === 'pgsql') {
    // PostgreSQL DSN configuration (used for Supabase or cloud Postgres instances)
    $dsn = "pgsql:host=" . DB_HOST . ";port=" . $port . ";dbname=" . DB_NAME . ";sslmode=require";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on SQL errors
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Return rows as associative arrays
        PDO::ATTR_EMULATE_PREPARES   => false,                  // Use native database prepared statements
    ];
} else {
    // MySQL / MariaDB DSN configuration (standard local XAMPP setup)
    $dsn = "mysql:host=" . DB_HOST . ";port=" . $port . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on SQL errors
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Return rows as associative arrays
        PDO::ATTR_EMULATE_PREPARES   => false,                  // Native server-side prepared statements
    ];
    // SSL options for remote managed MySQL databases (e.g. TiDB Cloud / Aiven)
    if (defined('DB_SSL') && DB_SSL) {
        if (defined('PDO::MYSQL_ATTR_SSL_CA')) {
            $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
        }
    }
}

// --- Connection Instantiation & Error Handling ---
try {
    // Instantiate the PDO database connection handle
    $conn = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    // Intercept connection failure and emit a structured JSON error response
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $e->getMessage(),
    ]);
    exit;
}

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

// Detect driver: auto-detect 'pgsql' if port is 5432/6543 or DB_DRIVER=pgsql
$port = defined('DB_PORT') ? (string)DB_PORT : '3306';
$driver = getenv('DB_DRIVER') ?: (in_array($port, ['5432', '6543']) ? 'pgsql' : 'mysql');

if ($driver === 'pgsql') {
    // PostgreSQL / Supabase
    $dsn = "pgsql:host=" . DB_HOST . ";port=" . $port . ";dbname=" . DB_NAME . ";sslmode=require";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
} else {
    // MySQL / MariaDB / TiDB Cloud / Aiven
    $dsn = "mysql:host=" . DB_HOST . ";port=" . $port . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    if (defined('DB_SSL') && DB_SSL) {
        if (defined('PDO::MYSQL_ATTR_SSL_CA')) {
            $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
        }
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

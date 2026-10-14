<?php
/**
 * session.php — Cross-Origin Session & Cookie Security Middleware
 *
 * Centralized session handler.
 * Configures cookie security parameters for both local development (HTTP)
 * and production deployments (HTTPS), ensuring session persistence across requests.
 */

// --- Session Initialization Check ---
// Prevents duplicate session_start() calls if this file is included multiple times.
if (session_status() === PHP_SESSION_NONE) {

    // --- Environment Protocol Detection ---
    // Checks standard HTTPS flags and HTTP_X_FORWARDED_PROTO for reverse proxies (Cloudflare, Nginx, etc.)
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
        || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);

    // --- Session Cookie Security Parameters ---
    // - lifetime: 7 days persistence
    // - secure: true over HTTPS, false for local HTTP development
    // - httponly: true prevents JavaScript document.cookie access (protects against XSS attacks)
    // - samesite: 'None' for cross-site requests with HTTPS, or 'Lax' for same-site local development
    if (PHP_VERSION_ID >= 70300) {
        session_set_cookie_params([
            'lifetime' => 86400 * 7,
            'path'     => '/',
            'domain'   => '',
            'secure'   => $isHttps,
            'httponly' => true,
            'samesite' => $isHttps ? 'None' : 'Lax',
        ]);
    } else {
        session_set_cookie_params(86400 * 7, '/; samesite=' . ($isHttps ? 'None' : 'Lax'), '', $isHttps, true);
    }

    // Start or resume the PHP session and load $_SESSION superglobal
    session_start();
}

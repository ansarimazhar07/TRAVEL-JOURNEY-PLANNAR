<?php
/**
 * session.php
 *
 * Centralized session handler.
 * Configures cookie security parameters for both local dev and production cross-origin hosting
 * (e.g. Netlify frontend connecting to Render backend).
 */

if (session_status() === PHP_SESSION_NONE) {
    // Detect HTTPS including reverse proxies (Render, Cloudflare, etc.)
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
        || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);

    // Cross-site cookies across different domains (Netlify <-> Render) require:
    // SameSite=None AND Secure=true.
    // On local HTTP dev, SameSite=Lax AND Secure=false.
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

    session_start();
}

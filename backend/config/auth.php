<?php
/**
 * BOSS N BUZZ ORIGINALS - Authentication Helper
 * Uses secure PHP sessions with Bearer token / Session ID support
 */
function startAuthSession() {
    if (session_status() === PHP_SESSION_NONE) {
        ini_set('session.cookie_httponly', 1);
        ini_set('session.use_only_cookies', 0); // Allow session token in header
        
        // Check for Bearer token or X-Session-Id in request header
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            session_id($matches[1]);
        } elseif (!empty($headers['X-Session-Id'])) {
            session_id($headers['X-Session-Id']);
        }

        session_start();
    }
}

function requireAdminAuth() {
    startAuthSession();
    if (empty($_SESSION['admin_logged_in']) || empty($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Unauthorized: Please log in to access admin resources'
        ]);
        exit;
    }
    return $_SESSION;
}

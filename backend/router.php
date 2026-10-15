<?php
// PHP Built-in Server Router for Boss N Buzz Originals
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Serve static files from /uploads directly
if (preg_match('#^/uploads/#', $uri)) {
    $file = __DIR__ . $uri;
    if (file_exists($file) && !is_dir($file)) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if ($ext === 'svg') header('Content-Type: image/svg+xml');
        elseif ($ext === 'png') header('Content-Type: image/png');
        elseif ($ext === 'jpg' || $ext === 'jpeg') header('Content-Type: image/jpeg');
        elseif ($ext === 'webp') header('Content-Type: image/webp');
        readfile($file);
        exit;
    }
}

// Route API requests to api/index.php
if (preg_match('#^/api#', $uri)) {
    require __DIR__ . '/api/index.php';
    exit;
}

// Fallback: if physical file exists, let PHP serve it
if (file_exists(__DIR__ . $uri) && !is_dir(__DIR__ . $uri)) {
    return false;
}

require __DIR__ . '/api/index.php';

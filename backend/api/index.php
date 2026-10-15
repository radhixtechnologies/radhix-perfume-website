<?php
require_once __DIR__ . '/../config/cors.php';
handleCors();

require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/LeadController.php';
require_once __DIR__ . '/../controllers/OrderController.php';
require_once __DIR__ . '/../controllers/AdminController.php';
require_once __DIR__ . '/../controllers/SettingsController.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Strip prefix if any (e.g., /api or /backend/api)
$uri = preg_replace('#^/+(backend/api|api)#i', '', $uri);
$uri = '/' . trim($uri, '/');

// ROUTING TABLE
if ($method === 'GET' && $uri === '/products') {
    ProductController::getPublicProducts();
} elseif ($method === 'GET' && preg_match('#^/products/([a-zA-Z0-9_-]+)$#', $uri, $matches)) {
    ProductController::getProductBySlug($matches[1]);
} elseif ($method === 'GET' && $uri === '/featured') {
    $_GET['featured'] = 1;
    ProductController::getPublicProducts();
} elseif ($method === 'GET' && $uri === '/settings') {
    SettingsController::getPublicSettings();
} elseif ($method === 'POST' && $uri === '/leads') {
    LeadController::createLead();
} elseif ($method === 'POST' && $uri === '/orders') {
    OrderController::createOrder();
} elseif (($method === 'GET' || $method === 'POST') && preg_match('#^/orders/track#', $uri)) {
    OrderController::trackOrder();
} elseif ($method === 'POST' && $uri === '/orders/submit-utr') {
    OrderController::submitUtr();
} elseif ($method === 'GET' && preg_match('#^/orders/([a-zA-Z0-9_-]+)$#', $uri, $matches)) {
    OrderController::getOrderDetails($matches[1]);
} 

// ADMIN ROUTES
elseif ($method === 'POST' && $uri === '/admin/login') {
    AdminController::login();
} elseif ($method === 'GET' && $uri === '/admin/check-session') {
    AdminController::checkSession();
} elseif ($method === 'POST' && $uri === '/admin/logout') {
    AdminController::logout();
} elseif ($method === 'GET' && $uri === '/admin/stats') {
    AdminController::getStats();
} elseif ($method === 'POST' && $uri === '/admin/upload') {
    AdminController::uploadImage();
} elseif ($method === 'GET' && $uri === '/admin/products') {
    ProductController::getAdminProducts();
} elseif ($method === 'POST' && $uri === '/admin/products') {
    ProductController::createProduct();
} elseif ($method === 'PUT' && preg_match('#^/admin/products/([0-9]+)$#', $uri, $matches)) {
    ProductController::updateProduct($matches[1]);
} elseif ($method === 'DELETE' && preg_match('#^/admin/products/([0-9]+)$#', $uri, $matches)) {
    ProductController::deleteProduct($matches[1]);
} elseif ($method === 'POST' && preg_match('#^/admin/products/([0-9]+)/toggle-featured$#', $uri, $matches)) {
    ProductController::toggleProductFeatured($matches[1]);
} elseif ($method === 'GET' && $uri === '/admin/leads') {
    LeadController::getAdminLeads();
} elseif ($method === 'PUT' && preg_match('#^/admin/leads/([0-9]+)$#', $uri, $matches)) {
    LeadController::updateLeadStatus($matches[1]);
} elseif ($method === 'DELETE' && preg_match('#^/admin/leads/([0-9]+)$#', $uri, $matches)) {
    LeadController::deleteLead($matches[1]);
} elseif ($method === 'GET' && $uri === '/admin/leads/export') {
    LeadController::exportLeadsCsv();
} elseif ($method === 'GET' && $uri === '/admin/orders') {
    OrderController::getAdminOrders();
} elseif ($method === 'PUT' && preg_match('#^/admin/orders/([0-9]+)$#', $uri, $matches)) {
    OrderController::updateOrderStatus($matches[1]);
} elseif ($method === 'PUT' && $uri === '/admin/settings') {
    SettingsController::updateSettings();
} elseif ($method === 'PUT' && $uri === '/admin/change-password') {
    SettingsController::changeAdminPassword();
} else {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'API endpoint not found',
        'requested_uri' => $uri,
        'method' => $method
    ]);
}

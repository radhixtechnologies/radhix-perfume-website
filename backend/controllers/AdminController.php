<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';

class AdminController {
    public static function login() {
        $db = Database::getConnection();
        $data = json_decode(file_get_contents('php://input'), true);

        $username = trim($data['username'] ?? '');
        $password = trim($data['password'] ?? '');

        if (empty($username) || empty($password)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Username and password required']);
            return;
        }

        $stmt = $db->prepare("SELECT * FROM admins WHERE username = ? OR email = ? LIMIT 1");
        $stmt->execute([$username, $username]);
        $admin = $stmt->fetch();

        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid luxury atelier credentials']);
            return;
        }

        startAuthSession();
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_username'] = $admin['username'];
        $_SESSION['admin_name'] = $admin['name'];
        $_SESSION['admin_role'] = $admin['role'];

        echo json_encode([
            'success' => true,
            'message' => 'Welcome back to Boss N Buzz Originals Atelier',
            'token' => session_id(),
            'admin' => [
                'id' => $admin['id'],
                'username' => $admin['username'],
                'name' => $admin['name'],
                'role' => $admin['role']
            ]
        ]);
    }

    public static function checkSession() {
        startAuthSession();
        if (!empty($_SESSION['admin_logged_in'])) {
            echo json_encode([
                'success' => true,
                'logged_in' => true,
                'token' => session_id(),
                'admin' => [
                    'id' => $_SESSION['admin_id'],
                    'username' => $_SESSION['admin_username'],
                    'name' => $_SESSION['admin_name'],
                    'role' => $_SESSION['admin_role']
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'logged_in' => false]);
        }
    }

    public static function logout() {
        startAuthSession();
        session_unset();
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    }

    public static function getStats() {
        requireAdminAuth();
        $db = Database::getConnection();

        $prodCount = $db->query("SELECT COUNT(*) FROM products WHERE is_active = 1")->fetchColumn();
        $leadsCount = $db->query("SELECT COUNT(*) FROM leads")->fetchColumn();
        $todayLeads = $db->query("SELECT COUNT(*) FROM leads WHERE DATE(created_at) = CURDATE()")->fetchColumn();
        $ordersCount = $db->query("SELECT COUNT(*) FROM orders")->fetchColumn();
        $totalSales = $db->query("SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE payment_status = 'Verified / Paid'")->fetchColumn();
        $pendingUpi = $db->query("SELECT COUNT(*) FROM orders WHERE payment_status = 'Pending Verification'")->fetchColumn();

        // Recent 5 leads
        $recentLeads = $db->query("SELECT * FROM leads ORDER BY id DESC LIMIT 5")->fetchAll();
        // Recent 5 orders
        $recentOrders = $db->query("SELECT * FROM orders ORDER BY id DESC LIMIT 5")->fetchAll();

        echo json_encode([
            'success' => true,
            'data' => [
                'total_products' => (int)$prodCount,
                'total_leads' => (int)$leadsCount,
                'today_leads' => (int)$todayLeads,
                'total_orders' => (int)$ordersCount,
                'total_sales' => (float)$totalSales,
                'pending_upi_verification' => (int)$pendingUpi,
                'recent_leads' => $recentLeads,
                'recent_orders' => $recentOrders
            ]
        ]);
    }

    public static function uploadImage() {
        requireAdminAuth();

        $fileKey = isset($_FILES['images']) ? 'images' : (isset($_FILES['image']) ? 'image' : null);

        if (!$fileKey || !isset($_FILES[$fileKey])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No image uploaded']);
            return;
        }

        $raw = $_FILES[$fileKey];
        $filesToProcess = [];

        if (is_array($raw['name'])) {
            $count = count($raw['name']);
            for ($i = 0; $i < $count; $i++) {
                if ($raw['error'][$i] === UPLOAD_ERR_OK) {
                    $filesToProcess[] = [
                        'name' => $raw['name'][$i],
                        'tmp_name' => $raw['tmp_name'][$i],
                        'size' => $raw['size'][$i],
                    ];
                }
            }
        } else {
            if ($raw['error'] === UPLOAD_ERR_OK) {
                $filesToProcess[] = [
                    'name' => $raw['name'],
                    'tmp_name' => $raw['tmp_name'],
                    'size' => $raw['size'],
                ];
            }
        }

        if (empty($filesToProcess)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No valid image uploaded or upload error']);
            return;
        }

        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
        $uploadDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $feUploads = __DIR__ . '/../../frontend/public/uploads/';

        $uploadedUrls = [];
        foreach ($filesToProcess as $file) {
            $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            if (!in_array($ext, $allowedExtensions)) {
                continue;
            }
            if ($file['size'] > 10 * 1024 * 1024) {
                continue;
            }

            $newFilename = 'bnb-' . time() . '-' . bin2hex(random_bytes(4)) . '.' . $ext;
            $destPath = $uploadDir . $newFilename;

            if (move_uploaded_file($file['tmp_name'], $destPath)) {
                if (is_dir($feUploads)) {
                    @copy($destPath, $feUploads . $newFilename);
                }
                $uploadedUrls[] = '/uploads/' . $newFilename;
            }
        }

        if (empty($uploadedUrls)) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to save uploaded image(s)']);
            return;
        }

        echo json_encode([
            'success' => true,
            'url' => $uploadedUrls[0],
            'urls' => $uploadedUrls,
            'count' => count($uploadedUrls),
            'message' => count($uploadedUrls) . ' image(s) uploaded successfully'
        ]);
    }
}

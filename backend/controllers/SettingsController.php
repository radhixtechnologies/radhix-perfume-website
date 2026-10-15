<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';

class SettingsController {
    public static function getPublicSettings() {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT setting_key, setting_value FROM settings");
        $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        echo json_encode(['success' => true, 'data' => $settings]);
    }

    public static function updateSettings() {
        requireAdminAuth();
        $db = Database::getConnection();
        $data = json_decode(file_get_contents('php://input'), true);

        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid data format']);
            return;
        }

        $stmt = $db->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) 
                              ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");

        foreach ($data as $key => $value) {
            $stmt->execute([$key, (string)$value]);
        }

        echo json_encode(['success' => true, 'message' => 'Brand settings updated successfully']);
    }

    public static function changeAdminPassword() {
        $admin = requireAdminAuth();
        $db = Database::getConnection();
        $data = json_decode(file_get_contents('php://input'), true);

        $current = $data['current_password'] ?? '';
        $new = $data['new_password'] ?? '';

        if (empty($current) || empty($new) || strlen($new) < 6) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
            return;
        }

        $check = $db->prepare("SELECT password_hash FROM admins WHERE id = ?");
        $check->execute([$admin['admin_id']]);
        $hash = $check->fetchColumn();

        if (!password_verify($current, $hash)) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
            return;
        }

        $newHash = password_hash($new, PASSWORD_BCRYPT);
        $update = $db->prepare("UPDATE admins SET password_hash = ? WHERE id = ?");
        $update->execute([$newHash, $admin['admin_id']]);

        echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
    }
}

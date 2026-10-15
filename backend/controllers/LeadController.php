<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';

class LeadController {
    public static function createLead() {
        $db = Database::getConnection();
        $data = json_decode(file_get_contents('php://input'), true);

        // Anti-spam honeypot
        if (!empty($data['website_url_hp'])) {
            // Silently ignore bot submission
            echo json_encode(['success' => true, 'message' => 'Inquiry received']);
            return;
        }

        $name = trim($data['name'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $email = trim($data['email'] ?? '');
        $product = trim($data['product_name'] ?? '');
        $message = trim($data['message'] ?? '');
        $source = trim($data['source_page'] ?? 'Home');

        if (empty($name) || empty($phone)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Name and Phone number are required']);
            return;
        }

        // Basic phone validation for India
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
        if (strlen($cleanPhone) < 10) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Please enter a valid 10-digit mobile number']);
            return;
        }

        $ip = $_SERVER['REMOTE_ADDR'] ?? '';

        // Rate limit: max 5 leads per IP in last 10 minutes
        $rateCheck = $db->prepare("SELECT COUNT(*) FROM leads WHERE ip_address = ? AND created_at > (NOW() - INTERVAL 10 MINUTE)");
        $rateCheck->execute([$ip]);
        if ($rateCheck->fetchColumn() >= 6) {
            http_response_code(429);
            echo json_encode(['success' => false, 'message' => 'Too many inquiries submitted. Please connect on WhatsApp directly.']);
            return;
        }

        $stmt = $db->prepare("INSERT INTO leads (name, phone, email, product_name, message, source_page, status, ip_address) 
                              VALUES (?, ?, ?, ?, ?, ?, 'New', ?)");
        $stmt->execute([$name, $phone, $email, $product, $message, $source, $ip]);

        echo json_encode([
            'success' => true,
            'message' => 'Your VIP fragrance consultation has been booked! Our luxury concierge will contact you shortly.',
            'lead_id' => $db->lastInsertId()
        ]);
    }

    public static function getAdminLeads() {
        requireAdminAuth();
        $db = Database::getConnection();
        $status = $_GET['status'] ?? null;
        $search = $_GET['search'] ?? null;

        $sql = "SELECT * FROM leads WHERE 1=1";
        $params = [];

        if ($status && $status !== 'All') {
            $sql .= " AND status = ?";
            $params[] = $status;
        }

        if ($search) {
            $sql .= " AND (name LIKE ? OR phone LIKE ? OR email LIKE ? OR product_name LIKE ?)";
            $term = "%$search%";
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
        }

        $sql .= " ORDER BY id DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $leads = $stmt->fetchAll();

        echo json_encode(['success' => true, 'data' => $leads]);
    }

    public static function updateLeadStatus($id) {
        requireAdminAuth();
        $db = Database::getConnection();
        $data = json_decode(file_get_contents('php://input'), true);
        $status = $data['status'] ?? 'New';
        $notes = $data['notes'] ?? null;

        $stmt = $db->prepare("UPDATE leads SET status = ?, notes = COALESCE(?, notes) WHERE id = ?");
        $stmt->execute([$status, $notes, $id]);

        echo json_encode(['success' => true, 'message' => 'Lead updated successfully']);
    }

    public static function deleteLead($id) {
        requireAdminAuth();
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM leads WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Lead deleted successfully']);
    }

    public static function exportLeadsCsv() {
        requireAdminAuth();
        $db = Database::getConnection();
        $stmt = $db->query("SELECT id, name, phone, email, product_name, message, source_page, status, notes, created_at FROM leads ORDER BY id DESC");
        $leads = $stmt->fetchAll();

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=bossnbuzz-leads-' . date('Y-m-d') . '.csv');

        $output = fopen('php://output', 'w');
        fputcsv($output, ['ID', 'Customer Name', 'Phone', 'Email', 'Interested Perfume', 'Message', 'Source Page', 'Status', 'Admin Notes', 'Date']);

        foreach ($leads as $lead) {
            fputcsv($output, [
                $lead['id'],
                $lead['name'],
                $lead['phone'],
                $lead['email'],
                $lead['product_name'],
                $lead['message'],
                $lead['source_page'],
                $lead['status'],
                $lead['notes'],
                $lead['created_at']
            ]);
        }
        fclose($output);
        exit;
    }
}

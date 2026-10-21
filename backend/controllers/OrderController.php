<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';

class OrderController {
    public static function createOrder() {
        $db = Database::getConnection();
        $data = json_decode(file_get_contents('php://input'), true);

        $name = trim($data['customer_name'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $email = trim($data['email'] ?? '');
        $address = trim($data['shipping_address'] ?? '');
        $city = trim($data['city'] ?? '');
        $state = trim($data['state'] ?? '');
        $pincode = trim($data['pincode'] ?? '');
        $items = $data['items'] ?? [];
        $paymentMethod = strtoupper(trim($data['payment_method'] ?? 'UPI'));
        if ($paymentMethod !== 'COD') {
            $paymentMethod = 'UPI';
        }
        $upiUtr = trim($data['upi_utr'] ?? '');
        $paymentStatus = ($paymentMethod === 'COD') ? 'Cash on Delivery' : 'Pending Verification';

        if (empty($name) || empty($phone) || empty($address) || empty($pincode) || empty($items)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Please fill in all shipping details and add items to cart']);
            return;
        }

        // Calculate verified total
        $totalAmount = 0;
        $orderItems = [];

        foreach ($items as $item) {
            $prodId = (int)($item['id'] ?? 0);
            $qty = max(1, (int)($item['quantity'] ?? 1));
            
            $stmt = $db->prepare("SELECT id, name, price, discount_price, size_ml, main_image FROM products WHERE id = ? AND is_active = 1");
            $stmt->execute([$prodId]);
            $prod = $stmt->fetch();

            if ($prod) {
                $unitPrice = !empty($prod['discount_price']) ? (float)$prod['discount_price'] : (float)$prod['price'];
                $subtotal = $unitPrice * $qty;
                $totalAmount += $subtotal;
                $orderItems[] = [
                    'product_id' => $prod['id'],
                    'product_name' => $prod['name'],
                    'size_ml' => $prod['size_ml'],
                    'price' => $unitPrice,
                    'quantity' => $qty,
                    'subtotal' => $subtotal,
                    'image_url' => $prod['main_image']
                ];
            }
        }

        if (empty($orderItems)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No valid products in cart']);
            return;
        }

        // Generate luxury order number: BNB-YYYYMMDD-XXXX
        $orderNumber = 'BNB-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';

        $db->beginTransaction();
        try {
            $stmt = $db->prepare("INSERT INTO orders 
                (order_number, customer_name, phone, email, shipping_address, city, state, pincode, total_amount, payment_method, upi_utr, payment_status, order_status, ip_address) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Placed', ?)");
            
            $stmt->execute([
                $orderNumber,
                $name,
                $phone,
                $email,
                $address,
                $city,
                $state,
                $pincode,
                $totalAmount,
                $paymentMethod,
                $upiUtr,
                $paymentStatus,
                $ip
            ]);

            $orderId = $db->lastInsertId();

            $itemStmt = $db->prepare("INSERT INTO order_items (order_id, product_id, product_name, size_ml, price, quantity, subtotal, image_url) 
                                      VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($orderItems as $oi) {
                $itemStmt->execute([
                    $orderId,
                    $oi['product_id'],
                    $oi['product_name'],
                    $oi['size_ml'],
                    $oi['price'],
                    $oi['quantity'],
                    $oi['subtotal'],
                    $oi['image_url']
                ]);
            }

            $db->commit();

            // Fetch UPI config from settings
            $setStmt = $db->query("SELECT setting_key, setting_value FROM settings WHERE setting_key IN ('upi_id', 'upi_merchant_name')");
            $settings = $setStmt->fetchAll(PDO::FETCH_KEY_PAIR);
            $upiId = $settings['upi_id'] ?? 'thakurshanky650@oksbi';
            $merchant = $settings['upi_merchant_name'] ?? 'BOSS N BUZZ ORIGINALS';

            // Generate standard UPI Intent URI
            // upi://pay?pa=...&pn=...&am=...&tn=...&cu=INR
            $upiIntentUri = "upi://pay?pa=" . urlencode($upiId) .
                            "&pn=" . urlencode($merchant) .
                            "&am=" . number_format($totalAmount, 2, '.', '') .
                            "&tn=" . urlencode("Order " . $orderNumber) .
                            "&cu=INR";

            echo json_encode([
                'success' => true,
                'message' => ($paymentMethod === 'COD') ? 'Cash on Delivery order placed successfully' : 'Order initiated successfully',
                'order' => [
                    'id' => $orderId,
                    'order_number' => $orderNumber,
                    'customer_name' => $name,
                    'phone' => $phone,
                    'total_amount' => $totalAmount,
                    'payment_method' => $paymentMethod,
                    'payment_status' => $paymentStatus,
                    'upi_id' => $upiId,
                    'merchant_name' => $merchant,
                    'upi_intent_uri' => $upiIntentUri
                ]
            ]);

        } catch (Exception $e) {
            $db->rollBack();
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create order: ' . $e->getMessage()]);
        }
    }

    public static function submitUtr() {
        $db = Database::getConnection();
        $data = json_decode(file_get_contents('php://input'), true);

        $orderNumber = trim($data['order_number'] ?? '');
        $utr = trim($data['upi_utr'] ?? '');

        if (empty($orderNumber) || empty($utr)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Order number and 12-digit UTR/Reference number are required']);
            return;
        }

        $stmt = $db->prepare("UPDATE orders SET upi_utr = ?, payment_status = 'Pending Verification' WHERE order_number = ?");
        $stmt->execute([$utr, $orderNumber]);

        echo json_encode([
            'success' => true,
            'message' => 'Payment reference submitted successfully! Our finance team is verifying your payment.'
        ]);
    }

    public static function getOrderDetails($orderNumber) {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM orders WHERE order_number = ? LIMIT 1");
        $stmt->execute([$orderNumber]);
        $order = $stmt->fetch();

        if (!$order) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Order not found']);
            return;
        }

        $itemsStmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $itemsStmt->execute([$order['id']]);
        $order['items'] = $itemsStmt->fetchAll();

        echo json_encode(['success' => true, 'data' => $order]);
    }

    public static function getAdminOrders() {
        requireAdminAuth();
        $db = Database::getConnection();
        $paymentStatus = $_GET['payment_status'] ?? null;
        $orderStatus = $_GET['order_status'] ?? null;
        $search = $_GET['search'] ?? null;

        $sql = "SELECT * FROM orders WHERE 1=1";
        $params = [];

        if ($paymentStatus && $paymentStatus !== 'All') {
            $sql .= " AND payment_status = ?";
            $params[] = $paymentStatus;
        }

        if ($orderStatus && $orderStatus !== 'All') {
            $sql .= " AND order_status = ?";
            $params[] = $orderStatus;
        }

        if ($search) {
            $sql .= " AND (order_number LIKE ? OR customer_name LIKE ? OR phone LIKE ? OR upi_utr LIKE ?)";
            $term = "%$search%";
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
        }

        $sql .= " ORDER BY id DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll();

        // Attach items summary
        foreach ($orders as &$order) {
            $itStmt = $db->prepare("SELECT product_name, quantity, size_ml FROM order_items WHERE order_id = ?");
            $itStmt->execute([$order['id']]);
            $order['items_summary'] = $itStmt->fetchAll();
        }

        echo json_encode(['success' => true, 'data' => $orders]);
    }

    public static function updateOrderStatus($id) {
        requireAdminAuth();
        $db = Database::getConnection();
        $data = json_decode(file_get_contents('php://input'), true);

        $paymentStatus = $data['payment_status'] ?? null;
        $orderStatus = $data['order_status'] ?? null;
        $notes = $data['notes'] ?? null;

        $updates = [];
        $params = [];

        if ($paymentStatus !== null) {
            $updates[] = "payment_status = ?";
            $params[] = $paymentStatus;
        }
        if ($orderStatus !== null) {
            $updates[] = "order_status = ?";
            $params[] = $orderStatus;
        }
        if ($notes !== null) {
            $updates[] = "notes = ?";
            $params[] = $notes;
        }

        if (empty($updates)) {
            echo json_encode(['success' => false, 'message' => 'No changes requested']);
            return;
        }

        $params[] = $id;
        $sql = "UPDATE orders SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        echo json_encode(['success' => true, 'message' => 'Order updated successfully']);
    }

    public static function trackOrder() {
        $db = Database::getConnection();
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $query = trim($_GET['query'] ?? ($data['query'] ?? ''));

        if (empty($query)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Please enter your Order Number or 10-digit Mobile Number']);
            return;
        }

        $cleanDigits = preg_replace('/[^0-9]/', '', $query);

        // Match order_number or phone
        $sql = "SELECT * FROM orders WHERE order_number = ? OR order_number LIKE ?";
        $params = [$query, "%$query%"];

        if (strlen($cleanDigits) >= 6) {
            $sql .= " OR phone LIKE ?";
            $params[] = "%$cleanDigits%";
            if (str_starts_with($cleanDigits, '91') && strlen($cleanDigits) >= 12) {
                $sql .= " OR phone LIKE ?";
                $params[] = "%" . substr($cleanDigits, 2) . "%";
            }
        }

        $sql .= " ORDER BY id DESC LIMIT 5";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll();

        if (empty($orders)) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'No orders found matching "' . htmlspecialchars($query) . '". Please verify your Order Reference ID or mobile number.'
            ]);
            return;
        }

        foreach ($orders as &$ord) {
            $itStmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $itStmt->execute([$ord['id']]);
            $ord['items'] = $itStmt->fetchAll();
        }

        echo json_encode(['success' => true, 'count' => count($orders), 'data' => $orders]);
    }
}

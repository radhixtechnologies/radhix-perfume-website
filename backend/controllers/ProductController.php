<?php
require_once __DIR__ . '/../config/database.php';

class ProductController {
    public static function getPublicProducts() {
        $db = Database::getConnection();
        $category = $_GET['category'] ?? null;
        $search = $_GET['search'] ?? null;
        $featured = isset($_GET['featured']) ? (int)$_GET['featured'] : null;
        $minPrice = isset($_GET['min_price']) ? (float)$_GET['min_price'] : null;
        $maxPrice = isset($_GET['max_price']) ? (float)$_GET['max_price'] : null;

        $sql = "SELECT p.*, c.name as category_name, c.slug as category_slug,
                (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC, id ASC LIMIT 1) as secondary_image
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE p.is_active = 1";
        $params = [];

        if ($category && $category !== 'all') {
            $sql .= " AND (c.slug = ? OR c.name = ?)";
            $params[] = $category;
            $params[] = $category;
        }

        if ($search) {
            $sql .= " AND (p.name LIKE ? OR p.short_description LIKE ? OR p.top_notes LIKE ? OR p.heart_notes LIKE ? OR p.base_notes LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        if ($featured !== null) {
            $sql .= " AND p.is_featured = ?";
            $params[] = $featured;
        }

        if ($minPrice !== null) {
            $sql .= " AND COALESCE(p.discount_price, p.price) >= ?";
            $params[] = $minPrice;
        }

        if ($maxPrice !== null) {
            $sql .= " AND COALESCE(p.discount_price, p.price) <= ?";
            $params[] = $maxPrice;
        }

        $sql .= " ORDER BY p.is_featured DESC, p.id ASC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'count' => count($products),
            'data' => $products
        ]);
    }

    public static function getProductBySlug($slug) {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT p.*, c.name as category_name, c.slug as category_slug 
                              FROM products p 
                              LEFT JOIN categories c ON p.category_id = c.id 
                              WHERE p.slug = ? AND p.is_active = 1 LIMIT 1");
        $stmt->execute([$slug]);
        $product = $stmt->fetch();

        if (!$product) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Perfume not found']);
            return;
        }

        // Additional images
        $imgStmt = $db->prepare("SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC");
        $imgStmt->execute([$product['id']]);
        $product['additional_images'] = $imgStmt->fetchAll(PDO::FETCH_COLUMN);

        // Related products from same category or random
        $relStmt = $db->prepare("SELECT id, name, slug, price, discount_price, size_ml, main_image, tagline, concentration 
                                 FROM products 
                                 WHERE is_active = 1 AND id != ? 
                                 ORDER BY (category_id = ?) DESC, RAND() LIMIT 3");
        $relStmt->execute([$product['id'], $product['category_id']]);
        $product['related'] = $relStmt->fetchAll();

        echo json_encode([
            'success' => true,
            'data' => $product
        ]);
    }

    public static function getAdminProducts() {
        requireAdminAuth();
        $db = Database::getConnection();
        $stmt = $db->query("SELECT p.*, c.name as category_name 
                            FROM products p 
                            LEFT JOIN categories c ON p.category_id = c.id 
                            ORDER BY p.id DESC");
        $products = $stmt->fetchAll();

        foreach ($products as &$product) {
            $product['additional_images'] = [];
        }
        unset($product);

        if ($products) {
            $productIds = array_column($products, 'id');
            $placeholders = implode(',', array_fill(0, count($productIds), '?'));
            $imageStmt = $db->prepare("SELECT product_id, image_url FROM product_images
                                       WHERE product_id IN ($placeholders)
                                       ORDER BY sort_order ASC, id ASC");
            $imageStmt->execute($productIds);
            $imagesByProduct = [];
            foreach ($imageStmt->fetchAll() as $image) {
                $imagesByProduct[$image['product_id']][] = $image['image_url'];
            }

            foreach ($products as &$product) {
                $product['additional_images'] = $imagesByProduct[$product['id']] ?? [];
            }
            unset($product);
        }

        echo json_encode(['success' => true, 'data' => $products]);
    }

    private static function saveAdditionalImages($db, $productId, $images) {
        $deleteStmt = $db->prepare("DELETE FROM product_images WHERE product_id = ?");
        $deleteStmt->execute([$productId]);

        if (!is_array($images)) {
            return;
        }

        $insertStmt = $db->prepare("INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)");
        foreach (array_values($images) as $index => $imageUrl) {
            if (is_string($imageUrl) && trim($imageUrl) !== '') {
                $insertStmt->execute([$productId, trim($imageUrl), $index]);
            }
        }
    }

    public static function createProduct() {
        requireAdminAuth();
        $db = Database::getConnection();
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['name']) || empty($data['price'])) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Product name and price are required']);
            return;
        }

        $slug = !empty($data['slug']) ? $data['slug'] : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['name'])));
        
        // Ensure unique slug
        $check = $db->prepare("SELECT id FROM products WHERE slug = ?");
        $check->execute([$slug]);
        if ($check->fetch()) {
            $slug .= '-' . time();
        }

        $stmt = $db->prepare("INSERT INTO products 
            (category_id, name, slug, tagline, price, discount_price, size_ml, concentration, short_description, full_description, top_notes, heart_notes, base_notes, longevity, sillage, season, occasion, stock_status, stock_quantity, is_featured, is_active, main_image, seo_title, seo_description) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $db->beginTransaction();
        try {
            $stmt->execute([
                $data['category_id'] ?? 1,
                $data['name'],
                $slug,
                $data['tagline'] ?? '',
                $data['price'],
                !empty($data['discount_price']) ? $data['discount_price'] : null,
                $data['size_ml'] ?? 100,
                $data['concentration'] ?? 'Extrait de Parfum',
                $data['short_description'] ?? '',
                $data['full_description'] ?? '',
                $data['top_notes'] ?? '',
                $data['heart_notes'] ?? '',
                $data['base_notes'] ?? '',
                $data['longevity'] ?? '16-24 Hours',
                $data['sillage'] ?? 'Magnetic Aura',
                $data['season'] ?? 'All Seasons',
                $data['occasion'] ?? 'Signature Scent',
                $data['stock_status'] ?? 'in_stock',
                $data['stock_quantity'] ?? 50,
                !empty($data['is_featured']) ? 1 : 0,
                isset($data['is_active']) ? (int)$data['is_active'] : 1,
                $data['main_image'] ?? '/uploads/bnb-gold-intense.svg',
                $data['seo_title'] ?? $data['name'] . ' | Boss N Buzz Originals',
                $data['seo_description'] ?? ($data['short_description'] ?? '')
            ]);

            $newId = $db->lastInsertId();
            self::saveAdditionalImages($db, $newId, $data['additional_images'] ?? []);
            $db->commit();
        } catch (Throwable $error) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            throw $error;
        }

        echo json_encode([
            'success' => true,
            'message' => 'Product created successfully',
            'id' => $newId,
            'slug' => $slug
        ]);
    }

    public static function updateProduct($id) {
        requireAdminAuth();
        $db = Database::getConnection();
        $data = json_decode(file_get_contents('php://input'), true);

        $stmt = $db->prepare("UPDATE products SET 
            category_id = ?, name = ?, tagline = ?, price = ?, discount_price = ?, size_ml = ?, concentration = ?, 
            short_description = ?, full_description = ?, top_notes = ?, heart_notes = ?, base_notes = ?, 
            longevity = ?, sillage = ?, season = ?, occasion = ?, stock_status = ?, stock_quantity = ?, 
            is_featured = ?, is_active = ?, main_image = ?, seo_title = ?, seo_description = ? 
            WHERE id = ?");

        $db->beginTransaction();
        try {
            $stmt->execute([
                $data['category_id'] ?? 1,
                $data['name'],
                $data['tagline'] ?? '',
                $data['price'],
                !empty($data['discount_price']) ? $data['discount_price'] : null,
                $data['size_ml'] ?? 100,
                $data['concentration'] ?? 'Extrait de Parfum',
                $data['short_description'] ?? '',
                $data['full_description'] ?? '',
                $data['top_notes'] ?? '',
                $data['heart_notes'] ?? '',
                $data['base_notes'] ?? '',
                $data['longevity'] ?? '16-24 Hours',
                $data['sillage'] ?? 'Magnetic Aura',
                $data['season'] ?? 'All Seasons',
                $data['occasion'] ?? 'Signature Scent',
                $data['stock_status'] ?? 'in_stock',
                $data['stock_quantity'] ?? 50,
                !empty($data['is_featured']) ? 1 : 0,
                isset($data['is_active']) ? (int)$data['is_active'] : 1,
                $data['main_image'],
                $data['seo_title'] ?? '',
                $data['seo_description'] ?? '',
                $id
            ]);
            if (array_key_exists('additional_images', $data)) {
                self::saveAdditionalImages($db, $id, $data['additional_images']);
            }
            $db->commit();
        } catch (Throwable $error) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            throw $error;
        }

        echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
    }

    public static function deleteProduct($id) {
        requireAdminAuth();
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
    }

    public static function toggleProductFeatured($id) {
        requireAdminAuth();
        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE products SET is_featured = NOT is_featured WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Product status updated']);
    }
}

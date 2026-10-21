-- BOSS N BUZZ ORIGINALS - Database Schema & Seed Data
CREATE DATABASE IF NOT EXISTS `bossnbuzz_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `bossnbuzz_db`;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) DEFAULT 'Admin',
  `role` VARCHAR(30) DEFAULT 'superadmin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT NULL,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(220) NOT NULL UNIQUE,
  `tagline` VARCHAR(255) NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `discount_price` DECIMAL(10,2) NULL,
  `size_ml` INT NOT NULL DEFAULT 100,
  `concentration` VARCHAR(60) DEFAULT 'Extrait de Parfum',
  `short_description` VARCHAR(500) NOT NULL,
  `full_description` LONGTEXT NOT NULL,
  `top_notes` VARCHAR(255) NOT NULL,
  `heart_notes` VARCHAR(255) NOT NULL,
  `base_notes` VARCHAR(255) NOT NULL,
  `longevity` VARCHAR(100) DEFAULT '16-24 Hours',
  `sillage` VARCHAR(100) DEFAULT 'Heavy / Magnetic Aura',
  `season` VARCHAR(120) DEFAULT 'All Seasons / Evening',
  `occasion` VARCHAR(120) DEFAULT 'VIP Events, Date Nights, Signature Scent',
  `stock_status` ENUM('in_stock', 'low_stock', 'out_of_stock') DEFAULT 'in_stock',
  `stock_quantity` INT DEFAULT 50,
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `main_image` VARCHAR(255) NOT NULL,
  `seo_title` VARCHAR(255) NULL,
  `seo_description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_featured` (`is_featured`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB;

-- 4. Product Additional Images Table
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Leads Table
CREATE TABLE IF NOT EXISTS `leads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(25) NOT NULL,
  `email` VARCHAR(150) NULL,
  `product_name` VARCHAR(200) NULL,
  `message` TEXT NULL,
  `source_page` VARCHAR(100) DEFAULT 'Home Page',
  `status` ENUM('New', 'Contacted', 'Converted', 'Closed') DEFAULT 'New',
  `notes` TEXT NULL,
  `ip_address` VARCHAR(60) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB;

-- 6. Orders Table (With Full UPI Support)
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `customer_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(25) NOT NULL,
  `email` VARCHAR(150) NULL,
  `shipping_address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `pincode` VARCHAR(20) NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `payment_method` VARCHAR(50) DEFAULT 'UPI',
  `upi_utr` VARCHAR(100) NULL,
  `payment_status` ENUM('Pending Verification', 'Verified / Paid', 'Failed') DEFAULT 'Pending Verification',
  `order_status` ENUM('Placed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled') DEFAULT 'Placed',
  `notes` TEXT NULL,
  `ip_address` VARCHAR(60) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_order_no` (`order_number`),
  INDEX `idx_payment_status` (`payment_status`),
  INDEX `idx_order_status` (`order_status`)
) ENGINE=InnoDB;

-- 7. Order Items Table
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NULL,
  `product_name` VARCHAR(200) NOT NULL,
  `size_ml` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `image_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Brand & Store Settings Table
CREATE TABLE IF NOT EXISTS `settings` (
  `setting_key` VARCHAR(80) PRIMARY KEY,
  `setting_value` TEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Default Admin User (Password: admin123)
INSERT INTO `admins` (`username`, `email`, `password_hash`, `name`, `role`)
VALUES ('admin', 'admin@bossnbuzz.com', '$2y$10$gcIG1lNnxhcoPV.858NxxO/QzRGc4i5Jpa7ky5N14lWqRf9vlkzlu', 'Founder & Creative Director', 'superadmin')
ON DUPLICATE KEY UPDATE `username`=`username`;

-- Seed Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Unisex Extrait', 'unisex-extrait', 'Gender-neutral signature elixirs crafted for individuals who own the room.'),
(2, 'Men Haute Parfumerie', 'men-haute-parfumerie', 'Bold, dark woods, smokey spices, and magnetic leathers.'),
(3, 'Women Royal Florals', 'women-royal-florals', 'Seductive nectar, velvety damask rose, and radiant amber.')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Seed Luxury Perfumes
INSERT INTO `products` (
  `id`, `category_id`, `name`, `slug`, `tagline`, `price`, `discount_price`, `size_ml`, `concentration`,
  `short_description`, `full_description`, `top_notes`, `heart_notes`, `base_notes`, `longevity`,
  `sillage`, `season`, `occasion`, `stock_status`, `stock_quantity`, `is_featured`, `is_active`,
  `main_image`, `seo_title`, `seo_description`
) VALUES
(
  1, 1, 'Boss N Buzz Originals', 'boss-n-buzz-originals', 'Be The Boss. Create The Buzz.',
  4499.00, 3999.00, 100, '40% Extrait de Parfum',
  'The signature flagship creation of Boss N Buzz. Mastercrafted with aged Assam agarwood, warm saffron, and amber nectar. Presented in an opulent gold satin gift box with bespoke luxury carry bag.',
  'Boss N Buzz Originals represents the zenith of Indian luxury haute parfumerie. Formulated with an uncompromising 40% pure perfume oil concentration for nuclear longevity and magnetic sillage. Accompanied by our handcrafted gold silk-lined presentation box and matte black gold-embossed rope carry bag.',
  'Calabrian Bergamot, Royal Saffron, Crisp Cardamom',
  'Bourbon Vanilla, Smoky Frankincense, French Orris',
  'Aged Assam Oud, Golden Ambergris, Velvet Cedarwood',
  '24+ Hours Nuclear Longevity', 'Room-Filling Magnetic Aura', 'All Seasons / Signature Evening',
  'VIP Events, Red Carpet, Executive Authority',
  'in_stock', 50, 1, 1,
  '/uploads/bnb-originals-bottle-cinematic.jpg',
  'Boss N Buzz Originals | Haute Parfumerie (40% Extrait)',
  'Experience Boss N Buzz Originals Extrait de Parfum. Handcrafted Indian luxury fragrance with 24-hour nuclear sillage.'
),
(
  2, 1, 'Boss N Buzz Atelier Gift Set', 'boss-n-buzz-atelier-gift-set', 'The Imperial Silk Box & Scent Experience.',
  5499.00, 4899.00, 100, '40% Extrait de Parfum',
  'The complete haute unboxing experience. Features the 100ml Boss N Buzz Originals Extrait nestled in our handcrafted gold silk-lined keepsake box with gold braided rope handles and bespoke boutique carry bag.',
  'Presenting the pinnacle of fragrance luxury. The Boss N Buzz Atelier Gift Set is masterfully assembled for discerning collectors and momentous gifting occasions. Includes the full-sized 100ml crystal flacon of 40% Extrait de Parfum, cushioned on champagne-gold silk bedding inside a reinforced keepsake case with gold braided cords, accompanied by the signature matte black boutique carry bag.',
  'Calabrian Bergamot, Royal Saffron, Crisp Cardamom',
  'Bourbon Vanilla, Smoky Frankincense, French Orris',
  'Aged Assam Oud, Golden Ambergris, Velvet Cedarwood',
  '24+ Hours Nuclear Longevity', 'Enveloping Luxury Sillage', 'All Seasons / Celebrations',
  'Royal Weddings, Milestone Celebrations, VIP Gifting',
  'in_stock', 35, 1, 1,
  '/uploads/bnb-originals-gift-box-cinematic.jpg',
  'Boss N Buzz Atelier Gift Set | Luxury Presentation Box',
  'The official Boss N Buzz Atelier Gift Set with gold silk presentation box and bespoke carry bag.'
),
(
  3, 2, 'Boss N Buzz Noir Imperial', 'boss-n-buzz-noir-imperial', 'Dark Ambergris & 15-Year Assam Agarwood.',
  4999.00, 4299.00, 100, '42% Extrait de Parfum',
  'An intensely concentrated, smoky resinous iteration of the Originals DNA. Infused with double-macerated Assam agarwood, charred bourbon vanilla, and dark ambergris.',
  'Engineered for those who thrive in the nocturnal hours. Boss N Buzz Noir Imperial takes the iconic Originals architecture into deeper, smokier territory. Rare Assamese oud aged for 15 years marries with dark toasted vanilla and mineral ambergris, creating a commanding sillage that demands deference.',
  'Black Pepper, Cardamom, Italian Bergamot',
  'Charred Bourbon Vanilla, Smoked Birch, Dark Iris',
  '15-Yr Aged Assam Agarwood, Black Amber, Leather Accord',
  '28+ Hours Nuclear Trail', 'Room-Filling Sovereign Aura', 'Fall / Winter & Black Tie',
  'Late Nights, Boardrooms, Black Tie Galas',
  'in_stock', 40, 1, 1,
  '/uploads/bnb-originals-noir-cinematic.jpg',
  'Boss N Buzz Noir Imperial | 42% Pure Extrait',
  'Discover Boss N Buzz Noir Imperial. 42% perfume concentration with 15-year aged Assam oud.'
),
(
  4, 1, 'Boss N Buzz Couture Edition', 'boss-n-buzz-couture-edition', 'Originals Extrait with Bespoke Boutique Bag.',
  4799.00, 4199.00, 100, '40% Extrait de Parfum',
  'The complete high-fashion ensemble. Boss N Buzz Originals Extrait paired with our custom heavy-weight matte black shopping bag featuring gold metallic foil embossing and gold braided cords.',
  'A statement of effortless elegance. The Couture Edition bundles the signature Boss N Buzz Originals 100ml flacon with our bespoke heavy-gauge textured shopping tote, embossed with reflective gold foil. Ready to carry into high-fashion salons and private dinners.',
  'Calabrian Bergamot, Kashmiri Saffron, Pink Pepper',
  'Bourbon Vanilla, Smoky Frankincense, French Orris',
  'Assam Agarwood, Golden Ambergris, White Cedar',
  '24+ Hours Nuclear Longevity', 'Magnetic & Sophisticated', 'All Seasons',
  'Fashion Weeks, Red Carpet, Executive Authority',
  'in_stock', 50, 1, 1,
  '/uploads/bnb-originals-couture-cinematic.jpg',
  'Boss N Buzz Couture Edition | Haute Boutique Presentation',
  'Boss N Buzz Couture Edition fragrance flacon with bespoke gold-embossed tote bag.'
)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `main_image`=VALUES(`main_image`), `is_active`=VALUES(`is_active`);

-- Seed Product Gallery Images
INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES
(1, '/uploads/bnb-originals-gift-box-cinematic.jpg', 0),
(1, '/uploads/bnb-originals-noir-cinematic.jpg', 1),
(1, '/uploads/bnb-originals-couture-cinematic.jpg', 2),
(1, '/uploads/bnb-originals-bottle.jpg', 3),
(2, '/uploads/bnb-originals-bottle-cinematic.jpg', 0),
(2, '/uploads/bnb-originals-noir-cinematic.jpg', 1),
(2, '/uploads/bnb-originals-couture-cinematic.jpg', 2),
(3, '/uploads/bnb-originals-bottle-cinematic.jpg', 0),
(3, '/uploads/bnb-originals-gift-box-cinematic.jpg', 1),
(3, '/uploads/bnb-originals-couture-cinematic.jpg', 2),
(4, '/uploads/bnb-originals-bottle-cinematic.jpg', 0),
(4, '/uploads/bnb-originals-gift-box-cinematic.jpg', 1),
(4, '/uploads/bnb-originals-noir-cinematic.jpg', 2)
ON DUPLICATE KEY UPDATE `image_url`=VALUES(`image_url`);

-- Seed Default Settings
INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('site_title', 'BOSS N BUZZ ORIGINALS | Luxury Parfumerie'),
('site_tagline', 'Be The Boss. Create The Buzz.'),
('whatsapp_number', '919876543210'),
('upi_id', 'thakurshanky650@oksbi'),
('upi_merchant_name', 'BOSS N BUZZ ORIGINALS'),
('contact_email', 'concierge@bossnbuzz.com'),
('contact_phone', '+91 98765 43210'),
('address', 'BNB Flagship Atelier, Luxury Avenue, UB City, Bengaluru, India'),
('hero_headline', 'BE THE BOSS. CREATE THE BUZZ.'),
('hero_subtext', 'Handcrafted Extrait de Parfum infused with rare botanical extracts, aged Indian oud, and 40% oil concentration for an unforgettable 24-hour magnetic aura.'),
('announcement_text', '✨ FREE LUXURY GIFT PACKAGING + EXPRESS SHIPPING ACROSS INDIA ON ALL ORDERS ✨'),
('instagram_url', 'https://instagram.com/bossnbuzzoriginals'),
('facebook_url', 'https://facebook.com/bossnbuzzoriginals')
ON DUPLICATE KEY UPDATE `setting_value`=VALUES(`setting_value`);

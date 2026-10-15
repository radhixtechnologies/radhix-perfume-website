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

-- Seed 6 Luxury Perfumes
INSERT INTO `products` (
  `id`, `category_id`, `name`, `slug`, `tagline`, `price`, `discount_price`, `size_ml`, `concentration`,
  `short_description`, `full_description`, `top_notes`, `heart_notes`, `base_notes`, `longevity`,
  `sillage`, `season`, `occasion`, `stock_status`, `stock_quantity`, `is_featured`, `is_active`,
  `main_image`, `seo_title`, `seo_description`
) VALUES
(
  1, 1, 'BNB Gold Intense', 'bnb-gold-intense', 'The Golden Throne of Indian Parfumerie',
  4499.00, 3499.00, 100, 'Extrait de Parfum (40% Oil)',
  'An opulent collision of radiant Italian bergamot, golden amber crystals, and aged royal Indian oud.',
  'BNB Gold Intense is the crown jewel of Boss N Buzz Originals. Formulated at a rare 40% pure perfume oil concentration, this masterpiece opens with an intoxicating blast of sun-drenched Italian bergamot and spicy cardamom. As the aura unfolds, rare Turkish Damask Rose intertwines with velvety praline and warm ambergris, settling into an aristocratic base of aged Assam agarwood and golden sandalwood. Crafted for rulers of the modern era.',
  'Italian Bergamot, Sunlit Cardamom, Pink Pepper',
  'Damask Rose Absolute, Golden Amber, French Praline',
  'Assam Royal Agarwood, Tonka Bean, Mysore Sandalwood',
  '24+ Hours Nuclear Longevity', 'Heavy, Magnetic Scent Trail', 'All Seasons / High Stakes Evenings',
  'VIP Galas, Black Tie, Boardrooms, Signature Scent',
  'in_stock', 45, 1, 1,
  '/uploads/bnb-gold-intense.svg',
  'BNB Gold Intense Extrait de Parfum | Boss N Buzz Originals',
  'Shop BNB Gold Intense luxury perfume by Boss N Buzz Originals. 40% oil concentration, aged Indian oud and golden amber.'
),
(
  2, 2, 'BNB Noir Absolu', 'bnb-noir-absolu', 'Darkness Weaponized Into Liquid Charisma',
  3999.00, 2999.00, 100, 'Extrait de Parfum (38% Oil)',
  'Smoky black leather, roasted coffee bean, cracked black pepper, and dark Madagascar vanilla.',
  'Daring, hypnotic, and utterly commanding. BNB Noir Absolu was born in the shadows of midnight encounters. It strikes with an adrenaline rush of freshly cracked black pepper and dark roasted espresso, quickly shrouded in luxury Tuscan glove leather, smoky birch tar, and rich Indonesian patchouli. This is the scent worn by architects of influence who speak softly because their aura shouts.',
  'Black Pepper, Bitter Orange, Roasted Coffee',
  'Tuscan Suede, Dark Iris, Smoky Birch Tar',
  'Indonesian Patchouli, Madagascar Black Vanilla, Cedarwood',
  '20+ Hours', 'Intense Projection for 8 Hours', 'Autumn, Winter & Night Outs',
  'Luxury Lounges, Date Nights, Red Carpet Events',
  'in_stock', 60, 1, 1,
  '/uploads/bnb-noir-absolu.svg',
  'BNB Noir Absolu Extrait de Parfum | Boss N Buzz Originals',
  'Buy BNB Noir Absolu by Boss N Buzz Originals. Dark, smoky leather and black vanilla luxury perfume.'
),
(
  3, 1, 'BNB Royal Oud Sovereign', 'bnb-royal-oud-sovereign', 'Ancient Heritage Reimagined for Gen-Z Kings',
  4999.00, 3999.00, 100, 'Pure Parfum Extrait (42% Oil)',
  'Raw wild Cambodian oud infused with nutmeg, saffron threads, and crystalline frankincense.',
  'A sacred olfactory tribute to royal courts of India and the Middle East. Royal Oud Sovereign utilizes sustainably sourced 15-year aged wild Cambodian and Indian agarwood distillations. Accented with golden Kashmiri saffron stamens, freshly grated nutmeg, and royal frankincense tears, this scent exudes immense pedigree and unshakeable confidence.',
  'Kashmiri Saffron, Fresh Nutmeg, Clary Sage',
  'Wild Cambodian Oud, Rosewood, Frankincense Tears',
  'Smoked Sandalwood, Raw Amber, Dark Musk',
  '24+ Hours (Indelible)', 'Royal Pervasive Sillage', 'All Year Round Signature',
  'Weddings, Royalty Gatherings, Landmark Celebrations',
  'in_stock', 30, 1, 1,
  '/uploads/bnb-royal-oud-sovereign.svg',
  'BNB Royal Oud Sovereign | Boss N Buzz Originals',
  'Authentic wild aged Cambodian Oud perfume in India by Boss N Buzz Originals.'
),
(
  4, 3, 'BNB Velvet Rose & Saffron', 'bnb-velvet-rose-saffron', 'Lethal Elegance Wrapped in Crimson Petals',
  4199.00, 3199.00, 100, 'Extrait de Parfum (35% Oil)',
  'Dewy midnight Turkish roses drenched in liquid gold saffron, crushed cinnamon, and creamy vanilla.',
  'Not your ordinary rose perfume. Velvet Rose & Saffron is seductive, rebellious, and impossibly addictive. We macerated hand-picked Isparta roses under the moonlight, then married them with pungent Iranian saffron threads, sweet spun sugar, and bourbon vanilla pods. The dry-down leaves a trail of pure temptation on human skin that lingers until the morning.',
  'Iranian Saffron, Juicy Plum, Pink Lychee',
  'Isparta Damask Rose, Cinnamon Bark, Jasmine Sambac',
  'Bourbon Vanilla, White Amber, Cashmere Woods',
  '18+ Hours', 'Enveloping Warm Cloud', 'Romantic Evenings, Spring, Winter',
  'First Dates, Cocktail Parties, Intimate Dinners',
  'in_stock', 40, 1, 1,
  '/uploads/bnb-velvet-rose-saffron.svg',
  'BNB Velvet Rose & Saffron | Boss N Buzz Originals',
  'Seductive Turkish Rose & Saffron Extrait de Parfum by Boss N Buzz Originals.'
),
(
  5, 1, 'BNB Elixir Blanc', 'bnb-elixir-blanc', 'Hyper-Fresh Mediterranean Breeze Infused with Diamond Musk',
  3799.00, 2799.00, 100, 'Extrait de Parfum (32% Oil)',
  'Calabrian bergamot, chilled sea salt mist, Moroccan neroli, and crystalline solar musk.',
  'Engineered for those who thrive in sunlight, beach clubs, and high-energy summer days. BNB Elixir Blanc defies fresh fragrances by lasting over 16 hours on skin. It explodes with ultra-crisp Calabrian citrus, cooling sea spray minerals, and blossoming Moroccan neroli, grounded smoothly by clean cedarwood and second-skin ambroxan.',
  'Calabrian Bergamot, Frozen Grapefruit, Sea Salt',
  'Moroccan Neroli, Crushed Mint, Rosemary',
  'Solar Ambroxan, White Cedar, Clean Diamond Musk',
  '16+ Hours (Extreme Fresh Longevity)', 'Vibrant & Uplifting Sillage', 'Spring, Summer, Daytime',
  'Yacht Parties, Resort Wear, Daily Casual Luxury',
  'in_stock', 55, 1, 1,
  '/uploads/bnb-elixir-blanc.svg',
  'BNB Elixir Blanc Luxury Fresh Perfume | Boss N Buzz Originals',
  'Long-lasting luxury fresh perfume with Calabrian bergamot and diamond musk.'
),
(
  6, 1, 'BNB Sovereign Amber', 'bnb-sovereign-amber', 'Intoxication of Aged French Cognac & Smoked Ambergris',
  4699.00, 3699.00, 100, 'Extrait de Parfum (40% Oil)',
  'Oak barrel aged cognac, roasted hazelnut, Ceylon cinnamon, melted amber, and benzoin.',
  'A gourmand masterpiece for the true connoisseur. Sovereign Amber opens with an intoxicating swirl of oak barrel cognac and roasted hazelnuts, cascading into an opulent heart of Ceylon cinnamon and rich toffee, before drying down into warm benzoin resin, natural ambergris, and smoky French oakwood. Warm, welcoming, yet relentlessly sophisticated.',
  'French Cognac, Roasted Hazelnut, Mandarin Zest',
  'Ceylon Cinnamon, Praline, Labdanum Resin',
  'Sovereign Ambergris, Siam Benzoin, Smoked Oak Barrels',
  '22+ Hours', 'Warm Seductive Sillage', 'Late Nights, Winter & Autumn',
  'Exclusive Clubs, Festive Evenings, Luxury Gifting',
  'in_stock', 35, 1, 1,
  '/uploads/bnb-sovereign-amber.svg',
  'BNB Sovereign Amber Extrait de Parfum | Boss N Buzz Originals',
  'Indulgent French cognac and warm amber perfume from Boss N Buzz Originals.'
)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

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

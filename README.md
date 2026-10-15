# BOSS N BUZZ ORIGINALS (BNB)
### Indian Luxury Haute Parfumerie & Atelier Management System

> **Tagline:** *"BE THE BOSS. CREATE THE BUZZ."*  
> **Brand Aesthetic:** Gen-Z + Cinematic + Haute Luxury (Dark #050505, Rich Gold, Amber, Glassmorphism, Floating Particles, 3D Bottle Effects)

---

## 🌟 Key Features

### 1. Public Luxury Fragrance Boutique
- **Cinematic Landing Page (`/`)**:
  - Interactive 3D floating perfume bottle with mouse parallax physics and slow rotation.
  - Initial animated gold monogram (`BNB`) intro loader with velvet curtain reveal.
  - Three-Tier Olfactory Scent Pyramid (Top, Heart, Base notes) with interactive timeline breakdown.
  - Why BNB USP cards: 40% Extrait Oil Concentration, 24+ Hours Nuclear Longevity, Aged Assam Oud, Handcrafted Velvet Box.
  - Animated gold luxury running marquee.
  - Editorial Instagram-style Gen-Z reels/moodboard feed.
  - VIP customer reviews & testimonials slider.
  - Bespoke fragrance consultation lead capture form.
- **Shop / Haute Collection (`/shop`)**:
  - Live category filters: Unisex Extrait, Men Smoky Woods & Oud, Women Royal Florals.
  - Real-time search by notes, name, or description.
  - Interactive price range slider (₹2,500 - ₹6,000).
  - 3D tilt perfume cards with gold aura glow, direct WhatsApp enquiry, and quick Add to Cart.
- **Product Detail View (`/product/:slug`)**:
  - High-resolution gallery, olfactory pyramid tags, longevity and sillage meters.
  - "Add to Bag", instant "Buy Now with UPI", and sticky "Order on WhatsApp" button with pre-filled fragrance details.
  - Related/complementary perfumes showcase.
- **Cart & Slide-in Drawer**:
  - Global reactive cart stored persistently in localStorage.
  - Live quantity adjustment, subtotal, and complimentary luxury velvet box badge.
- **Direct UPI Payment & Checkout Modal**:
  - Instant dynamic UPI QR Code generator (works with **Google Pay, PhonePe, Paytm, BHIM, Cred**).
  - One-tap mobile UPI deep link (`upi://pay?pa=...&pn=...&am=...&tn=...`).
  - Copy UPI VPA button.
  - 12-digit UTR transaction ID submission field.
  - Confetti explosion (`canvas-confetti`) and luxury Order Confirmation screen with one-click WhatsApp receipt dispatch.
- **VIP Lead Capture System**:
  - Auto-triggers once per session after 10 seconds or on exit intent.
  - Offers a 15% VIP welcome voucher and custom scent profiling.
  - Anti-spam honeypot protection & IP-based rate limiting.
- **Interactive Micro-Interactions**:
  - Magnetic gold dot & trailing ring cursor.
  - Ambient floating gold dust canvas background.
  - Floating WhatsApp concierge button with pulsating gold aura.

---

### 2. Atelier Admin Management Panel (`/admin`)
- **Secure Authentication**:
  - Login portal with luxury dark & gold design.
  - Secure PHP session and Bearer token handling with Bcrypt password hashing.
  - Default credentials:
    - **Username:** `admin` (or `admin@bossnbuzz.com`)
    - **Password:** `admin123`
- **Atelier Dashboard (`/admin/dashboard`)**:
  - Real-time metric cards: Total Sales (₹), Total Orders, Pending UPI Verifications, Total Leads, Active Fragrances.
  - Recent orders list with customer names, amounts, and statuses.
  - Recent VIP leads list with one-click action triggers.
- **Products Catalog CRUD (`/admin/products`)**:
  - Add new perfumes, edit existing perfumes, delete from archives.
  - Drag-and-drop / file upload for bottle images directly to `/backend/uploads`.
  - Toggle "Featured" badge and "Active" status instantly reflected on the public boutique.
  - Full olfactory field control: top notes, heart notes, base notes, longevity, sillage, sizes, pricing, and discount prices.
- **Orders & UPI Verification Manager (`/admin/orders`)**:
  - Complete orders table displaying Order Number, Customer, Phone, Items, Total Amount, and 12-digit UPI UTR reference.
  - Match UTRs with your bank account and update payment status to *"Verified / Paid"* with one click.
  - Update fulfillment status: *Placed → Processing → Dispatched → Delivered*.
  - Direct WhatsApp customer trigger with pre-filled order status message.
- **Leads & Consultation Manager (`/admin/leads`)**:
  - Table of all VIP consultation inquiries with customer name, phone, email, fragrance of interest, message, and source page.
  - Status updates: *New → Contacted → Converted → Closed*.
  - One-click "Call" and "WhatsApp" buttons.
  - **Export Leads to CSV** button downloading a clean spreadsheet.
- **Brand & Store Settings (`/admin/settings`)**:
  - Change active UPI ID / VPA (e.g. `bossnbuzz@okaxis`) and Merchant Name.
  - Update WhatsApp concierge phone number, contact email, and flagship atelier address.
  - Change Admin password.

---

## 📁 Project Directory Structure

```
C:\flutter projects\boss-n-buzz/
├── backend/
│   ├── api/
│   │   └── index.php              # Central REST API Router
│   ├── config/
│   │   ├── database.php           # PDO MySQL Connection
│   │   ├── cors.php               # CORS & Headers
│   │   └── auth.php               # Session & Bearer Auth Helper
│   ├── controllers/
│   │   ├── ProductController.php  # Public & Admin Products CRUD
│   │   ├── LeadController.php     # Lead Capturing & CSV Export
│   │   ├── OrderController.php    # UPI Order Creation & UTR Submission
│   │   ├── AdminController.php    # Admin Login, Logout, Stats & Uploads
│   │   └── SettingsController.php # Brand & UPI Settings Management
│   ├── database/
│   │   └── schema.sql             # Complete MySQL Schema & 6 Seed Perfumes
│   ├── uploads/                   # Uploaded & Seed Luxury Perfume Visuals
│   ├── router.php                 # PHP Built-in Server Router
│   └── .htaccess                  # Apache Configuration for Production
│
├── frontend/
│   ├── public/
│   │   └── bnb-monogram.svg       # Brand Monogram Favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomCursor.jsx   # Magnetic Gold Cursor
│   │   │   ├── ParticlesBackground.jsx # Floating Gold Dust Canvas
│   │   │   ├── Navbar.jsx         # Sticky Glass Navigation
│   │   │   ├── Footer.jsx         # Haute Footer & Links
│   │   │   ├── ProductCard.jsx    # 3D Tilt Card with Quick Actions
│   │   │   ├── CartDrawer.jsx     # Slide-Over Cart Bag
│   │   │   ├── UpiPaymentModal.jsx # Dynamic UPI QR & UTR Verification Modal
│   │   │   ├── LeadModal.jsx      # VIP 15% Scent Consultation Popup
│   │   │   └── IntroLoader.jsx    # Cinematic Monogram Entry Screen
│   │   ├── context/
│   │   │   ├── CartContext.jsx    # Persistent Shopping Bag Context
│   │   │   └── AuthContext.jsx    # Admin Session & Token Context
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Cinematic Landing Hero & Storytelling
│   │   │   ├── Shop.jsx           # Catalog with Category & Price Filters
│   │   │   ├── ProductDetail.jsx  # Olfactory Pyramid & Buy Now
│   │   │   ├── About.jsx          # Brand Origin & 40% Oil Philosophy
│   │   │   ├── Contact.jsx        # Atelier Hours, Form & Map Mock
│   │   │   ├── OrderSuccess.jsx   # Order Placed Screen with WhatsApp Trigger
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx     # Staff Login Screen
│   │   │       ├── AdminLayout.jsx    # Admin Navigation Sidebar Layout
│   │   │       ├── Dashboard.jsx      # Real-Time Store Statistics
│   │   │       ├── ProductsManager.jsx# Perfumes CRUD & Image Upload
│   │   │       ├── LeadsManager.jsx   # Leads Table & CSV Export
│   │   │       ├── OrdersManager.jsx  # Orders Table & UPI UTR Verifier
│   │   │       └── SettingsManager.jsx# UPI VPA, Copy & Password Manager
│   │   ├── services/
│   │   │   └── api.js             # API Client & Image Helper
│   │   ├── App.jsx                # Application Routing
│   │   ├── index.css              # Custom Luxury CSS & Gold Glow Utilities
│   │   └── main.jsx               # React DOM Entrypoint
│   ├── index.html                 # Luxury Google Fonts & Meta Tags
│   ├── package.json
│   ├── tailwind.config.js         # Custom Brand Color Palette & Fonts
│   ├── postcss.config.js
│   └── vite.config.js
└── README.md
```

---

## 🚀 Step-by-Step Local Setup Guide

### Prerequisites
1. **PHP 8.0+**
2. **MySQL / MariaDB** (e.g. XAMPP)
3. **Node.js 18+** and **npm**

---

### Step 1: Database Setup
1. Start your MySQL service (e.g. in XAMPP Control Panel).
2. Open terminal and run:
```bash
mysql -u root -p < "C:\flutter projects\boss-n-buzz\backend\database\schema.sql"
```
*(Or open phpMyAdmin at `http://localhost/phpmyadmin`, create database `bossnbuzz_db`, and import `backend/database/schema.sql`)*.

This will automatically create:
- All 8 tables: `admins`, `categories`, `products`, `product_images`, `leads`, `orders`, `order_items`, `settings`
- Default admin: `admin` / `admin123`
- 6 initial luxury perfumes with complete descriptions and notes:
  1. **BNB Gold Intense** (Extrait de Parfum - 40% Oil)
  2. **BNB Noir Absolu** (Extrait de Parfum - 38% Oil)
  3. **BNB Royal Oud Sovereign** (Pure Parfum Extrait - 42% Oil)
  4. **BNB Velvet Rose & Saffron** (Extrait de Parfum - 35% Oil)
  5. **BNB Elixir Blanc** (Extrait de Parfum - 32% Oil)
  6. **BNB Sovereign Amber** (Extrait de Parfum - 40% Oil)

---

### Step 2: Start the Backend PHP Server
In terminal:
```bash
cd "C:\flutter projects\boss-n-buzz\backend"
php -S 127.0.0.1:8000 router.php
```
Your REST API is now live at: `http://127.0.0.1:8000/api`

---

### Step 3: Start the Frontend React (Vite) App
In a second terminal:
```bash
cd "C:\flutter projects\boss-n-buzz\frontend"
npm install
npm run dev
```
Open your browser at:  
👉 **Public Store:** `http://127.0.0.1:5173/`  
👉 **Atelier Admin Panel:** `http://127.0.0.1:5173/admin`

---

## 🌐 Production Deployment Guide (cPanel / Hostinger / Apache)

### Deploying the Backend:
1. Upload all contents of the `/backend` folder into your server directory (e.g. `public_html/api` or a subdomain `api.bossnbuzz.com`).
2. Update database credentials in `backend/config/database.php`:
   ```php
   private static $host = 'localhost';
   private static $db_name = 'your_cpanel_db_name';
   private static $username = 'your_cpanel_user';
   private static $password = 'your_cpanel_password';
   ```
3. Ensure the `backend/uploads/` directory has write permissions (`chmod 755` or `775`).
4. Import `schema.sql` via phpMyAdmin on your hosting cPanel.

### Deploying the Frontend:
1. In `frontend/src/services/api.js`, update the API base URL to your production domain:
   ```javascript
   const API_BASE_URL = 'https://api.yourdomain.com/api';
   ```
2. Run production build:
   ```bash
   npm run build
   ```
3. Upload all contents of `frontend/dist/` into your root web folder (`public_html`).
4. Ensure your server has a fallback rewrite rule for Single Page Apps (SPA) to direct routes to `index.html`.

---

## 🎨 How to Customize Brand Identity

- **Colors:** Open `frontend/tailwind.config.js` and modify the `gold` (`#D4AF37`, `#F5D77A`) and `dark` (`#050505`) values.
- **Logo / Monogram:** Replace `frontend/public/bnb-monogram.svg` with your custom vector emblem.
- **UPI ID & Merchant Details:** Go to `/admin/settings` in the admin panel and update your active UPI VPA (e.g. `yourname@okhdfcbank`). It instantly updates on the QR code and mobile one-tap buttons across the entire website!
- **Admin Password:** Change anytime from the **Store Settings** tab in the admin panel.

---

© 2026 BOSS N BUZZ ORIGINALS. Handcrafted in India.

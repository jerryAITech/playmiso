# 🎲 PlayMiso – Discover the Magic of Play

A full-stack, SEO-optimized, mobile-first Toy eCommerce platform with a native mobile app feel (PWA bottom dock), Cash on Delivery (COD) checkout, Promo Coupons engine, User Authentication with saved delivery addresses, Per-Product SEO, YouTube/MP4 demo video player, Touch-directed Roaming Toy Car, and a White-Theme Admin Portal.

---

## 🔑 Login Credentials

> **Note:** Demo credentials have been removed from the public UI and are documented here for development, testing, and store operations.

### 🛡️ 1. Store Administrator Account
* **Email:** `admin@playmiso.in` (or `admin@toyjoy.in`)
* **Password:** `admin123`
* **Role:** `ADMIN` (Full access to Dashboard, Product Inventory, Dedicated Add Toy Page, COD Orders, Categories, Promo Coupons, Dynamic Banners, and SEO Meta Portal)
* **Admin Portal URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
* **Add New Toy Page:** [http://localhost:3000/admin/products/new](http://localhost:3000/admin/products/new)

### 👤 2. Sample Customer Account
* **Email:** `rahul@example.com`
* **Password:** `user123`
* **Role:** `USER` (Includes pre-saved delivery addresses and order history)
* **Customer Profile URL:** [http://localhost:3000/profile](http://localhost:3000/profile)

*(You can also register any new customer account anytime via the [Sign Up Page](http://localhost:3000/signup).)*

---

## 🗄️ Step-by-Step Guide: How to Connect & View Database Locally

The application uses **SQLite Database** managed through **Prisma ORM**. The entire database is stored in a lightweight, self-contained local file: `prisma/dev.db`.

```
toyEcommerce/
├── prisma/
│   ├── schema.prisma   # Database Models & Tables Definition
│   ├── seed.ts         # Sample Data Seeder
│   └── dev.db          # Actual SQLite Database File on Disk
└── .env                # DATABASE_URL="file:./dev.db"
```

### 1. 🖥️ Method 1: Open Visual Database GUI (Recommended - 1 Command)
Run the official visual web GUI to view, search, edit, and add data to all database tables:
```powershell
npx prisma studio
```
* Opens automatically in your browser at: **[http://localhost:5555](http://localhost:5555)**
* You will see all live tables:
  * `User` (Customer and Admin accounts, hashed passwords)
  * `Address` (Multiple customer delivery addresses)
  * `Order` & `OrderItem` (Cash on Delivery orders and item breakdowns)
  * `Product` (Toy catalog, prices, MRP, stock, multiple images, demo video URLs, and custom SEO)
  * `Category` (Toy categories and slugs)
  * `Coupon` (Promo discount codes and rules)
  * `Banner` (Dynamic homepage hero slides and gradient themes)
  * `SeoSetting` (Global SEO meta tags)

---

### 2. 🧰 Method 2: Connect via External Desktop Database Tools

You can open and inspect `prisma/dev.db` using any of these popular free database tools:

#### Option A: DB Browser for SQLite (Free Desktop GUI)
1. Download from [https://sqlitebrowser.org/](https://sqlitebrowser.org/)
2. Open DB Browser ➔ Click **"Open Database"**
3. Select file path: `D:\toyEcommerce\prisma\dev.db`
4. Click the **"Browse Data"** tab to view or edit rows.

#### Option B: VS Code / IDE Extensions
1. Search for **"SQLite Viewer"** or **"Prisma"** in VS Code Extensions.
2. Click directly on `prisma/dev.db` in your file explorer to view tables inline.

#### Option C: DBeaver / TablePlus
1. Create New Connection ➔ Select **SQLite**
2. Choose database file path: `D:\toyEcommerce\prisma\dev.db` ➔ Connect.

---

### 3. 🔄 Useful Database Commands

| Task | Command |
| :--- | :--- |
| **Start Development Server** | `npm run dev` |
| **Open Visual Database GUI** | `npx prisma studio` |
| **Apply Schema Changes to DB** | `npx prisma db push` |
| **Regenerate Prisma Client** | `npx prisma generate` |
| **Reset & Re-seed Sample Data** | `npx tsx prisma/seed.ts` |

---

### 4. 🌐 Switching to PostgreSQL / Supabase / Neon in Production (Optional)

If you deploy to production on Vercel/Cloud and want a cloud PostgreSQL database:
1. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. In `.env`, paste your cloud connection string:
   ```env
   DATABASE_URL="postgres://user:password@your-supabase-or-neon-host.com:5432/toyjoy"
   ```
3. Run `npx prisma db push` to create all tables in cloud PostgreSQL!

---

## 🎟️ Active Promo Coupons

| Coupon Code | Discount Offer | Rules |
| :--- | :--- | :--- |
| **`TOYJOY10`** | **10% OFF** | Valid on all orders (Max ₹300 discount) |
| **`FLAT100`** | **Flat ₹100 OFF** | Valid on orders above ₹699 |
| **`FESTIVE20`** | **20% OFF** | Valid on orders above ₹999 (Max ₹500 discount) |
| **`SUPERKID`** | **Flat ₹250 OFF** | Valid on orders above ₹1,499 |

---

## 📊 Excel / CSV Bulk Product Import & Export Hub (`/admin/products/import-export`)
👉 **[http://localhost:3000/admin/products/import-export](http://localhost:3000/admin/products/import-export)**

Manage your entire toy catalog in bulk using spreadsheets:

* **📥 Download Pre-Formatted Sample Excel Template**:
  * 1-click download of `playmiso_products_sample_template.csv` containing pre-filled sample rows (STEM kits, RC cars, plushies, board games) ready to edit in Microsoft Excel or Google Sheets.
* **📤 1-Click Export to Excel (.csv)**:
  * Export the entire live catalog into an Excel-compatible CSV file with UTF-8 BOM encoding. Includes all fields: Title, Category, Price, CompareAtPrice (MRP), Discount %, Stock, Age Group, Brand, Description, Safety Info, Multiple Image URLs, Demo Video URL, Meta Titles, and SEO tags.
* **📥 Bulk Import Spreadsheets**:
  * Drag & drop your completed Excel/CSV file with real-time preview (first 5 rows parsed), automatic category creation if not found, price validation, and batch database creation with 1 click!

---

## 📱 100% Mobile, Tablet & Desktop Responsive

* **Mobile Phones (< 640px)**: Native app feel with floating bottom dock (Home, Categories, Bag, Wishlist, Profile), sticky bottom 1-tap "Buy Now (COD)" bar on product pages, touch-optimized swiping chips.
* **Tablets (640px - 1024px)**: 3-column toy grid, responsive split layout for checkout, mobile responsive admin sidebar.
* **Desktop (1024px+)**: 4-column wide grid, sticky admin sidebar, multi-angle media galleries with instant video player.
👉 **[http://localhost:3000/admin/theme](http://localhost:3000/admin/theme)**

The store includes a full-stack **Design & Festive Sale Control Center**:

1. **🎆 Festive Season & Sale Logo Manager**:
   * **Diwali Dhamaka Sale**: Sets festive Diya logo `🪔`, golden sale ribbon, and "50% OFF" sale badges.
   * **Christmas Wonderland**: Sets Santa logo `🎅` with holiday holiday ribbons.
   * **New Year Mega Bash**: Sets fireworks logo `🎆` with neon celebration banners.
   * **Holi Color Carnival**: Sets color splash logo `🎨` with rainbow ribbons.
   * **Custom Sale Campaigns**: Enter any custom festive emoji, custom sale headline, and announcement ribbon.
2. **🔤 Font Family Selector**: Choose between Plus Jakarta Sans, Outfit, Poppins, Fredoka, Quicksand.
3. **🎨 Primary Brand Color**: Pick vibrant accent colors (Sunset Orange, Hot Pink, Electric Turquoise, Cyber Yellow, Royal Purple, Emerald).
4. **🔘 Button Styles & Corner Radius**: 3D Bouncy Press, Pill Rounded, Extra Bubbly (24px) corners.

---

## 🏎️ Autonomous Screen-Boundary Roaming Car

* The interactive toy car cruises continuously across the website.
* **Screen-Edge Bouncing**: Whenever the car hits any border of the screen (`left`, `right`, `top`, `bottom`), it realistically bounces, steers smoothly into the new angle, and continues driving without any cursor dependence!

---

## 🌐 SEO Management & Per-Product SEO

### 1. Per-Product Custom SEO & Google Search Optimization
Each individual toy product has full SEO controls (available on both **Add Toy** `/admin/products/new` and **Edit Toy** `/admin/products/edit/[id]`):
* **Custom Meta Title**: Google search headline (with 60-char counter).
* **Custom Meta Description**: Google snippet summary (with 160-char counter).
* **Target Search Keywords**: Specific search terms for the toy.
* **OpenGraph Social Share Image**: WhatsApp / Facebook share thumbnail.
* **🪄 1-Click "Auto-Generate SEO" Assistant**: Instantly crafts an optimized Google Title, Description, and Keywords from the product's title, price, and category.
* **Live Google SERP Preview Card**: Real-time interactive preview of the product card on Google Mobile & Desktop search.

### 2. Global SEO & Social Meta Control Center (`/admin/seo`)
👉 **[http://localhost:3000/admin/seo](http://localhost:3000/admin/seo)**

* Global Site Title, Meta Description, Keywords, and OpenGraph Image editor.
* Direct inspection for [`sitemap.xml`](http://localhost:3000/sitemap.xml) and [`robots.txt`](http://localhost:3000/robots.txt).
* Built-in JSON-LD structured data schema for `Product`, `Offer`, `AggregateRating`, and `Brand`.

---

## 📱 Mobile Native App Feel

* **Bottom App Dock**: Floating mobile navigation for *Home, Categories, Bag (with live badge), Wishlist, Profile*.
* **Sticky Purchase Dock**: Fixed bottom "Add to Bag" & "Buy Now (COD)" on product pages for thumb-friendly 1-tap checkout.
* **Story-style Category Circles**: Swipeable horizontal bubble chips.
* **1-Click Checkout with Saved Addresses**: Select from pre-saved addresses with automatic COD validation.

---

## 🛠️ Tech Stack & Architecture

* **Frontend & Backend**: Next.js 15 (App Router, Server-Side Rendering, React 19)
* **Styling & Fonts**: Tailwind CSS, Plus Jakarta Sans & Outfit (Google Fonts), Lucide Icons
* **Database & ORM**: SQLite + Prisma ORM (`prisma/schema.prisma` and `prisma/dev.db`)
* **Authentication**: JWT in HTTP-only cookies + bcryptjs password encryption
* **Payment**: Cash on Delivery (COD)

---

## 🚀 How to Run the Project

### 1. Start Development Server
```bash
npm run dev
```
* Storefront: **[http://localhost:3000](http://localhost:3000)**
* Admin Panel: **[http://localhost:3000/admin](http://localhost:3000/admin)**
* Add Toy Page: **[http://localhost:3000/admin/products/new](http://localhost:3000/admin/products/new)**
* SEO Portal: **[http://localhost:3000/admin/seo](http://localhost:3000/admin/seo)**

### 2. View Visual Database (Prisma Studio)
```bash
npx prisma studio
```
Opens GUI at **[http://localhost:5555](http://localhost:5555)**.

# 🎲 PlayMiso – Discover the Magic of Play

A full-stack, SEO-optimized, mobile-first Toy eCommerce platform with a native mobile app feel (PWA bottom dock), 1-Tap PIN Authentication, Cash on Delivery (COD) checkout, Promo Coupons engine, User Authentication with saved delivery addresses, Per-Product SEO, YouTube/MP4 demo video player, Dedicated File Upload API with 30s video duration check, Free WhatsApp Order Receipts, and a White-Theme Admin Portal.

---

## 🔑 Login Credentials & Quick PIN Access

> **Note:** For maximum convenience, both Store Admins and Customers can log in using either standard **Email/Password** OR a **4-Digit Fast PIN**!

### 🛡️ 1. Store Administrator Account
* **⚡ Master Admin Quick PIN:** `2026` *(Enter this 4-digit PIN on `/admin` or `/login` for instant 1-tap admin access!)*
* **Email:** `admin@playmiso.com`
* **Password:** `adminpassword123`
* **Role:** `ADMIN` (Full access to Performance Dashboard, Product Inventory, Add Toy Page with File Upload, COD Orders with WhatsApp trigger, Categories, Promo Coupons, Dynamic Banners, Theme Logo, and SEO Portal)
* **Admin Portal URL:** [https://playmiso.vercel.app/admin](https://playmiso.vercel.app/admin)
* **Add New Toy Page:** [https://playmiso.vercel.app/admin/products/new](https://playmiso.vercel.app/admin/products/new)

---

### 👤 2. Sample Customer Account
* **⚡ Customer Quick PIN:** `1234`
* **Email:** `parent@playmiso.com`
* **Password:** `parentpassword123`
* **Role:** `USER` (Includes pre-saved delivery addresses, wishlist, and order history)
* **Customer Profile URL:** [https://playmiso.vercel.app/profile](https://playmiso.vercel.app/profile)

*(Any customer can also set their own 4-digit PIN during registration on the [Sign Up Page](https://playmiso.vercel.app/signup).)*

---

## 📜 Legal & Store Policy Pages

* 🛡️ **Privacy Policy:** [https://playmiso.vercel.app/privacy-policy](https://playmiso.vercel.app/privacy-policy)
* 📄 **Terms of Service:** [https://playmiso.vercel.app/terms-of-service](https://playmiso.vercel.app/terms-of-service)
* 🚚 **Shipping & Returns:** [https://playmiso.vercel.app/shipping-returns](https://playmiso.vercel.app/shipping-returns)

---

## 🗄️ Database Management & Local Setup

The application uses **SQLite Database** managed through **Prisma ORM**. The entire database is stored in a lightweight local file: `prisma/dev.db`.

### 1. 🖥️ Open Visual Database GUI
```powershell
npx prisma studio
```
* Opens in your browser at: **[http://localhost:5555](http://localhost:5555)**

### 2. 🔄 Useful Development Commands

| Task | Command |
| :--- | :--- |
| **Start Development Server** | `npm run dev` |
| **Open Visual Database GUI** | `npx prisma studio` |
| **Type Check Codebase** | `npx tsc --noEmit` |
| **Apply Schema Changes to DB** | `npx prisma db push` |
| **Regenerate Prisma Client** | `npx prisma generate` |

---

## 📱 Mobile & Tablet App Navigation Dock
* Automatically adapts for all Smartphones, iPhones, iPads, and Android tablets (`lg:hidden`).
* 5 App Dock Tabs: 🏠 Home, 🔍 Explore, 🛍️ Bag (`/cart`), ❤️ Wishlist, 👤 Profile.
* Full PWA Standalone Manifest (`src/app/manifest.ts`) for browser-bar-free app experience.

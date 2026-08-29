# 🚀 PlayMiso – Free 100% Zero-Cost Deployment & Real-User Testing Guide

This guide gives you **2 fast options** to share and test PlayMiso with real users on mobile phones, tablets, and computers:

---

## ⚡ Option 1: Instant Public HTTPS Link in 30 Seconds (Best for Immediate Testing with Real Users)

If you want to share the website **right now** with friends, family, or test users without setting up cloud accounts or migrating databases:

### Step 1: Start your local server
Open your terminal and make sure the app is running:
```powershell
npm run dev
```

### Step 2: Open a free public HTTPS tunnel
Open a **second terminal window** in PowerShell and run:
```powershell
npx localtunnel --port 3000
```
*(Or use Cloudflare Quick Tunnel if installed: `cloudflared tunnel --url http://localhost:3000`)*

### Step 3: Share the Generated Link
You will get an instant public URL like:
`https://playmiso-demo.loca.lt`

* Anyone on any mobile phone, iPhone, tablet, or desktop anywhere in the world can open this link and test all features:
  * Browse toys & categories
  * Place real Cash on Delivery (COD) test orders
  * Submit customer star reviews
  * Test Admin Theme customizer (`/admin/theme`) & Excel import/export (`/admin/products/import-export`)

---

## 🌐 Option 2: Permanent 24/7 Free Cloud Deployment (Vercel + GitHub)

To have a permanent free URL (e.g. `https://playmiso.vercel.app`) running 24/7 in the cloud:

### Step 1: Push your Code to GitHub
1. Create a free GitHub repository named `playmiso` on [github.com](https://github.com).
2. Initialize and push your code:
```powershell
git init
git add .
git commit -m "PlayMiso full-stack release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/playmiso.git
git push -u origin main
```

---

### Step 2: Deploy to Vercel (100% Free Forever)
1. Go to [vercel.com](https://vercel.com) and click **"Sign Up"** (using your GitHub account).
2. Click **"Add New Project"** and select your `playmiso` GitHub repository.
3. In **Environment Variables**, add:
   * `JWT_SECRET`: `playmiso_super_secret_jwt_key_2026_kid_safe`
   * `NEXT_PUBLIC_SITE_URL`: `https://playmiso.vercel.app`
4. Click **"Deploy"**!
5. In ~60 seconds, your site is live with a free global SSL certificate.

---

## 🗄️ Database Options for Cloud Deployment

### A. Free Cloud PostgreSQL (Recommended for Vercel)
Vercel is serverless, so for permanent cloud multi-user data:
1. Create a 100% free serverless database on [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2. Copy your connection string (e.g. `postgresql://...`).
3. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Run `npx prisma db push` to push tables in 5 seconds!

### B. Persistent SQLite Hosting (Render / Railway)
If you want to keep SQLite (`dev.db`) exactly as is:
* Deploy to [Render.com](https://render.com) Web Service with a persistent disk for SQLite!

---

## 🧪 User Acceptance Testing (UAT) Checklist for Testers

Share this quick test flow with your real users:
1. **Mobile Browsing**: Open on iPhone / Android and test the floating bottom app dock.
2. **Instant Search**: Type *"robot"* or *"car"* in the search bar.
3. **Wishlist**: Tap the heart icon on any toy and open `/wishlist`.
4. **COD Checkout**: Add a toy to bag, apply promo code `PLAYMISO10`, and place a COD order.
5. **WhatsApp Confirmation**: Click the WhatsApp order receipt button on the confirmation page.
6. **Customer Review**: Write a 5-star review with comment on any toy detail page.
7. **Admin Portal**: Open `/admin/theme` and switch between Diwali `🪔`, Christmas `🎅`, and New Year `🎆` themes!

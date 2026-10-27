# TAGE — Architecture & E-Commerce Platform

A production-ready e-commerce platform built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Zod**, and **Zustand**. Designed for seamless integration with a **Spring Boot** backend.

---

## 1. Project Architecture

The codebase follows the official Next.js App Router project structure with a clear separation of concerns, preparing the system for both customer storefront and back-office admin operations within the same source tree:

```
ling-tage/
├── public/
│   ├── images/
│   │   ├── home/           # Editorial hero & lifestyle photography
│   │   ├── collection/     # Category edit lookbooks
│   │   ├── blog/           # Editorial banners
│   │   └── products/       # Multi-angle garment product photography (16 products)
│   └── logo/
│       ├── tage_logo.png   # TAGE signature mark
│       └── tage_banner.png # TAGE horizontal banner
├── src/
│   ├── app/
│   │   ├── (shop)/         # Customer Storefront (shares header, footer, cart drawer)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Homepage (Hero carousel, New Arrivals, Editorial)
│   │   │   ├── shop/page.tsx               # Product Catalog (filters, sorting, pagination)
│   │   │   ├── product/[slug]/page.tsx     # Product Detail (multi-angle gallery, variants, stock, SEO)
│   │   │   ├── cart/page.tsx               # Shopping Cart (coupons, free shipping threshold)
│   │   │   ├── checkout/page.tsx           # Checkout (Zod validation, COD / Online Card, PayOS)
│   │   │   ├── checkout/success/page.tsx   # Order confirmation & confirmation email trigger
│   │   │   └── account/                    # Customer account, order history, address book
│   │   │       ├── page.tsx
│   │   │       ├── orders/page.tsx
│   │   │       └── addresses/page.tsx
│   │   ├── auth/           # Authentication portal
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── admin/          # Back-office Admin Studio (protected by Middleware)
│   │   │   ├── layout.tsx                  # Dedicated Admin sidebar & session manager
│   │   │   ├── page.tsx                    # Revenue, order volume & low stock dashboard
│   │   │   ├── products/page.tsx           # Product catalog, size variant & stock manager
│   │   │   ├── orders/page.tsx             # Order fulfillment & status updater
│   │   │   └── customers/page.tsx          # Customer lifetime value & roster
│   │   ├── api/
│   │   │   ├── webhooks/payos/route.ts     # PayOS / VietQR payment webhook handler
│   │   │   └── upload/route.ts             # Media upload handler
│   │   ├── layout.tsx                      # Root layout, Google Inter font, SEO metadata
│   │   ├── globals.css                     # Custom design system tokens, typography & animations
│   │   ├── not-found.tsx                   # Brand 404 page
│   │   └── sitemap.ts                      # Dynamic XML sitemap for SEO
│   ├── components/
│   │   ├── ui/             # Reusable primitives (Accordion, Crumbs, Field, Icons, SectionHead)
│   │   ├── layout/         # Header, Footer, MobileMenu, SearchOverlay
│   │   ├── product/        # ProductCard, HeroCarousel, ProductCarousel, FilterDrawer, SortDropdown
│   │   ├── cart/           # CartSummary (coupon calculations, free shipping progress)
│   │   └── checkout/       # OrderSummaryAside
│   ├── service/            # Business Logic layer (strictly decoupled from presentation)
│   │   ├── products/       # actions.ts, queries.ts, schema.ts, store.ts, mock.ts
│   │   ├── cart/           # actions.ts, schema.ts, store.ts
│   │   ├── orders/         # actions.ts, schema.ts, service.ts
│   │   └── auth/           # actions.ts, schema.ts, service.ts, store.ts
│   ├── config/
│   │   ├── db.ts           # Spring Boot REST API client + 2s simulated debounce
│   │   ├── auth.ts         # Role definitions & cookie auth configuration
│   │   ├── mail.ts         # Email notification builder
│   │   ├── payment.ts      # COD & Online payment configuration
│   │   └── utils.ts        # Currency formatting, shipping fees, slugify, debounce delays
│   ├── hooks/
│   │   ├── useDebounce.ts  # Generic debounce hook for search and API triggers
│   │   └── useCart.ts      # Hydrated cart hook with shipping threshold helpers
│   ├── types/
│   │   └── index.ts        # Domain TypeScript definitions (Product, Variant, Order, User, etc.)
│   └── middleware.ts       # Edge middleware guarding `/admin` routes based on role cookie
├── .env.local
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 2. Spring Boot Backend Integration

The application includes an API client in `src/config/db.ts`:

- **Mock Mode (Default)**:
  `NEXT_PUBLIC_USE_MOCK_API=true`
  All service queries and actions simulate calling the Spring Boot backend with a **2000ms (2s) debounce / latency**, faithfully rendering realistic loading states and async updates.
- **Connecting to Real Spring Boot Backend**:
  Update `.env.local`:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
  NEXT_PUBLIC_USE_MOCK_API=false
  ```
  The `springBootFetch` client will automatically switch to querying the Spring Boot REST endpoints:
  - `GET /products`, `GET /products/{id}`, `GET /products/search`
  - `POST /auth/login`, `POST /auth/register`
  - `POST /orders`, `PATCH /admin/orders/{id}/status`
  - `POST /admin/products`, `PATCH /admin/products/{id}/variants/{variantId}/stock`

---

## 3. State Management & Data Validation

- **Zod Schemas** (`src/service/*/schema.ts`):
  Every form and server-bound payload is strictly validated with Zod before submission:
  - `CheckoutFormSchema`
  - `UpsertProductSchema`
  - `ProductVariantSchema`
  - `LoginSchema` & `RegisterSchema`
  - `ProductFilterSchema`
- **Zustand Stores**:
  - `useCartStore`: Persistent client cart with guest storage, coupon code support (`TAGE10` for 10% off), variant stock verification, and automatic guest-to-account cart merging upon login.
  - `useProductStore`: Client catalog cache with admin mutations (add product, update variant inventory, delete product) updating customer storefront views instantly.
  - `useAuthStore`: Role and authentication state syncing with cookies for `middleware.ts`.
  - `useOrderStore`: Order history tracking and admin status transitions (`PENDING_PAYMENT`, `PAID`, `SHIPPING`, `COMPLETED`, `CANCELLED`).

---

## 4. Admin Access & Demo Credentials

To test the Admin portal (`/admin`):
- Go to `/auth/login`
- Click the **"Auto Fill"** helper button or enter:
  - **Email**: `admin@tage.studio`
  - **Password**: `password123`
- The system will grant the `ADMIN` role cookie and redirect to the **Admin Studio**, unlocking:
  - Inventory variant stock editor
  - Order fulfillment workflow
  - Storefront catalog additions

# TAGE — Architecture & E-Commerce Platform

A production-ready e-commerce platform built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Zod**, and **Zustand**. Designed for seamless integration with a **Spring Boot** backend.

---

## 1. Project Architecture

The codebase follows the official Next.js App Router project structure with a clear separation of concerns, preparing the system for both customer storefront and back-office admin operations within the same source tree:

```
ling-tage/
├── public/
│   ├── images/
│   │   ├── home/           # Editorial hero & lifestyle photography
│   │   ├── collection/     # Category edit lookbooks
│   │   ├── blog/           # Editorial banners
│   │   └── products/       # Multi-angle garment product photography (16 products)
│   └── logo/
│       ├── tage_logo.png   # TAGE signature mark
│       └── tage_banner.png # TAGE horizontal banner
├── src/
│   ├── app/
│   │   ├── (shop)/         # Customer Storefront (shares header, footer, cart drawer)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Homepage (Hero carousel, New Arrivals, Editorial)
│   │   │   ├── shop/page.tsx               # Product Catalog (filters, sorting, pagination)
│   │   │   ├── product/[slug]/page.tsx     # Product Detail (multi-angle gallery, variants, stock, SEO)
│   │   │   ├── cart/page.tsx               # Shopping Cart (coupons, free shipping threshold)
│   │   │   ├── checkout/page.tsx           # Checkout (Zod validation, COD / Online Card, PayOS)
│   │   │   ├── checkout/success/page.tsx   # Order confirmation & confirmation email trigger
│   │   │   └── account/                    # Customer account, order history, address book
│   │   │       ├── page.tsx
│   │   │       ├── orders/page.tsx
│   │   │       └── addresses/page.tsx
│   │   ├── auth/           # Authentication portal
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── admin/          # Back-office Admin Studio (protected by Middleware)
│   │   │   ├── layout.tsx                  # Dedicated Admin sidebar & session manager
│   │   │   ├── page.tsx                    # Revenue, order volume & low stock dashboard
│   │   │   ├── products/page.tsx           # Product catalog, size variant & stock manager
│   │   │   ├── orders/page.tsx             # Order fulfillment & status updater
│   │   │   └── customers/page.tsx          # Customer lifetime value & roster
│   │   ├── api/
│   │   │   ├── webhooks/payos/route.ts     # PayOS / VietQR payment webhook handler
│   │   │   └── upload/route.ts             # Media upload handler
│   │   ├── layout.tsx                      # Root layout, Google Inter font, SEO metadata
│   │   ├── globals.css                     # Custom design system tokens, typography & animations
│   │   ├── not-found.tsx                   # Brand 404 page
│   │   └── sitemap.ts                      # Dynamic XML sitemap for SEO
│   ├── components/
│   │   ├── ui/             # Reusable primitives (Accordion, Crumbs, Field, Icons, SectionHead)
│   │   ├── layout/         # Header, Footer, MobileMenu, SearchOverlay
│   │   ├── product/        # ProductCard, HeroCarousel, ProductCarousel, FilterDrawer, SortDropdown
│   │   ├── cart/           # CartSummary (coupon calculations, free shipping progress)
│   │   └── checkout/       # OrderSummaryAside
│   ├── service/            # Business Logic layer (strictly decoupled from presentation)
│   │   ├── products/       # actions.ts, queries.ts, schema.ts, store.ts, mock.ts
│   │   ├── cart/           # actions.ts, schema.ts, store.ts
│   │   ├── orders/         # actions.ts, schema.ts, service.ts
│   │   └── auth/           # actions.ts, schema.ts, service.ts, store.ts
│   ├── config/
│   │   ├── db.ts           # Spring Boot REST API client + 2s simulated debounce
│   │   ├── auth.ts         # Role definitions & cookie auth configuration
│   │   ├── mail.ts         # Email notification builder
│   │   ├── payment.ts      # COD & Online payment configuration
│   │   └── utils.ts        # Currency formatting, shipping fees, slugify, debounce delays
│   ├── hooks/
│   │   ├── useDebounce.ts  # Generic debounce hook for search and API triggers
│   │   └── useCart.ts      # Hydrated cart hook with shipping threshold helpers
│   ├── types/
│   │   └── index.ts        # Domain TypeScript definitions (Product, Variant, Order, User, etc.)
│   └── middleware.ts       # Edge middleware guarding `/admin` routes based on role cookie
├── .env.local
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 2. Spring Boot Backend Integration

The application includes an API client in `src/config/db.ts`:

- **Mock Mode (Default)**:
  `NEXT_PUBLIC_USE_MOCK_API=true`
  All service queries and actions simulate calling the Spring Boot backend with a **2000ms (2s) debounce / latency**, faithfully rendering realistic loading states and async updates.
- **Connecting to Real Spring Boot Backend**:
  Update `.env.local`:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
  NEXT_PUBLIC_USE_MOCK_API=false
  ```
  The `springBootFetch` client will automatically switch to querying the Spring Boot REST endpoints:
  - `GET /products`, `GET /products/{id}`, `GET /products/search`
  - `POST /auth/login`, `POST /auth/register`
  - `POST /orders`, `PATCH /admin/orders/{id}/status`
  - `POST /admin/products`, `PATCH /admin/products/{id}/variants/{variantId}/stock`

---

## 3. State Management & Data Validation

- **Zod Schemas** (`src/service/*/schema.ts`):
  Every form and server-bound payload is strictly validated with Zod before submission:
  - `CheckoutFormSchema`
  - `UpsertProductSchema`
  - `ProductVariantSchema`
  - `LoginSchema` & `RegisterSchema`
  - `ProductFilterSchema`
- **Zustand Stores**:
  - `useCartStore`: Persistent client cart with guest storage, coupon code support (`TAGE10` for 10% off), variant stock verification, and automatic guest-to-account cart merging upon login.
  - `useProductStore`: Client catalog cache with admin mutations (add product, update variant inventory, delete product) updating customer storefront views instantly.
  - `useAuthStore`: Role and authentication state syncing with cookies for `middleware.ts`.
  - `useOrderStore`: Order history tracking and admin status transitions (`PENDING_PAYMENT`, `PAID`, `SHIPPING`, `COMPLETED`, `CANCELLED`).

---

## 4. Admin Access & Demo Credentials

To test the Admin portal (`/admin`):
- Go to `/auth/login`
- Click the **"Auto Fill"** helper button or enter:
  - **Email**: `admin@tage.studio`
  - **Password**: `password123`
- The system will grant the `ADMIN` role cookie and redirect to the **Admin Studio**, unlocking:
  - Inventory variant stock editor
  - Order fulfillment workflow
  - Storefront catalog additions


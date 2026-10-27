# TAGE Code Conventions & Guidelines

Tài liệu này định nghĩa các quy tắc lập trình, quy ước đặt tên, cấu trúc file và phong cách viết code bắt buộc áp dụng trong toàn bộ dự án TAGE.

---

## 1. Quy ước Đặt tên (Naming Conventions)

### 1.1. Thư mục (Directories)
- **Tất cả thư mục** phải dùng chữ thường phân cách bằng dấu gạch ngang (`kebab-case`), ví dụ:
  - `src/components/product/`
  - `src/service/products/`
  - `src/app/auth/forgot-password/`
- **Route groups** trong Next.js đặt trong dấu ngoặc đơn: `(shop)`.
- **Dynamic route segments** đặt trong ngoặc vuông: `[slug]`, `[id]`.

### 1.2. Tệp tin (Files)
- **Component files**: Dùng `PascalCase.tsx`, ví dụ: `ProductCard.tsx`, `HeroCarousel.tsx`, `FilterDrawer.tsx`.
- **Pages & Layouts Next.js**: Tuân theo quy chuẩn App Router: `page.tsx`, `layout.tsx`, `not-found.tsx`, `sitemap.ts`, `route.ts`.
- **Service & Logic files**: Dùng `camelCase.ts` hoặc danh từ chỉ vai trò:
  - `queries.ts`, `actions.ts`, `schema.ts`, `store.ts`, `mock.ts`.
- **Config & Utility files**: Dùng `camelCase.ts`, ví dụ: `db.ts`, `auth.ts`, `utils.ts`.
- **Custom Hooks**: Bắt đầu bằng tiền tố `use` theo `camelCase.ts`, ví dụ: `useDebounce.ts`, `useCart.ts`.
- **Type Definitions**: `index.ts` trong `src/types/`, `declarations.d.ts` cho ambient types.

### 1.3. Định danh trong Code (Identifiers)
- **React Components**: `PascalCase` (ví dụ: `function ProductCard()`, `export function SearchOverlay()`).
- **Interfaces / Types**: `PascalCase` (ví dụ: `Product`, `ProductVariant`, `CartItem`, `OrderStatus`).
- **Zod Schemas**: `PascalCase` kết thúc bằng `Schema` (ví dụ: `UpsertProductSchema`, `CheckoutFormSchema`).
- **Zustand Stores**: Bắt đầu bằng `use`, kết thúc bằng `Store` (ví dụ: `useCartStore`, `useAuthStore`, `useProductStore`).
- **Hằng số tĩnh toàn cục**: `UPPER_SNAKE_CASE` (ví dụ: `NAV_CATEGORIES`, `FREE_SHIPPING_THRESHOLD`, `BRAND_VALUES`).
- **Biến thông thường, Functions & Methods**: `camelCase` (ví dụ: `handleAddToCart`, `formatCurrency`, `selectedSize`).

---

## 2. Quy tắc Server Component vs Client Component

Dự án sử dụng Next.js 15 App Router với React 19:
1. **Server Components mặc định**:
   - Các file layout (`src/app/layout.tsx`, `src/app/(shop)/layout.tsx`), trang tĩnh, route handlers (`src/app/api/...`) không cần directive `"use client"`.
   - Giúp tối ưu SEO, giảm bundle JavaScript tải về trình duyệt.
2. **Khi nào bắt buộc dùng `"use client"`?**:
   - Khi component sử dụng React hooks (`useState`, `useEffect`, `useRef`, `useCallback`).
   - Khi component gắn event handlers (`onClick`, `onChange`, `onSubmit`).
   - Khi component sử dụng Zustand stores (`useCartStore`, `useProductStore`).
   - Directive `"use client";` **phải nằm ở dòng đầu tiên** của file.
3. **An toàn Hydration (Hydration Safety)**:
   - Khi đọc dữ liệu từ `localStorage` qua Zustand persist (như số lượng giỏ hàng, thông tin user), **luôn đảm bảo component đã mounted** trước khi hiển thị nội dung phụ thuộc client:
   ```tsx
   const [mounted, setMounted] = useState(false);
   useEffect(() => { setMounted(true); }, []);
   if (!mounted) return null; // hoặc placeholder
   ```
   - Tránh phát sinh lỗi hydration mismatch giữa HTML SSR và Client Render.

---

## 3. Quy chuẩn TypeScript & Imports

1. **Strict Type-Checking**:
   - Không được dùng `any`. Mọi dữ liệu phải có type rõ ràng từ `@/types`.
   - Kiểm tra kiểu dữ liệu với lệnh `npx tsc --noEmit` trước khi commit/hoàn thành task.
2. **Path Aliases**:
   - Luôn sử dụng alias `@/*` trỏ tới `src/*`, **tuyệt đối không dùng relative import quá 2 cấp** (ví dụ: cấm `../../../../service/cart`, phải dùng `@/service/cart`).
3. **Thứ tự Import**:
   ```tsx
   // 1. React & Next.js core
   import { useState, useEffect } from "react";
   import Link from "next/link";
   import { useRouter } from "next/navigation";

   // 2. Thư viện bên ngoài (Zod, Zustand...)
   import { z } from "zod";

   // 3. Types nội bộ
   import { Product, ProductVariant } from "@/types";

   // 4. Config & Utilities
   import { money, shipFee } from "@/config/utils";

   // 5. Service & Store
   import { useCartStore } from "@/service/cart/store";
   import { fetchProductsApi } from "@/service/products/queries";

   // 6. Components & Icons
   import { Icons } from "@/components/ui/Icons";
   import { Crumbs } from "@/components/ui/Crumbs";
   ```

---

## 4. Quy chuẩn UI / Styling & Design Tokens

- Sử dụng **Tailwind CSS** kết hợp CSS variables đã được cấu hình trong `globals.css`:
  - `bg-[color:var(--bg)]`: Nền trang web `#f7f7f7`.
  - `text-[color:var(--fg)]`: Màu chữ chính `#111111`.
  - `border line`: Viền mờ tối giản `#e1e1e1`.
  - `card`: Nền thẻ sản phẩm/khối xám `#ececec`.
  - `btn`: Nút bấm đen chuẩn TAGE (uppercase, letter-spacing 0.25em, hover sáng nhẹ).
  - `serif`: Font chữ hiển thị tiêu đề lớn.
  - `mute`: Màu chữ phụ/mô tả xám `#737373`.
  - `ul`: Hiệu ứng gạch chân động tinh tế khi hover.
- **Responsive**: Thiết kế theo chuẩn mobile-first, kiểm tra giao diện trên cả mobile (`<640px`), tablet (`768px`) và desktop (`>1024px`).


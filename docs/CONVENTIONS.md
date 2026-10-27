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

---

## 5. Quy chuẩn Phân rã Component & Tách biệt Nghiệp vụ (Component Decomposition)

Nhằm đảm bảo dự án dễ bảo trì, mở rộng và kiểm thử lâu dài, toàn bộ codebase phải tuân theo quy tắc phân rã nghiêm ngặt:

### 5.1. Nguyên tắc "Tách biệt Logic và Giao diện" (Separation of Concerns)
- **Tầng Logic / State**: Toàn bộ logic tính toán phức tạp, state quản lý danh mục/bộ lọc, hoặc hiệu ứng phụ trình duyệt PHẢI được đóng gói vào **Custom Hooks** (`src/hooks/` hoặc `src/service/<module>/`).
- **Tầng Giao diện (Presentational UI)**: Component chỉ nhận `props` và callback từ hook, tập trung hoàn toàn vào việc render JSX và styling Tailwind.
- **Ví dụ mẫu chuẩn**:
  - `src/hooks/usePagination.ts`: Chuyên trách tính toán dải số trang, dấu ba chấm `...` (`DOTS`), giới hạn biên `canGoPrev` / `canGoNext`.
  - `src/hooks/useScrollTop.ts`: Chuyên trách cuộn mượt mà lên đầu trang theo điều kiện.
  - `src/components/ui/Pagination.tsx`: Component giao diện chỉ việc kết nối 2 hook trên để render các nút bấm chuẩn UI TAGE.

### 5.2. Cấm viết "God Component" / "God Page"
- Không được để một file `page.tsx` hay component phình to hàng trăm dòng chứa lẫn lộn HTML, state và hàm xử lý.
- Mọi trang lớn đều bắt buộc phải phân rã thành các sub-components chuyên trách đặt trong thư mục domain tương ứng (`src/components/product/`, `src/components/cart/`, `src/components/checkout/`):
  - **Trang Chi tiết sản phẩm** (`product/[slug]/page.tsx`): Tách thành [`ProductGallery.tsx`](../src/components/product/ProductGallery.tsx) (ảnh & zoom popup) và [`ProductInfo.tsx`](../src/components/product/ProductInfo.tsx) (thông tin, size, nút giỏ hàng & accordion).
  - **Trang Danh mục Shop** (`shop/page.tsx`): Tách thành [`ShopHeader.tsx`](../src/components/product/ShopHeader.tsx) (tab danh mục, nút filter, chip đang chọn), [`FilterDrawer.tsx`](../src/components/product/FilterDrawer.tsx), [`Pagination.tsx`](../src/components/ui/Pagination.tsx) và quản lý state qua [`useShopCatalog.ts`](../src/hooks/useShopCatalog.ts).
  - **Trang Giỏ hàng** (`cart/page.tsx`): Tách thành [`CartItemRow.tsx`](../src/components/cart/CartItemRow.tsx) và [`CartSummary.tsx`](../src/components/cart/CartSummary.tsx).
- File `page.tsx` chỉ đóng vai trò là **"Layout Orchestrator"** (Nhạc trưởng điều phối layout): đọc params, gọi hook/service và compose các component con.

---

## 6. Quy chuẩn Fetching Dữ liệu: Có nên Fetch ở Page không?

### 6.1. Khi nào NÊN Fetch ở Page?
- **Khi `page.tsx` là Server Component (RSC)**: Next.js App Router khuyến nghị fetch dữ liệu ở tầng Page cao nhất trên server trước khi render HTML.
  - **Lợi ích**: Tối ưu SEO vượt trội, không layout shift, bảo vệ an toàn API endpoint và giảm kích thước JavaScript tải xuống client.
  - **Cách làm chuẩn**: `page.tsx` nhận `params` / `searchParams`, gọi hàm truy vấn từ tầng Service (`await fetchProductsApi()` hoặc `await fetchProductBySlugApi()`), sau đó truyền data đã định dạng xuống các Component con qua `props`.

### 6.2. Khi nào KHÔNG NÊN Fetch ở Page?
1. ❌ **CẤM viết gọi `fetch("http://...")` thô hay hardcode URL trong Page**:
   - Tất cả request HTTP, debounce 2s, xử lý header và Zod validate bắt buộc phải đóng gói trong `src/service/<module>/queries.ts` hoặc `actions.ts`.
2. ❌ **CẤM nhồi nhét `useEffect`, `useState` và fetch lồng nhau trong Client Page**:
   - Với các trang Client có tương tác cao (như lọc danh mục đa điều kiện, debounce tìm kiếm, chuyển trang real-time): Việc gọi API và quản lý hàng loạt state trực tiếp trong `page.tsx` sẽ phá vỡ tính phân tầng.
   - **Bắt buộc**: Đóng gói toàn bộ logic gọi API và state tương tác vào **Custom Hook** (như `useShopCatalog`), `page.tsx` chỉ gọi hook và truyền state xuống giao diện.



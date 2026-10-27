# TAGE Architecture Specification

Tài liệu này mô tả kiến trúc tổng thể của hệ thống E-commerce TAGE, được thiết kế theo chuẩn **Next.js 15 App Router** nhằm phục vụ cả Storefront bán lẻ (khách hàng) và Admin Studio (quản trị viên) trong cùng một codebase mà vẫn đảm bảo tính module hóa và dễ bảo trì khi phát triển lâu dài.

---

## 1. Mô hình Phân tầng (Layered Architecture)

Dự án áp dụng mô hình 4 tầng nghiêm ngặt:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. ROUTE PAGES & LAYOUTS (src/app/)                         │
│    App Router Pages, URL params, layout lồng nhau           │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 2. PRESENTATIONAL COMPONENTS (src/components/)              │
│    UI Components (ui/), Domain Components (product/, cart/) │
│    Chỉ nhận props, hiển thị và trigger event callback       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 3. BUSINESS SERVICE LAYER (src/service/)                    │
│    - queries.ts: Fetch dữ liệu, tìm kiếm, lọc               │
│    - actions.ts: Tạo đơn, sửa tồn kho, mutations            │
│    - schema.ts: Zod schemas validate dữ liệu đầu vào        │
│    - store.ts: Zustand client state & persistence           │
│    - mock.ts: Dữ liệu mẫu chuẩn ảnh thật                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 4. INFRASTRUCTURE & CONFIG (src/config/, src/types/)        │
│    - db.ts: Spring Boot HTTP client + 2s simulated debounce │
│    - auth.ts, mail.ts, payment.ts, utils.ts                 │
│    - types/index.ts: Domain models TypeScript               │
└─────────────────────────────────────────────────────────────┘
```

### Nguyên tắc liên tầng:
- **Tầng 1 (Pages)**: Chỉ chịu trách nhiệm routing, layout cấu trúc trang, đọc URL params (`searchParams`, `params`), và compose các components từ tầng 2.
- **Tầng 2 (Components)**: Tách làm 2 nhóm:
  - `components/ui/`: Dumb components tái sử dụng (Accordion, Field, Icons, Crumbs...).
  - `components/layout/` & `components/product/`: Domain UI components (Header, ProductCard, FilterDrawer...).
- **Tầng 3 (Service)**: Toàn bộ nghiệp vụ, gọi API, đồng bộ store, validate Zod đều phải nằm ở đây. Không import component vào service.
- **Tầng 4 (Config & Types)**: Chứa các cấu hình độc lập, types dùng chung toàn hệ thống, và hàm gọi HTTP client chuẩn hóa.

---

## 2. Tổ chức Thư mục & Routing trong `src/app`

### Route Groups
1. `src/app/(shop)/`:
   - Chứa toàn bộ giao diện khách lẻ: Trang chủ (`/`), Danh sách sản phẩm (`/shop`), Chi tiết sản phẩm (`/product/[slug]`), Giỏ hàng (`/cart`), Thanh toán (`/checkout`), Đặt hàng thành công (`/checkout/success`), Tài khoản (`/account`, `/account/orders`, `/account/addresses`).
   - Dùng chung layout khách hàng (`src/app/(shop)/layout.tsx`) gồm Banner Marquee thông báo, Header dính với giỏ hàng & tìm kiếm, Footer thương hiệu.
2. `src/app/auth/`:
   - Giao diện đăng nhập (`/auth/login`), đăng ký (`/auth/register`), quên mật khẩu (`/auth/forgot-password`).
   - Layout tối giản, tập trung vào form (`src/app/auth/layout.tsx`).
3. `src/app/admin/`:
   - Cổng quản trị độc lập: Dashboard thống kê (`/admin`), Quản lý sản phẩm & biến thể tồn kho (`/admin/products`), Đơn hàng (`/admin/orders`), Khách hàng (`/admin/customers`).
   - Layout riêng có thanh Sidebar điều hướng, thanh trạng thái API và quản lý phiên đăng nhập.
   - Được bảo vệ 2 lớp: **Edge Middleware (`src/middleware.ts`)** và **Client Guard trong Layout**.

---

## 3. Kiến trúc State Management (Zustand)

Hệ thống sử dụng Zustand chia theo từng miền nghiệp vụ (domain-driven stores):

| Store Name | File | Mục đích | Persistence |
| :--- | :--- | :--- | :--- |
| `useCartStore` | `src/service/cart/store.ts` | Giỏ hàng, áp mã giảm giá `TAGE10`, kiểm tra tồn kho variant, tính freeship | `localStorage` (`tage-cart-storage`) |
| `useProductStore` | `src/service/products/store.ts` | Cache sản phẩm, biến thể, wishlist, lịch sử xem, thao tác thêm/sửa/xóa sản phẩm của admin | `localStorage` (`tage-products-storage`) |
| `useAuthStore` | `src/service/auth/store.ts` | Thông tin người dùng, quyền (`CUSTOMER` / `ADMIN`), sổ địa chỉ, đồng bộ cookie `tage_auth_role` | `localStorage` (`tage-auth-storage`) |
| `useOrderStore` | `src/service/orders/service.ts` | Lịch sử đặt hàng, trạng thái xử lý đơn hàng của Admin | `localStorage` (`tage-orders-storage`) |
| `useUiStore` | `src/service/ui/store.ts` | Điều khiển thanh Top Progress Bar debounce 2s khi chuyển màn hình & lọc API | Memory State |

### Cơ chế gộp giỏ hàng (Guest Cart Merge):
- Khi khách chưa đăng nhập: Giỏ hàng được lưu trong `localStorage`.
- Khi khách đăng nhập thành công tại `/auth/login`: Hàm `mergeWithServerCart(items)` được tự động kích hoạt để hợp nhất sản phẩm khách đã chọn vào tài khoản người dùng mà không bị mất dữ liệu.

---

## 4. Kiến trúc Validate Dữ liệu (Zod)

Mọi luồng dữ liệu tương tác đều có Zod Schema tương ứng nằm tại `src/service/<module>/schema.ts`:
- **Thanh toán**: `CheckoutFormSchema` validate email, họ tên, địa chỉ, số điện thoại, phương thức giao hàng, và kiểm tra thông tin thẻ nếu chọn thanh toán online.
- **Sản phẩm & Biến thể**: `UpsertProductSchema` & `ProductVariantSchema` bắt buộc SKU hợp lệ, giá dương, size hợp lệ, mã màu hex (`#RRGGBB`), và số lượng tồn kho không âm.
- **Tài khoản**: `LoginSchema`, `RegisterSchema`, `AddressSchema`.
- **Lọc sản phẩm**: `ProductFilterSchema` chuẩn hóa phân trang, giới hạn giá và sắp xếp.

---

## 5. Tích hợp Spring Boot & Cơ chế Debounce 2s

- Khi gọi dữ liệu từ tầng service (`fetchProductsApi`, `searchProductsApi`, `submitOrderAction`, `updateVariantStockService`, `updateOrderStatusAction`), hệ thống thông qua `springBootFetch` trong [`src/config/db.ts`](file:///d:/learning-myself/ling-tage/src/config/db.ts).
- Khi ở chế độ Mock (`NEXT_PUBLIC_USE_MOCK_API=true`), hàm `mockApiCall` kích hoạt cơ chế **Debounce 2000ms (2 giây)** trên từng `debounceKey` (ví dụ: gõ tìm kiếm liên tục thì chỉ gọi sau 2s khi ngừng gõ, đổi trạng thái đơn chờ 2s mô phỏng độ trễ mạng thực tế).
- **Thanh Top Progress Bar mượt mà**: Thay vì làm mờ ảnh hay tracking scroll, độ trễ debounce 2s và quá trình chuyển màn hình được hiển thị trực quan qua thanh `TopProgressBar` (`cubic-bezier(0.16, 1, 0.3, 1)` chạy trong 2000ms) đặt ở đỉnh trang, giúp trải nghiệm mượt mà, không giật và giữ nguyên độ sắc nét của hình ảnh sản phẩm.
- Khi chuyển sang backend Spring Boot thực thụ, chỉ cần đặt `NEXT_PUBLIC_USE_MOCK_API=false`.


# Spring Boot Backend Integration Contract

Tài liệu này định nghĩa chi tiết hợp đồng API REST giữa Next.js Frontend và Spring Boot Backend chính của TAGE.

---

## 1. Cấu hình Môi trường

File cấu hình tại `.env.local`:

```env
# URL gốc của Spring Boot REST API
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# Bật/tắt chế độ Mock API
NEXT_PUBLIC_USE_MOCK_API=true

# Độ trễ giả lập của Mock API (debounce 2 giây)
NEXT_PUBLIC_MOCK_DELAY_MS=2000
```

---

## 2. Chuẩn hóa Phản hồi API (API Response Envelope)

Mọi endpoint của Spring Boot đều phải trả về định dạng JSON bọc trong đối tượng chuẩn:

```json
{
  "success": true,
  "data": { ... },
  "message": "Thành công",
  "timestamp": "2026-10-26T16:00:00.000Z"
}
```

Đối với danh sách phân trang (`PaginatedResponse<T>`):
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "total": 32,
    "page": 1,
    "pageSize": 12,
    "totalPages": 3
  },
  "timestamp": "2026-10-26T16:00:00.000Z"
}
```

---

## 3. Danh sách Endpoints RESTful

### 3.1. Xác thực & Tài khoản (`/auth`, `/users`)
- `POST /api/v1/auth/login`:
  - Request body: `{ "email": "...", "password": "..." }`
  - Response data: `User` (`id`, `name`, `email`, `role`, `addresses`)
  - Set HTTP-only Cookie `tage_auth_role` (`ADMIN` hoặc `CUSTOMER`)
- `POST /api/v1/auth/register`:
  - Request body: `{ "name": "...", "email": "...", "password": "..." }`
  - Response data: `User`
- `GET /api/v1/auth/me`: Lấy thông tin user hiện tại qua JWT cookie/header.

### 3.2. Danh mục & Sản phẩm (`/products`)
- `GET /api/v1/products`:
  - Query params: `category`, `sizes` (danh sách), `minPrice`, `maxPrice`, `sort` (`new` | `lo` | `hi`), `page`, `pageSize`.
  - Response: `PaginatedResponse<Product>`.
- `GET /api/v1/products/{idOrSlug}`: Lấy chi tiết sản phẩm và danh sách biến thể.
- `GET /api/v1/products/search?q={query}`: Tìm kiếm theo tên sản phẩm, màu sắc, danh mục.

### 3.3. Giỏ hàng & Đồng bộ (`/cart`)
- `POST /api/v1/cart/sync`:
  - Kích hoạt khi khách đăng nhập để hợp nhất các sản phẩm đã chọn ở local storage vào server.
  - Request body: `{ "items": [ { "productId": 1, "size": "M", "color": "Terracotta", "qty": 2 } ] }`

### 3.4. Đơn hàng (`/orders`)
- `POST /api/v1/orders`:
  - Tạo đơn hàng mới từ checkout.
  - Request body: Khớp với `CheckoutFormInput` đã validate qua Zod.
  - Trạng thái ban đầu: `PAID` (nếu thanh toán online) hoặc `PENDING_PAYMENT` (nếu COD).
- `GET /api/v1/orders/my-orders`: Lấy lịch sử đơn hàng của khách hiện tại.

### 3.5. Cổng Quản trị Admin (`/admin/...`)
- `POST /api/v1/admin/products`: Thêm mới sản phẩm kèm biến thể và tồn kho ban đầu.
- `PATCH /api/v1/admin/products/{productId}/variants/{variantId}/stock`: Cập nhật số lượng tồn kho của một biến thể cụ thể (`{ "stock": 15 }`).
- `DELETE /api/v1/admin/products/{id}`: Xóa hoặc ẩn sản phẩm khỏi catalog.
- `GET /api/v1/admin/orders`: Lấy toàn bộ đơn hàng trong hệ thống.
- `PATCH /api/v1/admin/orders/{id}/status`: Cập nhật trạng thái (`PENDING_PAYMENT` -> `PAID` -> `SHIPPING` -> `COMPLETED` -> `CANCELLED`).

---

## 4. Tích hợp Thanh toán PayOS & Webhook

- Endpoint Webhook Next.js: `POST /api/webhooks/payos`
- Định dạng dữ liệu từ PayOS:
  ```json
  {
    "code": "00",
    "desc": "Success",
    "data": {
      "orderCode": 849201,
      "amount": 260,
      "description": "Thanh toan don hang TG-849201",
      "accountNumber": "...",
      "reference": "...",
      "transactionDateTime": "...",
      "currency": "VND",
      "paymentLinkId": "..."
    },
    "signature": "..."
  }
  ```
- Khi nhận được webhook thành công (`code == "00"`), service sẽ tự động cập nhật đơn hàng sang trạng thái `PAID` và kích hoạt email xác nhận đơn hàng qua `buildOrderConfirmationEmail()`.


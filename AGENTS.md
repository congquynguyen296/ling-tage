# AI Agent Guidelines & Context

---

## 🚨 YÊU CẦU BẮT BUỘC TRƯỚC KHI CODE

Trước khi thực hiện bất kỳ thay đổi nào, bạn **BẮT BUỘC PHẢI ĐỌC** các tài liệu trong thư mục `docs/`:

1. [**`docs/AGENT_RULES.md`**](./docs/AGENT_RULES.md) — 7 điều cấm kỵ & checklist kiểm tra.
2. [**`docs/ARCHITECTURE.md`**](./docs/ARCHITECTURE.md) — Cấu trúc 4 tầng phân lập của dự án.
3. [**`docs/CONVENTIONS.md`**](./docs/CONVENTIONS.md) — Quy chuẩn đặt tên file, component, hook và TypeScript strictness.
4. [**`docs/SPRING_BOOT_INTEGRATION.md`**](./docs/SPRING_BOOT_INTEGRATION.md) — Hợp đồng API REST với Spring Boot backend và giả lập debounce 2s.

---

## 🧭 Bản đồ vị trí thư mục nhanh
- **Giao diện Storefront (Khách hàng)**: `src/app/(shop)/`
- **Giao diện Quản trị (Admin)**: `src/app/admin/` (Bảo vệ bởi `src/middleware.ts`)
- **Tầng nghiệp vụ & Gọi API**: `src/service/<module>/` (`queries.ts`, `actions.ts`, `schema.ts`, `store.ts`, `mock.ts`)
- **UI Components tái sử dụng**: `src/components/ui/`
- **Domain Components**: `src/components/product/`, `src/components/layout/`, `src/components/cart/`
- **Kiểu dữ liệu**: `src/types/index.ts`


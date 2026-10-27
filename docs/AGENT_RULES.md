# Mandatory Rules for AI Agents (Agent Checklist)

> **DÀNH CHO TẤT CẢ AGENT**: Mỗi khi bạn nhận được yêu cầu viết thêm tính năng, sửa bug, hoặc tái cấu trúc trong repo này, bạn **PHẢI** đọc và tuân theo danh sách quy tắc dưới đây.

---

## 1. Bắt buộc Đọc trước khi Viết Code

Trước khi tạo bất kỳ file mới hoặc sửa file hiện tại:
1. Đọc [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) để biết module của bạn thuộc tầng nào (Route, Component, Service, hay Config).
2. Đọc [`docs/CONVENTIONS.md`](./CONVENTIONS.md) để đặt tên file, component và hàm chuẩn xác.
3. Đọc [`docs/SPRING_BOOT_INTEGRATION.md`](./SPRING_BOOT_INTEGRATION.md) nếu công việc liên quan đến gọi API hoặc lưu trữ dữ liệu.

---

## 2. 7 Điều Cấm Kỵ (Strictly Prohibited)

1. ❌ **CẤM viết logic fetch API hoặc business logic trực tiếp trong UI Component**:
   - UI chỉ gọi hàm từ `src/service/<module>/queries.ts` hoặc `actions.ts`.
2. ❌ **CẤM gửi dữ liệu xuống backend/service mà chưa qua Zod Validate**:
   - Mọi form input (đặt hàng, tạo sản phẩm, đổi mật khẩu) đều phải có schema trong `schema.ts`.
3. ❌ **CẤM dùng type `any`**:
   - Mọi type phải được định nghĩa trong `src/types/index.ts`.
4. ❌ **CẤM import vượt cấp relative đường dẫn dài** (ví dụ: `../../../../service`):
   - Bắt buộc dùng alias `@/service/...`, `@/components/...`, `@/types/...`.
5. ❌ **CẤM đổi tên thương hiệu**:
   - Thương hiệu chính thức là **`TAGE`**. Không được đổi ngược lại thành ATELIER hay bất kỳ tên nào khác.
6. ❌ **CẤM hardcode ảnh giả không tồn tại**:
   - Tất cả ảnh sản phẩm, banner phải lấy từ `public/images/...` và `public/logo/...`.
7. ❌ **CẤM bỏ qua kiểm tra TypeScript**:
   - Luôn chạy `npx tsc --noEmit` sau khi hoàn thành code để đảm bảo 0 lỗi type.

---

## 3. Checklist Hoàn Thành Task (Pre-completion Verification)

Trước khi thông báo hoàn tất cho người dùng:
- [ ] File mới được đặt đúng vị trí theo quy chuẩn kiến trúc.
- [ ] Schema Zod đã được tạo và validate đầy đủ.
- [ ] Hook hoặc Store Zustand đã được cập nhật (nếu có state mới).
- [ ] Directive `"use client";` được đặt ở dòng 1 nếu có React hook / browser API.
- [ ] Chạy `npx tsc --noEmit` kiểm tra toàn bộ type: **0 Errors**.
- [ ] Kiểm tra responsive trên mobile và desktop.


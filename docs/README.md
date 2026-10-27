# TAGE Developer & Agent Documentation Hub

> **BẮT BUỘC ĐỌC TRƯỚC KHI CODE**: Tất cả các lập trình viên hoặc AI Agent khi tham gia phát triển, chỉnh sửa codebase TAGE đều **phải đọc và tuân thủ tuyệt đối** các tài liệu trong thư mục này.

---

## 📚 Mục lục tài liệu

| Tài liệu | Mô tả chi tiết |
| :--- | :--- |
| [**1. AGENT_RULES.md**](./AGENT_RULES.md) | **Quy tắc vàng cho AI Agent**. Các điều cấm kỵ, quy trình làm việc và checklist kiểm tra trước khi hoàn thành task. |
| [**2. ARCHITECTURE.md**](./ARCHITECTURE.md) | **Kiến trúc hệ thống toàn diện**. Phân tách các tầng (UI -> Component -> Service -> Config/API Client), cấu trúc Next.js App Router, quản lý State với Zustand, Validate với Zod. |
| [**3. CONVENTIONS.md**](./CONVENTIONS.md) | **Quy chuẩn lập trình & Đặt tên**. Thống nhất cách đặt tên thư mục, file, component, hook, store, quy tắc Server vs Client Component, TypeScript guidelines. |
| [**4. SPRING_BOOT_INTEGRATION.md**](./SPRING_BOOT_INTEGRATION.md) | **Đặc tả tích hợp Spring Boot Backend**. Cấu trúc REST DTO, quy chuẩn gọi API, giả lập debounce 2s của mock API, xác thực JWT / Cookie và Webhook PayOS. |

---

## ⚡ Tóm tắt nhanh nguyên tắc cốt lõi

1. **Phân tầng độc lập**: Tuyệt đối không viết logic nghiệp vụ (business logic) hoặc gọi API trực tiếp trong UI Component. Toàn bộ logic phải nằm ở `src/service/<module>/`.
2. **Validate bằng Zod**: Mọi dữ liệu từ form người dùng hoặc chuẩn bị gửi xuống Spring Boot backend đều phải được parse/validate qua Zod schema.
3. **Quản lý state bằng Zustand**: Sử dụng các custom store độc lập (`useCartStore`, `useAuthStore`, `useProductStore`, `useOrderStore`), không lạm dụng Context API gây thừa re-render.
4. **Chuẩn bị cho Spring Boot**: Tầng `src/config/db.ts` điều phối giữa Mock Mode (debounce 2s mô phỏng độ trễ mạng thực tế) và Real Spring Boot Backend mà không cần sửa giao diện.
5. **Thương hiệu & Design System**: Thương hiệu chính thức là **TAGE**, sử dụng font Inter, bảng màu tối giản cao cấp (`#f7f7f7`, `#111111`, `#737373`, `#e1e1e1`), animation tinh tế (`.rv`, `.serif`, `.ul`).


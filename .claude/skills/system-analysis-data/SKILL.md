---
name: system-analysis-data
description: Skill chuyên sâu về thiết kế mô hình dữ liệu và sơ đồ thực thể quan hệ (ERD) cho đồ án PTTKHTTT. Chuyển đổi sang mô hình quan niệm, logic, vật lý, chuẩn hóa 3NF và lập bảng ánh xạ CSDL.
---

# Proxy: Thiết Kế Mô Hình Dữ Liệu & ERD (`system-analysis-data`)

> **Lớp ủy thác mỏng (Thin Proxy) cho Claude Code.**
> Nguồn chân lý duy nhất (Single Source of Truth) của kỹ năng này được lưu trữ tại `.agents/skills/system-analysis-data/SKILL.md`.

## Chỉ Thị Hành Động Bắt Buộc

Khi kỹ năng này được kích hoạt, Claude Code BẮT BUỘC thực hiện các bước sau:

1. **Đọc tệp nguồn chuẩn:** Sử dụng công cụ đọc tệp để nạp toàn bộ nội dung chỉ dẫn chính tại:
   `../../../.agents/skills/system-analysis-data/SKILL.md`

2. **Đọc các tài liệu tham khảo chuyên sâu:** Nếu quy trình yêu cầu tra cứu biểu mẫu hoặc quy tắc chuẩn hóa ERD, chủ động đọc các tệp trong thư mục:
   - Biểu mẫu thiết kế cơ sở dữ liệu: `../../../.agents/skills/system-analysis-data/references/` (nếu có tài liệu chuyên sâu)

3. **Áp dụng nguyên tắc:** Tuyệt đối không tự suy diễn quy trình từ phần mô tả ngắn này. Mọi thao tác thiết kế ERD (quan niệm, logic, vật lý), chuẩn hóa 3NF, quy ước PascalCase cho thuộc tính ERD và bảng ánh xạ snake_case đều phải tuân thủ nghiêm ngặt theo nội dung của tệp nguồn chuẩn.


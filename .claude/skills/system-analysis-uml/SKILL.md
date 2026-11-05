---
name: system-analysis-uml
description: Skill chuyên sâu điều phối thiết kế và kiểm soát tính nhất quán của 7 biểu đồ UML chuẩn OMG cho đồ án PTTKHTTT (Use Case, Class, Sequence, Activity, State, Component, Deployment).
---

# Proxy: Điều Phối Thiết Kế & Nhất Quán 7 Biểu Đồ UML (`system-analysis-uml`)

> **Lớp ủy thác mỏng (Thin Proxy) cho Claude Code.**
> Nguồn chân lý duy nhất (Single Source of Truth) của kỹ năng này được lưu trữ tại `.agents/skills/system-analysis-uml/SKILL.md`.

## Chỉ Thị Hành Động Bắt Buộc

Khi kỹ năng này được kích hoạt, Claude Code BẮT BUỘC thực hiện các bước sau:

1. **Đọc tệp nguồn chuẩn:** Sử dụng công cụ đọc tệp để nạp toàn bộ nội dung chỉ dẫn chính tại:
   `../../../.agents/skills/system-analysis-uml/SKILL.md`

2. **Đọc các tài liệu tham khảo chuyên sâu:** Nếu quy trình yêu cầu tra cứu ma trận lựa chọn biểu đồ hoặc quy chuẩn PlantUML/Mermaid, chủ động đọc các tệp tương ứng trong thư mục:
   - Tài liệu tham khảo UML chuyên sâu: `../../../.agents/skills/system-analysis-uml/references/` (nếu có tài liệu chuyên sâu)

3. **Áp dụng nguyên tắc:** Tuyệt đối không tự suy diễn quy trình từ phần mô tả ngắn này. Mọi thao tác lựa chọn biểu đồ, kiểm soát quan hệ liên biểu đồ, quy chuẩn đặt tên Class Diagram (Class: PascalCase, Attribute/Method: camelCase) và các biểu đồ UML khác (PascalCase) đều phải tuân thủ nghiêm ngặt theo nội dung của tệp nguồn chuẩn.


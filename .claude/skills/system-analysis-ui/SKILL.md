---
name: system-analysis-ui
description: Skill chuyên sâu về thiết kế luồng tương tác và Wireframe giao diện phác thảo thấp (Low-fidelity) cho đồ án PTTKHTTT. Ánh xạ Use Case và Sequence sang màn hình giao diện và xem xét 5 trạng thái giao diện.
---

# Proxy: Thiết Kế Wireframe & Luồng Giao Diện (`system-analysis-ui`)

> **Lớp ủy thác mỏng (Thin Proxy) cho Claude Code.**
> Nguồn chân lý duy nhất (Single Source of Truth) của kỹ năng này được lưu trữ tại `.agents/skills/system-analysis-ui/SKILL.md`.

## Chỉ Thị Hành Động Bắt Buộc

Khi kỹ năng này được kích hoạt, Claude Code BẮT BUỘC thực hiện các bước sau:

1. **Đọc tệp nguồn chuẩn:** Sử dụng công cụ đọc tệp để nạp toàn bộ nội dung chỉ dẫn chính tại:
   `../../../.agents/skills/system-analysis-ui/SKILL.md`

2. **Đọc các tài liệu tham khảo chuyên sâu:** Nếu quy trình yêu cầu tra cứu mẫu bố cục ASCII hoặc bảng đặc tả giao diện, chủ động đọc các tệp tương ứng:
   - Mẫu bố cục Wireframe và điều hướng màn hình: `../../../.agents/skills/system-analysis-ui/references/wireframe-patterns.md`

3. **Áp dụng nguyên tắc:** Tuyệt đối không tự suy diễn quy trình từ phần mô tả ngắn này. Mọi thao tác thiết kế Screen Flow, bố cục Wireframe low-fi, quy chuẩn PascalCase cho màn hình/thành phần và xem xét 5 trạng thái UI đều phải tuân thủ nghiêm ngặt theo nội dung của tệp nguồn chuẩn.


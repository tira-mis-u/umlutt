---
name: system-analysis-audit
description: Skill chuyên sâu về thẩm định, kiểm toán tính nhất quán toàn diện hồ sơ PTTKHTTT và đối soát mã nguồn. Kiểm tra chuỗi truy vết End-to-End, phân định As-is vs To-be và đánh giá theo 5 kết quả chuẩn.
---

# Proxy: Thẩm Định Hồ Sơ & Kiểm Toán Mã Nguồn (`system-analysis-audit`)

> **Lớp ủy thác mỏng (Thin Proxy) cho Claude Code.**
> Nguồn chân lý duy nhất (Single Source of Truth) của kỹ năng này được lưu trữ tại `.agents/skills/system-analysis-audit/SKILL.md`.

## Chỉ Thị Hành Động Bắt Buộc

Khi kỹ năng này được kích hoạt, Claude Code BẮT BUỘC thực hiện các bước sau:

1. **Đọc tệp nguồn chuẩn:** Sử dụng công cụ đọc tệp để nạp toàn bộ nội dung chỉ dẫn chính tại:
   `../../../.agents/skills/system-analysis-audit/SKILL.md`

2. **Đọc các tài liệu tham khảo chuyên sâu:** Nếu quy trình yêu cầu tra cứu quy trình thẩm định hoặc tiêu chí đánh giá, chủ động đọc các tệp tương ứng:
   - Giao thức kiểm toán và tiêu chí đánh giá: `../../../.agents/skills/system-analysis-audit/references/audit-protocols.md`

3. **Áp dụng nguyên tắc:** Tuyệt đối không tự suy diễn quy trình từ phần mô tả ngắn này. Mọi thao tác kiểm kê chức năng, đối soát chuỗi truy vết và kết luận theo 5 mức chuẩn đều phải tuân thủ nghiêm ngặt theo nội dung của tệp nguồn chuẩn.


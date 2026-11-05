---
name: system-analysis-requirements
description: Skill chuyên sâu về phân tích và đặc tả yêu cầu phần mềm FR, phi chức năng NFR, quy tắc nghiệp vụ BR và danh mục Use Case UC kèm bảng đặc tả chi tiết cho đồ án PTTKHTTT.
---

# Proxy: Phân Tích & Đặc Tả Yêu Cầu Phần Mềm (`system-analysis-requirements`)

> **Lớp ủy thác mỏng (Thin Proxy) cho Claude Code.**
> Nguồn chân lý duy nhất (Single Source of Truth) của kỹ năng này được lưu trữ tại `.agents/skills/system-analysis-requirements/SKILL.md`.

## Chỉ Thị Hành Động Bắt Buộc

Khi kỹ năng này được kích hoạt, Claude Code BẮT BUỘC thực hiện các bước sau:

1. **Đọc tệp nguồn chuẩn:** Sử dụng công cụ đọc tệp để nạp toàn bộ nội dung chỉ dẫn chính tại:
   `../../../.agents/skills/system-analysis-requirements/SKILL.md`

2. **Đọc các tài liệu tham khảo chuyên sâu:** Nếu quy trình yêu cầu tra cứu biểu mẫu đặc tả yêu cầu, chủ động đọc các tệp tương ứng:
   - Mẫu biểu mẫu và đặc tả yêu cầu: `../../../.agents/skills/system-analysis-requirements/references/requirements-templates.md`

3. **Áp dụng nguyên tắc:** Tuyệt đối không tự suy diễn quy trình từ phần mô tả ngắn này. Mọi thao tác phân rã FR, NFR, quy tắc BR, định danh Use Case theo chuẩn `[ĐộngTừMạnh] + [DanhTừ/ĐốiTượng]` PascalCase và lập bảng đặc tả Use Case 6 trường đều phải tuân thủ nghiêm ngặt theo nội dung của tệp nguồn chuẩn.


---
name: system-analysis
description: Skill tổng điều phối quy trình Phân tích và Thiết kế Hệ thống Thông tin (PTTKHTTT) cho đồ án và bài tập lớn. Tự động nhận diện trạng thái dự án (A, B, C), điều phối các skill Tier 2 và quản lý hồ sơ PTTKHTTT.
---

# Proxy: Tổng Điều Phối Phân Tích & Thiết Kế Hệ Thống Thông Tin (`system-analysis`)

> **Lớp ủy thác mỏng (Thin Proxy) cho Claude Code.**
> Nguồn chân lý duy nhất (Single Source of Truth) của kỹ năng này được lưu trữ tại `.agents/skills/system-analysis/SKILL.md`.

## Chỉ Thị Hành Động Bắt Buộc

Khi kỹ năng này được kích hoạt, Claude Code BẮT BUỘC thực hiện các bước sau:

1. **Đọc tệp nguồn chuẩn:** Sử dụng công cụ đọc tệp để nạp toàn bộ nội dung chỉ dẫn chính tại:
   `../../../.agents/skills/system-analysis/SKILL.md`

2. **Đọc các tài liệu tham khảo chuyên sâu:** Nếu quy trình yêu cầu tra cứu về vòng đời dự án hoặc ma trận truy vết, chủ động đọc các tệp tương ứng:
   - Vòng đời dự án và lộ trình 3 trạng thái: `../../../.agents/skills/system-analysis/references/project-lifecycle.md`
   - Ma trận truy vết yêu cầu hai chiều: `../../../.agents/skills/system-analysis/references/traceability-matrix.md`

3. **Áp dụng nguyên tắc:** Tuyệt đối không tự suy diễn quy trình từ phần mô tả ngắn này. Mọi thao tác phân tích, nhận diện trạng thái, quản lý hồ sơ và kích hoạt các skill chuyên môn Tier 2 đều phải tuân thủ nghiêm ngặt theo nội dung của tệp nguồn chuẩn.


---
name: system-analysis-survey
description: Skill chuyên sâu về khảo sát hiện trạng và xác định phạm vi hệ thống cho đồ án PTTKHTTT. Lập kế hoạch khảo sát, thiết kế bảng câu hỏi, biên bản phỏng vấn và nhận diện vấn đề nghiệp vụ VD-xx.
---

# Proxy: Khảo Sát Hiện Trạng & Xác Định Phạm Vi (`system-analysis-survey`)

> **Lớp ủy thác mỏng (Thin Proxy) cho Claude Code.**
> Nguồn chân lý duy nhất (Single Source of Truth) của kỹ năng này được lưu trữ tại `.agents/skills/system-analysis-survey/SKILL.md`.

## Chỉ Thị Hành Động Bắt Buộc

Khi kỹ năng này được kích hoạt, Claude Code BẮT BUỘC thực hiện các bước sau:

1. **Đọc tệp nguồn chuẩn:** Sử dụng công cụ đọc tệp để nạp toàn bộ nội dung chỉ dẫn chính tại:
   `../../../.agents/skills/system-analysis-survey/SKILL.md`

2. **Đọc các tài liệu tham khảo chuyên sâu:** Nếu quy trình yêu cầu tra cứu biểu mẫu khảo sát hoặc kỹ thuật phỏng vấn, chủ động đọc các tệp tương ứng:
   - Mẫu kế hoạch, câu hỏi khảo sát và phân tích chứng từ: `../../../.agents/skills/system-analysis-survey/references/survey-templates.md`

3. **Áp dụng nguyên tắc:** Tuyệt đối không tự suy diễn quy trình từ phần mô tả ngắn này. Mọi thao tác lập kế hoạch khảo sát, phân tích chứng từ và mã hóa vấn đề hiện trạng `VD-xx` đều phải tuân thủ nghiêm ngặt theo nội dung của tệp nguồn chuẩn.


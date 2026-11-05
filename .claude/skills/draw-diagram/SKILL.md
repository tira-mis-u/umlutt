---
name: draw-diagram
description: Kỹ năng chuyên sâu điều phối phát hiện mô hình diagram hiện có hoặc phối hợp các skill chuyên môn tạo mô hình, sau đó chuyển đổi sang Draw.io XML trực tiếp sử dụng style mặc định cho toàn bộ 9 loại biểu đồ (7 biểu đồ UML, ERD và Wireframe) trong đồ án PTTKHTTT. Quản lý hệ thống hình học, định tuyến trực giao, kiểm định va chạm và lưu trữ artifact tại PTTKHTTT.
---

# Proxy: Vẽ Biểu Đồ Trực Tiếp Bằng Draw.io XML (`draw-diagram`)

> **Lớp ủy thác mỏng (Thin Proxy) cho Claude Code.**
> Nguồn chân lý duy nhất (Single Source of Truth) của kỹ năng này được lưu trữ tại `.agents/skills/draw-diagram/SKILL.md`.

## Chỉ Thị Hành Động Bắt Buộc

Khi kỹ năng này được kích hoạt, Claude Code BẮT BUỘC thực hiện các bước sau:

1. **Đọc tệp nguồn chuẩn:** Sử dụng công cụ đọc tệp để nạp toàn bộ nội dung chỉ dẫn chính tại:
   `../../../.agents/skills/draw-diagram/SKILL.md`

2. **Đọc các tài liệu tham khảo chuyên sâu:** Nếu quy trình yêu cầu tra cứu về hệ thống hình học, ngữ pháp bố cục hoặc cú pháp XML, chủ động đọc các tệp tương ứng:
   - Kiến trúc hình học và giải thuật định tuyến: `../../../.agents/skills/draw-diagram/references/geometry-system.md`
   - Quy tắc bố cục cho từng loại biểu đồ: `../../../.agents/skills/draw-diagram/references/layout-grammars.md`
   - Cấu trúc XML chuẩn và thư viện style mặc định: `../../../.agents/skills/draw-diagram/references/xml-style-guide.md`

3. **Áp dụng nguyên tắc:** Tuyệt đối không tự suy diễn quy trình từ phần mô tả ngắn này. Mọi thao tác, quy chuẩn đặt tên PascalCase/camelCase, kiểm tra va chạm hình học và quy định điều phối đều phải tuân thủ nghiêm ngặt theo nội dung của tệp nguồn chuẩn.

# Hướng Dẫn Vận Hành Dành Riêng Cho Claude Code (CLAUDE.md)

Tài liệu này định nghĩa các chỉ dẫn môi trường và cơ chế vận hành chuyên biệt cho Claude Code trong repository `umlutt`.

Toàn bộ các quy tắc chung về ngôn ngữ, quy chuẩn đặt tên PascalCase, quy định đường dẫn tương đối và chuẩn mực học thuật của hệ thống được kế thừa trực tiếp từ:
@AGENTS.md

---

## 1. Cơ Chế Nhận Diện & Đăng Ký Lệnh Slash Command

* **Không đăng ký lệnh trong tệp này:** Tệp `CLAUDE.md` đóng vai trò là hướng dẫn cấp repository cho phiên làm việc, **không phải là nơi đăng ký slash command**.
* **Đăng ký tự động qua thư mục kỹ năng:** Trong Claude Code, các lệnh slash command (ví dụ `/system-analysis`, `/draw-diagram`) được tự động phát hiện và đăng ký thông qua cấu trúc thư mục tại `.claude/skills/<ten-skill>/SKILL.md`.

---

## 2. Cơ Chế Ủy Thác Mỏng (Thin Proxy Execution)

Để duy trì nguyên tắc "Mỗi kỹ năng chỉ có một nguồn chân lý", toàn bộ nội dung chuyên môn, cẩm nang và tài liệu tham khảo chỉ tồn tại duy nhất tại thư mục `.agents/skills/`.

Thư mục `.claude/skills/<ten-skill>/` chỉ chứa các tệp `SKILL.md` mỏng (Thin Proxy) đóng vai trò làm điểm nhận diện lệnh và điều hướng cho Claude Code CLI.

### Chỉ thị hành động bắt buộc cho Claude Code:
1. **Không suy diễn nội dung:** Khi một kỹ năng được kích hoạt (qua slash command `/` hoặc tự động khớp ngữ cảnh), bạn **không được tự suy diễn** các bước thực hiện chỉ dựa vào phần mô tả ngắn trong frontmatter của tệp proxy.
2. **Không giả định nạp tự động qua liên kết Markdown:** Một liên kết Markdown (ví dụ `[link](path)`) nằm trong tệp proxy thuần túy là văn bản định dạng, **hoàn toàn không tự động nạp hay tiêm (inject) nội dung tệp đích vào ngữ cảnh**. Bạn không được coi sự hiện diện của liên kết là nội dung đã được đọc.
3. **Chủ động đọc tệp nguồn bằng công cụ:** Claude Code **bắt buộc phải sử dụng công cụ đọc tệp (`Read` hoặc lệnh đọc tệp qua Bash như `cat`)** để chủ động nạp trực tiếp toàn bộ nội dung tệp chỉ dẫn chính và các tài liệu tham khảo liên quan từ nguồn chuẩn:
   * Đường dẫn từ tệp proxy đến tệp nguồn chính: `../../../.agents/skills/<ten-skill>/SKILL.md`
   * Đường dẫn đến các tài liệu tham khảo và biểu mẫu chi tiết (khi quy trình yêu cầu): `../../../.agents/skills/<ten-skill>/references/<ten-tai-lieu>.md`
4. **Thực thi theo quy trình chuẩn:** Sau khi đã nạp đầy đủ nội dung từ tệp nguồn và tài liệu tham khảo, tiến hành thực hiện tuần tự theo đúng workflow, áp dụng quy chuẩn PascalCase cho định danh nghiệp vụ và đối chiếu ma trận đồng bộ theo quy định tại `@AGENTS.md`.


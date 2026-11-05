# Hướng Dẫn Dành Cho AI Coding Agents (AGENTS.md)

Tài liệu này định nghĩa các nguyên tắc và quy ước bắt buộc mà mọi AI coding agent (Antigravity, Gemini, OpenAI Codex, Claude Code, v.v.) phải tuân thủ khi thao tác, đóng góp hoặc phát triển trong repository này.

---

## 1. Mục Đích Của Repository

Repository này là thư viện **Agent Skills** chuẩn hóa bằng **tiếng Việt** chuyên sâu về **Phân tích và Thiết kế Hệ thống Thông tin (PTTKHTTT)** dành cho đồ án và bài tập lớn môn học, đồng thời hỗ trợ vận hành đa nền tảng cho các AI coding agent hàng đầu.

---

## 2. Nguyên Tắc Cốt Lõi (Core Principles)

### 2.1. Nguồn Chân Lý Duy Nhất & Kiến Trúc Phân Cấp 3 Tầng
* **Nguồn chân lý duy nhất (Single Source of Truth):** Toàn bộ nội dung kỹ năng gốc, cẩm nang nghiệp vụ và tài liệu tham khảo được lưu trữ duy nhất tại thư mục `.agents/skills/<ten-skill>/`.
* **Dùng chung đa nền tảng:**
  * **Antigravity / Gemini & OpenAI Codex:** Đọc trực tiếp từ nguồn chuẩn `.agents/skills/`.
  * **Claude Code:** Tích hợp thông qua lớp mỏng `.claude/skills/<ten-skill>/SKILL.md` (mẫu Thin Proxy), trỏ ngược về nguồn chuẩn bằng đường dẫn tương đối `../../../.agents/skills/<ten-skill>/SKILL.md`. Tuyệt đối không sao chép nhân bản nội dung.
* **Kiến trúc phân cấp:**
  * **Tầng 1 (Skill tổng điều phối):** `/system-analysis` (hoặc `$system-analysis` trên Codex) điều phối toàn bộ quy trình vòng đời theo 3 trạng thái project (A: Trống, B: Đã có tài liệu, C: Đã có code).
  * **Tầng 2 (Skill nhóm lĩnh vực / Producer Skills):** Phân tích và mô hình hóa từng mảng nghiệp vụ lớn (`survey`, `requirements`, `uml`, `data`, `ui`, `audit`).
  * **Bộ công cụ kết xuất & kiểm định trực tiếp (Renderer & Validator Engine):** `/draw-diagram` tiếp nhận mô hình từ các Producer Skills hoặc diagram có sẵn, tính toán hình học, định tuyến trực giao, tuần tự hóa Draw.io XML (`PTTKHTTT/xml/`), kiểm định tự động và xuất ảnh (`PTTKHTTT/diagrams/`).

### 2.2. Quy Định Về Ngôn Ngữ & Quy Ước Đặt Tên Bắt Buộc Trong Mô Hình
* **Nội dung hướng dẫn người dùng:** 100% bằng tiếng Việt. Áp dụng cho tài liệu, nội dung `SKILL.md`, các ghi chú và thông báo giao tiếp.
* **Quy ước định danh trong mô hình và biểu đồ:**
  * *Class Name:* BẮT BUỘC danh từ hoặc cụm danh từ số ít viết PascalCase (`DonHang`, `ChiTietDonHang`, `KhachHang`, `DocGia`). Không đặt tên Class bằng động từ.
  * *Thuộc tính Class (Attributes):* BẮT BUỘC viết thường chữ cái đầu theo camelCase, là danh từ/cụm danh từ (`maDonHang`, `tongTien`, `ngayDat`, `maKhachHang`).
  * *Phương thức Class (Methods / Operations):* BẮT BUỘC viết thường chữ cái đầu theo camelCase, bắt đầu bằng động từ hành động kèm `()` (`taoDonHang()`, `tinhTongTien()`, `kiemTraTonKho()`, `xacNhanTra()`).
  * *Quy tắc cốt lõi Class Diagram:* Trong Class Diagram, chỉ Class Name viết PascalCase; toàn bộ Attribute và Method đều viết camelCase.
  * *Use Case:* BẮT BUỘC viết PascalCase theo cấu trúc `[ĐộngTừMạnh] + [DanhTừ/ĐốiTượng]` (`TaoDonHang`, `HuyDonHang`, `XacNhanDonHang`, `KiemTraTonKho`, `CapNhatThongTinKhachHang`, `TraCuuThongTinThienTai`). Tránh các tên mơ hồ (`XuLy`, `ThucHien`, `ChucNang1`). Tuyệt đối không dùng camelCase cho tên Use Case.
  * *Actor:* Danh từ chỉ vai trò, viết PascalCase (`QuanLy`, `NhanVien`, `KhachHang`, `ThuThu`).
  * *Entity (ERD):* Danh từ số ít PascalCase (`DonHang`, `ChiTietDonHang`). Thuộc tính trong ERD BẮT BUỘC viết PascalCase (`MaDonHang`, `TongTien`, `NgayDat`), không áp dụng camelCase của Class Member ra ngoài Class Diagram.
  * *Lifeline (Sequence):* PascalCase (`KhachHang`, `DonHangController`, `SachRepository`). Thông điệp (Messages) trên Sequence Diagram BẮT BUỘC viết PascalCase (`TaoDonHang`, `KiemTraTonKho`), không tự ý đưa về camelCase.
  * *Component:* PascalCase kèm hậu tố vai trò (`QuanLyDonHang`, `ThanhToanService`, `ThanhPhanQuanLyDonHang`, `KhoModule`).
  * *Trạng thái (State Machine):* Tính từ/phân từ PascalCase (`ChoXacNhan`, `DangXuLy`, `DaHoanThanh`, `DaHuy`).
  * *Màn hình (Screen):* `ManHinhDangNhap`, `ManHinhQuanLyDonHang`.
  * *Thành phần giao diện:* `NutTaoDonHang`, `BangDanhSach`, `OTextInput`.
* **Danh sách ngoại lệ được phép (Allowlist):**
  * Các mã truy vết nghiệp vụ chuẩn: `FR-xx` (Yêu cầu chức năng), `NFR-xx` (Phi chức năng), `BR-xx` (Quy tắc nghiệp vụ), `UC-xx` (Mã Use Case), `VD-xx` (Mã vấn đề khảo sát).
  * Định danh kỹ thuật hạ tầng (tên thư mục kỹ năng, tên tệp markdown, cú pháp lệnh kích hoạt): Dùng `kebab-case` chữ thường (ví dụ: `system-analysis-survey`, `01-khao-sat-va-pham-vi.md`, `/draw-diagram`).
  * Thư mục hệ thống: `.agents`, `.claude`.
  * Metadata chuẩn YAML frontmatter: `name`, `description`, `trigger`.
* **Quy tắc ánh xạ (Mapping) sang Code / CSDL vật lý:** Khi triển khai mã nguồn (camelCase) hoặc CSDL thực tế (snake_case), phải có bảng ánh xạ minh bạch trong tài liệu thiết kế (ví dụ: Thực thể `DonHang` → Bảng `don_hang`; Thuộc tính `MaDonHang` → Cột `ma_don_hang`); không được tự ý thay đổi quy ước định danh của mô hình nghiệp vụ.

### 2.3. Quy Định Tuyệt Đối Về Đường Dẫn Tương Đối
* Toàn bộ liên kết nội bộ trong repository và trong hồ sơ dự án phải sử dụng **đường dẫn tương đối**.
* Tuyệt đối không hardcode đường dẫn tuyệt đối của môi trường máy cá nhân (`C:\Users\...`, `/home/...`).
* Mọi liên kết Markdown phải được tính tương đối từ vị trí của tệp chứa liên kết đó:
  * Từ `.claude/skills/<skill>/SKILL.md` trỏ về nguồn chuẩn: `../../../.agents/skills/<skill>/SKILL.md`.
  * Từ `SKILL.md` nguồn trỏ đến references nội bộ: `./references/<tệp>.md`.
  * Từ `PTTKHTTT/README.md` trỏ đến các tệp tài liệu: `01-khao-sat-va-pham-vi.md`.
* Khi AI agent thực thi công cụ tệp, phải xác định thư mục gốc của repository trước, sau đó chỉ dùng đường dẫn tương đối tính từ root.

### 2.4. Cấu Trúc Chuẩn Của Một Skill
Mỗi thư mục kỹ năng tại `.agents/skills/<ten-skill>/` tuân theo cấu trúc Agent Skills mở:

```text
.agents/skills/<skill-name>/
├── SKILL.md          # Bắt buộc: Tệp chỉ dẫn chính có YAML frontmatter
└── references/       # Tùy chọn: Tài liệu chuyên sâu (chỉ tạo khi thực sự cần thiết)
```

* **Nguyên tắc tạo thư mục con:** `references/`, `scripts/`, `assets/` chỉ được tạo khi thực sự có tài liệu cần dùng, tuyệt đối không tạo thư mục rỗng.
* **Quy chuẩn `SKILL.md`:**
  * Mỗi kỹ năng bắt buộc có duy nhất một tệp `SKILL.md` làm điểm vào chính.
  * Giữ `SKILL.md` tập trung vào quy trình và hướng dẫn hành động chính; các chi tiết tra cứu hoặc mẫu dàn ý lớn tách sang `references/`.
  * Frontmatter tối thiểu: `name` (chữ thường, số, dấu gạch ngang, tối đa 64 ký tự, khớp với tên thư mục) và `description` (tiếng Việt, nêu rõ khả năng hỗ trợ và thời điểm kích hoạt).

### 2.5. Công Cụ Biểu Đồ & Tính Đúng Đắn Ngữ Nghĩa Học Thuật
* **PlantUML và Mermaid là định dạng mô hình hóa ngữ nghĩa của Producer Skills:**
  * Sử dụng PlantUML (`@startuml` ... `@enduml`) làm định dạng chính để bảo đảm chuẩn mực học thuật cho các mô hình UML; cung cấp Mermaid làm phương án dự phòng khi môi trường người dùng chỉ hỗ trợ Markdown thuần.
  * *Lưu ý quan trọng:* Sử dụng PlantUML không đồng nghĩa với việc biểu đồ tự động đúng chuẩn UML. Mỗi kỹ năng bắt buộc phải kiểm tra tính đúng đắn về ngữ nghĩa, ký hiệu và quan hệ theo chuẩn UML 2.5.
* **Draw.io XML là định dạng kết xuất và chỉnh sửa trực tiếp qua `/draw-diagram`:**
  * Kỹ năng điều phối `/draw-diagram` chịu trách nhiệm tiếp nhận hoặc phát hiện các mô hình biểu đồ (Draw.io, PlantUML, Mermaid, tài liệu) và chuyển đổi/kết xuất sang mã nguồn Draw.io XML (`.drawio.xml`) sử dụng style mặc định, bố cục hình học chuẩn xác và lưu trữ tại `PTTKHTTT/xml/` cùng hình ảnh tại `PTTKHTTT/diagrams/`.
* **Lưu ý về Mermaid Use Case:** Cú pháp `usecase-beta` của Mermaid yêu cầu phiên bản >= 12.0 và còn ở trạng thái beta (dễ lỗi render trên nhiều trình đọc); khi vẽ Use Case bằng Mermaid, ưu tiên dùng `flowchart LR` với ranh giới `subgraph` đóng khung.
* **Phân biệt rạch ròi UML với C4 Model:**
  * UML Component và Deployment tuân thủ chuẩn OMG (Component với Provided/Required Interfaces; Deployment với Nodes và Artifacts).
  * Tuyệt đối không nhầm lẫn sang C4 Component / C4 Deployment.
* **Mô hình dữ liệu (ERD):** Dùng Mermaid `erDiagram` hoặc PlantUML; chuẩn hóa dữ liệu 3NF áp dụng phù hợp ở mức mô hình dữ liệu logic và vật lý.
* **Thiết kế giao diện (Wireframe low-fi):** Dùng bảng Markdown kết hợp ASCII layout. Năm trạng thái giao diện (`Loading`, `Empty`, `Error`, `Success`, `Validation`) là danh sách cần xem xét thiết kế khi chức năng yêu cầu, không phải điều kiện bắt buộc áp đặt cho mọi màn hình đơn giản.

### 2.6. Phân Biệt Rõ Ràng Giữa Skill Và Rule
* **Skill (Kỹ năng):** Là gói tri thức thủ tục hoặc quy trình chuyên biệt, chỉ được nạp và kích hoạt khi nhiệm vụ yêu cầu (thông qua lệnh gọi `/` hoặc `$`, hoặc khớp ngữ nghĩa).
* **Rule (Quy tắc):** Là các ràng buộc chung luôn có hiệu lực trong mọi tác vụ (như quy chuẩn PascalCase, đường dẫn tương đối), được đặt phẳng tại `.agents/rules/*.md`.
* Tuyệt đối không đưa các quy tắc chung luôn áp dụng vào bên trong một Skill, và không đưa các hướng dẫn thủ tục dài vào Rule.

### 2.7. Không Gây Phình Hạ Tầng (Zero Bloat)
* Không tự ý thêm thư viện ngoài vào `package.json` khi chưa có lý do kỹ thuật rõ ràng và được phê duyệt.
* Không tạo các file giả lập (placeholder/dummy) hoặc nội dung chuyên môn giả.

---

## 3. Checklist Kiểm Tra Thủ Công Cho Skill Mới

Trước khi hoàn tất một Skill mới, phải kiểm tra thủ công danh sách tiêu chí sau:

- [ ] **Tên thư mục:** Đúng quy ước `[a-z0-9-]`, tối đa 64 ký tự, phản ánh đúng chức năng.
- [ ] **Điểm vào chính:** Bắt buộc có tệp `SKILL.md` nằm trực tiếp trong thư mục kỹ năng.
- [ ] **Tính nhất quán của `name`:** Trường `name` trong YAML frontmatter trùng khớp 100% với tên thư mục.
- [ ] **Chất lượng `description`:** Viết bằng tiếng Việt, nêu rõ khả năng hỗ trợ và thời điểm kích hoạt.
- [ ] **Định danh mô hình chuẩn hóa:** Tên Class (danh từ), Actor, Use Case (Động từ mạnh + Danh từ), Entity, State, Component tuân thủ PascalCase; riêng Attribute và Method trong Class Diagram tuân thủ camelCase (ngoại trừ các mã trong Allowlist: `FR-xx`, `UC-xx`...).
- [ ] **Đường dẫn tương đối:** Mọi liên kết tài liệu đều là đường dẫn tương đối hợp lệ, không hardcode đường dẫn máy tính cá nhân.
- [ ] **Ngôn ngữ người dùng:** Toàn bộ nội dung hướng dẫn hướng đến người dùng Việt Nam và được viết 100% bằng tiếng Việt.
- [ ] **Không phình tài nguyên:** Chỉ chứa tài nguyên thực sự cần thiết, không có thư mục rỗng hay file mẫu thừa.

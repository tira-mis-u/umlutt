# Cẩm Nang Vòng Đời Dự Án Phân Tích & Thiết Kế Hệ Thống Thông Tin

Tài liệu này chi tiết hóa các bước thực thi vòng đời PTTKHTTT theo từng trạng thái dự án thực tế, đóng vai trò là kim chỉ nam điều phối cho skill `system-analysis`.

---

## 1. Cơ Chế Nhận Diện & Phân Loại Trạng Thái Dự Án (State Intake)

Khi tiếp nhận một bài toán đồ án hoặc bài tập lớn, AI agent không được vội vã tạo file hoặc sinh biểu đồ mà phải thực hiện quét cấu trúc thư mục làm việc (Workspace Scan):

| Trạng thái | Dấu hiệu nhận diện trong Workspace | Mục tiêu hành động chính | Skill Tier 2 chủ đạo |
| :--- | :--- | :--- | :--- |
| **Trạng thái A (Dự án trống)** | Workspace rỗng, hoặc chỉ có tệp `package.json`, `.git` mà không có mã nguồn logic nghiệp vụ hay tài liệu thiết kế. | Xây dựng bài bản từ con số 0 theo quy trình xuôi (Forward Engineering): Khảo sát → Yêu cầu → UML → Dữ liệu → UI → Audit. | Kích hoạt tuần tự từ `survey` đến `audit`. |
| **Trạng thái B (Đã có tài liệu)** | Có sẵn một số tệp văn bản mô tả, slide, biểu đồ hình ảnh hoặc tài liệu thiết kế sơ bộ nhưng chưa có code hoàn chỉnh. | Rà soát hiện trạng (As-is Documentation Audit), xác định lỗ hổng nghiệp vụ, giữ lại các phần đúng, bổ sung các phần còn thiếu. | `audit` (rà soát) → `requirements`/`uml`/`data`/`ui` (bổ sung) → `audit` (nghiệm thu). |
| **Trạng thái C (Đã có mã nguồn)** | Đã tồn tại mã nguồn thực tế (`src/`, `controllers/`, `models/`, `views/`, v.v.). | Dịch ngược mã nguồn (Reverse Engineering), lập ma trận truy vết chức năng, đối chiếu sự sai lệch giữa code và thiết kế, chuẩn hóa hồ sơ hoàn công. | `audit` (đối soát code) → `requirements`/`uml`/`data`/`ui` (tái lập tài liệu) → `audit`. |

---

## 2. Quy Trình Vận Hành Chi Tiết Cho Từng Trạng Thái

### 2.1. Vận Hành Trong Trạng Thái A (Dự Án Trống)

* **Bước A1: Tiếp nhận đề bài & Khảo sát hiện trạng**
  * Kích hoạt: `system-analysis-survey`.
  * Agent thu thập phát biểu bài toán từ người dùng hoặc tài liệu đề tài.
  * Phân tích tổ chức/doanh nghiệp: cơ cấu, đối tượng tham gia, quy trình hiện tại.
  * Lập danh sách các vấn đề nghiệp vụ `VD-01`, `VD-02`,... cùng mục tiêu của hệ thống mới.
  * Kết quả: Tạo `01-khao-sat-va-pham-vi.md`.
* **Bước A2: Phân tích yêu cầu & Xác định Use Case**
  * Kích hoạt: `system-analysis-requirements`.
  * Phân tích đa chiều từng vấn đề nghiệp vụ `VD-xx` để chọn hướng xử lý phù hợp: chuyển đổi thành yêu cầu chức năng `FR-xx` (nếu cần phần mềm hóa), yêu cầu phi chức năng `NFR-xx` (nếu liên quan đến hiệu năng/bảo mật), quy tắc nghiệp vụ `BR-xx` (nếu do thiếu ràng buộc), đề xuất thay đổi quy trình tổ chức (không giải quyết bằng phần mềm), hoặc xác định ngoài phạm vi.
  * Xác định các Actor nghiệp vụ (`QuanLy`, `NhanVien`, `KhachHang`,...) và các Use Case (`TaoDonHang`, `DangKyMonHoc`,...).
  * Lập bảng đặc tả chi tiết cho các Use Case trọng tâm.
  * Kết quả: Tạo `02-yeu-cau-va-use-case.md`.
* **Bước A3: Mô hình hóa kiến trúc & 7 biểu đồ UML**
  * Kích hoạt: `system-analysis-uml`.
  * Quyết định biểu đồ cần vẽ cho từng chức năng (không áp đặt cứng nhắc vẽ cả 7 biểu đồ cho mọi chức năng đơn giản).
  * Vẽ biểu đồ Use Case tổng thể (`03`), Biểu đồ Lớp miền nghiệp vụ (`04`), Biểu đồ Tuần tự cho kịch bản chính (`05`), Biểu đồ Hoạt động cho luồng xử lý phức tạp (`06`), Biểu đồ Máy trạng thái cho thực thể có vòng đời (`07`), Biểu đồ Thành phần (`08`), Biểu đồ Triển khai (`09`).
  * Lưu trữ mã nguồn PlantUML tại `PTTKHTTT/diagrams/`.
* **Bước A4: Thiết kế dữ liệu & Giao diện người dùng**
  * Kích hoạt: `system-analysis-data` để thiết kế mô hình dữ liệu ERD, chuẩn hóa 3NF và lập bảng ánh xạ sang CSDL vật lý (`10-mo-hinh-du-lieu-erd.md`).
  * Kích hoạt: `system-analysis-ui` để thiết kế các phác thảo Wireframe (dạng bảng Markdown + ASCII) và xem xét 5 trạng thái giao diện (`11-thiet-ke-giao-dien-wireframe.md`).
* **Bước A5: Thẩm định & Khóa hồ sơ (Pre-implementation Gate)**
  * Kích hoạt: `system-analysis-audit` để chạy kiểm tra toàn bộ tính nhất quán liên biểu đồ và ma trận truy vết.

---

### 2.2. Vận Hành Trong Trạng Thái B (Đã Có Tài Liệu)

* **Bước B1: Audit tài liệu hiện trạng (Current-State Audit)**
  * Kích hoạt: `system-analysis-audit`.
  * Agent đọc kỹ toàn bộ tài liệu có sẵn, ghi nhận danh sách tài liệu và nội dung tương ứng.
  * Thiết lập bảng kiểm kê hồ sơ tại `PTTKHTTT/README.md`: đánh giá tình trạng từng mục (`Đã có - Chuẩn`, `Đã có - Mâu thuẫn`, `Còn thiếu`).
* **Bước B2: Khoanh vùng sai lệch & Làm rõ thông tin**
  * Nhận diện các điểm đứt gãy: ví dụ Use Case có trong bản vẽ nhưng thiếu trong bảng đặc tả, hoặc Class thiếu phương thức phục vụ Sequence.
  * Với các thông tin chưa rõ: gắn nhãn `[Assumption]` và tạo danh sách câu hỏi phỏng vấn người dùng.
* **Bước B3: Bổ sung và chuẩn hóa theo quy chuẩn**
  * Kích hoạt các skill tương ứng (`requirements`, `uml`, `data`, `ui`) để bổ sung các tệp còn thiếu vào cấu trúc chuẩn 11 tệp `PTTKHTTT/`.
  * Chuẩn hóa lại định danh nghiệp vụ sang PascalCase không dấu nếu tài liệu cũ dùng lẫn lộn tiếng Anh/tiếng Việt có dấu.
* **Bước B4: Tái thẩm định và cập nhật Ma trận truy vết**
  * Kích hoạt `system-analysis-audit` lần cuối để nghiệm thu hồ sơ.

---

### 2.3. Vận Hành Trong Trạng Thái C (Đã Có Mã Nguồn)

* **Bước C1: Kiểm kê mã nguồn (Code Inventory Scan)**
  * Agent quét toàn bộ workspace để tìm các file định nghĩa thực thể (Entities/Models), điều phối (Controllers/Routes), giao dịch (Services/UseCases), giao diện (Views/Pages/Components) và lược đồ cơ sở dữ liệu (Migrations/Schemas).
  * Lập danh sách toàn bộ các chức năng thực tế mà mã nguồn đang hỗ trợ.
* **Bước C2: Đối soát từng chức năng (Function-by-Function Audit)**
  * Kích hoạt: `system-analysis-audit`.
  * Duy trì quy tắc cô lập chức năng: xử lý dứt điểm từng chức năng trước khi chuyển sang chức năng kế tiếp.
  * Với mỗi chức năng, tìm bằng chứng cụ thể trong code theo luồng end-to-end (Route, UI, Controller/Service, Model/Entity, Database schema, Auth, Validation, Test, Config) và đánh giá theo 5 kết quả chuẩn:
    * `Khớp` (Matched): Code và tài liệu To-be đồng thuận tuyệt đối về logic và dữ liệu.
    * `Thiếu` (Missing): Thành phần được yêu cầu nhưng chưa có hoặc chưa triển khai đầy đủ (ví dụ: Controller tồn tại nhưng rỗng, chưa viết logic service hay lưu DB; hoặc tài liệu chưa mô tả chức năng trong code).
    * `Mâu thuẫn` (Conflicting): Có bằng chứng về hai phần tài liệu hoặc triển khai xung đột thực tế (ví dụ: code có 4 trạng thái nhưng State Machine chỉ vẽ 3 trạng thái; kiểu dữ liệu trong code đối nghịch mô hình).
    * `Code ngoài phạm vi` (Out-of-Scope Code): Các hàm thử nghiệm, tính năng phát sinh không phục vụ mục tiêu bài toán.
    * `Không thể kết luận` (Inconclusive): Code thiếu chú thích, thông tin quá mơ hồ không đủ bằng chứng để xác định, cần phỏng vấn người dùng.
    * *(Quy định N/A: `N/A (kèm lý do)` là trạng thái miễn áp dụng riêng biệt cho biểu đồ hoặc thành phần không cần thiết cho chức năng đó, không gộp thành kết quả lỗi audit).*
* **Bước C3: Tái thiết kế hồ sơ hoàn công (As-is & To-be Alignment)**
  * Kích hoạt các skill Tier 2 để tạo lập hoặc cập nhật hồ sơ `PTTKHTTT/` tương ứng với mã nguồn thực tế.
  * Phân định rõ ràng: Mô hình hiện trạng mã nguồn (As-is) và Đề xuất cải tiến chuẩn hóa (To-be).
* **Bước C4: Đánh giá tác động toàn cục (Global Impact Analysis)**
  * Kiểm tra việc đồng bộ hồ sơ hoặc sửa đổi mã nguồn có gây ảnh hưởng phụ đến các phân hệ khác hay không.

---

## 3. Quản Lý Nguồn Gốc Thông Tin (Epistemic Status Lifecycle)

Trong suốt vòng đời dự án, mức độ tin cậy của thông tin phải được nâng dần theo mô hình:

```
[Assumption] (Giả định tạm thời)
     │
     ├── (Hỏi và được người dùng xác nhận) ─────────> [User-confirmed]
     │
     └── (Thu thập được đề bài / code / chứng từ) ──> [Evidence]
                                                          │
                                                          ▼ (Suy luận logic có căn cứ)
                                                     [Inference]
```

* **Phạm vi áp dụng nhãn:** Chỉ gắn nhãn cho dữ kiện nghiệp vụ thực tế, phát biểu yêu cầu, kết luận khảo sát, suy luận nghiệp vụ và các quyết định thiết kế có ảnh hưởng. Không bắt buộc gắn nhãn cho mọi câu mô tả thông thường, tiêu đề, kiến thức UML phổ quát hoặc hướng dẫn cú pháp. Mọi ví dụ dữ liệu mẫu trong tài liệu phải gắn nhãn `[Illustrative only]` để tránh việc agent sao chép thành sự thật của dự án.
* **Tuyệt đối cấm:** Đưa một mục `[Assumption]` vào tài liệu thiết kế chính thức mà không ghi chú cảnh báo hoặc chưa hỏi người dùng.
* **Bắt buộc:** Trước khi chuyển sang giai đoạn lập trình, 100% các mục quan trọng phải đạt trạng thái `[Evidence]`, `[User-confirmed]` hoặc `[Inference]` có dẫn chứng.


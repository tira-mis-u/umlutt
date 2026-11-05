---
name: system-analysis
description: Skill tổng điều phối quy trình Phân tích và Thiết kế Hệ thống Thông tin (PTTKHTTT) cho đồ án và bài tập lớn. Tự động nhận diện trạng thái dự án (A: Dự án trống, B: Đã có tài liệu, C: Đã có mã nguồn), điều phối các skill chuyên môn Tier 2 và quản lý hồ sơ truy vết chức năng PTTKHTTT. Kích hoạt khi bắt đầu đồ án mới, tiếp nhận dự án hoặc cần điều phối toàn diện vòng đời phân tích thiết kế.
---

# Skill Tổng Điều Phối Phân Tích & Thiết Kế Hệ Thống Thông Tin (`system-analysis`)

Kỹ năng này đóng vai trò là **nhạc trưởng (Orchestrator - Tier 1)** điều phối toàn bộ vòng đời Phân tích và Thiết kế Hệ thống Thông tin (PTTKHTTT) cho đồ án môn học và bài tập lớn. Kỹ năng chịu trách nhiệm nhận diện trạng thái thực tế của dự án, vạch ra lộ trình thực hiện, kích hoạt tuần tự các kỹ năng chuyên môn Tier 2 và bảo đảm tính truy vết hai chiều (Bidirectional Traceability) của toàn bộ hồ sơ.

---

## 1. Vai Trò Kiến Trúc & Ranh Giới Trách Nhiệm

```
[Tier 1: system-analysis (Tổng điều phối)]
       │
       ├──> system-analysis-survey       (Khảo sát hiện trạng & Phạm vi)
       ├──> system-analysis-requirements (Phân tích yêu cầu, BR & Use Case)
       ├──> system-analysis-uml          (Mô hình hóa 7 biểu đồ UML chuẩn OMG)
       ├──> system-analysis-data         (Thiết kế dữ liệu, ERD & Chuẩn hóa 3NF)
       ├──> system-analysis-ui           (Thiết kế Wireframe & Luồng giao diện)
       ├──> draw-diagram                 (Kết xuất Draw.io XML, Geometry Validation & Export ảnh)
       └──> system-analysis-audit        (Thẩm định tính nhất quán & Đối soát Code)
```

* **Trách nhiệm của Tier 1 (`system-analysis`):**
  * Nhận diện trạng thái dự án (A, B hay C).
  * Xác định thứ tự kích hoạt, đầu vào và đầu ra giữa các skill Tier 2 và Renderer Engine.
  * Điều phối chuyển giao mô hình từ các Producer Skills sang `draw-diagram` để kết xuất Draw.io XML (`PTTKHTTT/xml/`), kiểm định hình học tự động và xuất ảnh (`PTTKHTTT/diagrams/`).
  * Quản lý ma trận truy vết chức năng (Traceability Matrix) tại `PTTKHTTT/README.md`.
  * Điều phối cổng nghiệm thu trước lập trình (Pre-Implementation Gate).
* **Điều Tier 1 KHÔNG làm:**
  * Không trực tiếp viết chi tiết biểu mẫu khảo sát (giao cho `system-analysis-survey`).
  * Không trực tiếp đặc tả chi tiết kịch bản Use Case (giao cho `system-analysis-requirements`).
  * Không trực tiếp sinh mã nguồn biểu đồ PlantUML (giao cho `system-analysis-uml`).
  * Không trực tiếp thiết kế cấu trúc bảng CSDL (giao cho `system-analysis-data`).
  * Không trực tiếp vẽ ASCII wireframe (giao cho `system-analysis-ui`).
  * Không trực tiếp tính toán tọa độ hay kết xuất Draw.io XML (giao cho `draw-diagram`).
  * Không trực tiếp thực hiện đối soát chi tiết từng dòng code (giao cho `system-analysis-audit`).

---

## 2. Nguyên Tắc Hành Động Cốt Lõi

1. **Gắn nhãn nguồn gốc thông tin (Epistemic Status Tagging):**
   Áp dụng nhãn cho các dữ kiện nghiệp vụ thực tế, phát biểu yêu cầu, kết luận khảo sát, suy luận và quyết định thiết kế có ảnh hưởng. Bắt buộc sử dụng 1 trong 4 nhãn:
   * `[Evidence]`: Bằng chứng trực tiếp từ đề bài, tài liệu khảo sát hoặc mã nguồn thực tế.
   * `[User-confirmed]`: Thông tin đã được người dùng xác nhận trực tiếp qua trao đổi.
   * `[Inference]`: Suy luận logic có cơ sở minh bạch từ bằng chứng.
   * `[Assumption]`: Giả định nghiệp vụ tạm thời; **bắt buộc phải đặt câu hỏi làm rõ với người dùng, tuyệt đối không tự biến giả định thành sự thật**.
   *(Lưu ý về phạm vi: Không bắt buộc gắn nhãn cho mọi câu mô tả thông thường, tiêu đề, kiến thức UML phổ quát hoặc hướng dẫn cú pháp. Mọi ví dụ dữ liệu mẫu trong tài liệu phải gắn nhãn `[Illustrative only]` để tránh việc agent sao chép thành sự thật của dự án).*
2. **Quy chuẩn định danh nghiệp vụ PascalCase:**
   Áp dụng tiếng Việt không dấu chuẩn PascalCase cho toàn bộ định danh nghiệp vụ trong mô hình (`QuanLy`, `KhachHang`, `TaoDonHang`, `MaDonHang`, `TinhTongTien()`). Bảo toàn Allowlist chuẩn (`FR-xx`, `NFR-xx`, `BR-xx`, `UC-xx`, `VD-xx`).
3. **Độ phủ hồ sơ vs Độ phủ từng chức năng:**
   * *Cấp đồ án:* Hồ sơ `PTTKHTTT/` cần có đủ các tệp tài liệu tương ứng với từng khía cạnh kỹ thuật để đáp ứng chuẩn học thuật.
   * *Cấp chức năng:* Không ép buộc mọi chức năng phải xuất hiện trên đủ 7 biểu đồ UML hay màn hình giao diện. Một chức năng đơn giản được phép đánh dấu `N/A (kèm lý do nghiệp vụ)`.
4. **Không bắt đầu bằng giải pháp kỹ thuật:** Không lựa chọn công nghệ, thư viện, Class hay CSDL trước khi hiểu rõ bài toán nghiệp vụ.

---

## 3. Quy Trình Phân Loại & Điều Phối Theo Trạng Thái Dự Án

Khi kích hoạt, agent bắt buộc phải thực hiện quét workspace để xác định trạng thái dự án:

```
                  ┌───────────────────────────────┐
                  │ BƯỚC 0: Quét toàn bộ Workspace │
                  └──────────────┬────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
  [TRẠNG THÁI A]          [TRẠNG THÁI B]          [TRẠNG THÁI C]
   Dự án trống         Đã có tài liệu/thiết kế     Đã có mã nguồn
         │                       │                       │
         ▼                       ▼                       ▼
Khảo sát ─────────>   Audit tài liệu ───────>   Lập danh mục code ──>
Phân tích yêu cầu ─>  Khoanh vùng thiếu/lỗi ─>  Audit As-is vs To-be >
UML & Data & UI ──>   Bổ sung & Đồng bộ ────>   Đồng bộ hồ sơ ──────>
Thẩm định (Audit) ─>  Thẩm định (Audit) ────>   Thẩm định (Audit)
```

### 3.1. Kịch Bản A: Dự Án Trống (Greenfield Project)
* *Điều kiện kích hoạt:* Workspace chưa có mã nguồn hoặc chỉ có tệp khởi tạo dự án rỗng.
* *Quy trình điều phối:*
  1. Khởi tạo thư mục `PTTKHTTT/` và tệp chỉ mục `README.md`.
  2. Kích hoạt `system-analysis-survey` để thu thập hiện trạng, xác định vấn đề nghiệp vụ `VD-xx`, tạo `01-khao-sat-va-pham-vi.md`.
  3. Kích hoạt `system-analysis-requirements` để phân tích đa chiều từng vấn đề nghiệp vụ `VD-xx` (xác định phương án xử lý phù hợp: chuyển đổi thành yêu cầu chức năng `FR-xx`, phi chức năng `NFR-xx`, quy tắc nghiệp vụ `BR-xx`, đề xuất thay đổi quy trình, hoặc xác định ngoài phạm vi) và xây dựng danh mục Use Case `UC-xx`, tạo `02-yeu-cau-va-use-case.md`.
  4. Kích hoạt `system-analysis-uml` để mô hình hóa hệ thống sang các biểu đồ UML cần thiết (`03` đến `09`), lưu mô hình tại `PTTKHTTT/models/`.
  5. Kích hoạt `system-analysis-data` để thiết kế mô hình dữ liệu ERD và chuẩn hóa 3NF (`10-mo-hinh-du-lieu-erd.md`), lưu mô hình tại `PTTKHTTT/models/`.
  6. Kích hoạt `system-analysis-ui` để thiết kế luồng tương tác và Wireframe giao diện (`11-thiet-ke-giao-dien-wireframe.md`).
  7. Kích hoạt `draw-diagram` để tiếp nhận toàn bộ mô hình nguồn, kết xuất sang Draw.io XML tại `PTTKHTTT/xml/`, chạy kiểm định hình học qua `validate_drawio_xml.ps1` và xuất ảnh SVG/PNG sang `PTTKHTTT/diagrams/`.
  8. Kích hoạt `system-analysis-audit` để thẩm định toàn diện tính nhất quán trước khi chuyển sang lập trình.

### 3.2. Kịch Bản B: Dự Án Đã Có Tài Liệu / Thiết Kế
* *Điều kiện kích hoạt:* Workspace đã có một số tài liệu phân tích, biểu đồ hoặc bản vẽ thiết kế nhưng chưa có mã nguồn.
* *Quy trình điều phối:*
  1. Kích hoạt `system-analysis-audit` ở chế độ **Audit Tài Liệu**: lập bản đồ hiện trạng hồ sơ, phát hiện khoảng trống thông tin và các điểm mâu thuẫn giữa các tài liệu có sẵn.
  2. Với các khoảng trống thông tin: kích hoạt skill chuyên môn tương ứng (`survey`, `requirements`, `uml`, `data` hoặc `ui`) để bổ sung. **Tuyệt đối không xóa bỏ tài liệu cũ mà phải kế thừa có chọn lọc**.
  3. Đồng bộ lại mã truy vết chức năng tại `PTTKHTTT/README.md`.
  4. Tái thẩm định hồ sơ qua `system-analysis-audit`.

### 3.3. Kịch Bản C: Dự Án Đã Có Mã Nguồn (Code-First / Reverse Engineering)
* *Điều kiện kích hoạt:* Workspace đã có mã nguồn hoạt động (`src/`, `app/`, `backend/`, `models/`, v.v.).
* *Quy trình điều phối:*
  1. Quét cây mã nguồn để trích xuất danh mục chức năng thực tế (Inventory).
  2. Kích hoạt `system-analysis-audit` ở chế độ **Đối Soát Code vs Thiết Kế**:
     * Đối chiếu từng chức năng từ mã nguồn theo luồng end-to-end qua các khía cạnh kiến trúc thực tế (Route/API, UI, Controller/Service, Model/Entity, Database schema, Auth, Validation, Test, Config), không ép buộc cứng nhắc mọi dự án phải theo mô hình 4 tầng cố định.
     * Đánh giá theo 5 kết quả chuẩn (`Khớp`, `Thiếu`, `Mâu thuẫn`, `Code ngoài phạm vi`, `Không thể kết luận`) và quy định `N/A (kèm lý do)` là trạng thái miễn áp dụng riêng biệt.
     * Không kết luận chức năng hoàn thành chỉ vì thấy tên Class hoặc Controller; phải kiểm tra đầy đủ việc xử lý logic nghiệp vụ và dữ liệu thực tế.
  3. Với các chức năng chưa có tài liệu: kích hoạt tuần tự các skill Tier 2 để lập hồ sơ hoàn công (As-is Documentation).
  4. Đánh giá tác động toàn cục sau khi đồng bộ hồ sơ.

*Chi tiết quy trình từng bước của 3 trạng thái được quy định tại:* [project-lifecycle.md](./references/project-lifecycle.md)

---

## 4. Quản Lý Cấu Trúc Hồ Sơ & Ma Trận Truy Vết

Tier 1 quản lý thống nhất cấu trúc hồ sơ tại thư mục `PTTKHTTT/` gồm 11 tài liệu đánh số thứ tự tuần tự:

```text
PTTKHTTT/
├── README.md                          # Bản đồ hồ sơ & Ma trận truy vết chức năng
├── 01-khao-sat-va-pham-vi.md          # Kết quả khảo sát, hiện trạng & Vấn đề VD-xx
├── 02-yeu-cau-va-use-case.md          # Yêu cầu FR/NFR/BR & Danh mục Use Case UC-xx
├── 03-so-do-use-case.md               # Biểu đồ Use Case tổng thể & phân hệ
├── 04-bieu-do-lop.md                  # Biểu đồ lớp (Class Diagram) miền nghiệp vụ
├── 05-bieu-do-tuan-tu.md              # Biểu đồ tuần tự (Sequence Diagram) các kịch bản chính
├── 06-bieu-do-hoat-dong.md            # Biểu đồ hoạt động (Activity Diagram) các luồng phức tạp
├── 07-bieu-do-trang-thai.md           # Biểu đồ máy trạng thái (State Machine) các thực thể vòng đời
├── 08-bieu-do-thanh-phan.md           # Biểu đồ thành phần (Component Diagram) chuẩn OMG
├── 09-bieu-do-trien-khai.md           # Biểu đồ triển khai (Deployment Diagram) đồ án & đề xuất
├── 10-mo-hinh-du-lieu-erd.md          # Mô hình dữ liệu ERD & Chuẩn hóa 3NF
├── 11-thiet-ke-giao-dien-wireframe.md # Thiết kế Wireframe giao diện (bảng Markdown + ASCII)
├── models/                            # Mã nguồn mô hình ngữ nghĩa (.puml, .mmd, đặc tả)
├── xml/                               # Mã nguồn Draw.io XML (.drawio.xml)
└── diagrams/                          # Hình ảnh biểu đồ kết xuất (.svg, .png)
```

*Mẫu Ma trận truy vết hai chiều được định nghĩa tại:* [traceability-matrix.md](./references/traceability-matrix.md)

---

## 5. Cổng Nghiệm Thu Trước Khi Lập Trình (Pre-Implementation Gate)

Trước khi chuyển giao dự án cho việc viết code hoặc can thiệp sâu vào kiến trúc phần mềm, agent phải đảm bảo:

1. Trạng thái dự án đã được xác định chính xác và có bằng chứng cụ thể.
2. Ma trận truy vết chức năng tại `PTTKHTTT/README.md` đã được điền đầy đủ cho 100% chức năng.
3. Không còn bất kỳ nhãn `[Assumption]` nào chưa được người dùng làm rõ.
4. Không còn mục nào ở trạng thái `Không thể kết luận` hoặc `Mâu thuẫn` mà chưa có giải pháp xử lý.
5. Skill `system-analysis-audit` đã hoàn thành lượt kiểm tra và xác nhận đạt yêu cầu.


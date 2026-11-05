---
name: system-analysis-requirements
description: Skill chuyên sâu về phân tích và đặc tả yêu cầu phần mềm, quy tắc nghiệp vụ BR và danh mục Use Case cho đồ án PTTKHTTT. Chuyển đổi vấn đề khảo sát VD-xx thành yêu cầu chức năng FR-xx, phi chức năng NFR-xx, quy tắc nghiệp vụ BR-xx, xác định Actor và Use Case UC-xx kèm bảng đặc tả chi tiết. Kích hoạt sau bước khảo sát hoặc khi cần chuẩn hóa yêu cầu và kịch bản nghiệp vụ.
---

# Kỹ Năng Phân Tích Yêu Cầu & Đặc Tả Use Case (`system-analysis-requirements`)

Kỹ năng này thuộc **Nhóm Tier 2**, chịu trách nhiệm chuyển hóa các phát hiện từ khảo sát hiện trạng (`VD-xx`) thành bộ đặc tả yêu cầu hệ thống hoàn chỉnh gồm Yêu cầu chức năng (`FR-xx`), Yêu cầu phi chức năng (`NFR-xx`), Quy tắc nghiệp vụ (`BR-xx`) và Danh mục Use Case (`UC-xx`) có đặc tả kịch bản chi tiết tại `PTTKHTTT/02-yeu-cau-va-use-case.md`.

---

## 1. Vai Trò & Ranh Giới Trách Nhiệm

* **Trách nhiệm chính:**
  * Ánh xạ các vấn đề khảo sát `VD-xx` sang các yêu cầu chức năng `FR-01`, `FR-02`,...
  * Xác định các yêu cầu phi chức năng `NFR-xx` (hiệu năng, an toàn bảo mật, tính khả dụng).
  * Chiết xuất các quy tắc nghiệp vụ ràng buộc `BR-01`, `BR-02`,... (công thức, điều kiện nghiệp vụ).
  * Xác định ranh giới hệ thống (System Boundary) và các Actor nghiệp vụ ngoài ranh giới.
  * Phân rã các Use Case `UC-01`, `UC-02`,... bảo đảm cung cấp giá trị trọn vẹn cho Actor.
  * Viết bảng đặc tả chi tiết cho từng Use Case trọng tâm (tiền điều kiện, luồng chính, luồng phụ, ngoại lệ, hậu điều kiện).
* **Ranh giới (Điều kỹ năng này KHÔNG làm):**
  * Không vẽ biểu đồ Use Case bằng PlantUML/Mermaid (thuộc về `system-analysis-uml` hoặc `/uml-uc-diagram`).
  * Không thiết kế biểu đồ lớp Class Diagram (thuộc về `system-analysis-uml` hoặc `/uml-class-diagram`).
  * Không thiết kế cơ sở dữ liệu ERD (thuộc về `system-analysis-data`).

---

## 2. Đầu Vào & Đầu Ra

* **Đầu vào:**
  * Tệp khảo sát hiện trạng: `PTTKHTTT/01-khao-sat-va-pham-vi.md`.
  * Danh mục vấn đề nghiệp vụ mã hóa `VD-xx` và bảng phân tích chứng từ.
* **Đầu ra:**
  * Tệp đặc tả hoàn chỉnh: `PTTKHTTT/02-yeu-cau-va-use-case.md`.
  * Ma trận ánh xạ: `VD-xx` → `FR-xx` → `UC-xx`.
  * Danh mục Actor và bảng đặc tả kịch bản Use Case chuẩn hóa.

---

## 3. Quy Trình Phân Tích & Đặc Tả Yêu Cầu (6 Bước)

```
[B1: Phân tích hướng xử lý VD] ──> [B2: Xác định NFR] ──> [B3: Chiết xuất Quy tắc BR]
                                                                        │
[B6: Đặc tả kịch bản UC]       <── [B5: Xác định Use Case] <── [B4: Xác định Actor]
```

### Bước 1: Phân tích đa chiều Vấn đề khảo sát (`VD-xx`)
* **Không bắt buộc mỗi `VD-xx` phải sinh ra một `FR-xx`:** Mỗi vấn đề nghiệp vụ phải được phân tích để xác định phương án xử lý phù hợp nhất:
  1. *Yêu cầu chức năng (`FR-xx`):* Khi vấn đề cần giải quyết bằng chức năng phần mềm tự động hóa (Ví dụ minh họa: `VD-01` nhầm giá → `FR-01`: Quét mã và tính tiền tự động `[Illustrative only]`).
  2. *Yêu cầu phi chức năng (`NFR-xx`):* Khi vấn đề liên quan đến độ trễ, thời gian phản hồi, an toàn bảo mật hoặc tính khả dụng.
  3. *Quy tắc nghiệp vụ (`BR-xx`):* Khi vấn đề xuất phát từ việc thiếu chính sách hoặc quy định kiểm soát lỏng lẻo.
  4. *Thay đổi quy trình tổ chức (Process/Policy change):* Khi vấn đề thuộc về cơ chế quản lý, phân công nhân sự hoặc văn hóa làm việc không cần và không nên giải quyết bằng phần mềm.
  5. *Ngoài phạm vi (`Out-of-Scope`):* Khi vấn đề vượt quá giới hạn hoặc thời lượng của đồ án.
  6. *Chưa đủ thông tin:* Cần đưa vào danh sách câu hỏi để khảo sát làm rõ thêm với người dùng.
* Tuyệt đối không ép tạo yêu cầu phần mềm nếu vấn đề không cần giải quyết bằng phần mềm. Mỗi yêu cầu chức năng thực tế khi được xác định phải có tiêu chí kiểm thử nghiệm thu (Acceptance Criteria) rõ ràng.

### Bước 2: Xác định Yêu cầu phi chức năng (`NFR-xx`)
* Phân loại theo các nhóm chuẩn (dưới đây là các ví dụ minh họa hư cấu, không sao chép vào dự án thực tế):
  * *Hiệu năng (Performance):* Thời gian phản hồi tìm kiếm < 2 giây với 100,000 bản ghi `[Illustrative only]`.
  * *Bảo mật (Security):* Mã hóa mật khẩu bằng BCrypt/Argon2; phân quyền RBAC theo vai trò `[Illustrative only]`.
  * *Độ tin cậy (Reliability):* Tự động sao lưu dữ liệu giao dịch hàng ngày `[Illustrative only]`.
  * *Tính khả dụng (Usability):* Giao diện tương thích máy tính để bàn và máy quét mã vạch cầm tay.

### Bước 3: Chiết xuất Quy tắc nghiệp vụ (`BR-xx`)
* Tách biệt rạch ròi giữa **Quy tắc nghiệp vụ (Business Rules)** và **Chức năng phần mềm (Features)**:
  * *Chức năng:* Cho phép áp mã giảm giá.
  * *Quy tắc nghiệp vụ (`BR-01` - minh họa):* Mỗi đơn hàng chỉ được áp dụng tối đa 1 mã giảm giá; đơn hàng từ 500,000 VNĐ mới được áp dụng mã `FREESHIP` `[Illustrative only]`.
  * *Quy tắc nghiệp vụ (`BR-02` - minh họa):* Khách hàng nợ quá 30 ngày không được phép tạo đơn hàng mới `[Illustrative only]`.
* *(Ghi chú về nhãn: Áp dụng nhãn xác thực cho dữ kiện nghiệp vụ, yêu cầu và quyết định thiết kế thực tế; các ví dụ hư cấu trong tài liệu dùng nhãn `[Illustrative only]`).*

### Bước 4: Nhận diện Actor & Ranh giới hệ thống (System Boundary)
* **Actor là ai?** Là các thực thể bên ngoài tương tác trực tiếp qua lại với hệ thống (người dùng hoặc hệ thống ngoài).
* **Quy chuẩn đặt tên Actor:**
  * Bắt buộc dùng danh từ số ít, tiếng Việt không dấu chuẩn **PascalCase**: `QuanLy`, `NhanVien`, `KhachHang`, `ThuThu`, `CongThanhToan`.
  * *Tuyệt đối cấm:* Đưa lập trình viên (`Developer`), người kiểm thử (`Tester`), hoặc cơ sở dữ liệu (`Database`) vào làm Actor.

### Bước 5: Phân rã Danh mục Use Case (`UC-xx`) & Phong cách biểu diễn
* **Use Case là gì?** Là một chuỗi hành động mang lại một **mục tiêu và giá trị nghiệp vụ trọn vẹn** cho Actor.
* **Quy tắc đặt tên Use Case:**
  * Bắt buộc dùng cấu trúc: `[ĐộngTừMạnh] + [DanhTừ/ĐốiTượng]` theo chuẩn **PascalCase**: `TaoDonHang`, `DangKyMonHoc`, `TraCuuSach`, `HuyDonHang`. Tránh tên mơ hồ (`XuLy`, `ThucHien`, `ChucNang1`). Tuyệt đối không dùng camelCase cho Use Case.
  * Không tách các thao tác nhỏ không có giá trị mục tiêu nghiệp vụ độc lập thành Use Case (ví dụ: bấm nút lưu, mở màn hình, nhập text field).
* **Hai cách thể hiện Use Case chi tiết (Hỗ trợ cả hai tùy mức độ yêu cầu):**
  1. *Individual Use Cases (Mô hình hóa độc lập):* Mỗi mục tiêu nghiệp vụ độc lập là một hình elip riêng biệt có Actor kết nối trực tiếp.
  2. *Grouped Functional Overview (Tổng quan nhóm chức năng):* Một hình elip tổng quát đi cùng khối UML Note liệt kê các chức năng con. Các dòng trong Note không tự động trở thành Use Case độc lập.
* **Quy chuẩn quan hệ và hướng liên kết:**
  * Association giữa Actor và Use Case: Nét liền, KHÔNG CÓ ĐẦU MŨI TÊN (undirected).
  * Generalization: Nét liền, tam giác rỗng hướng từ phần tử chuyên biệt đến phần tử tổng quát.
  * `«include»`: Nét đứt, đầu mở, từ Use Case cơ sở đến Use Case được bao gồm (`DatHang -> XacThuc`). Thể hiện hành vi bắt buộc. Không máy móc coi Include phải chạy trước toàn bộ Use Case cơ sở. Không tự động include `DangNhap` vào mọi Use Case; nếu Use Case yêu cầu người dùng đã xác thực, có thể mô tả trạng thái xác thực trong tiền điều kiện; nếu hệ thống hỗ trợ khách chưa đăng nhập, đăng nhập tùy chọn hoặc luồng xác thực khác, phải mô hình hóa theo nghiệp vụ thực tế (không giả định mọi Actor đều đã đăng nhập).
  * `«extend»`: Nét đứt, đầu mở, từ Use Case mở rộng đến Use Case cơ sở (`ThanhToanBangVi -> ThanhToan`). Thể hiện hành vi mở rộng có điều kiện.

### Bước 6: Soạn thảo Bảng đặc tả Use Case chi tiết (Khi người dùng yêu cầu)
* **Quy tắc kích hoạt:** Chỉ tạo bảng đặc tả khi người dùng yêu cầu rõ ràng; không tự ý tạo bảng đặc tả nếu chỉ được yêu cầu vẽ diagram.
* **Định dạng chuẩn 6 trường:** Khi được yêu cầu, tạo bảng hai cột với đúng sáu trường theo đúng thứ tự:
  1. Tên Usecase (kèm mã `UC-xx`, viết PascalCase)
  2. Tác nhân (Actor tham gia chính/phụ)
  3. Tiền điều kiện (Điều kiện cần có trước khi bắt đầu Use Case)
  4. Mục đích (Giá trị nghiệp vụ mà Use Case đem lại cho Actor)
  5. Dòng sự kiện chính (Chuỗi bước tuần tự của kịch bản thành công)
  6. Dòng sự kiện phụ (Các luồng rẽ nhánh và luồng xử lý ngoại lệ)
* **Ràng buộc:** Mỗi Use Case có một bảng đặc tả riêng biệt. Tuyệt đối không tự ý thêm trường ngoài 6 trường chuẩn.

---

## 4. Cơ Chế Xử Lý Mâu Thuẫn & Độ Ưu Tiên Yêu Cầu

Khi phát hiện mâu thuẫn hoặc phạm vi bài toán quá rộng so với thời lượng đồ án:
1. Áp dụng phương pháp phân loại **MoSCoW**:
   * **Must have (Bắt buộc phải có):** Các chức năng cốt lõi bắt buộc để hệ thống vận hành và demo đồ án.
   * **Should have (Nên có):** Các tính năng quan trọng nhưng có thể dùng giải pháp thay thế tạm thời.
   * **Could have (Có thể có):** Tính năng tiện ích, chỉ thực hiện khi còn dư thời gian.
   * **Won't have (Bảo lưu):** Nằm ngoài phạm vi đồ án lần này, ghi rõ vào mục Out-of-Scope.
2. Với các yêu cầu chưa có thông tin xác nhận: gán nhãn `[Assumption]` và gửi bảng câu hỏi phỏng vấn lại người dùng.

---

## 5. Chuyển Giao Cho Bước Tiếp Theo (Handover to UML)

Sau khi hoàn thành `02-yeu-cau-va-use-case.md`:
* Bàn giao danh mục Actor, Use Case `UC-xx` và các kịch bản tương tác cho skill `system-analysis-uml`.
* Kích hoạt `system-analysis-uml` để chuyển đổi bảng đặc tả Use Case thành Biểu đồ Use Case (`03`), Biểu đồ Lớp (`04`) và Biểu đồ Tuần tự (`05`).

*Xem chi tiết biểu mẫu đặc tả yêu cầu tại:* [requirements-templates.md](./references/requirements-templates.md)


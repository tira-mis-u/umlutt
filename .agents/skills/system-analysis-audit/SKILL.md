---
name: system-analysis-audit
description: Skill chuyên sâu về thẩm định, kiểm toán tính nhất quán toàn diện hồ sơ PTTKHTTT và đối soát mã nguồn. Thực hiện kiểm kê toàn bộ chức năng trước khi audit từng chức năng, kiểm tra chuỗi truy vết từ đầu đến cuối (End-to-End trace), đánh giá ảnh hưởng toàn cục, phân định As-is vs To-be, đánh giá theo 5 kết quả chuẩn (Khớp, Thiếu, Mâu thuẫn, Code ngoài phạm vi, Không thể kết luận) và quản lý cổng nghiệm thu trước lập trình. Kích hoạt khi thẩm định hồ sơ hoặc kiểm toán mã nguồn.
---

# Kỹ Năng Thẩm Định Hồ Sơ & Kiểm Toán Mã Nguồn (`system-analysis-audit`)

Kỹ năng này thuộc **Nhóm Tier 2**, đóng vai trò là cơ quan kiểm toán chất lượng độc lập, chịu trách nhiệm rà soát toàn diện tính nhất quán, tính bao phủ và tính khả thi của bộ hồ sơ `PTTKHTTT/` cũng như đối soát sự sai lệch giữa mô hình thiết kế và mã nguồn thực tế (Trạng thái C). Kỹ năng bảo đảm dự án không có điểm đứt gãy trong chuỗi truy vết và kiểm soát cổng nghiệm thu trước khi lập trình (Pre-Implementation Gate).

---

## 1. Vai Trò & Ranh Giới Trách Nhiệm

* **Trách nhiệm chính:**
  * Thực hiện kiểm kê toàn bộ danh mục chức năng (Function Inventory) trước khi audit chi tiết.
  * Audit từng chức năng từ đầu đến cuối (End-to-End Traceability).
  * Thực hiện đánh giá ảnh hưởng toàn cục (Global Impact Analysis) sau khi audit từng phần.
  * Phân định rạch ròi giữa hiện trạng mã nguồn thực tế (As-is) và mô hình thiết kế chuẩn hóa (To-be).
  * Kiểm soát việc sử dụng 5 kết quả audit chuẩn hóa và trạng thái `N/A` có lý do minh bạch.
  * Quản lý biên bản nghiệm thu tại Cổng phê duyệt trước khi lập trình (Pre-Implementation Gate).
* **Ranh giới (Điều kỹ năng này KHÔNG làm):**
  * Không tự ý xóa bỏ hoặc viết lại toàn bộ mã nguồn hay tài liệu khi phát hiện sai lệch.
  * Không trực tiếp sinh mã biểu đồ UML (giao cho `system-analysis-uml` hoặc Tier 3).
  * Không trực tiếp thiết kế CSDL hoặc vẽ Wireframe (giao cho `system-analysis-data`, `system-analysis-ui`).

---

## 2. Đầu Vào & Đầu Ra

* **Đầu vào:**
  * Toàn bộ các tệp tài liệu hiện có trong thư mục `PTTKHTTT/` (từ `01` đến `11` và `README.md`).
  * Toàn bộ cây mã nguồn thực tế trong workspace (nếu thuộc Trạng thái C).
* **Đầu ra:**
  * Báo cáo kiểm toán toàn diện (Comprehensive Audit Report) và Ma trận truy vết chức năng hoàn chỉnh tại `PTTKHTTT/README.md`.
  * Danh mục các điểm bất cập, mâu thuẫn cần khắc phục phân loại theo mức độ nghiêm trọng.
  * Biên bản phê duyệt Cổng trước lập trình (Pre-Implementation Sign-off).

---

## 3. Các Nguyên Tắc Bắt Buộc Trong Kiểm Toán Nghiệp Vụ

1. **Kiểm kê toàn bộ chức năng trước khi audit chi tiết (Inventory-First):**
   * Agent **bắt buộc phải lập danh mục toàn bộ 100% các chức năng** (`FR-xx`, `UC-xx` hoặc các endpoints/controllers trong code) trước khi bắt đầu audit bất kỳ chức năng nào.
   * *Tuyệt đối cấm:* Nhảy ngay vào kiểm tra một chức năng ngẫu nhiên mà chưa nắm rõ tổng thể quy mô bài toán.
2. **Kiểm tra từng chức năng từ đầu đến cuối (End-to-End Trace):**
   * Áp dụng nguyên tắc cô lập chức năng: audit dứt điểm từng chức năng xuyên suốt toàn bộ chuỗi:
     $$\text{Vấn đề (01)} \longrightarrow \text{Yêu cầu (02)} \longrightarrow \text{Use Case (03)} \longrightarrow \text{Class (04)} \longrightarrow \text{Sequence (05)} \longrightarrow \text{ERD (10)} \longrightarrow \text{UI (11)} \longrightarrow \text{Code (State C)}$$
   * Không được chuyển sang chức năng tiếp theo nếu chức năng hiện tại chưa có kết luận đánh giá rõ ràng.
3. **Đánh giá ảnh hưởng toàn cục (Global Impact Analysis):**
   * Sau khi kiểm tra xong tất cả các chức năng riêng lẻ, bắt buộc phải có một bước tổng hợp đánh giá trên toàn hệ thống:
     * Kiểm tra phụ thuộc vòng (Circular Dependencies) giữa các Package/Component.
     * Kiểm tra các bảng dữ liệu dùng chung (Shared Tables) có nguy cơ xung đột khóa hoặc tắc nghẽn (Race Conditions).
     * Kiểm tra sự quá tải hoặc thiếu hụt tài nguyên của các Node phần cứng trong Deployment Diagram.
4. **Phân biệt rạch ròi As-is và To-be:**
   * *As-is (Hiện trạng):* Phản ánh trung thực mã nguồn hoặc quy trình hiện có đang chạy như thế nào (kể cả những chỗ viết sai hoặc chưa tối ưu).
   * *To-be (Mục tiêu thiết kế):* Bản vẽ kiến trúc chuẩn hóa hướng tới khắc phục các hạn chế của As-is.
   * Tuyệt đối không được lẫn lộn giữa code đang chạy thực tế và mô hình lý thuyết mong muốn.
5. **Không kết luận hoàn thành chỉ vì thấy class hoặc controller:**
   * *Cấm tuyệt đối quy chụp:* Thấy file `OrderController` thì vội vàng kết luận chức năng `TaoDonHang` đã hoàn thành `[Khớp]`.
   * Một chức năng chỉ được kết luận là hoàn thành khi kiểm chứng được việc triển khai đầy đủ logic nghiệp vụ và lưu trữ dữ liệu theo luồng end-to-end, đối chiếu qua các khía cạnh kiến trúc thực tế:
     * Route / API endpoints tiếp nhận request.
     * Giao diện người dùng (UI components/pages) gửi nhận dữ liệu.
     * Tầng điều phối / xử lý nghiệp vụ (Controller/Service) kiểm tra quy tắc `BR-xx`.
     * Mô hình thực thể (Model/Entity) và CSDL vật lý (Database schema, migration).
     * Cơ chế xác thực, phân quyền (Authentication / Authorization / Role / Permission).
     * Ràng buộc dữ liệu và xử lý ngoại lệ (Validation, Error handling).
     * Kiểm thử tự động (Unit / Integration Tests) và cấu hình (Config, Environment).
   * *Lưu ý về tính linh hoạt:* Không ép dự án nhỏ hoặc bài tập lớn phải có đủ mọi tầng lớp phức tạp; dự án sử dụng kiến trúc tối giản vẫn được chấp nhận nhưng báo cáo audit bắt buộc phải ghi rõ thành phần nào không tồn tại và lý do tại sao không áp dụng (`N/A kèm lý do`).
   * *Phân định kết luận:* Nếu Controller tồn tại nhưng rỗng, trong khi yêu cầu có xử lý nghiệp vụ và lưu DB: bắt buộc đánh giá là `Thiếu` (chưa triển khai đầy đủ). Chỉ đánh giá `Mâu thuẫn` khi phát hiện xung đột thực tế giữa thiết kế và triển khai.

---

## 4. Năm Kết Quả Audit Chuẩn Hóa & Quy Tắc Trạng Thái `N/A`

Mọi ô trong Ma trận truy vết và mọi mục kiểm tra bắt buộc phải sử dụng chính xác 1 trong 5 kết quả chuẩn sau (tuyệt đối không gộp `N/A` thành kết quả audit thứ sáu):

1. **`Khớp` (Matched):**
   * *Định nghĩa:* Hồ sơ thiết kế và mã nguồn (nếu có) phản ánh hoàn toàn thống nhất về logic, kiểu dữ liệu, phương thức, trạng thái và quy tắc nghiệp vụ.
2. **`Thiếu` (Missing):**
   * *Định nghĩa:* Thành phần được yêu cầu nhưng chưa có hoặc chưa triển khai đầy đủ (ví dụ: Controller tồn tại nhưng rỗng, chưa viết logic service hay lưu DB; tài liệu thiếu mô tả chức năng đang có trong code; chức năng thiếu màn hình UI hoặc thiếu test).
3. **`Mâu thuẫn` (Conflicting):**
   * *Định nghĩa:* Có bằng chứng về hai phần tài liệu hoặc triển khai xung đột thực tế (ví dụ: tài liệu ghi tính thuế 10% nhưng code tính 5%; tên phương thức, số lượng tham số hoặc kiểu dữ liệu đối nghịch nhau; code có 4 trạng thái nhưng State Machine chỉ vẽ 3).
4. **`Code ngoài phạm vi` (Out-of-Scope Code):**
   * *Định nghĩa:* Mã nguồn chứa các hàm, controller hoặc module tự phát không phục vụ bất kỳ yêu cầu bài toán `FR-xx` nào đã chốt trong phạm vi đồ án.
5. **`Không thể kết luận` (Inconclusive):**
   * *Định nghĩa:* Không đủ bằng chứng để xác định do thông tin quá mơ hồ, code thiếu chú thích hoặc tài liệu đứt đoạn. Bắt buộc gắn nhãn `[Assumption]` và đặt câu hỏi làm rõ cho người dùng.

### Quy định trạng thái miễn áp dụng: `N/A (kèm lý do)`
* `N/A` (Not Applicable) là trạng thái miễn áp dụng riêng biệt cho biểu đồ hoặc khía cạnh kỹ thuật không cần thiết đối với chức năng đó (không phải là kết quả phát hiện lỗi audit).
* *Quy tắc bắt buộc:* **Cấm ghi `N/A` đơn thuần**. Bắt buộc phải đi kèm lý do nghiệp vụ chính đáng (ví dụ: `N/A (Chức năng chỉ đọc dữ liệu tĩnh, không có vòng đời chuyển đổi trạng thái)`).

---

## 5. Quy Trình 4 Bước Kiểm Toán Toàn Diện

```
[B1: Kiểm kê toàn bộ] ──> [B2: Audit End-to-End] ──> [B3: Đánh giá toàn cục] ──> [B4: Nghiệm thu Cổng]
```

* **Bước 1: Lập Bảng kiểm kê chức năng (Function Inventory):** Liệt kê toàn bộ các mã `UC-xx` và `FR-xx`.
* **Bước 2: Đối soát cô lập từng chức năng (Single-Function Trace):** Rà soát tuần tự qua các cột của Ma trận truy vết, gán 1 trong 5 nhãn chuẩn.
* **Bước 3: Đánh giá ảnh hưởng toàn cục (Global Impact Check):** Kiểm tra liên kết phân hệ, phụ thuộc vòng, bảng dữ liệu dùng chung.
* **Bước 4: Tổng hợp báo cáo & Ký duyệt Cổng trước lập trình (Gate Sign-off):** Nếu còn mục `Thiếu`, `Mâu thuẫn` hoặc `Không thể kết luận`, đưa ra danh sách hành động sửa đổi cụ thể và chưa cho phép lập trình.

*Xem chi tiết các biểu mẫu và giao thức kiểm toán tại:* [audit-protocols.md](./references/audit-protocols.md)


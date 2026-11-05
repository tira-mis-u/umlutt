# Giao Thức Kiểm Toán Hồ Sơ & Đối Soát Mã Nguồn Chi Tiết

Tài liệu này chi tiết hóa các giao thức kiểm toán chất lượng 3 cấp độ (Cấp chức năng, Cấp tài liệu, Cấp mã nguồn) và biên bản nghiệm thu tại Cổng phê duyệt trước lập trình (Pre-Implementation Gate).

---

## 1. Giao Thức Kiểm Toán Mã Nguồn End-to-End Theo Kiến Trúc Thực Tế (Trạng Thái C)

Để ngăn chặn việc kết luận vội vã rằng "chức năng đã xong chỉ vì thấy file Controller", agent kiểm tra luồng xử lý end-to-end qua các khía cạnh kiến trúc thực tế của dự án. 

> [!NOTE]
> Bảng dưới đây cung cấp tiêu chuẩn kiểm tra toàn diện. **Không ép buộc các dự án nhỏ hoặc bài tập lớn phải có đủ mọi tầng lớp**; dự án có kiến trúc tối giản (ví dụ: Route xử lý trực tiếp CSDL không qua Service/DAO) vẫn được chấp nhận, nhưng báo cáo audit bắt buộc phải ghi nhận rõ thành phần nào không tồn tại và lý do không áp dụng (`N/A kèm lý do`).

| Khía cạnh kiến trúc | Tệp / Thành phần kiểm tra | Tiêu chí chứng minh `[Khớp]` | Trường hợp phát hiện lỗi | Kết luận audit |
| :--- | :--- | :--- | :--- | :---: |
| **1. Route / API Endpoint** | `routes/*`, `*Controller.*` | Có endpoint URL, phương thức HTTP (GET/POST/PUT/DELETE) khớp kịch bản Use Case, nhận đủ tham số. | Endpoint rỗng, hoặc nhận sai phương thức HTTP so với kịch bản (ví dụ: yêu cầu POST nhưng code viết GET). | `Mâu thuẫn` |
| **2. Tầng điều phối & nghiệp vụ** | `*Controller.*`, `*Service.*` | Controller gọi Service; Service chứa logic tính toán, kiểm tra đầy đủ các quy tắc `BR-xx`. | Controller tồn tại nhưng rỗng, chưa viết logic xử lý nghiệp vụ hoặc bỏ qua kiểm tra quy tắc `BR-xx`. | `Thiếu` |
| **3. Mô hình dữ liệu & CSDL** | `*Model.*`, `schemas/*`, `migrations/*` | Entity/Schema khớp với ERD, có câu lệnh lưu trữ thực tế xuống CSDL quan hệ. | Thao tác ghi dữ liệu chỉ là `console.log` hoặc lưu mảng tạm trong RAM mà chưa lưu CSDL; hoặc cột trong DB sai kiểu dữ liệu so với ERD. | `Thiếu` (nếu chưa lưu) / `Mâu thuẫn` (nếu sai kiểu) |
| **4. Giao diện người dùng (UI)** | `pages/*`, `components/*`, `views/*` | Giao diện hiển thị đúng các trường dữ liệu, bắt sự kiện và xử lý các trạng thái UI (Loading, Error, Success). | Không có giao diện cho người dùng, hoặc giao diện không liên kết với API xử lý. | `Thiếu` |
| **5. Xác thực & Phân quyền** | `middleware/*`, `guards/*` | Kiểm tra đúng vai trò người dùng (RBAC) khớp với Actor được phép trong Use Case. | Không kiểm tra quyền, cho phép mọi vai trò truy cập trái phép chức năng quản trị. | `Thiếu` |
| **6. Ràng buộc & Xử lý lỗi** | `validators/*`, `exceptions/*` | Có validation dữ liệu đầu vào và bắt lỗi ngoại lệ trả về thông điệp thân thiện. | Thiếu validation khiến hệ thống crash khi nhận dữ liệu rác. | `Thiếu` |
| **7. Kiểm thử tự động (Tests)** | `tests/*`, `*.spec.*` | Có unit/integration tests bao phủ các nhánh chính và ngoại lệ của Use Case. | Không có test nào được viết cho chức năng cốt lõi. | `Thiếu` (hoặc `N/A` nếu đề tài không yêu cầu test) |
| **8. Cấu hình & Triển khai** | `.env.*`, `Dockerfile`, configs | Biến môi trường và cấu hình cổng/CSDL kết nối thông suốt với Node triển khai trong Deployment Diagram. | Thiếu biến môi trường hoặc cổng kết nối bị chặn giữa các dịch vụ. | `Thiếu` |

> **Quy tắc kết luận một chức năng trong Trạng thái C:** 
> - Kết luận `[Khớp]`: Chỉ khi toàn bộ các thành phần kiến trúc áp dụng cho chức năng đó đều hoạt động thống nhất với tài liệu thiết kế.
> - Kết luận `[Thiếu]`: Khi thành phần cần thiết chưa được triển khai đầy đủ (ví dụ: Controller rỗng, chưa có UI, chưa có logic lưu DB).
> - Kết luận `[Mâu thuẫn]`: Khi phát hiện xung đột thực tế giữa triển khai và tài liệu (logic ngược chiều, sai phương thức, đối nghịch kiểu dữ liệu).

---

## 2. Giao Thức Đánh Giá Ảnh Hưởng Toàn Cục (Global Impact Analysis Protocol)

Sau khi đối soát xong từng chức năng đơn lẻ, agent phải thực hiện 3 phép kiểm tra toàn cục:

### 2.1. Kiểm tra phụ thuộc vòng (Circular Dependencies)
* **Mục tiêu:** Phát hiện xem các Component hoặc Class có phụ thuộc lẫn nhau theo chu trình khép kín ($A \rightarrow B \rightarrow C \rightarrow A$) hay không.
* **Cách kiểm tra:** Lập đồ thị phụ thuộc từ Component Diagram (`08`) và Class Diagram (`04`). Nếu có chu trình, bắt buộc phải tái cấu trúc bằng cách áp dụng nguyên lý đảo ngược phụ thuộc (Dependency Inversion) hoặc tách Component trung gian.

### 2.2. Kiểm tra xung đột dữ liệu dùng chung (Shared Data Bottleneck)
* **Mục tiêu:** Phát hiện các bảng dữ liệu bị nhiều Use Case cùng cập nhật trạng thái đồng thời (ví dụ: bảng `SanPham` có cột `so_luong_ton` vừa bị `TaoDonHang` trừ, vừa bị `HuyDonHang` cộng, vừa bị `KiemKeKho` điều chỉnh).
* **Cách kiểm tra:** Rà soát ma trận ERD và các bảng kịch bản Use Case để bổ sung cơ chế khóa (Pessimistic/Optimistic Locking) hoặc giao dịch phân tán (Transaction Management).

### 2.3. Kiểm tra tính tương thích hạ tầng triển khai (Deployment Compatibility)
* **Mục tiêu:** Đảm bảo toàn bộ các Artifacts được phân bổ trên Node của Deployment Diagram (`09`) có thể kết nối thông suốt qua các giao thức mạng đã khai báo (`HTTPS`, `JDBC`, `WSS`), không có cổng kết nối nào bị cô lập.

---

## 3. Checklist Nghiệm Thu Cổng Phê Duyệt Trước Lập Trình (Pre-Implementation Gate)

Trước khi người dùng hoặc agent bắt đầu viết mã nguồn mới hoặc can thiệp kiến trúc, bắt buộc phải hoàn thành và đạt 100% các tiêu chí trong bảng sau:

```markdown
### BIÊN BẢN NGHIỆM THU HỒ SƠ PTTKHTTT (PRE-IMPLEMENTATION GATE)

- [ ] 1. Toàn bộ 11 tài liệu từ `01` đến `11` tại thư mục `PTTKHTTT/` đã được tạo và không có tệp nào rỗng.
- [ ] 2. Ma trận truy vết chức năng tại `PTTKHTTT/README.md` đã bao phủ 100% các chức năng trong phạm vi.
- [ ] 3. Không còn bất kỳ mục nào mang nhãn `[Assumption]` mà chưa được người dùng xác nhận.
- [ ] 4. Không còn mục nào trong Ma trận bị đánh dấu `Mâu thuẫn` hoặc `Không thể kết luận` mà chưa có giải pháp.
- [ ] 5. Mọi ô được đánh dấu `N/A` đều có lý do nghiệp vụ chính đáng, không để trống vô căn cứ.
- [ ] 6. Toàn bộ định danh nghiệp vụ (Actor, Use Case, Class, Method, State, Screen) tuân thủ 100% PascalCase tiếng Việt không dấu.
- [ ] 7. Mọi lời gọi nghiệp vụ nội bộ trên Sequence Diagram đều có phương thức tương ứng trên Class đích trong Class Diagram.
- [ ] 8. Mô hình dữ liệu ERD đã được chứng minh thỏa mãn chuẩn hóa 3NF và có bảng ánh xạ sang CSDL vật lý (snake_case).
- [ ] 9. Đã phân định rạch ròi giữa kiến trúc triển khai đồ án thực tế (Localhost/Docker) và kiến trúc đề xuất Production.
- [ ] 10. Đã hoàn thành phân tích ảnh hưởng toàn cục, không có phụ thuộc vòng gây deadlock hệ thống.

KẾT LUẬN CỦA AGENT AUDIT: [ ĐẠT / CHƯA ĐẠT ]
Ghi chú hành động tiếp theo: ...
```


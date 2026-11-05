# Biểu Mẫu Đặc Tả Yêu Cầu & Kịch Bản Use Case Chi Tiết

Tài liệu này cung cấp các khung mẫu chuẩn hóa phục vụ việc soạn thảo tệp `PTTKHTTT/02-yeu-cau-va-use-case.md`.

---

## 1. Dàn Ý Chuẩn Của Tệp `02-yeu-cau-va-use-case.md`

```markdown
# 02. ĐẶC TẢ YÊU CẦU VÀ DANH MỤC USE CASE

> [!NOTE]
> Toàn bộ dữ liệu dưới đây là **ví dụ minh họa hư cấu (`[Illustrative only]`)**. AI agent tuyệt đối không được tự ý sao chép số liệu, quy tắc nghiệp vụ hoặc kết luận minh họa này vào hồ sơ dự án thực tế.

## 1. Phân Tích & Định Hướng Xử Lý Vấn Đề Khảo Sát (VD-xx)
- `VD-01`: Tính tiền chậm, dễ nhầm giá -> Hướng xử lý: Chức năng phần mềm `FR-01` (Quét mã và tự động tính tiền). Độ ưu tiên: Must.
- `VD-02`: Tồn kho lệch sổ sách -> Hướng xử lý: Quy tắc nghiệp vụ + Phần mềm (`BR-02`, `FR-02` Quản lý tồn kho). Độ ưu tiên: Must.
- `VD-03`: Nhân viên giao ca trễ giờ -> Hướng xử lý: Thay đổi quy trình tổ chức nhân sự (Không phần mềm hóa).

## 2. Danh Mục Yêu Cầu Chức Năng Chi Tiết (FR-xx)
- `FR-01` - Lập hóa đơn: Cho phép nhân viên quét mã, chọn sản phẩm, tính tổng tiền và in hóa đơn. Tiêu chí nghiệm thu: Thời gian in < 3s, tự tính VAT, tự động cập nhật tồn kho.

## 3. Danh Mục Yêu Cầu Phi Chức Năng (NFR-xx)
- `NFR-01` (Hiệu năng): Thời gian phản hồi API tra cứu sản phẩm < 500ms với 50,000 bản ghi.
- `NFR-02` (Bảo mật): Mã hóa thông tin đăng nhập và phân quyền RBAC bằng thuật toán hash BCrypt/Argon2.

## 4. Danh Mục Quy Tắc Nghiệp Vụ (BR-xx)
- `BR-01` (Điều kiện giảm giá): Đơn hàng trên 1,000,000 VNĐ được giảm 5% tổng hóa đơn. Áp dụng cho `UC-02` (`TaoDonHang`).
- `BR-02` (Ràng buộc tồn kho): Không cho phép xuất hóa đơn nếu số lượng mua vượt quá số lượng tồn khả dụng. Áp dụng cho `UC-02` (`TaoDonHang`).

## 5. Danh Mục Actor Hệ Thống
- `QuanLy` (Nội bộ): Xem báo cáo doanh thu, duyệt nhập kho, quản lý danh mục.
- `NhanVien` (Nội bộ): Tạo hóa đơn, kiểm tra hàng, lập phiếu kiểm kê.
- `KhachHang` (Người dùng ngoài): Tra cứu sản phẩm, đặt hàng trực tuyến, xem lịch sử đơn hàng.

## 6. Danh Mục Use Case Tổng Thể (UC-xx)
- `UC-01` - `DangNhap`: Actor chính `QuanLy`, `NhanVien`. Xác thực danh tính và cấp quyền phiên làm việc.
- `UC-02` - `TaoDonHang`: Actor chính `NhanVien`, `KhachHang`. Tạo đơn hàng mới và tính toán hóa đơn.
- `UC-03` - `TraCuuSanPham`: Actor chính `KhachHang`, `NhanVien`. Tìm kiếm mặt hàng theo từ khóa và danh mục.

## 7. Bảng Đặc Tả Chi Tiết Từng Use Case (Xem mẫu bên dưới)
```

---

## 2. Mẫu Bảng Đặc Tả Use Case Chuẩn 6 Trường (Khi Có Yêu Cầu)

Quy tắc kích hoạt: Chỉ lập bảng đặc tả khi người dùng yêu cầu rõ ràng; không tự ý tạo đặc tả nếu chỉ được yêu cầu vẽ diagram.

Mỗi Use Case có một bảng đặc tả riêng biệt hai cột với đúng sáu trường theo đúng thứ tự (không tự ý thêm trường):

1. **Tên Usecase:** `TaoDonHang` (Mã: `UC-02`)
2. **Tác nhân:** `KhachHang` (chính), `NhanVien`, `CongThanhToan` (hệ thống ngoài)
3. **Tiền điều kiện:** Khách hàng đã được định danh phiên làm việc hợp lệ; các sản phẩm chọn mua đang ở trạng thái kinh doanh (`DangKinhDoanh`).
4. **Mục đích:** Cho phép khách hàng đặt mua các sản phẩm đã chọn, tính tổng tiền hóa đơn, ghi nhận đơn hàng vào hệ thống và giữ hàng trong kho.
5. **Dòng sự kiện chính:**
   - Bước 1: Actor chọn chức năng tạo đơn hàng và thêm các sản phẩm vào giỏ hàng.
   - Bước 2: Hệ thống kiểm tra thông tin sản phẩm và hiển thị danh sách các món đã chọn.
   - Bước 3: Actor nhập số lượng cho từng mặt hàng và cung cấp thông tin giao hàng.
   - Bước 4: Hệ thống kiểm tra số lượng tồn kho khả dụng theo quy tắc `BR-02`.
   - Bước 5: Actor xác nhận đơn hàng và chọn phương thức thanh toán.
   - Bước 6: Hệ thống áp dụng quy tắc giảm giá `BR-01`, tính thuế VAT, phí vận chuyển và tổng tiền cần thanh toán.
   - Bước 7: Actor hoàn tất thanh toán trực tuyến hoặc chọn trả tiền khi nhận hàng (COD).
   - Bước 8: Hệ thống lưu đơn hàng với trạng thái `ChoXacNhan`, trừ số lượng tồn kho và gửi thông báo xác nhận thành công.
6. **Dòng sự kiện phụ:**
   - 3a. Khách hàng áp dụng mã giảm giá: Tại bước 5, Actor nhập `MaGiamGia`. Hệ thống kiểm tra tính hợp lệ; nếu đạt thì giảm trừ vào tổng tiền, nếu sai thì thông báo lý do và giữ nguyên giá gốc.
   - 4a. Số lượng tồn kho không đủ: Tại bước 4, nếu số lượng khả dụng < số lượng mua, hệ thống cảnh báo và yêu cầu điều chỉnh lại số lượng trước khi tiếp tục.
   - 7a. Thanh toán trực tuyến thất bại: Tại bước 7, nếu cổng thanh toán báo lỗi thẻ/hết hạn, hệ thống giữ nguyên đơn ở trạng thái chờ và cho phép Actor chọn lại phương thức thanh toán khác.

### Lưu ý về phong cách thể hiện Use Case trên biểu đồ:
- Hỗ trợ cả 2 phong cách theo yêu cầu bài toán:
  - *Individual Use Cases:* Mỗi mục tiêu nghiệp vụ độc lập là một hình elip riêng biệt.
  - *Grouped Functional Overview:* Một hình elip tổng quát kèm khối UML Note liệt kê chức năng con (các dòng trong Note không phải Use Case độc lập).
- Quan hệ và hướng liên kết:
  - Association: Nét liền không mũi tên (undirected).
  - Generalization: Nét liền, tam giác rỗng hướng về phần tử tổng quát.
  - `«include»`: Nét đứt, đầu mở, từ Use Case cơ sở đến Use Case được bao gồm (`DatHang -> XacThuc`).
  - `«extend»`: Nét đứt, đầu mở, từ Use Case mở rộng đến Use Case cơ sở (`ThanhToanBangVi -> ThanhToan`).
  - Không đảo ngược chiều mũi tên! Không tự động include `DangNhap` vào mọi Use Case; nếu Use Case yêu cầu người dùng đã xác thực, có thể mô tả trạng thái xác thực trong tiền điều kiện; nếu hệ thống hỗ trợ khách chưa đăng nhập, đăng nhập tùy chọn hoặc luồng xác thực khác, phải mô hình hóa theo nghiệp vụ thực tế (không giả định mọi Actor đều đã đăng nhập).


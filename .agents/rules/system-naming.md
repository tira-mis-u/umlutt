---
trigger: always_on
---

# Quy Chuẩn Định Danh Trong Mô Hình Hệ Thống

Quy tắc này quy định chuẩn đặt tên thống nhất cho các phần tử mô hình trong tài liệu phân tích và thiết kế hệ thống, bao gồm các biểu đồ UML, mô hình dữ liệu (ERD) và thành phần giao diện (UI).

> [!IMPORTANT]
> **Phạm vi áp dụng:** Áp dụng cho các định danh kỹ thuật và nghiệp vụ trong biểu đồ, mô hình và mã đặc tả. Tuyệt đối **không áp dụng PascalCase hay camelCase** cho văn xuôi thông thường, đoạn văn phân tích/giải thích, tiêu đề chương mục, nội dung Note hoặc nhãn mô tả tự nhiên trong tài liệu.

## 1. Biểu Đồ Lớp (Class Diagram)

Trong biểu đồ Lớp, quy tắc cốt lõi là: **chỉ Class Name viết PascalCase; toàn bộ Attribute và Method đều viết camelCase**.

* **Class Name:**
  * BẮT BUỘC sử dụng danh từ hoặc cụm danh từ.
  * Viết PascalCase: chữ cái đầu tiên viết hoa, các từ tiếp theo viết hoa chữ cái đầu.
  * Tuyệt đối không đặt tên Class bằng động từ chỉ hành động.
  * Ví dụ: `DonHang`, `KhachHang`, `ChiTietDonHang`, `DocGia`.
* **Attribute Name:**
  * BẮT BUỘC viết thường chữ cái đầu theo camelCase.
  * Sử dụng danh từ hoặc cụm danh từ.
  * Ví dụ: `maDonHang`, `tongTien`, `ngayDat`, `tenKhachHang`.
* **Method / Operation Name:**
  * BẮT BUỘC viết thường chữ cái đầu theo camelCase.
  * BẮT BUỘC bắt đầu bằng động từ thể hiện hành động nghiệp vụ cụ thể.
  * Kèm cặp ngoặc tròn `()`.
  * Ví dụ: `taoDonHang()`, `tinhTongTien()`, `kiemTraTonKho()`, `xacNhanTra()`.

## 2. Biểu Đồ Use Case (Use Case Diagram)

Tên mỗi Use Case BẮT BUỘC tuân thủ cấu trúc:

`[ĐộngTừMạnh] + [DanhTừ/ĐốiTượng]`

* **Quy cách:** Viết PascalCase (tiếng Việt không dấu).
* **Động từ:** BẮT BUỘC là động từ mạnh thể hiện rõ ràng mục tiêu hoặc hành động nghiệp vụ cụ thể của tác nhân.
* **Yêu cầu tường minh:** Không sử dụng tên chung chung, mơ hồ nếu có thể xác định hành động cụ thể (tránh các tên như `XuLy`, `ThucHien`, `ChucNang1`).
* **Ví dụ chuẩn:**
  * `TaoDonHang`
  * `HuyDonHang`
  * `XacNhanDonHang`
  * `KiemTraTonKho`
  * `CapNhatThongTinKhachHang`
  * `TraCuuThongTinThienTai`
* **Ràng buộc:** Tuyệt đối không dùng camelCase cho tên Use Case vì đây là mục tiêu nghiệp vụ độc lập, không phải Attribute hoặc Method bên trong Class.

## 3. Tất Cả Các Loại Diagram Còn Lại

Định danh phần tử trong toàn bộ các biểu đồ còn lại sử dụng **PascalCase**. Tuyệt đối **không áp dụng quy tắc camelCase của Class Member ra ngoài Class Diagram**:

* **Actor:** Danh từ chỉ vai trò, viết PascalCase (ví dụ: `QuanLy`, `NhanVien`, `KhachHang`, `ThuThu`).
* **Entity trên ERD:** Danh từ số ít, viết PascalCase (ví dụ: `DonHang`, `ChiTietDonHang`, `KhachHang`).
* **Thuộc tính thực thể trên ERD (Attribute trên ERD):** BẮT BUỘC viết PascalCase (ví dụ: `MaDonHang`, `TongTien`, `NgayDat`, `MaKhachHang`). Không tự ý đưa thuộc tính ERD về camelCase chỉ vì có thể tương ứng với thuộc tính trong Class Diagram.
* **Trạng thái (State Machine):** Tính từ hoặc phân từ thể hiện trạng thái kết quả của đối tượng, viết PascalCase (ví dụ: `ChoXacNhan`, `DangXuLy`, `DaHoanThanh`, `DaHuy`).
* **Component & Node:** PascalCase kèm hậu tố vai trò (ví dụ: `ThanhPhanQuanLyDonHang`, `ThanhToanService`, `KhoModule`, `MayChuUngDung`).
* **Lifeline trong Sequence Diagram:** Viết PascalCase cho tên Lifeline (ví dụ: `KhachHang`, `DonHangController`, `SachRepository`).
* **Thông điệp trong Sequence Diagram (Sequence Messages):** Định danh thông điệp sử dụng PascalCase (ví dụ: `TaoDonHang`, `KiemTraTonKho`, `XacNhanDonHang`). Không tự ý đưa Sequence Message về camelCase chỉ vì có thể tương ứng với một method trong Class Diagram. Không ép các sự kiện giao diện người dùng (UI events) hoặc thông điệp giao tiếp bên ngoài thành Method của Domain Class.
* **Màn hình và Thành phần giao diện (UI):** Viết PascalCase (ví dụ: `ManHinhDangNhap`, `ManHinhQuanLyDonHang`, `NutTaoDonHang`, `BangDanhSach`).

## 4. Danh Sách Ngoại Lệ Được Phép (Allowlist)

1. **Mã truy vết nghiệp vụ:** Sử dụng mã chuẩn chữ hoa kèm dấu gạch ngang và số thứ tự:
   * Yêu cầu chức năng: `FR-01`, `FR-02`, ... (`FR-xx`)
   * Yêu cầu phi chức năng: `NFR-01`, `NFR-02`, ... (`NFR-xx`)
   * Quy tắc nghiệp vụ: `BR-01`, `BR-02`, ... (`BR-xx`)
   * Mã Use Case: `UC-01`, `UC-02`, ... (`UC-xx`)
   * Mã vấn đề khảo sát: `VD-01`, `VD-02`, ... (`VD-xx`)
2. **Định danh kỹ thuật hạ tầng:** Dùng `kebab-case` chữ thường cho:
   * Tên thư mục kỹ năng (ví dụ: `system-analysis`, `uml-class-diagram`, `draw-diagram`)
   * Tên tệp Markdown (ví dụ: `01-khao-sat-va-pham-vi.md`, `SKILL.md`)
   * Cú pháp lệnh kích hoạt (ví dụ: `/system-analysis`, `$system-analysis`, `/draw-diagram`)
   * Thư mục hệ thống: `.agents`, `.claude`
3. **Metadata cấu hình:** Chuẩn YAML frontmatter (`name`, `description`, `trigger`).

## 5. Quy Tắc Triển Khai Thực Tế & Bảng Ánh Xạ (Mapping Table)

Quy ước mô hình bảo đảm tính trừu tượng nghiệp vụ và chuẩn mực học thuật. Khi chuyển sang giai đoạn hiện thực hóa:
* **Mã nguồn (Source Code):** Sử dụng `camelCase` cho biến, hàm/phương thức và `PascalCase` cho class theo quy ước của từng ngôn ngữ lập trình.
* **CSDL vật lý (Physical Database):** Sử dụng `snake_case` theo chuẩn cơ sở dữ liệu quan hệ (ví dụ: bảng `don_hang`, cột `ma_don_hang`, `tong_tien`).
* **Bắt buộc có Bảng ánh xạ:** Khi mã nguồn hoặc CSDL vật lý sử dụng định danh khác với mô hình nghiệp vụ, tài liệu thiết kế bắt buộc phải lập bảng đối chiếu minh bạch (ví dụ: Thực thể `DonHang` → Bảng `don_hang`; Thuộc tính `MaDonHang` → Cột `ma_don_hang` / Trường `orderId`).

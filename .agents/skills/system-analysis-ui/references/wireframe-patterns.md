# Mẫu Bố Cục Wireframe ASCII & Mô Tả Thành Phần Giao Diện

Tài liệu này cung cấp các mẫu bố cục phác thảo thấp (Low-fi Wireframe) chuẩn hóa bằng ký tự ASCII và bảng Markdown, phục vụ việc soạn thảo tệp `PTTKHTTT/11-thiet-ke-giao-dien-wireframe.md`.

---

## 1. Mẫu Bố Cục 1: Màn Hình Quản Lý Danh Sách (Data Grid / Master View)

Áp dụng cho các màn hình tra cứu, quản lý danh mục (ví dụ: `ManHinhQuanLyDonHang`, `ManHinhQuanLySanPham`):

```text
+------------------------------------------------------------------------------------+
| [Logo] HE THONG QUAN LY BAN HANG                [Tim kiem...]  [Bell] (User: Admin)|
+------------------------------------------------------------------------------------+
| MENU CHINH       | QUAN LY DON HANG                                                |
| - Trang chu      |-----------------------------------------------------------------|
| - Don hang (*)   | [OTextInputTimKiem___________] [TrangThai: Tat ca v] [Loc Du Lieu]|
| - San pham       |                                                                 |
| - Khach hang     | [+ NutTaoDonHang]   [Xuat Excel]               Tong: 128 don    |
| - Bao cao        |-----------------------------------------------------------------|
|                  | [x] Ma Don  | Khach Hang   | Ngay Tao   | Tong Tien  | Trang Thai |
|                  |-----------------------------------------------------------------|
|                  | [ ] DH-001  | Nguyen Van A | 01/11/2026 | 1.250.000d | HoanTat    |
|                  | [ ] DH-002  | Tran Thi B   | 02/11/2026 |   450.000d | ChoXacNhan |
|                  | [ ] DH-003  | Le Van C     | 02/11/2026 | 2.100.000d | DangGiao   |
|                  |-----------------------------------------------------------------|
|                  | Trang: [<] [1] 2 3 [>]                      Hien thi: [10/trang]|
+------------------------------------------------------------------------------------+
```

### Bảng Đặc Tả Thành Phần `ManHinhQuanLyDonHang`:

| Tên thành phần (PascalCase) | Phân loại | Nhãn hiển thị | Mô tả hành vi & Quy tắc nghiệp vụ |
| :--- | :--- | :--- | :--- |
| `OTextInputTimKiem` | Text Input | "Nhập mã đơn, tên khách..." | Lọc tức thời danh sách khi người dùng nhập từ 3 ký tự trở lên. |
| `MenuChonTrangThai` | Dropdown | "Trạng thái: Tất cả" | Lọc theo các trạng thái: `ChoXacNhan`, `DangGiao`, `HoanTat`, `DaHuy`. |
| `NutTaoDonHang` | Button (Primary) | "+ Tạo đơn hàng mới" | Điều hướng sang `ManHinhTaoDonHang`. |
| `BangDanhSachDonHang` | Data Table | Lưới danh sách đơn hàng | Nhấp vào một dòng để chuyển sang `ManHinhChiTietDonHang`. |
| `ThanhPhanTrang` | Pagination | `[<] [1] 2 3 [>]` | Chuyển trang dữ liệu; mặc định hiển thị 10 bản ghi/trang. |

---

## 2. Mẫu Bố Cục 2: Màn Hình Biểu Mẫu Nhập Liệu (Form / Detail View)

Áp dụng cho các màn hình tạo mới, chỉnh sửa thông tin (ví dụ: `ManHinhTaoDonHang`):

```text
+------------------------------------------------------------------------------------+
| <- [Quay lai danh sach]             TAO DON HANG MOI                               |
+------------------------------------------------------------------------------------+
| THONG TIN KHACH HANG                      | CHI TIET MAT HANG                      |
| So dien thoai (*): [0912345678________]    | Chon san pham: [Chon san pham____ v]   |
| Ho va ten (*):     [Nguyen Van A______]    | So luong: [ 2 ] Don gia: 250.000d      |
| Dia chi (*):       [123 Pho Hue, HN___]    | [+ NutThemVaoDon]                      |
| Ghi chu don:       [Giao gio hanh chinh]   |----------------------------------------|
|                                           | STT | Ten Mat Hang | SL | Don Gia | TT |
| PHUONG THUC THANH TOAN                    | 1   | Ao So Mi Nam | 2  | 250.000 | 500|
| (*) Thanh toan khi nhan hang (COD)        |----------------------------------------|
| ( ) Chuyen khoan ngan hang / QR           | Tien hang:                  500.000d   |
| ( ) Vi dien tu (Momo/VNPAY)               | Giam gia (BR-01):           -25.000d   |
|                                           | Phi giao hang:               30.000d   |
|                                           | TONG THANH TOAN:            505.000d   |
|                                           |----------------------------------------|
|                                           | [ NutHuyBo ]      [ NutXacNhanDatHang ]|
+------------------------------------------------------------------------------------+
```

---

## 3. Biểu Diễn 5 Trạng Thái Giao Diện (The 5 UI States)

### 3.1. Trạng Thái Trống (`Empty State`)
Khi hệ thống truy vấn và bảng dữ liệu không có dòng nào:

```text
+------------------------------------------------------------------------------------+
|                                                                                    |
|                                   [ Icon Hop Rong ]                                |
|                               CHUA CO DON HANG NAO                                 |
|               Hien tai ban chua co don hang nao trong danh sach.                   |
|                                                                                    |
|                           [ + Bấm Vào Đây Để Tạo Đơn Mới ]                         |
|                                                                                    |
+------------------------------------------------------------------------------------+
```

### 3.2. Trạng Thái Xác Thực Lỗi Nhập Liệu (`Validation State`)
Hiển thị cảnh báo trực tiếp dưới trường dữ liệu vi phạm quy tắc `BR-xx`:

```text
So dien thoai (*): [ 09abc123456_______ ]
(!) So dien thoai khong dung dinh dang (phai gom 10 chu so).

So luong mua (*):  [ 999_______________ ]
(!) So luong mua vuot qua ton kho kha dung (Hien con ton: 15 san pham) - BR-02.
```

### 3.3. Trạng Thái Đang Tải (`Loading State`)
Sử dụng các thanh Skeleton hoặc Spinner thông báo:

```text
+------------------------------------------------------------------------------------+
| [ Dang tai du lieu tu may chu, vui long cho trong giay lat... ]                    |
| [========================>                                   ] 45%                 |
+------------------------------------------------------------------------------------+
```


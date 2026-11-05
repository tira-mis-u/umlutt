---
name: system-analysis-data
description: Skill chuyên sâu về thiết kế mô hình dữ liệu và sơ đồ thực thể quan hệ (ERD) cho đồ án PTTKHTTT. Chuyển đổi Class Diagram miền phân tích sang mô hình dữ liệu quan niệm, logic và vật lý, chuẩn hóa dữ liệu 3NF, xác định khóa chính/khóa ngoại và lập bảng ánh xạ sang CSDL vật lý (snake_case). Kích hoạt khi thiết kế cơ sở dữ liệu hoặc chuẩn bị tệp 10-mo-hinh-du-lieu-erd.md.
---

# Kỹ Năng Thiết Kế Mô Hình Dữ Liệu & ERD (`system-analysis-data`)

Kỹ năng này thuộc **Nhóm Tier 2**, chịu trách nhiệm chuyển hóa các thực thể nghiệp vụ từ Biểu đồ Lớp (`04-bieu-do-lop.md`) và bảng chứng từ thực tế thành mô hình dữ liệu quan hệ hoàn chỉnh tại `PTTKHTTT/10-mo-hinh-du-lieu-erd.md`. Kỹ năng kiểm soát quy trình chuẩn hóa dữ liệu 3NF, giải quyết quan hệ Nhiều - Nhiều (N-N), thiết lập ràng buộc toàn vẹn và lập bảng ánh xạ từ mô hình nghiệp vụ PascalCase sang cơ sở dữ liệu vật lý snake_case.

---

## 1. Vai Trò & Ranh Giới Trách Nhiệm

* **Trách nhiệm chính:**
  * Trích xuất các thực thể dữ liệu bền vững (Persistent Entities) từ Class Diagram.
  * Phân tích và biểu diễn quan hệ giữa các thực thể (1-1, 1-N, N-N).
  * Chuẩn hóa dữ liệu qua các dạng chuẩn 1NF, 2NF, 3NF để loại bỏ trùng lặp và dị thường dữ liệu (Anomalies).
  * Xây dựng sơ đồ ERD mức logic và vật lý bằng cú pháp Mermaid `erDiagram` hoặc PlantUML.
  * Lập bảng đối chiếu ánh xạ (Name Mapping Table) giữa tên thực thể PascalCase và tên bảng/cột CSDL vật lý snake_case.
  * Chuyển giao mô hình quan niệm, logic và vật lý sang cho `/draw-diagram` để kết xuất Draw.io XML chuẩn (chân quạ trực giao) và xuất ảnh.
* **Ranh giới (Điều kỹ năng này KHÔNG làm):**
  * Không thiết kế Class Diagram hướng đối tượng miền phân tích (thuộc về `system-analysis-uml`).
  * Không viết script migration hoặc seed data trực tiếp của framework (thuộc về giai đoạn lập trình sau khi hoàn tất hồ sơ).

---

## 2. Đầu Vào & Đầu Ra

* **Đầu vào:**
  * Tệp biểu đồ lớp: `PTTKHTTT/04-bieu-do-lop.md`.
  * Bảng phân tích chứng từ và trường dữ liệu từ: `PTTKHTTT/01-khao-sat-va-pham-vi.md`.
* **Đầu ra:**
  * Tệp tài liệu hoàn chỉnh: `PTTKHTTT/10-mo-hinh-du-lieu-erd.md`.
  * Sơ đồ thực thể quan hệ ERD (Mermaid hoặc PlantUML) lưu tại `PTTKHTTT/models/`.
  * Báo cáo phân tích chuẩn hóa 3NF và Bảng ánh xạ CSDL vật lý (Physical Schema Mapping Table).
  * Biểu đồ Draw.io XML lưu tại `PTTKHTTT/xml/` và hình ảnh tại `PTTKHTTT/diagrams/` thông qua `draw-diagram`.

---

## 3. Quy Trình Thiết Kế Mô Hình Dữ Liệu (5 Bước)

```
[B1: Trích xuất Entity] ──> [B2: Xác định quan hệ] ──> [B3: Phân rã N-N]
                                                               │
[B5: Lập Bảng ánh xạ]   <── [B4: Chuẩn hóa 3NF]   <────────────┘
```

### Bước 1: Trích xuất thực thể bền vững từ Class Diagram
* Lọc bỏ các lớp hành vi thuần túy trong Class Diagram (ví dụ: các lớp `*Controller`, `*Service`, `*Helper`).
* Giữ lại các lớp thực thể lưu trữ thông tin nghiệp vụ lâu dài: `NguoiDung`, `KhachHang`, `DonHang`, `ChiTietDonHang`, `SanPham`, `DanhMuc`, `KhoHang`.

### Bước 2: Xác định bản số quan hệ (Cardinality)
* Xác định chính xác mối quan hệ giữa các cặp thực thể:
  * Quan hệ 1 - 1 (1:1): ví dụ `NguoiDung` và `HoSoNguoiDung`.
  * Quan hệ 1 - Nhiều (1:N): ví dụ `DanhMuc` và `SanPham`, `KhachHang` và `DonHang`.
  * Quan hệ Nhiều - Nhiều (N:N): ví dụ `DonHang` và `SanPham`, `SinhVien` và `MonHoc`.

### Bước 3: Phân rã quan hệ Nhiều - Nhiều (N:N)
* *Nguyên tắc bắt buộc:* CSDL quan hệ không hỗ trợ trực tiếp quan hệ N:N mà phải phân rã thành **Bảng trung gian (Associative Entity / Junction Table)** với hai quan hệ 1:N.
* Ví dụ:
  $$\text{DonHang} \xleftrightarrow{\quad N:N \quad} \text{SanPham}$$
  Được phân rã thành:
  $$\text{DonHang} \xrightarrow{\quad 1:N \quad} \text{ChiTietDonHang} \xleftarrow{\quad N:1 \quad} \text{SanPham}$$
* Khóa chính của bảng trung gian có thể là khóa phức hợp gồm hai khóa ngoại `(MaDonHang, MaSanPham)`, hoặc một khóa nhân tạo độc lập `MaChiTietDonHang`.

### Bước 4: Chuẩn hóa dữ liệu theo 3 dạng chuẩn (1NF → 2NF → 3NF)
Mỗi bảng trong mô hình dữ liệu phải chứng minh được việc thỏa mãn 3NF:
1. **Dạng chuẩn 1 (1NF):**
   * Mọi thuộc tính phải chứa giá trị nguyên tử (Atomic values), không có mảng hay nhóm lặp.
   * *Vi phạm thường gặp:* Cột `SoDienThoai` lưu chuỗi `"0912345678, 0987654321"`. Khắc phục: tách thành bảng phụ `SoDienThoaiKhachHang` hoặc chuẩn hóa 1 số chính.
2. **Dạng chuẩn 2 (2NF):**
   * Đạt 1NF và mọi thuộc tính không khóa phải phụ thuộc hàm toàn phần vào toàn bộ khóa chính (loại bỏ phụ thuộc một phần vào một phần khóa phức hợp).
   * *Vi phạm thường gặp:* Trong bảng `ChiTietDonHang (MaDonHang, MaSanPham, SoLuong, TenSanPham)`, thuộc tính `TenSanPham` chỉ phụ thuộc vào `MaSanPham` mà không phụ thuộc vào `MaDonHang`. Khắc phục: chuyển `TenSanPham` về bảng `SanPham`.
3. **Dạng chuẩn 3 (3NF):**
   * Đạt 2NF và không có thuộc tính không khóa nào phụ thuộc bắc cầu vào khóa chính qua một thuộc tính không khóa khác.
   * *Vi phạm thường gặp:* Trong bảng `NhanVien (MaNhanVien, HoTen, MaPhongBan, TenPhongBan)`, `TenPhongBan` phụ thuộc vào `MaPhongBan`, mà `MaPhongBan` lại phụ thuộc vào `MaNhanVien`. Khắc phục: tách riêng thành bảng `PhongBan (MaPhongBan, TenPhongBan)`.

### Bước 5: Lập Bảng Ánh Xạ Sang CSDL Vật Lý (Name Mapping Table)
* Theo quy định tại `.agents/rules/system-naming.md`, mô hình nghiệp vụ bắt buộc dùng **PascalCase**, còn CSDL quan hệ vật lý dùng **snake_case**.
* Agent bắt buộc lập bảng ánh xạ minh bạch từng trường dữ liệu theo mẫu:

| Thực thể / Thuộc tính mô hình | Bảng / Cột CSDL vật lý | Kiểu dữ liệu CSDL | Ràng buộc dữ liệu | Ghi chú nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- |
| `DonHang` | `don_hang` | TABLE | | Bảng lưu thông tin đơn đặt hàng |
| `DonHang.MaDonHang` | `ma_don_hang` | `VARCHAR(36)` | `PRIMARY KEY` | Khóa chính dạng UUID/Chuỗi mã hóa |
| `DonHang.NgayTao` | `ngay_tao` | `TIMESTAMP` | `NOT NULL` | Thời điểm khách tạo đơn |
| `DonHang.TongTien` | `tong_tien` | `DECIMAL(12,2)`| `NOT NULL` | Giá trị đơn hàng sau chiết khấu |
| `DonHang.TrangThai` | `trang_thai` | `VARCHAR(20)` | `NOT NULL` | Enum: `CHO_XAC_NHAN`, `HOAN_TAT` |
| `DonHang.MaKhachHang`| `ma_khach_hang` | `VARCHAR(36)` | `FOREIGN KEY` | Khóa ngoại tham chiếu `khach_hang` |

---

## 4. Chuyển Giao Cho Kỹ Năng Kết Xuất Biểu Đồ (`/draw-diagram`)

Khi người dùng yêu cầu vẽ biểu đồ ERD đồ họa Draw.io hoàn chỉnh:
* Lưu mã nguồn mô hình (Mermaid `erDiagram` hoặc PlantUML) tại `PTTKHTTT/models/10-mo-hinh-du-lieu-erd.mmd`.
* Kích hoạt kỹ năng `/draw-diagram` để tiếp nhận danh mục bảng, khóa chính (PK), khóa ngoại (FK) và bản số quan hệ đã chuẩn hóa.
* `draw-diagram` sẽ bố trí bảng thực thể, định tuyến quan hệ chân quạ trực giao, kết xuất mã Draw.io XML tại `PTTKHTTT/xml/10-mo-hinh-du-lieu-erd.drawio.xml`, kiểm định hình học qua `validate_drawio_xml.ps1` và xuất ảnh sang `PTTKHTTT/diagrams/`.

*Xem cẩm nang chuẩn hóa dữ liệu chi tiết tại:* [data-modeling-guide.md](./references/data-modeling-guide.md)


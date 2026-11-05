# Biểu Mẫu Khảo Sát Hiện Trạng & Phân Tích Phạm Vi

Tài liệu này cung cấp các khung mẫu chuẩn hóa phục vụ việc thu thập thông tin và soạn thảo tệp `PTTKHTTT/01-khao-sat-va-pham-vi.md`.

---

## 1. Dàn Ý Chuẩn Của Tệp `01-khao-sat-va-pham-vi.md`

```markdown
# 01. KHẢO SÁT HIỆN TRẠNG VÀ PHẠM VI HỆ THỐNG

## 1. Bối Cảnh & Giới Thiệu Tổ Chức
- Tên tổ chức/doanh nghiệp: ...
- Cơ cấu tổ chức và các bộ phận nghiệp vụ liên quan: ...
- Mô hình hoạt động và quy mô hiện tại: ...

## 2. Mục Tiêu Khảo Sát
- Xác định rõ hiện trạng vận hành và các luồng thông tin nghiệp vụ.
- Phát hiện các điểm nghẽn, rủi ro và bất cập trong quy trình thủ công/bán tự động.
- Xác định mục tiêu và kỳ vọng của các nhóm người dùng đối với hệ thống mới.

## 3. Đối Tượng & Kế Hoạch Khảo Sát
- Danh sách các bên liên quan (Stakeholders):
  * Cấp quản lý: ...
  * Cấp nhân viên tác nghiệp: ...
  * Khách hàng / Người dùng ngoài: ...
- Phương pháp áp dụng cho từng đối tượng (Phỏng vấn sâu, Bảng câu hỏi, Quan sát).

## 4. Báo Cáo Kết Quả Khảo Sát
- Biên bản ghi nhận phỏng vấn các vị trí chủ chốt.
- Báo cáo kết quả tổng hợp bảng hỏi khảo sát (nếu có).
- Bảng phân tích chứng từ, biểu mẫu nghiệp vụ hiện hành.

## 5. Danh Mục Vấn Đề Nghiệp Vụ Hiện Tại (Mã Hóa VD-xx)
*(Lưu ý: Bảng dưới đây là ví dụ minh họa hư cấu, agent không sao chép vào dự án thực tế).*

| Mã VD | Mô tả vấn đề hiện trạng | Nguồn gốc / Nhãn xác thực | Hướng xử lý dự kiến | Mục tiêu giải quyết |
| :---: | :--- | :---: | :---: | :--- |
| `VD-01` | Lập hóa đơn thủ công tốn thời gian, dễ nhầm giá | `[Illustrative only]` | Phần mềm (FR) | Tự động tính giá và in hóa đơn |
| `VD-02` | Tồn kho lệch so với sổ sách, không kiểm soát HSD | `[Illustrative only]` | Quy trình + Phần mềm (FR/BR) | Chuẩn hóa quy trình kiểm kê & Cảnh báo tồn thời gian thực |
| `VD-03` | Khách hàng không theo dõi được trạng thái đơn | `[Illustrative only]` | Phần mềm (FR) | Cổng thông tin tra cứu đơn hàng |

## 6. Phạm Vi Dự Án (Scope Boundaries)
- **Trong phạm vi (In-Scope):** Các phân hệ, quy trình được cam kết thực hiện trong đồ án.
- **Ngoài phạm vi (Out-of-Scope):** Các tính năng phức tạp được bảo lưu cho tương lai (ví dụ: Tích hợp ERP quốc tế, sàn giao dịch đa quốc gia).

## 7. Giải Pháp Đề Xuất & Mục Tiêu Hệ Thống Mới
- Tóm tắt kiến trúc giải pháp phần mềm hướng tới giải quyết triệt để các mã `VD-xx`.
```

---

## 2. Mẫu Biên Bản Phỏng Vấn Nghiệp Vụ Sâu

> [!NOTE]
> Biên bản phỏng vấn dưới đây là **ví dụ mẫu hư cấu (`[Illustrative only]`)** nhằm minh họa phương pháp đặt câu hỏi, không phải dữ liệu khảo sát thực tế của dự án.

```markdown
### BIÊN BẢN PHỎNG VẤN NGHIỆP VỤ (MẪU MINH HỌA)

* **Thời gian thực hiện:** [Ngày/Tháng/Năm]
* **Người phỏng vấn:** [Tên sinh viên / AI Agent đại diện]
* **Người được phỏng vấn:** Anh/Chị [Tên người được phỏng vấn] - Vai trò: `QuanLyCuaHang`
* **Mục tiêu phỏng vấn:** Khảo sát quy trình quản lý đơn hàng và kiểm soát tồn kho.

#### Câu hỏi & Nội dung trả lời ghi nhận (Minh họa):

1. **Hỏi:** *Quy trình từ lúc khách chốt mua hàng đến khi giao hàng hiện tại mất bao lâu và qua những bước nào?*
   * **Trả lời:** Hiện tại khách gọi điện hoặc nhắn tin, nhân viên ghi sổ tay rồi kiểm tra hàng trong kho vật lý. Mất khoảng 20-30 phút mỗi đơn. Nếu đông khách thường bị sót đơn `[Illustrative only]`.
2. **Hỏi:** *Điểm nghẽn lớn nhất gây thất thoát hoặc sai sót hiện nay là gì?*
   * **Trả lời:** Khi nhiều nhân viên cùng bán một mặt hàng còn ít trong kho, cả hai đều hứa với khách và nhận cọc, dẫn đến thiếu hàng giao và khách phàn nàn `[Illustrative only]`.
3. **Hỏi:** *Khi khách muốn hủy đơn hoặc đổi trả, quy trình xử lý công nợ diễn ra như thế nào?*
   * **Trả lời:** Kế toán phải lục lại cùi hóa đơn giấy, tính tiền thủ công và trừ sổ. Thường mất 1-2 ngày mới xong một ca hoàn tiền `[Illustrative only]`.
```

---

## 3. Mẫu Phân Tích Chứng Từ & Bóc Tách Trường Dữ Liệu

Khi phân tích một chứng từ thực tế (ví dụ: `HoaDonBanHang`), lập bảng bóc tách dữ liệu theo định dạng:

| Tên chứng từ mẫu | Phân loại trường | Tên trường đề xuất (PascalCase) | Kiểu dữ liệu dự kiến | Mục đích nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- |
| **`HoaDonBanHang`** | Tiêu đề chung | `MaHoaDon` | Chuỗi ký tự (ID) | Khóa chính nhận diện hóa đơn |
| | | `NgayLapHoaDon` | Ngày giờ (DateTime) | Thời điểm phát sinh giao dịch |
| | | `MaNhanVienLap` | Chuỗi ký tự (ID) | Xác định nhân viên chịu trách nhiệm |
| | | `MaKhachHang` | Chuỗi ký tự (ID) | Khách hàng nhận hóa đơn |
| | Dòng chi tiết | `MaSanPham` | Chuỗi ký tự (ID) | Sản phẩm được bán |
| | | `SoLuong` | Số nguyên (Integer) | Số lượng mua |
| | | `DonGiaBan` | Số thực (Decimal) | Đơn giá tại thời điểm lập hóa đơn |
| | | `ThanhTien` | Số thực (Decimal) | `SoLuong * DonGiaBan` |
| | Tổng cộng | `TongTienHang` | Số thực (Decimal) | Tổng giá trị trước thuế |
| | | `ThueVAT` | Số thực (Decimal) | Thuế giá trị gia tăng |
| | | `TienGiamGia` | Số thực (Decimal) | Chiết khấu khuyến mãi |
| | | `TongTienPhaiTra`| Số thực (Decimal) | Số tiền thực thu của khách |


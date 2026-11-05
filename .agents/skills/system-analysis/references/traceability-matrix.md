# Quy Chuẩn Hồ Sơ & Ma Trận Truy Vết Chức Năng (PTTKHTTT)

Tài liệu này định nghĩa cấu trúc chuẩn của thư mục hồ sơ `PTTKHTTT/` và quy cách lập Ma trận truy vết hai chiều (Bidirectional Traceability Matrix), phục vụ việc quản lý chất lượng xuyên suốt dự án.

---

## 1. Cấu Trúc Bộ Hồ Sơ Phân Tích & Thiết Kế Chuẩn

Mọi dự án khi áp dụng quy trình phải được tổ chức thành một thư mục duy nhất mang tên `PTTKHTTT/` tại thư mục gốc của repository:

```text
PTTKHTTT/
├── README.md                          # Bản đồ hồ sơ & Ma trận truy vết tổng thể
├── 01-khao-sat-va-pham-vi.md          # Hiện trạng, tổ chức, đối tượng & Vấn đề VD-xx
├── 02-yeu-cau-va-use-case.md          # Yêu cầu FR/NFR/BR & Danh mục Use Case UC-xx
├── 03-so-do-use-case.md               # Biểu đồ Use Case tổng thể & phân rã phân hệ
├── 04-bieu-do-lop.md                  # Biểu đồ Lớp (Class Diagram) miền phân tích
├── 05-bieu-do-tuan-tu.md              # Biểu đồ Tuần tự (Sequence Diagram) kịch bản Use Case
├── 06-bieu-do-hoat-dong.md            # Biểu đồ Hoạt động (Activity Diagram) các luồng xử lý
├── 07-bieu-do-trang-thai.md           # Biểu đồ Máy trạng thái (State Machine) các thực thể
├── 08-bieu-do-thanh-phan.md           # Biểu đồ Thành phần (Component Diagram) chuẩn OMG
├── 09-bieu-do-trien-khai.md           # Biểu đồ Triển khai (Deployment Diagram) thực tế & đề xuất
├── 10-mo-hinh-du-lieu-erd.md          # Mô hình dữ liệu ERD & Bảng ánh xạ CSDL vật lý
├── 11-thiet-ke-giao-dien-wireframe.md # Thiết kế Wireframe giao diện (Bảng Markdown + ASCII)
└── diagrams/                          # Thư mục lưu mã nguồn biểu đồ (.puml và .mermaid)
    ├── use-case/
    ├── class/
    ├── sequence/
    ├── activity/
    ├── state/
    ├── component/
    └── deployment/
```

> [!NOTE]
> Tất cả các liên kết giữa các tài liệu trong `PTTKHTTT/` phải sử dụng **đường dẫn tương đối** ngang cấp (ví dụ cú pháp: `[Biểu đồ Lớp](04-bieu-do-lop.md)`).

---

## 2. Ma Trận Truy Vết Chức Năng Hai Chiều (Traceability Matrix)

Ma trận truy vết được duy trì tại `PTTKHTTT/README.md` nhằm bảo đảm mỗi yêu cầu nghiệp vụ đều được hiện thực hóa qua các biểu đồ thiết kế, và ngược lại, mọi thành phần thiết kế hoặc đoạn mã nguồn đều phục vụ một yêu cầu chính đáng.

### 2.1. Cấu Trúc Bảng Ma Trận Chuẩn

> [!NOTE]
> Bảng ma trận dưới đây là **ví dụ minh họa mẫu (`[Illustrative only]`)**, không phải dữ liệu thực tế của dự án. AI agent tuyệt đối không được tự ý sao chép các mã chức năng hay thông tin giả định này vào hồ sơ dự án thực tế.

| Mã UC | Tên Use Case | Mã FR | Mã BR | Class tham gia | Sequence | Activity | State | Component | ERD (Thực thể) | Wireframe UI | Mã nguồn (State C) |
| :---: | :--- | :---: | :---: | :--- | :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| `UC-01` | `DangNhap` | `FR-01` | `BR-01` | `TaiKhoan`, `NguoiDung` | `Seq-01` | `Act-01` | `N/A (Tĩnh)` | `AuthService` | `TaiKhoan` | `ManHinhDangNhap` | `src/auth/` |
| `UC-02` | `TaoDonHang` | `FR-02` | `BR-02`<br>`BR-03` | `DonHang`, `ChiTietDonHang`, `SanPham` | `Seq-02` | `Act-02` | `State-01`<br>(DonHang) | `QuanLyDonHang` | `DonHang`<br>`ChiTietDonHang` | `ManHinhTaoDonHang` | `src/orders/` |
| `UC-03` | `TraCuuSanPham`| `FR-03` | `N/A` | `SanPham`, `DanhMuc` | `Seq-03` | `N/A (CRUD)` | `N/A (Tĩnh)` | `QuanLyKho` | `SanPham`, `DanhMuc` | `ManHinhTraCuu` | `src/products/` |

---

## 3. Quy Định Đánh Giá Trạng Thái Trong Ma Trận (Audit Status Labels)

Khi thực hiện kiểm toán hồ sơ hoặc đối soát mã nguồn trong Trạng thái C, mỗi ô hoặc mỗi dòng chức năng được đánh giá bằng 5 kết quả chuẩn hóa sau:

1. **`Khớp` (Matched):**
   * *Ý nghĩa:* Thành phần tương ứng có đầy đủ tài liệu, logic và mã nguồn (nếu có) phản ánh hoàn toàn thống nhất.
2. **`Thiếu` (Missing):**
   * *Ý nghĩa:* Thành phần được yêu cầu nhưng chưa có hoặc chưa triển khai đầy đủ (ví dụ: Controller tồn tại nhưng rỗng, chưa viết logic service hay lưu DB; hoặc tài liệu chưa mô tả chức năng có trong code).
   * *Hành động:* Kích hoạt skill chuyên môn tương ứng để bổ sung.
3. **`Mâu thuẫn` (Conflicting):**
   * *Ý nghĩa:* Có bằng chứng về hai phần tài liệu hoặc triển khai xung đột thực tế (ví dụ: tài liệu ghi tính thuế 10% nhưng code tính 5%; tên phương thức hoặc kiểu dữ liệu đối nghịch nhau).
   * *Hành động:* Gắn nhãn, phân tích nguyên nhân và đưa ra phương án chỉnh sửa đồng bộ.
4. **`Code ngoài phạm vi` (Out-of-Scope Code):**
   * *Ý nghĩa:* Mã nguồn chứa các hàm, tệp hoặc chức năng không nằm trong danh mục yêu cầu bài toán `FR-xx` đã phê duyệt.
   * *Hành động:* Xem xét loại bỏ khỏi dự án hoặc bổ sung vào yêu cầu nếu người dùng xác nhận cần thiết.
5. **`Không thể kết luận` (Inconclusive):**
   * *Ý nghĩa:* Không đủ bằng chứng để xác định do thông tin quá mơ hồ hoặc code thiếu chú thích/đứt đoạn.
   * *Hành động:* Gán nhãn `[Assumption]` và đặt câu hỏi trực tiếp cho người dùng.

### Quy định trạng thái miễn áp dụng: `N/A (kèm lý do)`
* `N/A` (Not Applicable) là trạng thái miễn áp dụng riêng biệt cho biểu đồ hoặc khía cạnh kỹ thuật không cần thiết đối với chức năng đó (không phải là kết quả phát hiện lỗi audit).
* *Quy tắc bắt buộc:* **Cấm ghi `N/A` đơn thuần**. Bắt buộc phải kèm lý do ngắn gọn (ví dụ: `N/A (Thao tác đọc dữ liệu đơn giản, không biến đổi trạng thái)`).

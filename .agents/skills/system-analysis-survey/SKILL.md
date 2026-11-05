---
name: system-analysis-survey
description: Skill chuyên sâu về khảo sát hiện trạng và xác định phạm vi hệ thống cho đồ án và bài tập lớn PTTKHTTT. Hướng dẫn lập kế hoạch khảo sát, thiết kế bảng câu hỏi, biên bản phỏng vấn, phân tích chứng từ thực tế, nhận diện các vấn đề nghiệp vụ VD-xx và chuyển đổi thành mục tiêu hệ thống. Kích hoạt khi bắt đầu dự án mới, giai đoạn tiếp nhận bài toán hoặc khi cần làm rõ bối cảnh nghiệp vụ.
---

# Kỹ Năng Khảo Sát Hiện Trạng & Xác Định Phạm Vi (`system-analysis-survey`)

Kỹ năng này thuộc **Nhóm Tier 2**, chịu trách nhiệm hướng dẫn AI agent thực hiện quy trình khảo sát thực chất bài toán nghiệp vụ, tìm hiểu cơ cấu tổ chức, phân tích chứng từ thực tế và chuẩn hóa các vấn đề nghiệp vụ thành danh sách mã hóa `VD-xx` phục vụ việc xây dựng hồ sơ `PTTKHTTT/01-khao-sat-va-pham-vi.md`.

---

## 1. Vai Trò & Ranh Giới Trách Nhiệm

* **Trách nhiệm chính:**
  * Lập kế hoạch khảo sát hiện trạng: đối tượng, phương pháp, nội dung cần thu thập.
  * Soạn bộ câu hỏi phỏng vấn và bảng hỏi khảo sát gắn liền với bài toán thực tế.
  * Phân tích chứng từ mẫu (hóa đơn, phiếu kho, đơn đăng ký) để trích xuất các trường dữ liệu thực tế.
  * Nhận diện và mã hóa các vấn đề tồn tại của hệ thống cũ thành mã `VD-01`, `VD-02`,...
  * Thiết lập phạm vi ranh giới bài toán và mục tiêu giải pháp của hệ thống mới.
* **Ranh giới (Điều kỹ năng này KHÔNG làm):**
  * Không đặc tả yêu cầu kỹ thuật `FR-xx`, `NFR-xx` hay quy tắc nghiệp vụ `BR-xx` (thuộc về `system-analysis-requirements`).
  * Không vẽ biểu đồ Use Case hoặc biểu đồ lớp UML (thuộc về `system-analysis-uml`).
  * Không thiết kế cấu trúc bảng CSDL (thuộc về `system-analysis-data`).

---

## 2. Đầu Vào & Đầu Ra

* **Đầu vào:**
  * Phát biểu bài toán ban đầu từ đề tài đồ án/bài tập lớn.
  * Mô tả sơ bộ của người dùng về mô hình hoạt động của tổ chức/doanh nghiệp.
  * Tài liệu, biểu mẫu, chứng từ mẫu thực tế (nếu có).
* **Đầu ra:**
  * Tệp tài liệu hoàn chỉnh: `PTTKHTTT/01-khao-sat-va-pham-vi.md` tuân thủ cấu trúc chuẩn.
  * Bảng danh mục vấn đề nghiệp vụ mã hóa (`VD-xx`) có gắn nhãn nguồn gốc thông tin.
  * Danh mục các bên liên quan (Stakeholders) và bảng phân tích chứng từ nghiệp vụ.

---

## 3. Quy Trình Khảo Sát Nghiệp Vụ Thực Chất (6 Bước)

```
[B1: Xác định đối tượng] ──> [B2: Chọn phương pháp] ──> [B3: Soạn công cụ khảo sát]
                                                                    │
[B6: Đề xuất giải pháp] <── [B5: Tổng hợp VD-xx]   <── [B4: Phân tích & Gắn nhãn]
```

### Bước 1: Xác định đối tượng khảo sát (Stakeholders)
* Liệt kê các nhóm đối tượng tham gia vào quy trình hoạt động:
  * *Cấp quản lý:* Ban giám đốc, Trưởng phòng, Quản lý cửa hàng (quan tâm báo cáo, chỉ số KPI, giám sát).
  * *Cấp tác nghiệp:* Nhân viên bán hàng, Thủ kho, Kế toán, Lễ tân (quan tâm tốc độ nhập liệu, tính dễ dùng, giảm sai sót).
  * *Đối tượng phục vụ:* Khách hàng, Sinh viên, Bệnh nhân, Độc giả (quan tâm tra cứu nhanh, tương tác thuận tiện).

### Bước 2: Lựa chọn phương pháp khảo sát phù hợp
* **Phỏng vấn sâu (Interview):** Áp dụng cho các quy trình cốt lõi và các cấp quản lý nhằm nắm bắt tầm nhìn và các điểm nghẽn nghiệp vụ lớn.
* **Bảng câu hỏi khảo sát (Questionnaire):** Áp dụng khi cần thu thập ý kiến diện rộng từ khách hàng hoặc nhân viên.
* **Phân tích biểu mẫu, chứng từ (Document Analysis):** Bắt buộc đối với các bài toán có phát sinh hóa đơn, phiếu nhập/xuất, biên lai, báo cáo.
* **Quan sát thực tế (Observation):** Quan sát luồng di chuyển của hàng hóa, khách hàng hoặc tài liệu giấy.

### Bước 3: Soạn thảo câu hỏi & công cụ khảo sát thực chất
* *Nguyên tắc bắt buộc:* Câu hỏi phải đi thẳng vào nghiệp vụ cụ thể, thời gian xử lý, tần suất và sai sót thường gặp.
* *Tuyệt đối cấm:* Hỏi lý thuyết chung chung ("Theo bạn phần mềm cần những tính năng gì?", "Bạn có thích phần mềm hiện đại không?").
* Xem mẫu câu hỏi chuẩn tại: [survey-templates.md](./references/survey-templates.md).

### Bước 4: Thu thập, phân tích & Gắn nhãn nguồn gốc thông tin
* Phân loại toàn bộ dữ liệu nghiệp vụ thực tế thu thập được theo 4 nhãn:
  * `[Evidence]`: Trích dẫn trực tiếp từ tài liệu đề bài, biểu mẫu giấy hoặc câu trả lời phỏng vấn đã được ghi nhận.
  * `[User-confirmed]`: Thông tin đã được người dùng xác nhận trực tiếp qua trao đổi.
  * `[Inference]`: Suy luận logic có căn cứ minh bạch từ bằng chứng thực tế.
  * `[Assumption]`: Giả định tạm thời chưa được kiểm chứng (phải ghi chú rõ và chờ xác nhận).
* **Phạm vi áp dụng nhãn:** Chỉ gắn nhãn cho dữ kiện nghiệp vụ thực tế, phát biểu yêu cầu, kết luận khảo sát và quyết định thiết kế có ảnh hưởng. Không bắt buộc gắn nhãn cho mọi câu mô tả thông thường, tiêu đề, kiến thức UML phổ quát hoặc hướng dẫn cú pháp.
* **Quy tắc trung thực:** Tuyệt đối không tự bịa đặt lời phát biểu của người phỏng vấn hoặc tạo số liệu thống kê giả. Mọi ví dụ trong tài liệu hướng dẫn chỉ mang tính chất minh họa (`[Illustrative only]`).

### Bước 5: Bóc tách chứng từ thực tế
* Liệt kê tất cả các biểu mẫu chứng từ hiện có trong tổ chức (ví dụ: `HoaDonBanHang`, `PhieuNhapKho`, `TheDocGia`).
* Bóc tách toàn bộ các trường dữ liệu trên từng chứng từ để chuẩn bị đầu vào cho Class Diagram và mô hình ERD:
  * *Thông tin chung:* `SoPhieu`, `NgayLap`, `NguoiLap`, `MaDoiTac`.
  * *Thông tin dòng chi tiết:* `MaHang`, `TenHang`, `DonGia`, `SoLuong`, `ThanhTien`.
  * *Thông tin tổng hợp:* `TongTien`, `ThueVAT`, `GiamGia`, `ThucThu`.

### Bước 6: Tổng hợp danh mục vấn đề nghiệp vụ (`VD-xx`)
* Chuẩn hóa mỗi khó khăn, bất cập thành một mã vấn đề cụ thể (dưới đây là ví dụ minh họa hư cấu, agent không được sao chép vào dự án thực tế):
  * `VD-01`: Quy trình lập hóa đơn thủ công tốn 15-20 phút/đơn, thường xuyên nhầm lẫn giá bán `[Illustrative only]`.
  * `VD-02`: Số liệu tồn kho giữa sổ sách và kho thực tế chênh lệch, không kiểm soát được hạn sử dụng hàng hóa `[Illustrative only]`.
  * `VD-03`: Khách hàng không thể tra cứu trạng thái đơn hàng từ xa `[Illustrative only]`.

---

## 4. Xử Lý Khi Dữ Liệu Thiếu Hoặc Mâu Thuẫn

1. **Khi đề bài quá ngắn hoặc thiếu bối cảnh nghiệp vụ:**
   * Không tự ý suy diễn toàn bộ quy trình của doanh nghiệp.
   * Tạo danh sách từ 3 đến 5 câu hỏi phỏng vấn trọng tâm, tập trung vào: quy mô, đối tượng sử dụng chính và quy tắc tính toán đặc thù.
   * Gắn nhãn `[Assumption]` cho các nhận định tạm thời và gửi người dùng phê duyệt trước khi hoàn tất tài liệu.
2. **Khi phát hiện mâu thuẫn giữa các bên khảo sát:**
   * Ghi nhận rõ sự mâu thuẫn trong bảng phân tích hiện trạng (ví dụ: "Nhân viên phản ánh quy trình duyệt quá chậm, trong khi Quản lý yêu cầu phải kiểm soát chặt chẽ").
   * Đề xuất giải pháp dung hòa trong hệ thống mới (ví dụ: "Phân quyền duyệt tự động cho đơn hàng dưới 5 triệu, đơn hàng trên 5 triệu mới chuyển cấp quản lý").

---

## 5. Chuyển Giao Quy Trình (Handover to Requirements)

Sau khi hoàn thiện và nghiệm thu tài liệu `PTTKHTTT/01-khao-sat-va-pham-vi.md`:
* Bàn giao danh mục `VD-xx` cho skill `system-analysis-requirements`.
* Kích hoạt `system-analysis-requirements` để phân tích đa chiều từng `VD-xx` (xác định phương án xử lý phù hợp: yêu cầu chức năng `FR-xx`, phi chức năng `NFR-xx`, quy tắc nghiệp vụ `BR-xx`, đề xuất cải tiến quy trình ngoài phần mềm, hoặc loại trừ ngoài phạm vi) và xác định Actor/Use Case.

*Xem tài liệu biểu mẫu khảo sát chi tiết tại:* [survey-templates.md](./references/survey-templates.md)


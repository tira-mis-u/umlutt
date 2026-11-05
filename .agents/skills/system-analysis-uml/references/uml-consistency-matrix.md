# Ma Trận Kiểm Tra Tính Nhất Quán 7 Biểu Đồ UML & Tiêu Chuẩn OMG

Tài liệu này cung cấp ma trận đối chiếu chéo (Cross-Consistency Matrix) và danh mục các lỗi ngữ nghĩa (Anti-Patterns) phổ biến cần tránh khi thiết kế 7 biểu đồ UML chuẩn OMG.

---

## 1. Các Cặp Biểu Đồ Đối Chiếu Nhất Quán Bắt Buộc

- **Use Case ↔ Sequence:**
  - Điểm kiểm tra: Mỗi Sequence Diagram có tương ứng với một kịch bản Use Case xác định không?
  - Quy tắc ngữ nghĩa: Sequence Diagram là sự hiện thực hóa (Realization) của đúng một kịch bản trong bảng đặc tả Use Case.
  - Cách sửa khi phát hiện mâu thuẫn: Không vẽ Sequence Diagram tự phát; bắt buộc lấy trực tiếp từ bảng đặc tả Use Case tại `02-yeu-cau-va-use-case.md`.

- **Sequence ↔ Class:**
  - Điểm kiểm tra: Các lời gọi nghiệp vụ nội bộ có tồn tại trên Class đích không?
  - Quy tắc ngữ nghĩa: Đối với lời gọi nghiệp vụ giữa các đối tượng nội bộ: Tên thông điệp = Tên phương thức công khai (`public`) của lớp đích trong Class Diagram. Các sự kiện kỹ thuật, tương tác UI hoặc gọi hệ thống ngoài không bắt buộc phải có operation trong Class Diagram miền nghiệp vụ.
  - Cách sửa khi phát hiện mâu thuẫn: Bổ sung phương thức vào Class Diagram hoặc chuẩn hóa lại tên thông điệp nghiệp vụ trong Sequence Diagram cho khớp.

- **Sequence ↔ Lifeline:**
  - Điểm kiểm tra: Các Lifelines có được phân định rạch ròi theo phạm vi không?
  - Quy tắc ngữ nghĩa: Phân biệt rõ: Lifelines nội bộ thuộc Class Diagram (Entity, Controller, Service) và Lifelines ngoài phạm vi Class Diagram (Actor người dùng, Boundary UI, External System, Middleware).
  - Cách sửa khi phát hiện mâu thuẫn: Định danh rõ vai trò của từng Lifeline, không ép buộc Actor hay Boundary UI phải trở thành Class trong Class Diagram miền nghiệp vụ.

- **Class ↔ State Machine:**
  - Điểm kiểm tra: Thực thể trong State Machine có thuộc tính lưu trạng thái không?
  - Quy tắc ngữ nghĩa: Class tương ứng bắt buộc phải có một thuộc tính kiểu Enum/State lưu các giá trị trạng thái.
  - Cách sửa khi phát hiện mâu thuẫn: Bổ sung thuộc tính trạng thái (ví dụ: `trangThai: TrangThaiDonHang`) vào Class Diagram.

- **Activity ↔ Sequence:**
  - Điểm kiểm tra: Nhánh rẽ `Decision` có khớp với khung tương tác không?
  - Quy tắc ngữ nghĩa: Điểm rẽ nhánh điều kiện `Decision` trên Activity tương ứng với khối `alt` hoặc `opt` trên Sequence Diagram.
  - Cách sửa khi phát hiện mâu thuẫn: Đồng bộ điều kiện rẽ nhánh giữa hai luồng xử lý.

- **Activity (Fork/Join):**
  - Điểm kiểm tra: Điểm phân tách song song có được dùng đúng ngữ nghĩa không?
  - Quy tắc ngữ nghĩa: `Fork` tách một luồng thành nhiều luồng chạy đồng thời; `Join` gom tất cả luồng đồng thời lại. Cấm dùng Fork để rẽ nhánh điều kiện.
  - Cách sửa khi phát hiện mâu thuẫn: Thay Fork thành Decision nếu các nhánh loại trừ lẫn nhau (if-else).

- **Component ↔ Class:**
  - Điểm kiểm tra: Các Component có đóng gói các Class cụ thể không?
  - Quy tắc ngữ nghĩa: Mỗi Component là một khối đóng gói kiến trúc chứa một hoặc nhiều Class có cùng miền nghiệp vụ.
  - Cách sửa khi phát hiện mâu thuẫn: Kiểm tra bảng phân rã Class vào Component trong tài liệu `08-bieu-do-thanh-phan.md`.

- **Component ↔ Deployment:**
  - Điểm kiểm tra: Các Artifacts trên Node có đóng gói Component tương ứng không?
  - Quy tắc ngữ nghĩa: Mỗi Artifact (tệp `.jar`, `.war`, container image) triển khai trên Node phải là dạng vật lý của Component.
  - Cách sửa khi phát hiện mâu thuẫn: Kiểm tra tính tương thích giữa Node thực thi và Artifact trong tài liệu `09-bieu-do-trien-khai.md`.

---

## 2. Danh Mục Các Lỗi Ngữ Nghĩa Thường Gặp (UML Anti-Patterns)

### Anti-pattern 1: Nhầm lẫn chuẩn OMG UML với mô hình C4
- **Biểu hiện:** Vẽ Component Diagram hoặc Deployment Diagram bằng các khối hộp mang phong cách C4 (ghi chú Container: Docker, Spring Boot, React SPA theo kiểu C4).
- **Chuẩn OMG bắt buộc:**
  - Component Diagram: Phải sử dụng ký hiệu Component có biểu tượng 2 hình chữ nhật nhỏ lồi ra ở góc trái, hoặc stereotype `<<component>>`, giao tiếp qua **Provided Interface** (ký hiệu lollipop `-0`) và **Required Interface** (ký hiệu socket `-(`).
  - Deployment Diagram: Phải sử dụng khối lập phương biểu diễn **Node** vật lý/ảo hóa, môi trường thực thi `<<executionEnvironment>>`, và các **Artifact** biểu diễn tệp thực thi cụ thể.

### Anti-pattern 2: Phương thức nghiệp vụ nội bộ trên Sequence Diagram "vô danh" trong Class Diagram
- **Biểu hiện:** Trên biểu đồ tuần tự, đối tượng nội bộ gửi thông điệp nghiệp vụ `xacNhanThanhToan()` đến `DonHangController` hoặc `DonHang`, nhưng trong Class Diagram của lớp đích lại không có phương thức này (hoặc đặt tên khác như `thanhToanDonHang()`).
- **Phân biệt phạm vi:** Quy tắc này áp dụng cho các lời gọi nghiệp vụ thực sự được mô hình hóa trong hệ thống nội bộ. Các sự kiện kỹ thuật (click chuột trên UI, nhận webhook HTTP thô) không bắt buộc phải có operation trong Class Diagram miền nghiệp vụ.
- **Khắc phục:** Mọi thông điệp nghiệp vụ nội bộ giữa các đối tượng phải được đối chiếu và bổ sung phương thức tương ứng vào Class Diagram.

### Anti-pattern 3: Biến Actor thành cơ sở dữ liệu hoặc thành phần nội bộ
- **Biểu hiện:** Vẽ Actor là `Database`, `Hệ thống`, `Developer`, `Tester` trên biểu đồ Use Case.
- **Chuẩn OMG bắt buộc:** Actor chỉ là người dùng bên ngoài hoặc hệ thống bên thứ ba tương tác trực tiếp với ranh giới hệ thống. Cơ sở dữ liệu là tài nguyên nội bộ, không bao giờ là Actor.

### Anti-pattern 4: "Thấy danh từ là tạo Class" (Class Bloat)
- **Biểu hiện:** Tạo riêng các lớp cho `DiaChi`, `SoDienThoai`, `GiaTien` dù chúng không có định danh độc lập, không có phương thức riêng và không có vòng đời quản lý riêng.
- **Khắc phục:** Áp dụng bộ lọc 4 tiêu chí: nếu không có định danh riêng và không có hành vi độc lập, hãy đưa về làm thuộc tính đơn lẻ của một Class khác (ví dụ: `diaChi: String` thuộc `KhachHang`).

### Anti-pattern 5: Dùng nhầm cú pháp `usecase-beta` trong Mermaid hoặc ngộ nhận Mermaid flowchart là chuẩn UML
- **Biểu hiện:** Viết cú pháp Mermaid `usecase-beta` gây lỗi render màn hình trắng hoặc lỗi cú pháp; hoặc ngộ nhận rằng việc vẽ Mermaid `flowchart LR` với các `subgraph` là đã đạt đầy đủ chuẩn mực học thuật của Use Case Diagram.
- **Quy chuẩn bắt buộc:**
  - PlantUML (`@startuml` ... `@enduml`) là định dạng ưu tiên chính thức, bảo đảm đầy đủ ngữ nghĩa học thuật OMG UML 2.5 cho đồ án.
  - Nếu dùng Mermaid `flowchart` làm phương án dự phòng khi môi trường không hỗ trợ PlantUML, bắt buộc phải ghi rõ: **Đây chỉ là biểu diễn sơ đồ luồng thay thế trực quan, không phải cú pháp Use Case UML chuẩn và không có đầy đủ ngữ nghĩa quan hệ UML 2.5** (như include/extend có điều kiện ngữ nghĩa chính xác).

### Anti-pattern 6: Đảo ngược hướng mũi tên trong Use Case hoặc tự ý thêm mũi tên vào Association
- **Biểu hiện:** Vẽ mũi tên `<<include>>` từ Use Case được bao hàm trỏ ngược về Use Case cơ sở; vẽ mũi tên `<<extend>>` từ Use Case cơ sở trỏ sang Use Case mở rộng; hoặc thêm đầu mũi tên định hướng vào đường Association giữa Actor và Use Case.
- **Quy chuẩn bắt buộc:**
  - Association: Nét liền KHÔNG ĐỊNH HƯỚNG, không có đầu mũi tên ở cả hai đầu.
  - `«include»`: Nét đứt, đầu mũi tên mở, hướng BẮT BUỘC từ Use Case cơ sở trỏ sang Use Case được bao gồm (`DatHang -> XacThuc`).
  - `«extend»`: Nét đứt, đầu mũi tên mở, hướng BẮT BUỘC từ Use Case mở rộng trỏ về Use Case cơ sở (`ThanhToanBangVi -> ThanhToan`).
  - Generalization: Nét liền, đầu tam giác rỗng, từ phần tử chuyên biệt (con) trỏ về phần tử tổng quát (cha) (ứng viên `endArrow=classic;endFill=0;endSize=10;`, Visual verification pending).
  - Tuyệt đối không tự ý đảo ngược chiều mũi tên!

### Anti-pattern 7: Dùng sai ký pháp đầu mũi tên thông điệp Sequence Diagram
- **Biểu hiện:** Vẽ lời gọi đồng bộ (Synchronous Call) bằng đầu mũi tên mở thay vì tam giác tô đen; vẽ thông điệp bất đồng bộ (Asynchronous) bằng tam giác tô đen; vẽ kết quả trả về (Reply/Return) bằng nét liền thay vì nét đứt; mặc định mọi Self-message có chung một kiểu arrowhead; vẽ Create Message bằng nét liền solid hoặc kéo dài Lifeline đối tượng mới lên tận đỉnh như thể đã tồn tại từ trước; hoặc dùng `endArrow=cross` thay thế sơ sài cho toàn bộ Destruction Occurrence khiến Lifeline vẫn tiếp tục chạy xuống dưới điểm hủy.
- **Quy chuẩn bắt buộc:**
  - Synchronous Call: Nét liền, ĐẦU MŨI TÊN TAM GIÁC TÔ ĐEN (`endArrow=classic;endFill=1;endSize=8;`, Standard filled triangle theo tài liệu Draw.io chính thức; Visual verification pending).
  - Asynchronous Message: Nét liền, ĐẦU MŨI TÊN MỞ (`endArrow=open;endFill=0;endSize=8;`).
  - Reply / Return Message: Nét đứt, ĐẦU MŨI TÊN MỞ (`dashed=1;dashPattern=4 4;endArrow=open;endFill=0;endSize=8;`, UML 2.5.1 cho phép đầu mở hoặc tam giác tô kín; repository chọn đầu mở để thống nhất với bài giảng).
  - Self-message: Không phải một Message Sort có kiểu đầu mũi tên riêng; là Message có điểm gửi và nhận cùng thuộc một Lifeline/Activation. Phải dùng kiểu đầu mũi tên đồng bộ (`endArrow=classic;endFill=1;`, Visual verification pending) hoặc bất đồng bộ (`endArrow=open;endFill=0;`) tùy theo bản chất lời gọi; đường nối loopback sang phải rồi quay lại Lifeline.
  - Create Message (UML 2.5.1 Section 17.4 & Draw.io Sequence doc): Đường NÉT ĐỨT (`dashed=1;dashPattern=4 4;endArrow=open;endFill=0;endSize=8;`), trỏ vào Participant mới; Lifeline của đối tượng mới BẮT ĐẦU TẠI ĐÚNG CAO ĐỘ (tọa độ Y) nhận thông điệp tạo (TUYỆT ĐỐI KHÔNG kéo dài Lifeline ngược lên trên đỉnh biểu đồ); không coi Create Message là lựa chọn nét liền solid giữa đồng bộ/bất đồng bộ.
  - Destroy Message: Message trỏ vào Destruction Occurrence (ký hiệu X, `shape=umlDestroy;whiteSpace=wrap;html=1;`, bảo toàn nét mặc định strokeWidth=1 của Draw.io) đặt chính xác ở đáy Lifeline; Lifeline chấm dứt hoàn toàn tại điểm hủy và không được phép kéo dài xuống phía dưới.
  - Shorthand loop `*[1..10]` hoặc `*[C]` trong bài giảng cũ phải chuyển sang Combined Fragment `loop` trong UML 2.

### Anti-pattern 8: Đánh đồng Decision với xử lý song song, hoặc lạm dụng thanh Fork/Join
- **Biểu hiện:** Sử dụng hình thoi Decision để phân nhánh các công việc diễn ra đồng thời, hoặc sử dụng thanh Fork/Join chỉ để tạo bố cục hình học đối xứng mà các công việc không hề độc lập hay đồng thời về mặt nghiệp vụ.
- **Quy chuẩn bắt buộc:**
  - Decision / Merge: Dành cho các nhánh rẽ điều kiện thay thế loại trừ nhau (if-else).
  - Fork / Join: Dành riêng cho các nhánh công việc thực sự độc lập và diễn ra đồng thời. Join phải chờ tất cả các luồng cần thiết hoàn thành trước khi đi tiếp.
  - Phân biệt Flow Final vs Activity Final: Activity Final (chấm đen có vòng tròn bao quanh) kết thúc toàn bộ quy trình; Flow Final (vòng tròn có dấu X bên trong) chỉ kết thúc một luồng xử lý riêng biệt mà không dừng toàn bộ Activity. Tuyệt đối không dùng shape cổng OR và không dùng ký tự Unicode mặc định; phân biệt triệt để với Sequence Destruction Occurrence.

### Anti-pattern 9: Đánh đồng Event và Guard, hoặc biến Entry/Do/Exit thành State độc lập
- **Biểu hiện:** Ghi nhãn chuyển trạng thái thiếu sự kiện hoặc nhầm lẫn giữa sự kiện kích hoạt với điều kiện kiểm tra (ví dụ ghi `[SoDuHopLe]` thay vì `ThanhToan [SoDuHopLe] / GhiNhanThanhToan`); hoặc vẽ các hộp State riêng cho `entry`, `do`, `exit`.
- **Quy chuẩn bắt buộc:**
  - Cú pháp Transition: `trigger [guard] / effect`.
  - `entry`, `do`, `exit` là hành vi nội tại bên trong một State, không bao giờ là State riêng.
  - Phân biệt rõ External Self-transition (rời state rồi quay lại, kích hoạt exit/entry) với Internal Transition (xử lý nội tại không rời state, không kích hoạt exit/entry).

### Anti-pattern 10: Tự động `«include» DangNhap` vào mọi Use Case hoặc giả định mọi Actor đều đã đăng nhập
- **Biểu hiện:** Kẻ đường `«include» DangNhap` từ tất cả các Use Case trong hệ thống đến Use Case `DangNhap`, hoặc mặc nhiên xem tất cả Actor đều đã đăng nhập phiên làm việc trước khi thực hiện chức năng.
- **Quy chuẩn bắt buộc:**
  - Tuyệt đối không tự động include `DangNhap` vào tất cả Use Case.
  - Nếu Use Case yêu cầu người dùng đã xác thực, có thể mô tả trạng thái xác thực trong mục Tiền điều kiện (Precondition).
  - Nếu hệ thống hỗ trợ khách vãng lai chưa đăng nhập, đăng nhập tùy chọn hoặc các luồng xác thực đa dạng (OAuth, OTP, SSO), phải mô hình hóa chính xác theo nghiệp vụ thực tế; không giả định mọi Actor đều đã đăng nhập.
  - Chỉ tạo quan hệ `<<include>> DangNhap` khi việc xác thực là một bước nghiệp vụ nội tại bắt buộc diễn ra ngay trong luồng của Use Case đó.


# Ngữ Pháp Bố Cục Cho Từng Loại Biểu Đồ (Layout Grammars)

Tài liệu này định nghĩa chi tiết các quy tắc bố cục không gian, cấu trúc phân vùng và nguyên tắc mỹ học chuẩn hóa cho từng loại biểu đồ trong đồ án Phân tích và Thiết kế Hệ thống Thông tin (PTTKHTTT). Các quy tắc không gian trong tài liệu này đóng vai trò là các heuristic bố cục mặc định tham khảo, giúp khởi tạo bản vẽ khoa học, đồng thời có thể điều chỉnh linh hoạt theo miền bài toán thực tế.

Mọi biểu đồ trong tài liệu này đều ưu tiên **sử dụng style mặc định của Draw.io**: không tự ý thêm màu trang trí, không tô màu phân loại Actor/Component/State/tầng kiến trúc, không gradient và không shadow.

## 1. Biểu Đồ Use Case (Use Case Diagram)

Biểu đồ Use Case là cửa ngõ giao tiếp giữa nghiệp vụ thực tế và hệ thống kỹ thuật. Kỹ năng này phân định rõ hai cấp độ biểu diễn và hỗ trợ linh hoạt các phương án mô hình hóa:

### Phân cấp hai mức độ mô hình hóa

- **Biểu đồ Use Case Tổng quát (General Use Case Overview):**
  - *Mục đích:* Phác họa toàn cảnh bức tranh chức năng của toàn hệ thống hoặc phân hệ lớn, thể hiện ranh giới hệ thống và các nhóm tác nhân tương tác.
  - *Cấu trúc bố cục tham khảo:* Khung chữ nhật bao quanh toàn bộ hệ thống (System Boundary) thường được đặt tại trung tâm bản vẽ, tiêu đề hệ thống đặt ở góc trên bên trái khung.
  - *Bố trí Actor (Heuristic mặc định):* Các Actor được bố trí bên ngoài ranh giới hệ thống, phân bổ theo vai trò và mạng lưới quan hệ nghiệp vụ (ví dụ: nhóm người dùng phổ thông/công dân bên trái, nhóm quản trị viên/đơn vị nghiệp vụ bên phải) nhằm giảm thiểu hiện tượng các đường liên kết cắt chéo canvas.
  - *Mức độ chi tiết:* Các chức năng bên trong ranh giới được gom thành các nhóm Use Case cấp cao (High-level Functional Groups) như `QuanLyDonHang`, `XuLyYeuCau`, `QuanTriHeThong`. Bố trí các nhóm thoáng và dễ phân biệt. Không đưa các thao tác vụn vặt như nút bấm hay các bước giao dịch chi li vào sơ đồ tổng quát.

- **Biểu đồ Use Case Chi tiết theo nhóm chức năng (Functional Group Details):**
  - Hỗ trợ linh hoạt cả hai cách tiếp cận, không ép buộc mọi biểu đồ vào một khuôn mẫu duy nhất:
    - *Cách 1 — Tổng quan nhóm chức năng (Grouped Functional Overview):* Đây là phong cách trình bày thực tế được quan sát thấy trong các tài liệu tham khảo đồ án (một hình elip đại diện cho nhóm chức năng cấp cao, kèm một khối UML Note bên cạnh liệt kê danh sách các chức năng con chi tiết). Lưu ý cốt lõi: Các dòng gạch đầu dòng bên trong khối Note KHÔNG PHẢI là các Use Case UML được mô hình hóa độc lập (không sở hữu quan hệ kết nối UML, không có kịch bản Use Case độc lập trên biểu đồ). Tuyệt đối không tuyên bố phong cách dùng Note này là một ký pháp UML chuẩn độc lập của OMG. Tuy nhiên, đây là giải pháp trực quan hợp lệ và hữu ích khi người dùng cần bản vẽ tổng quan nhanh, súc tích cho một cụm chức năng.
    - *Cách 2 — Phân rã Use Case độc lập (Individual Use Cases):* Khi cần mô hình hóa đầy đủ và chặt chẽ các mục tiêu nghiệp vụ theo chuẩn UML OMG, BẮT BUỘC phải dùng các hình elip Use Case riêng biệt cho từng chức năng. Mỗi mục tiêu nghiệp vụ độc lập là một hình elip riêng bên trong khung ranh giới phân hệ. Actor kết nối trực tiếp đến Use Case tương ứng. Các Use Case được bố trí thành cụm rõ ràng, mạch lạc. Không chia nhỏ các thao tác giao diện vô nghĩa thành Use Case.
    - Hệ thống hỗ trợ cả hai phong cách tùy theo mục đích thực tế của người dùng (tổng quan nhanh vs đặc tả mô hình đầy đủ). Tuyệt đối không coi UML Note là sự thay thế cho Use Case độc lập, nhưng cũng không cấm sử dụng Note trong sơ đồ tổng quan nhóm chức năng.

### Quy ước đặt tên Use Case
- Tên mỗi Use Case BẮT BUỘC tuân thủ cấu trúc: `Động từ mạnh + Danh từ/Đối tượng`.
- Viết PascalCase (tiếng Việt không dấu).
- Động từ phải thể hiện mục tiêu hoặc hành động nghiệp vụ cụ thể của Actor.
- Tránh các tên chung chung, mơ hồ nếu có thể xác định hành động cụ thể (ví dụ: tránh các tên như `XuLy`, `ThucHien`, `ChucNang1`).
- Ví dụ chuẩn: `TaoDonHang`, `HuyDonHang`, `XacNhanDonHang`, `KiemTraTonKho`, `CapNhatThongTinKhachHang`, `TraCuuThongTinThienTai`.
- Tuyệt đối không dùng camelCase cho tên Use Case vì đây là mục tiêu nghiệp vụ độc lập, không phải Attribute hoặc Method bên trong Class.

### Ký pháp quan hệ và hướng liên kết
- Quan hệ Association giữa Actor và Use Case: Là đường thẳng liền nét, không có đầu mũi tên ở cả hai phía (`endArrow=none;endFill=0;strokeColor=#000000;`). Chỉ vẽ đường liên kết khi Actor thực sự trực tiếp khởi tạo hoặc tham gia giao tiếp với Use Case.
- Quan hệ `<<include>>`: Biểu diễn bằng đường nét đứt kèm mũi tên nhọn hở (`dashed=1;endArrow=open;endSize=8;strokeColor=#000000;`), hướng bắt buộc xuất phát từ Use Case cơ sở (source) chỉ đến Use Case được bao hàm (target), kèm nhãn hiển thị `<<include>>`. Chỉ áp dụng cho các chuỗi hành vi bắt buộc phải thực hiện hoặc tái sử dụng ở nhiều Use Case.
- Quan hệ `<<extend>>`: Biểu diễn bằng đường nét đứt kèm mũi tên nhọn hở, hướng bắt buộc xuất phát từ Use Case mở rộng (source) chỉ ngược về Use Case cơ sở (target), kèm nhãn hiển thị `<<extend>>` và điểm mở rộng (Extension Point) hoặc điều kiện kích hoạt.
- Quan hệ kế thừa Actor (Actor Generalization): Biểu diễn bằng đường thẳng liền nét kèm biểu tượng tam giác rỗng hướng về Actor cha (source = Actor con, target = Actor cha; ứng viên `endArrow=classic;endFill=0;endSize=10;`, Visual verification pending theo tài liệu Draw.io Style Reference).
- Kiểm soát quan hệ xác thực (`DangNhap`):
  - Tuyệt đối không tự động include `DangNhap` vào tất cả Use Case.
  - Nếu Use Case yêu cầu người dùng đã xác thực, có thể mô tả trạng thái xác thực trong mục Tiền điều kiện (Precondition) của kịch bản.
  - Nếu hệ thống hỗ trợ khách vãng lai chưa đăng nhập, đăng nhập tùy chọn hoặc các luồng xác thực đa dạng (OAuth, OTP, SSO), phải mô hình hóa chính xác theo nghiệp vụ thực tế của bài toán.
  - Không giả định mọi Actor đều đã đăng nhập.
  - Chỉ tạo quan hệ `<<include>> DangNhap` khi việc xác thực là một bước nghiệp vụ nội tại bắt buộc diễn ra ngay trong luồng của Use Case đó.

## 2. Biểu Đồ Lớp Và Biểu Đồ Thực Thể Quan Hệ (Class Diagram & ERD)

Biểu đồ Lớp và ERD là xương sống cấu trúc dữ liệu của hệ thống, đòi hỏi trật tự không gian chặt chẽ:

### Biểu đồ lớp (Class Diagram)

- Bố cục phân tầng hoặc theo cụm miền (Domain/Package Clustering):
  - Xếp các lớp theo cụm nghiệp vụ có liên quan mật thiết để giảm độ dài các đường kết nối.
  - Bố trí quan hệ kế thừa (Generalization) theo chiều dọc từ trên xuống dưới (lớp cha ở trên, các lớp con ở dưới).
- Cấu trúc ba ngăn chuẩn mực (Three-Compartment Box):
  - Ngăn trên: Tên lớp (in đậm, BẮT BUỘC sử dụng danh từ hoặc cụm danh từ số ít theo chuẩn PascalCase, ví dụ: `DonHang`, `KhachHang`, `ChiTietDonHang`, `DocGia`. Tuyệt đối không đặt tên Class bằng động từ chỉ hành động).
  - Ngăn giữa: Danh sách các thuộc tính nghiệp vụ (Attribute Name: BẮT BUỘC viết thường chữ cái đầu theo camelCase, là danh từ hoặc cụm danh từ) kèm tầm vực truy cập và kiểu dữ liệu (ví dụ: `+ maDonHang: String`, `- tongTien: Decimal`, `# ngayDat: Date`).
  - Ngăn dưới: Danh sách các phương thức nghiệp vụ (Method / Operation Name: BẮT BUỘC viết thường chữ cái đầu theo camelCase, bắt đầu bằng động từ hành động thể hiện hành vi cụ thể) (ví dụ: `+ taoDonHang(): DonHang`, `+ tinhTongTien(): Decimal`, `+ kiemTraTonKho(): Boolean`, `+ xacNhanTra(): Boolean`).
  - Quy tắc cốt lõi: Trong Class Diagram, CHỈ Class Name viết PascalCase. Toàn bộ Attribute và Method đều BẮT BUỘC viết camelCase.
- Định tuyến các quan hệ liên kết:
  - Quan hệ liên kết (Association), kết tập (Aggregation) và hợp thành (Composition) chạy trên các hành lang giữa các cụm lớp.
  - Sử dụng định tuyến trực giao, nhãn tên quan hệ và chỉ số bản số (Multiplicity: `1`, `0..*`, `1..*`) đặt sát hai đầu mút của đường nối, cách cạnh lớp tối thiểu 8 px để không bị che khuất.

### Biểu đồ thực thể quan hệ (ERD - Phân biệt 3 cấp độ mô hình)

Tùy theo giai đoạn phân tích và thiết kế, mô hình ERD được chia thành ba mức độ phân định rõ ràng:

- Mô hình quan niệm (Conceptual ERD):
  - Tập trung mô tả các thực thể nghiệp vụ cốt lõi và các mối quan hệ ngữ nghĩa cấp cao trong bài toán.
  - Thể hiện tên thực thể (PascalCase) và các mối quan hệ nghiệp vụ chính. Không bắt buộc phải liệt kê đầy đủ thuộc tính chi tiết, không yêu cầu khóa ngoại (FK) hay kiểu dữ liệu vật lý.
- Mô hình logic (Logical ERD):
  - Chi tiết hóa toàn bộ các thuộc tính nghiệp vụ, xác định khóa chính (PK), khóa ngoại (FK) và chuẩn hóa dữ liệu (chuẩn 3NF).
  - Tên thực thể: Viết PascalCase (ví dụ: `DonHang`, `ChiTietDonHang`).
  - Thuộc tính thực thể trên ERD (Attribute trên ERD): BẮT BUỘC viết PascalCase (ví dụ: `MaDonHang`, `TongTien`, `NgayDat`, `MaKhachHang`). Không áp dụng quy tắc camelCase của Class Member ra ngoài Class Diagram.
  - Khai báo kiểu dữ liệu logic độc lập với hệ quản trị CSDL (ví dụ: String, Integer, Decimal, DateTime, Boolean).
- Mô hình vật lý (Physical ERD):
  - Đặc tả triển khai cụ thể trên một hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) xác định (như PostgreSQL, MySQL, SQL Server).
  - Tên bảng và tên cột dùng `snake_case` (ví dụ: bảng `don_hang`, cột `ma_don_hang`, `tong_tien`).
  - Khai báo kiểu dữ liệu vật lý chuẩn xác (ví dụ: VARCHAR(50), INT, BIGINT, NUMERIC(12,2), TIMESTAMP), quy tắc chỉ mục (Index), khóa chính/ngoại vật lý và các ràng buộc (Not Null, Unique, Check).
  - Bắt buộc có bảng ánh xạ đối chiếu giữa thuộc tính logic (PascalCase) và cột vật lý (snake_case).
- Ký pháp quan hệ chân quạ (Crow's Foot Notation):
  - Sử dụng ký hiệu chân quạ đặt chính xác ở hai đầu mút tiếp giáp cạnh thực thể để thể hiện bản số `1 - 1`, `1 - n` hoặc `n - n`.
  - Toàn bộ đường nối giữa các bảng đi theo đường trực giao vuông góc, hạn chế tối đa việc cắt xuyên qua các bảng thực thể khác.

## 3. Biểu Đồ Trình Tự (Sequence Diagram)

Biểu đồ Trình tự mô tả tương tác động giữa các đối tượng theo trục thời gian tuyến tính từ trên xuống dưới. Cần phân định rạch ròi giữa **Message Sort** (loại thông điệp ngữ nghĩa) và **Hình học tương tác đặc thù** (Self-message, Create, Destroy):

- Bố cục Participant, Lifeline và Activation:
  - Các Participant được xếp thành hàng ngang ở mép trên cùng của bản vẽ (trừ các đối tượng được tạo động trong quá trình tương tác). Định danh Participant BẮT BUỘC viết PascalCase.
  - Lifeline là đường thẳng đứng nét đứt (`dashed=1;`), biểu diễn sự tồn tại của đối tượng trong tương tác.
  - Thanh kích hoạt (Activation / Execution Specification) là khối chữ nhật hẹp (chiều rộng 12 đến 16 px) đặt chính xác trên đường nét đứt của Lifeline để biểu thị khoảng thời gian đối tượng đang thực thi tác vụ. Không dùng Lifeline thay cho Activation.
  - Khoảng cách ngang giữa các Lifeline: Heuristic khởi tạo từ 180 đến 260 px, điều chỉnh theo chiều dài thông điệp dài nhất.
- Trục thời gian và Quy chuẩn Message Sort:
  - Trục tung y biểu diễn tiến trình thời gian tăng dần từ trên xuống. Mọi thông điệp (Messages) giữa các đối tượng đều là các đường mũi tên nằm ngang hoàn toàn (`y1 == y2`), khoảng cách dọc giữa các bước từ 35 đến 45 px.
  - **1. Synchronous Call (Gọi đồng bộ):** Đường NÉT LIỀN, ĐẦU MŨI TÊN TAM GIÁC TÔ ĐEN. Theo tài liệu Draw.io Style Reference chính thức, `classic` là standard filled triangle (`endArrow=classic;endFill=1;endSize=8;`), ưu tiên sử dụng thay vì giả định `block` là tam giác UML (Visual verification pending). Bên gửi dừng chờ bên nhận hoàn tất xử lý. Khuyến nghị ưu tiên dùng trong các kịch bản Use Case tuần tự.
  - **2. Asynchronous Message (Thông điệp bất đồng bộ):** Đường NÉT LIỀN, ĐẦU MŨI TÊN MỞ (`endArrow=open;endFill=0;endSize=8;`), bên gửi tiếp tục xử lý ngay mà không chờ bên nhận.
  - **3. Reply / Return (Kết quả trả về):** Đường NÉT ĐỨT, ĐẦU MŨI TÊN MỞ (`dashed=1;dashPattern=4 4;endArrow=open;endFill=0;endSize=8;`), trả kết quả hoặc quyền điều khiển về bên gọi. (Lưu ý: Chuẩn UML 2.5.1 cho phép thông điệp trả về dùng đầu mũi tên mở hoặc tam giác tô kín; repository này chọn đầu mũi tên mở để thống nhất với quy ước trình bày của bài giảng, không tuyên bố chỉ có duy nhất một dạng đầu mũi tên hợp lệ).
  - Ràng buộc: Không đảo hướng mũi tên; không nhầm tam giác tô đen với đầu mở; không nhầm nét liền với nét đứt.
- Tương tác hình học đặc thù:
  - **Self-message (Tự gọi nội tại — Không phải một Message Sort có kiểu đầu mũi tên riêng):**
    - Là thông điệp có điểm gửi và nhận cùng thuộc một Participant/Lifeline.
    - Self-call đồng bộ BẮT BUỘC dùng kiểu đầu mũi tên đồng bộ (`endArrow=classic;endFill=1;endSize=8;`, Visual verification pending); Self-message bất đồng bộ BẮT BUỘC dùng kiểu đầu mũi tên bất đồng bộ (`endArrow=open;endFill=0;endSize=8;`). Không mặc định mọi Self-message có cùng một kiểu arrowhead.
    - Đường nối vòng ra phía bên phải rồi gập góc vuông quay lại Lifeline/Activation: `edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;verticalAlign=bottom;` kết hợp với arrowhead tương ứng.
  - **Create Message (Tạo đối tượng mới — Chuẩn UML 2.5.1 Section 17.4 & Draw.io Sequence doc):**
    - Là Message Sort `messageSort=createMessage` gửi đến một đối tượng mới được tạo, trỏ thẳng vào HỘP Participant mới tạo.
    - Ký pháp connector: Đường NÉT ĐỨT (`dashed=1;dashPattern=4 4;`), ĐẦU MŨI TÊN MỞ (`endArrow=open;endFill=0;endSize=8;`). Không coi Create Message là lựa chọn nét liền solid giữa đồng bộ/bất đồng bộ.
    - Hình học đường đời: Participant mới được đặt tại tọa độ dọc y tương ứng với thời điểm nhận thông điệp tạo; Lifeline của đối tượng mới BẮT ĐẦU TẠI ĐÚNG CAO ĐỘ (tọa độ Y) nhận Create Message. TUYỆT ĐỐI KHÔNG kéo dài Lifeline ngược lên trên đỉnh biểu đồ (không được vẽ đối tượng mới như thể đã tồn tại từ đầu tương tác).
  - **Destroy Message & Destruction Occurrence (Hủy đối tượng):**
    - Thông điệp hướng đến đối tượng bị hủy để chấm dứt sự tồn tại của đối tượng đó.
    - Lifeline kết thúc tại Destruction Occurrence (Ký hiệu X, `shape=umlDestroy;whiteSpace=wrap;html=1;`, bảo toàn nét mặc định strokeWidth=1 của Draw.io) đặt chính xác ở đáy của Lifeline. Message hủy trỏ thẳng vào điểm hủy này (`target="id-umlDestroy"`).
    - Tuyệt đối không dùng `endArrow=cross` làm giải pháp duy nhất thay thế toàn bộ Destruction Occurrence; Lifeline KHÔNG ĐƯỢC PHÉP tiếp tục chạy xuống dưới điểm hủy.
- Khung phân mảnh tương tác (Combined Fragments: alt, opt, loop, ref):
  - Khung chữ nhật bao quanh một vùng tương tác có điều kiện (nền trong suốt `fillColor=none;`). Nhãn toán tử (`alt`, `opt`, `loop`, `ref`) đặt trong ô tab góc trên bên trái khung.
  - `alt`: Nhiều nhánh thay thế loại trừ nhau, mỗi nhánh có Guard riêng.
  - `opt`: Một nhánh tùy chọn duy nhất, không dùng thay thế switch nhiều lựa chọn.
  - `loop`: Vòng lặp tương tác kèm điều kiện hoặc giới hạn lặp. Các ký hiệu rút gọn trong tài liệu cũ như `*[1..10]Message` hoặc `*[C]Message` bắt buộc phải được chuyển đổi thành Combined Fragment `loop` khi dựng mô hình UML 2 chuẩn.
  - `ref`: Tham chiếu đến một Sequence Diagram khác (Interaction Use), không phải là connector tùy ý.
- Kỹ thuật phân tích BCE (Boundary - Control - Entity):
  - Thể hiện bằng stereotype `«boundary»`, `«control»`, `«entity»` hoặc icon đồ họa tương ứng. Không bắt buộc mọi Sequence Diagram phải có đủ cả 3 loại. BCE là kỹ thuật phân tích vai trò lớp, không phải một loại Message.
- Thuật ngữ chuẩn hóa:
  - Communication Diagram (UML 2) là tên gọi chuẩn thay cho Collaboration Diagram (UML 1.x).
  - Thuật ngữ "Active Diagram" trong các bài giảng cũ được hiểu là "Activity Diagram".
  - Hướng dẫn phần mềm StarUML (như mẹo chọn `asyncSignal`) là giải pháp tình thế của công cụ, không mang sang Draw.io.

## 4. Biểu Đồ Hoạt Động (Activity Diagram)

- Bố cục phân làn trách nhiệm (Swimlanes):
  - Bản vẽ được chia thành các làn (làn dọc hoặc ngang) tương ứng với từng Actor, Phòng ban hoặc Hệ thống chịu trách nhiệm.
  - Mỗi Action thuộc về đúng một lane. Connector có thể đi xuyên qua ranh giới giữa các lane.
  - Làn bơi (Swimlane) là ranh giới phân định trách nhiệm, không phải là Actor, State hay Action.
- Các ký hiệu thành phần chuẩn mực:
  - Nút bắt đầu (Initial Node): Chấm tròn đặc màu đen (`fillColor=#000000;strokeColor=#000000;`), đặt ở đầu luồng.
  - Nút hành động (Action Node): Khối chữ nhật bo góc tròn (nền trắng viền đen), nhãn bắt đầu bằng động từ và đối tượng nghiệp vụ.
  - Nút kết thúc toàn bộ quy trình (Activity Final Node): Chấm đen có vòng tròn bao quanh, kết thúc toàn bộ quy trình.
  - Nút kết thúc luồng đơn lẻ (Flow Final Node): Vòng tròn có dấu X bên trong (hai đường chéo cắt nhau bên trong hình elip), kết thúc một luồng xử lý riêng biệt mà không dừng toàn bộ Activity (không dùng cổng OR `shape=mxgraph.flowchart.or` và không dùng text Unicode mặc định; phân biệt triệt để với Destruction Occurrence trong Sequence Diagram).
  - Nút rẽ nhánh / Hợp nhất (Decision / Merge Node): Khối hình thoi (nền trắng viền đen).
    - Decision: 1 luồng vào, nhiều luồng ra kèm điều kiện bảo vệ `[Guard]` (ví dụ: `[HopLe]`, `[KhongHopLe]`, `[else]`). Tuyệt đối không dùng Decision cho xử lý song song.
    - Merge: Nhiều luồng vào, 1 luồng ra để hợp nhất các nhánh thay thế.
  - Thanh phân tách và đồng bộ luồng song song (Fork / Join Synchronization Bar):
    - Fork: 1 luồng vào, từ 2 luồng ra trở lên để phân tách các luồng chạy đồng thời.
    - Join: Từ 2 luồng vào trở lên, 1 luồng ra để đồng bộ; Join chờ tất cả các luồng cần thiết hoàn thành trước khi đi tiếp.
    - Chỉ dùng thanh Fork/Join khi các hoạt động thực sự có thể diễn ra đồng thời về mặt nghiệp vụ. Tuyệt đối không dùng thanh Fork/Join chỉ để tạo bố cục đẹp mắt.
- Mũi tên luồng điều khiển (Control Flow):
  - Đường nét liền, ĐẦU MŨI TÊN MỞ (`endArrow=open;endFill=0;endSize=8;`), hướng từ hoạt động nguồn đến hoạt động đích.
  - Connector phải gắn chính xác vào node hoặc thanh đồng bộ, không để kết thúc lơ lửng.
- Tuyến đường quay lại và xử lý lỗi (Bypass Corridors):
  - Nhánh lặp hoặc chuyển hướng khi gặp lỗi phải đi ra hành lang thông thoáng ở sát mép làn hoặc mép ngoài canvas rồi mới vòng ngược lên trên; tránh đâm xuyên qua các Action Node khác.

## 5. Biểu Đồ Trạng Thái (State Machine Diagram)

- Ký hiệu trạng thái và vùng xử lý:
  - Nút bắt đầu (Initial Pseudostate): Chấm tròn đen đặc.
  - Khối trạng thái (State): Hình chữ nhật bo góc tròn (nền trắng viền đen), tên trạng thái là danh từ hoặc tính từ thể hiện trạng thái kết quả, viết PascalCase (`ChoXacNhan`, `DangXuLy`, `HoanTat`, `DaHuy`).
  - Nút kết thúc (Final State): Vòng tròn kép (chấm đen có vòng tròn bao ngoài). Final State thể hiện sự kết thúc của State Machine hoặc Region, không tự động đồng nghĩa với việc đối tượng bị xóa khỏi cơ sở dữ liệu.
- Cú pháp Transition và phân biệt Event vs Guard:
  - Mũi tên chuyển trạng thái: Đường nét liền, ĐẦU MŨI TÊN MỞ (`endArrow=open;endFill=0;endSize=8;`), hướng đến State đích.
  - Nhãn chuyển trạng thái chuẩn: `trigger [guard] / effect`
    - `trigger`: Sự kiện kích hoạt (Event).
    - `guard`: Điều kiện để chuyển trạng thái được phép xảy ra (Guard).
    - `effect`: Hành động thực hiện khi chuyển trạng thái (Effect).
    - Ví dụ: `ThanhToan [SoDuHopLe] / GhiNhanThanhToan`. Tuyệt đối không đánh đồng Event và Guard.
- Hành vi nội tại của State (Entry / Do / Exit):
  - `entry / action`: Hành động thực hiện khi bước vào State.
  - `do / activity`: Hoạt động diễn ra trong suốt thời gian ở State.
  - `exit / action`: Hành động thực hiện khi rời khỏi State.
  - Tuyệt đối không biến 3 hành vi này thành các State riêng biệt.
- Phân biệt External Self-transition và Internal Transition:
  - External Self-transition: Đường nối rời khỏi State rồi vòng lại chính nó; kích hoạt chuỗi hành động `exit` và `entry`.
  - Internal Transition: Xử lý sự kiện bên trong State mà không rời khỏi State; không kích hoạt `exit` hay `entry`. Không được dùng thay thế nhau.
- Trục xương sống trạng thái và hành lang ngoại lệ:
  - Vòng đời chuẩn (Happy Path) xếp nối tiếp theo trục ngang hoặc dọc.
  - Các đường chuyển trạng thái hủy, từ chối hoặc quay lại được định tuyến đi vòng qua hành lang biên thông thoáng.

## 6. Biểu Đồ Thành Phần Và Triển Khai (Component & Deployment Diagram)

### Biểu đồ thành phần (Component Diagram)

- Bố cục phân tầng kiến trúc (Architectural Layering - Heuristic tham khảo):
  - Phân tầng thông dụng từ trên xuống dưới: Tầng Trình diễn (Presentation Layer), Tầng Dịch vụ Nghiệp vụ (Business/Service Layer), và Tầng Dữ liệu/Tích hợp (Data/Integration Layer).
  - Tên Component: BẮT BUỘC viết PascalCase kèm hậu tố vai trò (ví dụ: `ThanhPhanQuanLyDonHang`, `ThanhToanService`, `KhoModule`).
  - Mỗi thành phần được mô hình hóa bằng khối Component chuẩn UML kèm biểu tượng hai thẻ nhỏ ở góc trái (nền trắng viền đen).
- Giao diện cung cấp và yêu cầu (Provided & Required Interfaces):
  - Sử dụng ký hiệu chuẩn UML: Giao diện cung cấp hình tròn (Lollipop / Ball) và giao diện yêu cầu hình bán nguyệt (Socket) tiếp giáp nhau, hoặc các cổng Port rõ ràng trên cạnh của Component.
  - Tuyệt đối không nhầm lẫn sang mô hình C4 Component.

### Biểu đồ triển khai (Deployment Diagram)

- Bố cục các nút phần cứng (Hardware / Execution Environment Nodes):
  - Mô hình hóa bằng các khối lập phương 3D (Cube Node, nền trắng viền đen) đại diện cho môi trường vật lý hoặc máy chủ ảo, viết PascalCase (`MayChuUngDung`, `MayChuCoSoDuLieu`).
  - Bên trong mỗi Node chứa các Artifact đại diện cho tệp nhị phân triển khai thực tế.
- Đường liên kết truyền thông (Communication Paths):
  - Là các đường thẳng nối giữa các Node, ghi chú giao thức mạng tương ứng theo tài liệu bài toán.
  - Ràng buộc trung thực về công nghệ: Chỉ ghi các giao thức, định dạng tệp hoặc phiên bản công nghệ cụ thể khi tài liệu nguồn hoặc người dùng đã xác nhận (ví dụ bài toán nêu rõ sử dụng HTTPS hoặc TCP/IP). Tuyệt đối không tự ý thêm thắt các phiên bản công nghệ chi tiết khi không có dữ kiện bằng chứng từ tài liệu.

## 7. Thiết Kế Giao Diện Phác Thảo Thấp (Wireframe)

- Khung màn hình chuẩn (Screen Frames):
  - Tên màn hình: BẮT BUỘC viết PascalCase (ví dụ: `ManHinhDangNhap`, `ManHinhQuanLyDonHang`).
  - Tên thành phần điều khiển: PascalCase (ví dụ: `NutTaoDonHang`, `BangDanhSach`).
  - Màn hình Desktop: Kích thước tham khảo 960x540 px hoặc 1024x768 px.
  - Màn hình Mobile: Kích thước tham khảo 375x667 px hoặc 340x540 px.
- Cấu trúc cây phân cấp cha - con (Container-Child Hierarchy):
  - Khung màn hình đóng vai trò là một container cha, các nút bấm, ô nhập liệu, thanh điều hướng bên trong là các cell con có `parent` trỏ đến ID của khung màn hình đó để dễ dàng di chuyển và quản lý theo module.
- 5 trạng thái giao diện cần xem xét (Five UI States):
  - Trạng thái trống (Empty State): Khi hệ thống chưa có dữ liệu.
  - Trạng thái đang tải (Loading State): Hiệu ứng chờ nạp tài nguyên.
  - Trạng thái lỗi (Error State): Thông báo sự cố hoặc mất kết nối.
  - Trạng thái thành công (Success State): Thông báo hoàn tất tác vụ.
  - Trạng thái xác thực (Validation State): Cảnh báo nhập sai định dạng tại các trường biểu mẫu.
  - Lưu ý: 5 trạng thái này là danh sách cần xem xét thiết kế khi chức năng yêu cầu, không phải điều kiện bắt buộc áp đặt cho mọi màn hình đơn giản.

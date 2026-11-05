---
name: system-analysis-uml
description: Skill chuyên sâu điều phối thiết kế và kiểm soát tính nhất quán của 7 biểu đồ UML chuẩn OMG cho đồ án PTTKHTTT. Lựa chọn biểu đồ phù hợp theo tính chất từng chức năng, quản lý mã nguồn PlantUML làm định dạng chính và Mermaid làm dự phòng, kiểm soát quan hệ liên biểu đồ (Use Case, Class, Sequence, Activity, State, Component, Deployment). Kích hoạt khi cần lập mô hình kiến trúc hoặc kiểm tra tính nhất quán UML.
---

# Kỹ Năng Điều Phối Thiết Kế & Nhất Quán 7 Biểu Đồ UML (`system-analysis-uml`)

Kỹ năng này thuộc **Nhóm Tier 2**, chịu trách nhiệm điều phối việc xây dựng và kiểm soát tính nhất quán liên biểu đồ cho **7 loại biểu đồ UML chuẩn OMG 2.5** phục vụ các tệp từ `03` đến `09` trong hồ sơ `PTTKHTTT/`. Kỹ năng định hướng việc lựa chọn biểu đồ đúng theo tính chất chức năng, chuẩn hóa định dạng PlantUML (chính) và Mermaid (dự phòng), đồng thời chuyển giao các tác vụ vẽ chi tiết cho các skill Tier 3 tương ứng.

---

## 1. Vai Trò & Ranh Giới Trách Nhiệm

* **Trách nhiệm chính:**
  * Điều phối cấu trúc và tính liên kết giữa 7 biểu đồ UML chuẩn OMG 2.5.
  * Quyết định tiêu chí lựa chọn biểu đồ cho từng chức năng (không ép vẽ đủ cả 7 biểu đồ cho chức năng đơn giản).
  * Xây dựng mô hình ngữ nghĩa chuẩn xác cho cả 7 loại biểu đồ UML.
  * Kiểm soát ma trận đối chiếu nhất quán liên biểu đồ (Cross-Diagram Consistency).
  * Chuẩn hóa cấu trúc thư mục lưu trữ mã nguồn mô hình tại `PTTKHTTT/models/`.
  * Chuyển giao mô hình hoàn chỉnh cho kỹ năng kết xuất `draw-diagram` để sinh mã Draw.io XML tại `PTTKHTTT/xml/` và xuất ảnh tại `PTTKHTTT/diagrams/`.
* **Ranh giới (Điều kỹ năng này KHÔNG làm):**
  * Không trực tiếp tính toán tọa độ phẳng hay định tuyến XML Draw.io (thuộc về `draw-diagram`).
  * Không thiết kế mô hình dữ liệu ERD và chuẩn hóa CSDL (thuộc về `system-analysis-data`).
  * Không thiết kế phác thảo Wireframe màn hình UI (thuộc về `system-analysis-ui`).

---

## 2. Đầu Vào & Đầu Ra

* **Đầu vào:**
  * Tệp đặc tả yêu cầu và kịch bản Use Case: `PTTKHTTT/02-yeu-cau-va-use-case.md`.
  * Danh mục Actor, Use Case `UC-xx`, quy tắc nghiệp vụ `BR-xx` và các luồng sự kiện chính/phụ/ngoại lệ.
* **Đầu ra:**
  * Các tệp tài liệu biểu đồ UML từ `03` đến `09` trong `PTTKHTTT/`:
    * `03-so-do-use-case.md`
    * `04-bieu-do-lop.md`
    * `05-bieu-do-tuan-tu.md`
    * `06-bieu-do-hoat-dong.md`
    * `07-bieu-do-trang-thai.md`
    * `08-bieu-do-thanh-phan.md`
    * `09-bieu-do-trien-khai.md`
  * Mã nguồn PlantUML (`.puml`) hoặc Mermaid (`.mmd`) lưu tại `PTTKHTTT/models/`.
  * Kết xuất Draw.io XML (`PTTKHTTT/xml/`) và hình ảnh (`PTTKHTTT/diagrams/`) thông qua `draw-diagram`.

---

## 3. Tiêu Chí Lựa Chọn Biểu Đồ Theo Bản Chất Chức Năng

Không áp đặt mọi chức năng phải vẽ đầy đủ cả 7 biểu đồ UML. Agent phân tích tính chất chức năng để áp dụng đúng:

- **Use Case Diagram (`03`):**
  - Mục đích: Hệ thống cung cấp những giá trị nghiệp vụ nào cho Actor nào ngoài ranh giới?
  - Bắt buộc vẽ: Toàn bộ các chức năng và phân hệ của hệ thống (không được phép `N/A`).
- **Class Diagram (`04`):**
  - Mục đích: Cấu trúc dữ liệu tĩnh, các thực thể và quan hệ nghiệp vụ là gì?
  - Bắt buộc vẽ: Toàn bộ miền nghiệp vụ cốt lõi (Domain Model).
  - Cho phép `N/A`: Chỉ các chức năng không lưu trữ dữ liệu (ví dụ: chỉ ping kiểm tra mạng).
- **Sequence Diagram (`05`):**
  - Mục đích: Các đối tượng phối hợp trao đổi thông điệp ra sao theo thời gian?
  - Bắt buộc vẽ: Các Use Case trọng tâm, các luồng giao dịch phức tạp (Thanh toán, Đặt hàng).
  - Cho phép `N/A`: Các thao tác CRUD đơn giản chỉ đọc dữ liệu từ một bảng tĩnh.
- **Activity Diagram (`06`):**
  - Mục đích: Quy trình nghiệp vụ phối hợp hoặc luồng thuật toán rẽ nhánh ra sao?
  - Bắt buộc vẽ: Luồng công việc liên quan nhiều bên tham gia (Swimlanes), luồng song song (Fork/Join).
  - Cho phép `N/A`: Các chức năng tuyến tính không rẽ nhánh hoặc chỉ có 1-2 bước thực thi.
- **State Machine (`07`):**
  - Mục đích: Thực thể dữ liệu trải qua những trạng thái nào trong vòng đời?
  - Bắt buộc vẽ: Các thực thể có vòng đời thay đổi phức tạp (`DonHang`, `VeMayBay`, `HopDong`).
  - Cho phép `N/A`: Các thực thể dữ liệu tĩnh, không đổi trạng thái (`DanhMucSanPham`, `TinhThanh`).
- **Component (`08`):**
  - Mục đích: Hệ thống phân rã thành các module logic nào và cung cấp giao diện gì?
  - Bắt buộc vẽ: Cấp tổng thể toàn bộ hệ thống đồ án (Toàn cục).
  - Cho phép `N/A`: Cấp từng chức năng nhỏ đơn lẻ.
- **Deployment (`09`):**
  - Mục đích: Phần mềm được đóng gói và cài đặt trên hạ tầng phần cứng/mạng nào?
  - Bắt buộc vẽ: Cấp tổng thể toàn bộ hệ thống đồ án (Toàn cục).
  - Cho phép `N/A`: Cấp từng chức năng nhỏ đơn lẻ.

---

## 4. Chuẩn Mực Ký Pháp UML & Ngữ Nghĩa Học Thuật (UML 2.5 vs C4 Model)

Mọi mô hình UML trong hệ thống phải tuân thủ nghiêm ngặt các quy tắc ký pháp, ngữ nghĩa, kiểu đường nối và hướng mũi tên được chuẩn hóa dưới đây:

### 4.1. Biểu đồ Use Case (Use Case Diagram)
- **Thành phần:**
  - Actor: Hình người que (stick figure), bắt buộc nằm bên ngoài System Boundary. Tên là danh từ/cụm danh từ chỉ vai trò (PascalCase).
  - System Boundary: Hình chữ nhật bao quanh phạm vi hệ thống/phân hệ, chứa các Use Case bên trong.
  - Use Case: Hình elip (ellipse). Tên theo cấu trúc `Động từ mạnh + Danh từ/Đối tượng` (PascalCase), thể hiện mục tiêu nghiệp vụ trọn vẹn. Không tách thao tác vụn vặt không có giá trị nghiệp vụ thành Use Case riêng.
- **Quan hệ và Hướng mũi tên:**
  - Association: Nét liền, KHÔNG CÓ ĐẦU MŨI TÊN (undirected), thể hiện quan hệ tham gia giữa Actor và Use Case. Tuyệt đối không tự ý thêm đầu mũi tên vào Association giữa Actor và Use Case.
  - Generalization: Nét liền, đầu mũi tên tam giác rỗng ứng viên (`endArrow=classic;endFill=0;endSize=10`, Visual verification pending theo Draw.io Style Reference), hướng từ phần tử chuyên biệt (con) đến phần tử tổng quát (cha). Ví dụ: `QuanLy` kế thừa `NhanVien` thì tam giác rỗng hướng về `NhanVien`.
  - `«include»`: Nét đứt, đầu mũi tên mở (`dashed=1;endArrow=open`), hướng bắt buộc từ Use Case cơ sở đến Use Case được bao gồm (`DatHang -> XacThuc`). Thể hiện hành vi được bao gồm như một phần bắt buộc của Use Case cơ sở. Không máy móc coi Include phải luôn chạy trước toàn bộ Use Case cơ sở.
  - `«extend»`: Nét đứt, đầu mũi tên mở (`dashed=1;endArrow=open`), hướng bắt buộc từ Use Case mở rộng đến Use Case cơ sở (`ThanhToanBangVi -> ThanhToan`). Thể hiện hành vi mở rộng có điều kiện.
  - Tuyệt đối không được đảo ngược hướng mũi tên của `include` và `extend`.
  - **Kiểm soát quan hệ xác thực (`DangNhap`):** Không tự động include `DangNhap` vào tất cả Use Case. Nếu Use Case yêu cầu người dùng đã xác thực, có thể mô tả trạng thái xác thực trong mục Tiền điều kiện (Precondition). Nếu hệ thống hỗ trợ khách vãng lai chưa đăng nhập, đăng nhập tùy chọn hoặc các luồng xác thực khác, phải mô hình hóa theo đúng nghiệp vụ thực tế; không giả định mọi Actor đều đã đăng nhập. Chỉ include `DangNhap` khi việc đăng nhập là bước nghiệp vụ nội tại bắt buộc diễn ra ngay trong luồng của Use Case đó.
- **Hai cách thể hiện Use Case chi tiết:**
  - Individual Use Cases: Mỗi mục tiêu nghiệp vụ độc lập là một elip riêng biệt.
  - Grouped Functional Overview: Một elip chức năng tổng quát đi kèm khối UML Note liệt kê các chức năng con. Các dòng trong Note không tự động trở thành Use Case độc lập.
  - Hỗ trợ cả hai cách, lựa chọn theo mức độ chi tiết người dùng yêu cầu, không áp đặt máy móc.
- **Đặc tả Use Case:** Nếu người dùng yêu cầu đặc tả (không tự tạo nếu chỉ yêu cầu vẽ), lập bảng 2 cột với đúng 6 trường theo thứ tự chuẩn: 1. Tên Usecase, 2. Tác nhân, 3. Tiền điều kiện, 4. Mục đích, 5. Dòng sự kiện chính, 6. Dòng sự kiện phụ.

### 4.2. Biểu đồ Hoạt động (Activity Diagram)
- **Ký hiệu chuẩn:**
  - Initial Node: Chấm tròn đen đặc (`startState`), biểu diễn điểm bắt đầu quy trình.
  - Action: Hình chữ nhật bo góc tròn, thể hiện một công việc/hành động xử lý.
  - Activity Final: Chấm đen có vòng tròn bao ngoài (`endState`), kết thúc toàn bộ Activity.
  - Flow Final: Vòng tròn có dấu X bên trong (hai đường chéo cắt nhau bên trong hình elip), kết thúc một luồng xử lý riêng biệt mà không dừng toàn bộ Activity (không dùng cổng OR `shape=mxgraph.flowchart.or` và không dùng ký tự Unicode mặc định; phân biệt triệt để với Destruction Occurrence trong Sequence Diagram).
  - Decision: Hình thoi, 1 luồng vào, nhiều luồng ra có điều kiện bảo vệ `[Guard]` (ví dụ: `[HopLe]`, `[KhongHopLe]`, `[else]`). Không dùng Decision cho xử lý song song.
  - Merge: Hình thoi, nhiều luồng vào, 1 luồng ra để hợp nhất các nhánh rẽ thay thế.
  - Fork: Thanh đậm (Synchronization Bar), 1 luồng vào, từ 2 luồng ra trở lên để phân tách các luồng chạy song song.
  - Join: Thanh đậm, từ 2 luồng vào trở lên, 1 luồng ra để đồng bộ các luồng song song; Join chờ tất cả các luồng cần thiết hoàn thành trước khi đi tiếp.
  - Swimlane: Phân vùng thể hiện người/bộ phận/thành phần chịu trách nhiệm. Mỗi Action thuộc một lane. Connector có thể đi qua ranh giới giữa các lane. Lane không phải Actor, State hay Action.
- **Mũi tên Control Flow:** Nét liền, ĐẦU MŨI TÊN MỞ (`endArrow=open;endFill=0`), hướng từ hoạt động nguồn đến hoạt động đích. Connector phải gắn chính xác vào node hoặc thanh đồng bộ, không để kết thúc lơ lửng.
- **Quy tắc phân biệt Decision vs Fork:** Chỉ dùng thanh Fork/Join khi các hoạt động thực sự có thể diễn ra đồng thời về mặt nghiệp vụ. Tuyệt đối không dùng thanh Fork/Join chỉ để tạo bố cục đẹp.

### 4.3. Biểu đồ Máy trạng thái (State Machine Diagram)
- **Ký hiệu chuẩn:**
  - Initial Pseudostate: Chấm tròn đen đặc.
  - State: Hình chữ nhật bo góc, tên trạng thái viết PascalCase (tính từ/danh từ kết quả: `ChoXacNhan`, `DangXuLy`, `HoanTat`).
  - Final State: Vòng tròn kép (chấm đen có vòng tròn bao ngoài). Thể hiện kết thúc State Machine hoặc Region, không tự động đồng nghĩa với việc đối tượng bị xóa khỏi database hoặc bị hủy.
  - Transition: Nét liền, đầu mũi tên mở (`endArrow=open;endFill=0`), hướng đến State đích.
  - Self-transition: Đường nối rời khỏi State và quay lại chính State đó.
- **Cú pháp Transition chuẩn:** `trigger [guard] / effect`
  - `trigger`: Sự kiện kích hoạt.
  - `guard`: Điều kiện để Transition được phép xảy ra (đặt trong ngoặc vuông `[...]`).
  - `effect`: Hành động/hiệu ứng tức thời khi Transition thực hiện.
  - Phân biệt rõ ràng giữa Event (sự kiện) và Guard (điều kiện), không đánh đồng hai khái niệm này.
- **Hành vi nội tại của State:**
  - `entry / action`: Hành động thực hiện ngay khi bước vào State.
  - `do / activity`: Hoạt động diễn ra liên tục trong thời gian đối tượng ở State.
  - `exit / action`: Hành động thực hiện ngay trước khi rời khỏi State.
  - Tuyệt đối không biến `entry`, `do`, `exit` thành các State độc lập.
- **Phân biệt Self-transition và Internal Transition:**
  - External Self-transition: Rời khỏi State rồi quay lại chính nó; kích hoạt chuỗi hành động `exit` và `entry`.
  - Internal Transition: Xử lý sự kiện ngay bên trong State mà không rời khỏi State; không kích hoạt `exit` hay `entry`. Tuyệt đối không sử dụng thay thế nhau.

### 4.4. Biểu đồ Trình tự (Sequence Diagram)
- **Cấu trúc thành phần:**
  - Participant: Xếp ngang ở mép trên cùng, định danh PascalCase.
  - Lifeline: Đường thẳng đứng nét đứt (`dashed=1`), biểu diễn sự tồn tại của Participant trong tương tác.
  - Activation (Execution Specification): Hình chữ nhật hẹp nằm trên Lifeline, biểu diễn khoảng thời gian đối tượng thực thi xử lý. Không dùng Lifeline thay cho Activation.
  - Trục thời gian đọc nghiêm ngặt từ trên xuống dưới.
- **Quy chuẩn Message Sort và Kiểu Mũi Tên (Bắt buộc chính xác 100%):**
  - Synchronous Call (Gọi đồng bộ): Nét liền, ĐẦU MŨI TÊN TAM GIÁC TÔ ĐEN (`endArrow=classic;endFill=1;endSize=8`, Standard filled triangle theo tài liệu Draw.io chính thức, Visual verification pending), bên gửi dừng chờ bên nhận hoàn thành xử lý. Khuyến nghị ưu tiên dùng cho các luồng Use Case tuần tự.
  - Asynchronous Message (Thông điệp bất đồng bộ): Nét liền, ĐẦU MŨI TÊN MỞ (`endArrow=open;endFill=0`), bên gửi tiếp tục công việc mà không chờ.
  - Reply / Return (Kết quả trả về): Nét đứt, ĐẦU MŨI TÊN MỞ (`dashed=1;dashPattern=4 4;endArrow=open;endFill=0`), trả kết quả hoặc quyền điều khiển về bên gọi (UML 2.5.1 cho phép đầu mở hoặc tam giác tô kín; repository chọn đầu mở để thống nhất với bài giảng).
  - Ràng buộc: Tuyệt đối không đảo ngược hướng mũi tên; không nhầm tam giác tô đen với đầu mở; không nhầm nét liền với nét đứt.
- **Quy chuẩn các tương tác hình học đặc thù trong Sequence:**
  - Self-message (Tự gọi nội tại — Không phải một Message Sort có kiểu đầu mũi tên riêng): Điểm gửi và nhận cùng thuộc một Lifeline/Activation. Self-call đồng bộ dùng kiểu đầu mũi tên đồng bộ (`endArrow=classic;endFill=1;`, Visual verification pending); Self-message bất đồng bộ dùng kiểu đầu mũi tên bất đồng bộ (`endArrow=open;endFill=0`). Không mặc định mọi Self-message có cùng một kiểu arrowhead. Đường nối gập góc vuông loopback về Lifeline.
  - Create Message (Tạo đối tượng mới — Chuẩn UML 2.5.1 Section 17.4 & Draw.io Sequence doc): Nét đứt, đầu mũi tên mở (`dashed=1;dashPattern=4 4;endArrow=open;endFill=0`), hướng trực tiếp đến hộp Participant mới tạo; Lifeline của đối tượng mới bắt đầu tại ĐÚNG CAO ĐỘ (tọa độ Y) nhận Create Message (TUYỆT ĐỐI KHÔNG kéo dài Lifeline ngược lên đỉnh biểu đồ, không vẽ đối tượng như đã tồn tại từ trước). Không coi Create Message là lựa chọn nét liền solid giữa đồng bộ/bất đồng bộ.
  - Destroy Message & Destruction Occurrence (Hủy đối tượng): Hướng đến đối tượng bị hủy; Lifeline kết thúc tại Destruction Occurrence (ký hiệu X, `shape=umlDestroy;whiteSpace=wrap;html=1;`, bảo toàn nét mặc định strokeWidth=1 của Draw.io) đặt chính xác ở cuối Lifeline; connector Destroy trỏ trực tiếp tới vị trí điểm hủy này. Tuyệt đối không dùng `endArrow=cross` thay thế toàn bộ Destruction Occurrence; Lifeline KHÔNG ĐƯỢC PHÉP tiếp tục chạy xuống dưới điểm hủy.
- **Khung phân mảnh tương tác (Combined Fragments):**
  - `alt`: Nhiều nhánh thay thế loại trừ nhau (if-else/switch), mỗi nhánh bắt buộc có Guard riêng.
  - `opt`: Một nhánh tùy chọn duy nhất (if without else), không dùng làm switch nhiều lựa chọn.
  - `loop`: Vòng lặp tương tác, kèm điều kiện hoặc giới hạn lặp. Các ký hiệu rút gọn trong bài giảng cũ như `*[1..10]Message` hoặc `*[C]Message` bắt buộc phải được chuyển đổi thành Combined Fragment `loop` khi dựng mô hình UML 2 chuẩn.
  - `ref`: Tham chiếu đến một Sequence Diagram khác (Interaction Use), không phải là connector tùy ý.
- **Kỹ thuật phân tích BCE (Boundary - Control - Entity):**
  - Đối tượng biên (`«boundary»`), điều khiển (`«control»`), thực thể (`«entity»`).
  - Thể hiện bằng stereotype hoặc icon tương ứng. Không bắt buộc mọi Sequence Diagram phải có đủ cả 3 loại, và BCE không phải là một loại Message.
- **Thuật ngữ chuẩn hóa & Hướng dẫn công cụ:**
  - Collaboration Diagram là tên gọi cũ trong UML 1.x; UML 2 gọi là Communication Diagram.
  - Thuật ngữ "Active Diagram" trong các tài liệu bài giảng cũ được chuẩn hóa là "Activity Diagram".
  - Hướng dẫn phần mềm StarUML (như mẹo chọn `asyncSignal`) là giải pháp tình thế của công cụ, không phải quy tắc UML và không được mang sang Draw.io.

### 4.5. Định dạng mô hình hóa: PlantUML ưu tiên, OMG UML vs C4 Model
1. **PlantUML là định dạng ưu tiên chính:** Mọi biểu đồ UML bắt buộc có mã nguồn PlantUML hợp lệ (`@startuml` ... `@enduml`). Cung cấp Mermaid làm dự phòng khi chỉ có Markdown thuần (không dùng cú pháp thử nghiệm `usecase-beta`; dùng `flowchart LR` thay thế trực quan có ghi chú).
2. **Phân biệt rạch ròi OMG UML và C4 Model:**
   - Component Diagram: Bắt buộc chuẩn OMG với Provided Interface (Lollipop `-0`) và Required Interface (Socket `-(`). Tuyệt đối không vẽ khối C4 Container/Component.
   - Deployment Diagram: Bắt buộc chuẩn OMG với Node 3D Cube (`node`), Execution Environment (`executionEnvironment`), và Artifact (`artifact`). Tuyệt đối không nhầm lẫn với C4 Deployment.

---

## 5. Quy Tắc Đồng Bộ Nhất Quán Giữa Các Biểu Đồ (Consistency Rules)

Để tránh tình trạng "vẽ rời rạc từng biểu đồ", agent bắt buộc kiểm tra 5 quy tắc nhất quán chéo:

1. **Nhất quán giữa Use Case và Sequence:**
   - Mỗi biểu đồ Sequence phải là sự hiện thực hóa (Realization) của đúng một kịch bản trong bảng đặc tả Use Case tại `02-yeu-cau-va-use-case.md`.
2. **Nhất quán giữa Sequence và Class Diagram (Có phân định phạm vi):**
   - *Phân biệt Lifelines:* Các Lifelines đại diện cho đối tượng nội bộ thuộc phạm vi mô hình hóa nghiệp vụ (Domain Entities, Controllers, Services nội bộ) phải tương ứng với các Class trong Class Diagram. Ngược lại, Actor (người dùng), giao diện người dùng (Boundary/UI), thành phần framework/middleware hoặc hệ thống bên thứ ba không thuộc phạm vi Class Diagram miền nghiệp vụ.
   - *Phân biệt Thông điệp:* Lời gọi nghiệp vụ nội bộ giữa các đối tượng thuộc phạm vi Class Diagram bắt buộc phải nhất quán tên phương thức (Operation) công khai trên lớp đích tương ứng trong Class Diagram (ví dụ: lời gọi nghiệp vụ `tinhTongTien()` đến `DonHang` thì lớp `DonHang` phải có operation `+ tinhTongTien()`). Các sự kiện kỹ thuật (click UI, nhận webhook HTTP thô) không ép buộc phải khớp với operation trong Class Diagram miền nghiệp vụ.
3. **Nhất quán giữa State Machine và Class Diagram:**
   - Thực thể được vẽ State Machine phải là một Class trong Class Diagram.
   - Class đó bắt buộc phải có một thuộc tính biểu diễn trạng thái (ví dụ: `- trangThai: TrangThaiDonHang`).
4. **Nhất quán giữa Activity và Sequence Diagram:**
   - Điểm rẽ nhánh điều kiện `Decision` trên Activity Diagram phải phản ánh tương ứng các khung `alt` hoặc `opt` trên Sequence Diagram.
5. **Định danh mô hình chuẩn hóa:**
   - Class Diagram: CHỈ Class Name viết PascalCase (`DonHang`, `KhachHang`). Toàn bộ Attribute Name (`maDonHang`, `tongTien`) và Method Name (`taoDonHang()`, `tinhTongTien()`) BẮT BUỘC viết camelCase.
   - Use Case: BẮT BUỘC PascalCase theo cấu trúc `Động từ mạnh + Danh từ/Đối tượng` (`TaoDonHang`, `HuyDonHang`).
   - Toàn bộ các biểu đồ còn lại: BẮT BUỘC PascalCase cho Actor, Entity ERD, Thuộc tính ERD (`MaDonHang`, `TongTien`), Trạng thái (`ChoXacNhan`), Component, Node Deployment, Màn hình Wireframe và Thông điệp Sequence (`TaoDonHang`, `KiemTraTonKho`). Không áp dụng camelCase của Class Member ra ngoài Class Diagram.

---

## 6. Chuyển Giao Cho Kỹ Năng Kết Xuất Biểu Đồ (`draw-diagram`)

Sau khi hoàn tất việc lập mô hình ngữ nghĩa cho 7 loại biểu đồ UML và lưu trữ tại `PTTKHTTT/models/`:

* Kích hoạt kỹ năng `/draw-diagram` để tiếp nhận mô hình nguồn (PlantUML / Mermaid / bảng phân tích kịch bản).
* `draw-diagram` sẽ tính toán kích thước theo nội dung, gán tọa độ, định tuyến trực giao không cắt xuyên node, tuần tự hóa sang tệp `.drawio.xml` trong `PTTKHTTT/xml/`.
* Tự động chạy kiểm định chất lượng hình học qua `validate_drawio_xml.ps1` và xuất ảnh SVG/PNG sang `PTTKHTTT/diagrams/`.

*Xem ma trận đối chiếu kiểm tra chi tiết tại:* [uml-consistency-matrix.md](./references/uml-consistency-matrix.md)


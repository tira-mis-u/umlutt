# Cẩm Nang Cú Pháp Và Phong Cách Draw.io XML (XML Style Guide)

Tài liệu này quy chuẩn cấu trúc tài liệu XML của Draw.io (mxGraph), các thuộc tính bắt buộc của thẻ phần tử và bộ mẫu chuỗi định kiểu (style strings) chuẩn mực theo **style mặc định của Draw.io (không thêm màu trang trí)** cho toàn bộ các đối tượng biểu đồ UML, ERD và Wireframe.

## 1. Cấu Trúc Khung Tài Liệu Draw.io XML Tiêu Chuẩn

Tệp Draw.io XML hợp lệ bắt buộc phải tuân thủ cây phân cấp thẻ theo đúng chuẩn diagrams.net:

- Thẻ gốc `<mxfile>`:
  - Khai báo các thuộc tính môi trường cơ sở: `host="app.diagrams.net"`, `version="24.0.0"`, `type="device"`.
- Thẻ biểu đồ `<diagram>`:
  - Chứa thuộc tính `id` (chuỗi định danh duy nhất) và thuộc tính `name` thể hiện tên biểu đồ (ví dụ: `name="SoDoUseCaseChiTiet"`).
- Thẻ mô hình đồ họa `<mxGraphModel>`:
  - Các thuộc tính hiển thị bắt buộc:
    - `dx="1200"` và `dy="800"`: Tọa độ gốc khung nhìn hiển thị.
    - `grid="1"`: Bật chế độ căn chỉnh theo lưới.
    - `gridSize="10"`: Đặt kích thước lưới chuẩn mặc định 10 px.
    - `guides="1"`, `tooltips="1"`, `connect="1"`, `arrows="1"`, `fold="1"`: Kích hoạt các tính năng tương tác của trình biên tập.
    - `page="1"`, `pageScale="1"`: Cấu hình kích thước trang chuẩn.
    - `pageWidth` và `pageHeight`: Kích thước trang vẽ thích ứng linh hoạt theo độ rộng và chiều cao của biểu đồ (ví dụ: `pageWidth="1169"`, `pageHeight="827"` cho khổ A4 ngang, hoặc mở rộng thích ứng khi biểu đồ có nhiều phân làn/cột).
    - `math="0"`, `shadow="0"`: Tắt các hiệu ứng toán học và bóng đổ không cần thiết để giữ dung lượng nhẹ và đồ họa rõ nét.
- Thẻ gốc chứa phần tử `<root>`:
  - Bắt buộc phải có hai thẻ ô cơ sở không thể thiếu:
    - Ô tầng gốc của toàn bộ sơ đồ: `<mxCell id="0" />`
    - Ô lớp mặc định chứa các đối tượng: `<mxCell id="1" parent="0" />`

Ví dụ cấu trúc khung bao bọc XML tiêu chuẩn:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="app.diagrams.net" version="24.0.0" type="device">
  <diagram id="Diagram_01" name="Use-Case-Overview">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <!-- Danh sách các đỉnh (vertices) và đường nối (edges) ở đây -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

## 2. Quy Chuẩn Thuộc Tính Thẻ mxCell

Mọi đối tượng hiển thị trên bản vẽ đều được biểu diễn thông qua thẻ `mxCell` kèm thẻ con `mxGeometry`:

- **Định danh duy nhất `id`:** Mọi thẻ `mxCell` bắt buộc phải có `id` duy nhất trong phạm vi toàn tệp XML (ví dụ: `id="boundary-01"`, `id="actor-khachhang"`, `id="uc-dathang"`, `id="edge-assoc-01"`).
- **Giá trị hiển thị `value`:** Chuỗi văn bản hiển thị trên đối tượng, hỗ trợ định dạng chuỗi đơn giản hoặc mã HTML nhẹ khi có `html=1;`. Với các ký tự đặc biệt, cần mã hóa XML chuẩn (`&lt;` cho `<`, `&gt;` cho `>`).
- **Kiểu đối tượng:**
  - Khối hình đỉnh: Khai báo thuộc tính `vertex="1"`.
  - Đường liên kết nối: Khai báo thuộc tính `edge="1"`.
- **Quan hệ cha con `parent`:**
  - Phần tử cấp cao nhất thuộc lớp mặc định: `parent="1"`.
  - Phần tử con nằm trong khung chứa (container-child): `parent="<id-khung-chứa>"`.
- **Điểm đầu và điểm cuối của đường nối:**
  - Mọi đường nối thể hiện quan hệ nghiệp vụ bắt buộc phải khai báo đầy đủ cả hai thuộc tính `source` và `target` trỏ đến `id` của hai đỉnh tương ứng.
- **Thẻ hình học `<mxGeometry>`:**
  - Đối với khối hình đỉnh (Vertex): Chứa các thuộc tính kích thước và vị trí tuyệt đối hoặc tương đối: `<mxGeometry x="120" y="80" width="160" height="70" as="geometry" />`.
  - Đối với đường nối (Edge): Chứa thuộc tính `<mxGeometry relative="1" as="geometry" />` kèm mảng các điểm bẻ góc trực giao `<Array as="points">...</Array>`.
  - Đối với nhãn văn bản gắn trên đường nối (Edge Label): Được biểu diễn bằng một thẻ `mxCell` con của edge với `connectable="0"`, có `parent` trỏ vào id của edge và geometry tương đối: `<mxGeometry x="0" y="-12" relative="1" as="geometry"><mxPoint as="offset" /></mxGeometry>`.

## 3. Thư Viện Style Strings Chuẩn Cho Khối Hình (Draw.io Default Style)

Các chuỗi định kiểu mxGraph dưới đây tuân thủ triệt để **Style Mặc Định của Draw.io** (`strokeColor=default`, `fillColor=default`, `strokeWidth=1`):
- Không hardcode các mã màu hex không cần thiết; không thêm màu pastel, gradient hay shadow.
- Chỉ khai báo tường minh các thuộc tính khi bản thân ký pháp UML yêu cầu (ví dụ: nút bắt đầu phải tô đen, khung chứa phải trong suốt).

### 3.1. Khối hình trong Use Case Diagram
- **Khung ranh giới hệ thống (System Boundary):**
  `shape=rect;rounded=0;whiteSpace=wrap;html=1;fillColor=none;verticalAlign=top;align=left;spacingLeft=15;spacingTop=10;fontStyle=1;fontSize=13;`
  - Thuộc tính `fillColor=none;` là bắt buộc để khung trong suốt, không che lấp các Use Case bên trong.
- **Tác nhân (Actor Stick Figure):**
  `shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;fontStyle=1;`
  - Đặt ngoài System Boundary; tên là danh từ/cụm danh từ chỉ vai trò viết PascalCase.
- **Hình elip Use Case:**
  `ellipse;whiteSpace=wrap;html=1;align=center;verticalAlign=middle;`
  - Tên Use Case BẮT BUỘC tuân thủ cấu trúc `Động từ mạnh + Danh từ/Đối tượng` viết PascalCase (`TaoDonHang`, `KiemTraTonKho`). Tuyệt đối không dùng camelCase cho Use Case.
- **Khối chú thích (UML Note):**
  `shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0;size=14;align=left;spacingLeft=8;spacingRight=8;fontSize=11;`

### 3.2. Khối hình trong Class Diagram
- **Khối lớp UML 3 ngăn (Class Compartment Frame):**
  `swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;html=1;`
  - Tiêu đề khung (Class Name): BẮT BUỘC danh từ/cụm danh từ số ít viết PascalCase (`DonHang`, `KhachHang`).
  - Ngăn thuộc tính (Attributes): BẮT BUỘC camelCase (`maDonHang`, `tongTien`).
  - Ngăn phương thức (Methods/Operations): BẮT BUỘC camelCase (`taoDonHang()`, `kiemTraTonKho()`).
  - Quy tắc cốt lõi: Trong Class Diagram, CHỈ Class Name viết PascalCase; toàn bộ Attribute và Method BẮT BUỘC viết camelCase.

### 3.3. Khối hình trong Activity Diagram
- **Nút bắt đầu quy trình (Activity Initial Node):**
  `ellipse;html=1;shape=startState;fillColor=#000000;strokeColor=#000000;`
  - Ký pháp UML bắt buộc chấm tròn đặc màu đen để biểu diễn điểm khởi đầu quy trình.
- **Nút hành động (Activity Action):**
  `rounded=1;whiteSpace=wrap;html=1;arcSize=30;align=center;verticalAlign=middle;`
- **Nút kết thúc toàn bộ quy trình (Activity Final Node):**
  `ellipse;html=1;shape=endState;fillColor=#000000;strokeColor=#000000;`
  - Chấm đen có vòng tròn bao quanh, kết thúc toàn bộ các luồng trong Activity.
- **Nút kết thúc luồng đơn lẻ (Flow Final Node):**
  - Ký pháp: Vòng tròn có dấu X bên trong, kết thúc một luồng thực thi đồng thời/song song đơn lẻ mà không làm dừng toàn bộ Activity hay các luồng song song khác (khác với Activity Final làm dừng toàn bộ quy trình). Tuyệt đối không dùng `shape=mxgraph.flowchart.or` (OR gate không phải ký pháp UML) và không dùng ký tự text `&#x2715;` làm mặc định để tránh lệch font hiển thị. Phân biệt triệt để với Destruction Occurrence trong Sequence Diagram.
  - Cấu trúc XML nhóm hình học bảo toàn Default Style (Composite Vertex Pattern):
    - Khối hình tròn cha (Parent Circle Container): `ellipse;whiteSpace=wrap;html=1;aspect=fixed;container=1;collapsible=0;` (`vertex="1"`, `connectable="1"`). Hình tròn kích thước $30 \times 30$ px; tâm cục bộ tại `(15, 15)`. Thuộc tính `collapsible=0` tắt biểu tượng thu gọn/mở rộng container vì Flow Final là ký hiệu UML nhỏ.
    - Đường chéo con 1 (Diagonal 1 Vertex): `shape=line;rotation=45;html=1;` (`vertex="1"`, `connectable="0"`, `parent="id-node-flow-final"`). Geometry cục bộ: `x=0, y=14, width=30, height=2` — tâm hình học tại `(15, 15)`, chiều rộng bằng đường kính 30 px. Sau khi xoay 45°, hai đầu mút đặt tại chu vi hình tròn.
    - Đường chéo con 2 (Diagonal 2 Vertex): `shape=line;rotation=-45;html=1;` (`vertex="1"`, `connectable="0"`, `parent="id-node-flow-final"`). Geometry cục bộ: `x=0, y=14, width=30, height=2` — đồng tâm, góc xoay -45°.
    - **Quy tắc hệ tọa độ:** Geometry của child vertex phải dùng **tọa độ cục bộ tương đối với container** (không phải tọa độ canvas tuyệt đối). `x=0, y=14` nghĩa là góc trên-trái của hình chữ nhật đường chéo đặt tại `(0, 14)` trong không gian của parent container.
    - Hai đường chéo là các shape vertex độc lập, không có connector semantics (không phải edge, không có source/target, có `connectable="0"`), triệt tiêu hoàn toàn việc dùng self-loop edge để giả lập đường chéo.
    - Mọi connector Control Flow từ bên ngoài chỉ gắn vào hình tròn cha `id-node-flow-final`, không gắn vào hai đường chéo con.
    - Bảo toàn Draw.io Default Style: Tuyệt đối không hardcode màu sắc (`strokeColor`, `fillColor`) hay độ dày nét (`strokeWidth`), để trình dựng áp dụng style mặc định.
- **Nút rẽ nhánh / Hợp nhất (Decision / Merge Diamond):**
  `rhombus;whiteSpace=wrap;html=1;`
  - Cùng dùng hình thoi nhưng phân biệt rõ: Decision có 1 luồng vào, nhiều luồng ra kèm `[Guard]`; Merge có nhiều luồng vào, 1 luồng ra để hợp nhất nhánh thay thế. Không dùng cho luồng song song.
- **Thanh phân tách / Đồng bộ luồng song song (Fork / Join Synchronization Bar):**
  - Thanh ngang: `rounded=0;whiteSpace=wrap;html=1;fillColor=#000000;strokeColor=#000000;` (ví dụ: `width="120" height="8"`)
  - Thanh dọc: `rounded=0;whiteSpace=wrap;html=1;fillColor=#000000;strokeColor=#000000;` (ví dụ: `width="8" height="120"`)
  - Ký pháp UML bắt buộc thanh đặc tô đen. Fork: 1 vào, >= 2 ra song song. Join: >= 2 vào, 1 ra đồng bộ.
- **Làn bơi phân vùng trách nhiệm (Swimlane):**
  - Làn dọc: `swimlane;horizontal=0;whiteSpace=wrap;html=1;fillColor=none;collapsible=0;`
  - Làn ngang: `swimlane;horizontal=1;whiteSpace=wrap;html=1;fillColor=none;collapsible=0;`
  - Thể hiện trách nhiệm của Actor/bộ phận. Không phải Actor, State hay Action.

### 3.4. Khối hình trong State Machine Diagram
- **Nút bắt đầu máy trạng thái (Initial Pseudostate):**
  `ellipse;html=1;shape=startState;fillColor=#000000;strokeColor=#000000;`
  - Chấm tròn đặc màu đen, trỏ đến trạng thái khởi tạo mặc định.
- **Khối trạng thái (State Machine State):**
  `rounded=1;whiteSpace=wrap;html=1;arcSize=20;align=center;verticalAlign=middle;`
  - Tên trạng thái viết PascalCase (`ChoXacNhan`, `DangXuLy`, `HoanTat`).
  - Hành vi nội tại ghi dạng văn bản bên trong: `entry / action`, `do / activity`, `exit / action`, không tách thành State riêng.
- **Nút kết thúc máy trạng thái (Final State):**
  `ellipse;html=1;shape=endState;fillColor=#000000;strokeColor=#000000;`
  - Kết thúc vòng đời của State Machine hoặc Region, không tự động đồng nghĩa với việc thực thể bị xóa khỏi CSDL.

### 3.5. Khối hình trong Sequence Diagram
- **Đường đời Sequence (Sequence Lifeline & Participant Header):**
  `shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;outlineConnect=0;fontStyle=1;`
  - Header chứa tên Participant viết PascalCase. Lifeline là đường thẳng đứng nét đứt (`dashed=1`).
- **Thanh kích hoạt (Activation / Execution Specification):**
  `rounded=0;whiteSpace=wrap;html=1;`
  - Khối chữ nhật hẹp (chiều rộng 12-16 px) đặt trên Lifeline, thể hiện khoảng thời gian thực thi xử lý. Không dùng Lifeline thay thế Activation.
- **Điểm hủy đối tượng (Destruction Occurrence Specification):**
  `shape=umlDestroy;whiteSpace=wrap;html=1;`
  - Ký hiệu dấu X đặt chính xác tại đáy của Lifeline đối tượng bị hủy (bảo toàn độ dày nét mặc định `strokeWidth=1` của Draw.io). Message hủy trỏ vào điểm này; Lifeline chấm dứt hoàn toàn tại đây và KHÔNG ĐƯỢC kéo dài xuống phía dưới.
- **Khung phân mảnh tương tác (Combined Fragment: alt, opt, loop, ref):**
  `shape=rect;rounded=0;whiteSpace=wrap;html=1;fillColor=none;verticalAlign=top;align=left;spacingLeft=10;spacingTop=5;fontStyle=1;`
- **Biểu tượng phân tích BCE (Boundary, Control, Entity):**
  - Boundary: `shape=umlBoundary;whiteSpace=wrap;html=1;` hoặc stereotype `«boundary»`
  - Control: `shape=umlControl;whiteSpace=wrap;html=1;` hoặc stereotype `«control»`
  - Entity: `shape=umlEntity;whiteSpace=wrap;html=1;` hoặc stereotype `«entity»`

### 3.6. Khối hình trong Deployment Diagram
- **Nút phần cứng triển khai (Deployment 3D Node):**
  `shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;darkOpacity=0;size=12;align=center;verticalAlign=top;spacingTop=16;`
  - Tên Node: Viết PascalCase (`MayChuUngDung`, `MayChuCoSoDuLieu`).

---

## 4. Thư Viện Style Strings Cho Đường Nối (Connectors - Default Clean)

Tất cả các connector sử dụng định tuyến trực giao và cấu hình đầu mũi tên chính xác theo chuẩn UML OMG, không hardcode màu sắc tùy tiện:

### 4.1. Đường nối trong Use Case Diagram
- **Quan hệ kết hợp Actor và Use Case (Association):**
  - Ký pháp: Đường thẳng liền nét, KHÔNG CÓ ĐẦU MŨI TÊN ở cả hai đầu (`endArrow=none;endFill=0;`). Không định hướng.
  - Tuyệt đối không tự ý thêm đầu mũi tên vào Association giữa Actor và Use Case.
  - Chuỗi định kiểu: `edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=none;endFill=0;`
- **Quan hệ bao hàm (Include):**
  - Ký pháp: Đường nét đứt kèm mũi tên nhọn hở (`dashed=1;endArrow=open;endSize=8;`), stereotype hiển thị nhãn `<<include>>`.
  - Hướng bắt buộc: Xuất phát từ Use Case cơ sở (`source`) trỏ sang Use Case được đưa vào (`target`).
  - Chuỗi định kiểu: `edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;dashPattern=5 5;endArrow=open;endSize=8;`
- **Quan hệ mở rộng (Extend):**
  - Ký pháp: Đường nét đứt kèm mũi tên nhọn hở (`dashed=1;endArrow=open;endSize=8;`), stereotype hiển thị nhãn `<<extend>>`.
  - Hướng bắt buộc: Xuất phát từ Use Case mở rộng (`source`) trỏ ngược về Use Case cơ sở (`target`).
  - Chuỗi định kiểu: `edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;dashPattern=5 5;endArrow=open;endSize=8;`
- **Quan hệ kế thừa Actor / Use Case (Generalization):**
  - Ký pháp: Đường thẳng liền nét kèm biểu tượng TAM GIÁC RỖNG ở đầu đích. Theo Draw.io Style Reference chính thức, `classic` là standard filled triangle và khi kết hợp `endFill=0` tạo ra tam giác khép kín rỗng (closed hollow triangle), trong khi `block` là filled block.
  - Hướng bắt buộc: Xuất phát từ phần tử con/chuyên biệt (`source`) trỏ về phần tử cha/tổng quát (`target`).
  - Chuỗi định kiểu ứng viên: `edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=classic;endFill=0;endSize=10;` (Visual verification pending). Không giả định `block;endFill=0` là đúng nếu chưa kiểm chứng thị giác.
- **Đường nối chú thích (Note Connector):**
  - Ký pháp: Đường nét đứt thanh mảnh, không có mũi tên (`dashed=1;endArrow=none;`).
  - Chuỗi định kiểu: `edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;dashPattern=3 3;endArrow=none;`

### 4.2. Đường nối trong Activity Diagram
- **Luồng điều khiển (Activity Control Flow):**
  - Ký pháp: Đường nét liền, ĐẦU MŨI TÊN MỞ (`endArrow=open;endFill=0;endSize=8;`).
  - Hướng: Từ hoạt động nguồn đến hoạt động đích. Phải gắn vào đúng node hoặc thanh Fork/Join, không lơ lửng.
  - Chuỗi định kiểu: `edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=open;endFill=0;endSize=8;`

### 4.3. Đường nối trong State Machine Diagram
- **Chuyển trạng thái (State Transition):**
  - Ký pháp: Đường nét liền, ĐẦU MŨI TÊN MỞ (`endArrow=open;endFill=0;endSize=8;`).
  - Nhãn chuẩn: `trigger [guard] / effect` đặt song song trên đoạn thẳng thông thoáng.
  - Chuỗi định kiểu: `edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=open;endFill=0;endSize=8;`
- **Tự chuyển trạng thái (External Self-Transition):**
  - Ký pháp: Đường vòng rời khỏi State và quay lại chính State đó với đầu mũi tên mở.
  - Chuỗi định kiểu: `edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=open;endFill=0;endSize=8;`

### 4.4. Mô Hình Thông Điệp Sequence Diagram (Message Sort & Hình Học Tương Tác)

Phân định rạch ròi giữa **Message Sort** (loại thông điệp ngữ nghĩa) và **Hình học tương tác đặc biệt** (Self-message, Create, Destroy):

#### A. Ba loại Message Sort cơ bản và kiểu đầu mũi tên
- **1. Synchronous Call (Gọi đồng bộ):**
  - Ký pháp: Đường NÉT LIỀN, ĐẦU MŨI TÊN TAM GIÁC TÔ ĐEN. Theo Draw.io Style Reference chính thức, `classic` là standard filled triangle (`endArrow=classic;endFill=1;endSize=8;`), ưu tiên sử dụng thay vì giả định `block` là tam giác UML (Visual verification pending).
  - Ngữ nghĩa: Bên gửi dừng chờ bên nhận hoàn tất xử lý.
  - Nhãn thông điệp: BẮT BUỘC viết PascalCase (ví dụ: `TaoDonHang`, `KiemTraTonKho`).
  - Chuỗi định kiểu: `html=1;verticalAlign=bottom;endArrow=classic;endFill=1;endSize=8;`
- **2. Asynchronous Message (Thông điệp bất đồng bộ):**
  - Ký pháp: Đường NÉT LIỀN, ĐẦU MŨI TÊN MỞ (`endArrow=open;endFill=0;endSize=8;`).
  - Ngữ nghĩa: Bên gửi gửi thông điệp và tiếp tục xử lý ngay, không chờ bên nhận.
  - Chuỗi định kiểu: `html=1;verticalAlign=bottom;endArrow=open;endFill=0;endSize=8;`
- **3. Reply / Return (Kết quả trả về):**
  - Ký pháp: Đường NÉT ĐỨT, ĐẦU MŨI TÊN MỞ (`dashed=1;dashPattern=4 4;endArrow=open;endFill=0;endSize=8;`).
  - Ghi chú chuẩn hóa ký pháp: Chuẩn UML 2.5.1 cho phép thông điệp trả về dùng đầu mũi tên mở hoặc tam giác tô kín; repository này chọn đầu mũi tên mở để thống nhất với quy ước trực quan của tài liệu bài giảng, không tuyên bố chỉ có một dạng đầu mũi tên hợp lệ trong lý thuyết UML.
  - Ngữ nghĩa: Trả dữ liệu/kết quả từ bên nhận về cho bên gọi.
  - Chuỗi định kiểu: `html=1;verticalAlign=bottom;dashed=1;dashPattern=4 4;endArrow=open;endFill=0;endSize=8;`

#### B. Các tương tác hình học đặc thù
- **Self-message (Tự gọi nội tại — Không phải một Message Sort có kiểu đầu mũi tên riêng):**
  - Là Message có điểm gửi và nhận cùng thuộc một Participant/Lifeline.
  - *Quy tắc đầu mũi tên:* Self-call đồng bộ BẮT BUỘC dùng kiểu đầu mũi tên đồng bộ (`endArrow=classic;endFill=1;endSize=8;`, Visual verification pending); Self-message bất đồng bộ BẮT BUỘC dùng kiểu đầu mũi tên bất đồng bộ (`endArrow=open;endFill=0;endSize=8;`). Không mặc định mọi Self-message có cùng một kiểu arrowhead.
  - *Hình học đường nối:* Vòng ra ngoài (sang phải) rồi quay về đúng Lifeline/Activation:
    `html=1;verticalAlign=bottom;edgeStyle=orthogonalEdgeStyle;rounded=0;` kết hợp với arrowhead tương ứng của Message Sort.
- **Create Message (Tạo đối tượng mới — Chuẩn UML 2.5.1 Section 17.4 & Draw.io Sequence doc):**
  - Là Message Sort `messageSort=createMessage` gửi đến một đối tượng mới được tạo, trỏ thẳng vào HỘP Participant mới tạo.
  - *Ký pháp connector:* Đường NÉT ĐỨT (`dashed=1;dashPattern=4 4;`), ĐẦU MŨI TÊN MỞ (`endArrow=open;endFill=0;endSize=8;`). Chuỗi định kiểu: `html=1;verticalAlign=bottom;dashed=1;dashPattern=4 4;endArrow=open;endFill=0;endSize=8;`
  - *Quy tắc bản chất:* Không coi Create Message là lựa chọn giữa solid nét liền đồng bộ/bất đồng bộ. Chuẩn UML 2.5.1 quy định Create Message là đường nét đứt với đầu mũi tên mở.
  - *Hình học đường đời:* Lifeline của Participant mới BẮT ĐẦU TẠI ĐÚNG CAO ĐỘ (tọa độ Y) nhận Create Message. TUYỆT ĐỐI KHÔNG kéo dài Lifeline ngược lên trên đỉnh biểu đồ (không được vẽ đối tượng mới như thể đã tồn tại từ đầu tương tác).
- **Destroy Message & Destruction Occurrence (Hủy đối tượng):**
  - Là Message gửi đến đối tượng bị hủy nhằm kết thúc sự tồn tại của đối tượng đó.
  - *Ký pháp chuẩn:* Lifeline kết thúc tại ký hiệu X (`shape=umlDestroy;whiteSpace=wrap;html=1;`, bảo toàn nét mặc định strokeWidth=1 của Draw.io) đặt chính xác ở cuối Lifeline. Message hủy kết nối trực tiếp tới vị trí điểm hủy này (`target="id-umlDestroy"`).
  - *Ràng buộc bắt buộc:* Tuyệt đối không dùng `endArrow=cross` làm giải pháp duy nhất thay thế toàn bộ Destruction Occurrence; Lifeline KHÔNG ĐƯỢC PHÉP tiếp tục chạy xuống dưới điểm hủy.

### 4.5. Đường nối trong Class Diagram & ERD
- **Quan hệ phụ thuộc (Dependency):**
  - Ký pháp: Đường nét đứt kèm mũi tên nhọn hở (`dashed=1;endArrow=open;endSize=8;`), source phụ thuộc vào target.
  - Chuỗi định kiểu: `edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;dashPattern=4 4;endArrow=open;endSize=8;`
- **Quan hệ kết tập (Aggregation):**
  - Ký pháp: Đầu hình thoi rỗng (`endArrow=diamond;endFill=0;endSize=12;`), trỏ về phía lớp tập hợp.
  - Chuỗi định kiểu: `edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=diamond;endFill=0;endSize=12;`
- **Quan hệ hợp thành (Composition):**
  - Ký pháp: Đầu hình thoi đặc (`endArrow=diamond;endFill=1;endSize=12;`), trỏ về phía lớp sở hữu.
  - Chuỗi định kiểu: `edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=diamond;endFill=1;endSize=12;`

---

## 5. Quy Chuẩn Trình Bày: Bảo Toàn Draw.io Default Style

Mọi biểu đồ phân tích và thiết kế hệ thống trong đồ án và bài tập lớn tuân thủ nguyên tắc bảo toàn triệt để style mặc định của Draw.io:

- **Bảo toàn thuộc tính mặc định của trình dựng:**
  - Không hardcode các màu hex thừa thãi (`strokeColor=#000000;fillColor=#ffffff;fontColor=#000000;`) trên mọi cell khi Draw.io đã tự động áp dụng `strokeColor=default`, `fillColor=default` và `strokeWidth=1`.
  - Không áp đặt cố định độ dày nét `strokeWidth=1.2` nếu ký pháp UML không yêu cầu nét đậm đặc biệt (như thanh Fork/Join hay dấu X Destruction Occurrence).
- **Tuyệt đối không thêm màu sắc trang trí:**
  - Không tự đặt palette màu sắc; không tự tô màu phân loại Actor, Component, State, nhóm chức năng hay tầng kiến trúc.
  - Không thêm màu pastel, gradient, bóng đổ (`shadow="0"`) hoặc các hiệu ứng trang trí làm rối bản vẽ.
- **Chỉ khai báo thuộc tính riêng khi ký pháp UML bắt buộc:**
  - Phần tử bắt buộc tô đen (Initial Node, Initial Pseudostate, Final State inner, thanh Fork/Join): Khai báo `fillColor=#000000;strokeColor=#000000;`.
  - Khung chứa trong suốt (System Boundary, Swimlane, Combined Fragment): Khai báo `fillColor=none;`.
  - Đường nét đứt (Include, Extend, Dependency, Reply Message, Create Message): Khai báo `dashed=1;`.
  - Đầu mũi tên tam giác tô đen (Synchronous Call): Khai báo `endArrow=classic;endFill=1;` (Standard filled triangle theo tài liệu Draw.io chính thức; Visual verification pending).
  - Đầu mũi tên tam giác rỗng (Generalization): Khai báo ứng viên `endArrow=classic;endFill=0;` (Candidate closed hollow triangle theo tài liệu Draw.io chính thức; Visual verification pending).
  - Đầu mũi tên nhọn hở (Asynchronous, Reply, Create Message, Include, Extend, Transition, Control Flow): Khai báo `endArrow=open;endFill=0;`.
  - Dấu X hủy đối tượng Sequence: Sử dụng shape chuẩn `shape=umlDestroy;whiteSpace=wrap;html=1;` (bảo toàn độ dày nét mặc định strokeWidth=1).
- **Tạo phân cấp thị giác bằng hình học và ký pháp:**
  - Sử dụng hình dạng hình học chuẩn mực OMG (elip cho Use Case, hình chữ nhật cho Boundary, hình thoi cho Decision, hình chữ nhật bo góc cho Action/State, swimlane cho phân lớp/làn).
  - Sử dụng bố cục không gian, lề phân cách và hành lang định tuyến trực giao thông thoáng.

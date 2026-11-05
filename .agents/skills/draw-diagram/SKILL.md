---
name: draw-diagram
description: Kỹ năng chuyên sâu điều phối và kết xuất biểu đồ trực tiếp bằng Draw.io XML. Tự động phát hiện diagram hiện có (Draw.io, PlantUML, Mermaid, tài liệu, hình ảnh) để chuyển đổi sang Draw.io XML, hoặc điều phối các skill chuyên môn (system-analysis-uml, data, ui) tạo mô hình trước khi kết xuất toàn bộ sang Draw.io XML. Quản lý hệ thống hình học, định tuyến trực giao, kiểm định va chạm và lưu trữ artifact tại PTTKHTTT.
---

# Kỹ Năng Điều Phối & Vẽ Biểu Đồ Trực Tiếp Bằng Draw.io XML (`/draw-diagram`)

Kỹ năng này chịu trách nhiệm điều phối quy trình phát hiện, tiếp nhận mô hình nghiệp vụ và kết xuất sang mã nguồn Draw.io XML chuẩn cho toàn bộ 9 loại biểu đồ trong vòng đời Phân tích và Thiết kế Hệ thống Thông tin (PTTKHTTT). Nguồn chân lý duy nhất có thể chỉnh sửa của mọi biểu đồ là mã XML tương thích hoàn toàn với diagrams.net; tệp hình ảnh SVG hoặc PNG là sản phẩm kết xuất trực quan từ tệp XML tương ứng.

---

## 1. Nguyên Tắc Cốt Lõi & Phân Định Ranh Giới Trách Nhiệm

### 1.1. Tách biệt tuyệt đối giữa Producer Skills và Draw.io Renderer
Để đảm bảo tính chuyên môn hóa và không nhân đôi logic nghiệp vụ:

- **Các Producer Skills (`system-analysis-*`):**
  - Chịu trách nhiệm phân tích nghiệp vụ, xác định phạm vi, nhận diện thực thể/tác nhân.
  - Thiết lập quan hệ ngữ nghĩa, điều kiện kích hoạt, luồng sự kiện và cấu trúc dữ liệu.
  - Tạo ra các mô hình nguồn có cấu trúc (bản đặc tả, PlantUML, Mermaid, lược đồ dữ liệu, khung giao diện).
- **Kỹ năng kết xuất `draw-diagram`:**
  - Chịu trách nhiệm tiếp nhận mô hình biểu đồ đã có từ các Producer Skills hoặc từ mã nguồn hiện có của project.
  - Lập kế hoạch bố cục hình học (Geometry System), tính toán kích thước theo nội dung (Sizing before Positioning).
  - Gán tọa độ phẳng, phân bổ cổng kết nối (Port Assignment), định tuyến trực giao tránh vật cản (Orthogonal Routing).
  - Tuần tự hóa mã Draw.io XML chuẩn, kiểm định va chạm tự động và xuất ảnh tương ứng.
  - **Tuyệt đối không tự thay thế việc phân tích nghiệp vụ chuyên sâu của các skill producer.** Nếu project chưa có mô hình và chưa có diagram, `draw-diagram` phải điều phối các producer skills thực hiện trước.

### 1.2. Phạm vi 9 loại biểu đồ được hỗ trợ đầy đủ
`draw-diagram` có năng lực bố cục và kết xuất Draw.io XML cho toàn bộ 9 loại biểu đồ trong phân tích thiết kế:
1. **Use Case Diagram** (Tổng quát phân hệ & Chi tiết nhóm chức năng)
2. **Class Diagram** (Biểu đồ lớp miền nghiệp vụ chuẩn OMG)
3. **Sequence Diagram** (Biểu đồ tuần tự luồng tương tác theo thời gian)
4. **Activity Diagram** (Biểu đồ hoạt động luồng xử lý và rẽ nhánh)
5. **State Machine Diagram** (Biểu đồ máy trạng thái vòng đời thực thể)
6. **Component Diagram** (Biểu đồ thành phần kiến trúc chuẩn OMG)
7. **Deployment Diagram** (Biểu đồ triển khai môi trường phần cứng và nút xử lý)
8. **Entity-Relationship Diagram (ERD)** (Mô hình dữ liệu quan niệm, logic và vật lý)
9. **Wireframe** (Khung giao diện phác thảo thấp Low-fidelity)

### 1.3. Quy tắc trình bày style mặc định của Draw.io
- **Ưu tiên style mặc định:** Sử dụng giao diện và style mặc định, tự nhiên của Draw.io (nền trắng/trong suốt, viền đen sắc nét, nhãn chữ rõ ràng).
- **Không tự ý thêm màu sắc trang trí:**
  - Không tự chọn palette màu; không tự tô màu phân loại Actor, Component, State, nhóm chức năng hoặc tầng kiến trúc.
  - Không thêm màu pastel, gradient, bóng đổ (`shadow="0"`) hoặc các hiệu ứng trang trí làm rối bản vẽ.
  - Không tự đặt các mã màu hex như một quy tắc thiết kế bắt buộc; không ép mọi cell phải khai báo tường minh `#FFFFFF` hoặc `#000000` khi style mặc định của Draw.io đã đáp ứng trực quan rõ ràng.
- **Phân cấp thị giác bằng ký pháp và hình học:** Sử dụng hình dạng chuẩn UML OMG, độ dày nét (`strokeWidth=1.5` cho khối chính, `1.0` cho khối phụ), kiểu nét (liền nét vs đứt nét `dashed=1`) và khoảng cách hành lang thông thoáng.

### 1.4. Quy chuẩn định danh thống nhất
Tuân thủ nghiêm ngặt quy định tại `.agents/rules/system-naming.md`:
- **Class Diagram:**
  - Class Name: BẮT BUỘC danh từ/cụm danh từ số ít viết PascalCase (`DonHang`, `KhachHang`, `ChiTietDonHang`).
  - Attribute Name: BẮT BUỘC camelCase (`maDonHang`, `tongTien`, `ngayDat`).
  - Method Name: BẮT BUỘC camelCase, bắt đầu bằng động từ kèm `()` (`taoDonHang()`, `tinhTongTien()`).
  - Quy tắc cốt lõi: Trong Class Diagram, CHỈ Class Name viết PascalCase; toàn bộ Attribute và Method đều BẮT BUỘC viết camelCase.
- **Use Case Diagram:**
  - Tên Use Case BẮT BUỘC theo cấu trúc `Động từ mạnh + Danh từ/Đối tượng` viết PascalCase (`TaoDonHang`, `HuyDonHang`, `XacNhanDonHang`, `KiemTraTonKho`). Tuyệt đối không dùng camelCase cho Use Case.
- **Tất cả các loại biểu đồ còn lại:**
  - BẮT BUỘC sử dụng PascalCase cho toàn bộ định danh phần tử: Actor, Entity trên ERD, Attribute trên ERD (`MaDonHang`, `TongTien`), State (`ChoXacNhan`, `DangXuLy`), Component, Node Deployment, Màn hình Wireframe, Thông điệp Sequence (`TaoDonHang`, `KiemTraTonKho`).
  - Tuyệt đối không áp dụng quy tắc camelCase của Class Member ra ngoài Class Diagram.
  - Không ép câu văn giải thích, ghi chú tự nhiên hoặc nội dung Note thành PascalCase.

### 1.5. Quy tắc thư mục đầu ra `PTTKHTTT`
- Dự án thông thường **KHÔNG tự động có** thư mục `PTTKHTTT`.
- Chat, hỏi đáp, giải thích lý thuyết hoặc review tài liệu tuyệt đối **không tự động tạo thư mục**.
- Thư mục chỉ được tạo khi người dùng gọi `/draw-diagram` và thực sự yêu cầu tạo hoặc xuất biểu đồ.
- Cấu trúc mặc định:
  ```text
  PTTKHTTT/
  ├── models/
  │   ├── <diagram-name>.puml (hoặc .mmd)
  │   └── ...
  ├── xml/
  │   ├── <diagram-name>.drawio.xml
  │   └── ...
  └── diagrams/
      ├── <diagram-name>.svg
      └── ...
  ```
- Nếu người dùng chỉ định đường dẫn đầu ra khác, bắt buộc sử dụng chính xác đường dẫn đó.
- Nếu thư mục đã tồn tại, bảo toàn nguyên vẹn các file hiện có; không ghi đè khi chưa xác định rõ người dùng muốn cập nhật hay tạo bản mới.
- Mỗi biểu đồ có một tệp XML riêng; tệp ảnh kết xuất (ưu tiên SVG, PNG khi cần) có cùng basename với tệp XML tương ứng.
- Tuyệt đối không lưu các file test fixture hoặc file thử nghiệm chung với artifact thật của dự án.

### 1.6. Chiến lược chuyển đổi: Mermaid vs Direct Draw.io XML
Để đảm bảo chất lượng đồ họa và tính chính xác ngữ nghĩa:
- **Direct Draw.io XML (Bắt buộc cho các mô hình giàu ngữ nghĩa UML 2.5 & ERD):**
  - Áp dụng cho: Use Case, Class Diagram, Sequence Diagram, Activity Diagram, State Machine, Component, Deployment, ERD, và Wireframe.
  - Lý do: Các định dạng trung gian như Mermaid bị giới hạn về ký pháp (thiếu Stick figure Actor chuẩn, thiếu Activation bar độc lập trên Lifeline, thiếu composite Flow Final với hai đường chéo `shape=line;rotation=±45`, thiếu 3-compartment Class table, thiếu quan hệ chân quạ trực giao kèm port phân bổ). Do đó, `draw-diagram` trực tiếp xây dựng cây `mxGraphModel` XML từ mô hình phân tích để bảo đảm 100% ngữ nghĩa học thuật và vị trí hình học chuẩn xác.
- **Mermaid Conversion (Dành cho luồng đơn giản):**
  - Áp dụng cho: Screen Navigation Flow (`flowchart LR`), hoặc sơ đồ luồng công việc cấp cao không đòi hỏi ký hiệu chuyên sâu UML 2.5.
- **Quy tắc chống đệ quy (Anti-Recursion):**
  - Khi `draw-diagram` được kích hoạt:
    1. Nếu mô hình đã tồn tại trong `PTTKHTTT/models/` hoặc trong tài liệu Markdown, `draw-diagram` THỰC THI NGAY quy trình Geometry -> XML Serialization -> Validation -> Image Export. TUYỆT ĐỐI KHÔNG gọi ngược lại `system-analysis` để tránh vòng lặp vô hạn.
    2. Chỉ khi hoàn toàn chưa có mô hình và chưa có tài liệu, `draw-diagram` mới yêu cầu Producer skills tạo mô hình nguồn vào `PTTKHTTT/models/` trước, sau đó tiếp tục bước kết xuất và kết thúc quy trình.

---

## 2. Quy Trình Điều Phối Biểu Đồ (Diagram Discovery & Orchestration)

Khi `/draw-diagram` được kích hoạt, quy trình bắt buộc phải trải qua bước khảo sát phát hiện nguồn diagram trước khi thực hiện kết xuất hình học.

```
                  [Người dùng gọi /draw-diagram]
                                │
               ┌────────────────┴────────────────┐
               ▼                                 ▼
   [Branch A: ĐÃ CÓ DIAGRAM]         [Branch B: CHƯA CÓ DIAGRAM]
   Khảo sát phát hiện nguồn:         Không tự suy diễn nghiệp vụ!
   - Draw.io XML (.drawio, .xml)     Điều phối Producer Skills:
   - PlantUML (.puml, .plantuml)     - system-analysis (Phạm vi)
   - Mermaid (.mmd, Markdown blocks) - system-analysis-uml (7 biểu đồ UML)
   - Sơ đồ trong tài liệu/ảnh        - system-analysis-data (ERD)
               │                     - system-analysis-ui (Wireframe)
               │                                 │
               │ (Chuyển đổi giữ ngữ nghĩa)      │ (Hoàn tất toàn bộ mô hình)
               └────────────────┬────────────────┘
                                ▼
              [Thu thập toàn bộ mô hình nguồn]
                                │
                                ▼
          [Giai đoạn Geometry System: Tính tọa độ & Bố cục]
                                │
                                ▼
         [Giai đoạn Định tuyến trực giao & Phân bổ cổng]
                                │
                                ▼
          [Giai đoạn Serialization: Tạo Draw.io XML chuẩn]
                                │
                                ▼
          [Giai đoạn Validation & Export ảnh -> PTTKHTTT/]
```

### Bước 1: Khảo sát phát hiện nguồn biểu đồ (Diagram Discovery)

Quét toàn bộ workspace để phân loại hiện trạng:
1. **Kiểm tra các tệp mô hình nguồn có cấu trúc (Structured Sources):**
   - Tệp Draw.io XML hiện có: `.drawio`, `.drawio.xml`, `.xml`.
   - Tệp PlantUML: `.puml`, `.plantuml` hoặc các khối `@startuml ... @enduml`.
   - Tệp Mermaid: `.mmd` hoặc các khối code block ````mermaid ... ```` trong tài liệu Markdown.
   - Các sơ đồ được lưu trong tài liệu dự án (`PTTKHTTT/` hoặc các thư mục tài liệu khác).
2. **Kiểm tra hình ảnh biểu đồ (Rendered Images):**
   - Tệp ảnh biểu đồ hiện có (`.png`, `.svg`, `.jpg`) nhúng trong tài liệu khi có thể quan sát được nội dung trực quan.
   - Phân biệt rõ: *Diagram source* (mô hình nguồn có cấu trúc) với *Diagram image* (hình ảnh đã kết xuất).

---

### Bước 2: Rẽ nhánh xử lý theo hiện trạng

#### Nhánh A (Branch A) — Đã tồn tại diagram trong dự án
Nếu phát hiện một hoặc nhiều biểu đồ trong workspace:
- **Xác định phạm vi:** Lập danh mục toàn bộ các biểu đồ hiện có thuộc phạm vi dự án và yêu cầu của task.
- **Chuyển đổi bảo toàn ngữ nghĩa:** Chuyển đổi hoặc tái tạo chúng thành Draw.io XML. Giữ nguyên 100% ngữ nghĩa mô hình, tên phần tử, vai trò tác nhân và các mối quan hệ nghiệp vụ.
- **Nguyên tắc đóng băng phạm vi:**
  - Không tự ý thêm biểu đồ loại khác chỉ vì kỹ năng có hỗ trợ loại đó.
  - Không gọi các skill producer để tạo các biểu đồ còn thiếu khi người dùng không yêu cầu.
  - Nếu người dùng chỉ định một biểu đồ cụ thể, chỉ xử lý duy nhất biểu đồ đó.
- **Xử lý theo định dạng nguồn:**
  - *Nếu nguồn đã là Draw.io XML:* Kiểm tra tính hợp lệ hình học, hiệu chỉnh căn lề hoặc cập nhật nội dung cần thiết, không tạo bản sao chép trùng lặp.
  - *Nếu nguồn là PlantUML hoặc Mermaid:* Ánh xạ toàn bộ cấu trúc khối và liên kết sang các thẻ `mxCell` của Draw.io tương đương về ngữ nghĩa.
  - *Nếu nguồn là hình ảnh không có mã nguồn:* Tái tạo thành Draw.io XML có thể biên tập dựa trên các phần tử và quan hệ quan sát được rõ ràng. Tuyệt đối không tự bịa các phần bị mờ hoặc không đọc được; ghi chú rõ những điểm chưa thể xác nhận.

#### Nhánh B (Branch B) — Chưa tồn tại bất kỳ diagram nào
Nếu kiểm tra thấy dự án chưa có bất kỳ mô hình hoặc biểu đồ nào:
- **Nghiêm cấm tự suy diễn:** `draw-diagram` tuyệt đối không được tự vẽ và tự bịa ra toàn bộ nghiệp vụ, bảng dữ liệu hay luồng xử lý.
- **Điều phối các Producer Skills chuyên môn tạo mô hình trước:**
  - Kích hoạt `system-analysis` để xác định phạm vi hệ thống và ngữ cảnh tổng thể.
  - Kích hoạt `system-analysis-uml` để phân tích và lập các mô hình UML phù hợp trong phạm vi đồ án:
    - Use Case Diagram (Tổng quát phân hệ & Chi tiết nhóm chức năng).
    - Class Diagram (Mô hình lớp miền nghiệp vụ).
    - Sequence Diagram (Kịch bản tương tác động của các chức năng chính).
    - Activity Diagram (Luồng hoạt động nghiệp vụ phức tạp).
    - State Machine Diagram (Vòng đời của các thực thể có chuyển đổi trạng thái).
    - Component Diagram (Kiến trúc phân rã thành phần hệ thống).
    - Deployment Diagram (Kiến trúc triển khai hạ tầng phần cứng/môi trường chạy).
  - Kích hoạt `system-analysis-data` để thiết kế mô hình dữ liệu ERD (quan niệm, logic, vật lý chuẩn hóa 3NF).
  - Kích hoạt `system-analysis-ui` để thiết kế luồng điều hướng màn hình và Wireframe giao diện.
- **Bảo đảm độ phủ phân tích thiết kế:**
  - Phải tạo TOÀN BỘ các biểu đồ thuộc phạm vi phân tích thiết kế của đồ án theo kết luận của các skill chuyên môn.
  - Không tự ý bỏ sót biểu đồ cần thiết chỉ vì cấu trúc biểu đồ đó phức tạp.
  - Không áp đặt cứng nhắc các biểu đồ không phù hợp với bài toán (ví dụ: chức năng không có vòng đời trạng thái thì không ép vẽ State Machine, nhưng phải có câu giải thích lý do nghiệp vụ).
  - Nếu dự án thiếu dữ kiện để xây dựng biểu đồ chính xác, không tự sáng tác dữ liệu; ghi rõ ràng các điểm thiếu dữ kiện và các phần chưa thể kết luận.
- **Chuyển giao sang Renderer:** Chỉ sau khi các skill chuyên môn hoàn tất việc xác định mô hình biểu đồ nguồn, `draw-diagram` mới tiếp nhận toàn bộ mô hình đó để kết xuất sang Draw.io XML. Không tạo XML trước khi có mô hình tương ứng.

---

### Bước 3: Lập kế hoạch bố cục không gian (Layout Planning)

- Tham khảo hướng dẫn chi tiết tại `./references/layout-grammars.md`.
- **Ước lượng kích thước theo nội dung (Sizing before Positioning):**
  - Tính toán độ rộng và độ cao của node dựa trên độ dài nhãn văn bản, cỡ chữ, số dòng và đặc thù dấu thanh tiếng Việt (tham khảo công thức tại `./references/geometry-system.md`).
  - Khoảng đệm nội bộ (padding) tối thiểu 10 px mỗi cạnh.
  - Đối với elip Use Case, chiều rộng lớn hơn chiều dài chuỗi chữ dài nhất theo tỷ lệ hình dạng khuyến nghị từ 2.2:1 đến 2.5:1.
  - Đối với Actor, bounding box bao trùm cả hình người stick figure lẫn nhãn tên Actor bên dưới.
- **Cấu trúc phân vùng và Ký pháp chuẩn theo từng loại biểu đồ:**
  - *Use Case Diagram:*
    - Actor hình người que (`shape=umlActor`) đặt ngoài System Boundary; System Boundary hình chữ nhật (`shape=rect`); Use Case hình elip (`ellipse`).
    - Association: Nét liền, KHÔNG ĐẦU MŨI TÊN (`endArrow=none;endFill=0;`), không định hướng.
    - Generalization: Nét liền, tam giác rỗng ứng viên (`endArrow=classic;endFill=0;endSize=10;`, Visual verification pending), con trỏ về cha.
    - `«include»`: Nét đứt, đầu mở (`dashed=1;endArrow=open;`), Use Case cơ sở trỏ sang Use Case được bao gồm.
    - `«extend»`: Nét đứt, đầu mở (`dashed=1;endArrow=open;`), Use Case mở rộng trỏ về Use Case cơ sở.
    - Hỗ trợ 2 phong cách chi tiết: Individual Use Cases (mỗi mục tiêu 1 elip) vs Grouped Functional Overview (1 elip + khối UML Note).
  - *Class Diagram:* Cấu trúc hộp 3 ngăn (Tên lớp PascalCase; Thuộc tính camelCase; Phương thức camelCase). Bố cục kế thừa từ trên xuống, liên kết theo hành lang ngang/dọc.
  - *Sequence Diagram:*
    - Participant xếp ngang ở mép trên; Lifeline thẳng đứng nét đứt (`dashed=1`); Activation hình chữ nhật hẹp trên Lifeline.
    - Message Sort cơ bản: Synchronous Call (nét liền, tam giác tô đen `endArrow=classic;endFill=1;endSize=8;`, Visual verification pending), Asynchronous Message (nét liền, đầu mở `endArrow=open;endFill=0;`), Reply/Return (nét đứt, đầu mở `dashed=1;dashPattern=4 4;endArrow=open;endFill=0;`).
    - Self-message: Điểm gửi và nhận cùng thuộc một Lifeline/Activation, đầu mũi tên phản ánh đúng tính chất đồng bộ (`endArrow=classic;endFill=1;`, Visual verification pending) hoặc bất đồng bộ (`endArrow=open;endFill=0;`) của lời gọi, định tuyến loopback vuông góc.
    - Create Message (UML 2.5.1 Section 17.4): Nét đứt, đầu mở (`dashed=1;dashPattern=4 4;endArrow=open;endFill=0;`), trỏ vào Participant mới, Lifeline của đối tượng mới bắt đầu tại chính thời điểm tạo (không kéo dài lên trên đỉnh).
    - Destroy Message & Destruction Occurrence: Trỏ vào ký hiệu X (`shape=umlDestroy;whiteSpace=wrap;html=1;`, bảo toàn nét mặc định strokeWidth=1) ở cuối Lifeline; Lifeline kết thúc hoàn toàn tại điểm hủy và không kéo dài xuống dưới.
    - Combined Fragments: `alt`, `opt`, `loop`, `ref`. Chuyển đổi shorthand `*[1..10]` sang `loop`. Phân tích BCE (Boundary, Control, Entity) bằng stereotype, không phải loại message.
  - *Activity Diagram:*
    - Initial Node chấm tròn đen; Action chữ nhật bo góc; Activity Final vòng tròn kép; Flow Final vòng tròn dấu X bên trong (hai đường chéo cắt nhau, không dùng cổng OR và không dùng Unicode mặc định); Decision/Merge hình thoi; Fork/Join thanh đồng bộ đậm; Swimlane phân vùng trách nhiệm.
    - Control Flow: Nét liền, ĐẦU MŨI TÊN MỞ (`endArrow=open;endFill=0;`), gắn đúng node/thanh, không lơ lửng.
    - Phân biệt rõ Decision (1 vào nhiều ra có guard) vs Fork (1 vào nhiều ra song song thực sự).
  - *State Machine Diagram:*
    - Initial chấm tròn đen; State chữ nhật bo góc; Final State vòng tròn kép (kết thúc vùng, không tự hiểu là xóa DB).
    - Transition: Nét liền, ĐẦU MŨI TÊN MỞ (`endArrow=open;endFill=0;`), nhãn chuẩn `trigger [guard] / effect`.
    - Phân biệt Event vs Guard; Entry/Do/Exit là hành vi nội tại không biến thành State; phân biệt External Self-transition vs Internal Transition.
  - *Component & Deployment:* Khối Component chuẩn OMG (không nhầm với C4); Khối Node 3D Cube cho thiết bị vật lý/môi trường thực thi.
  - *ERD:* Thực thể PascalCase, Thuộc tính PascalCase; quan hệ chân quạ vuông góc.
  - *Wireframe:* Khung màn hình container PascalCase, các nút bấm và thành phần con lồng bên trong, xem xét 5 trạng thái giao diện khi chức năng yêu cầu.

---

### Bước 4: Phân bổ cổng kết nối & Định tuyến trực giao (Orthogonal Routing)

- Tham khảo giải thuật và hàm chi phí tại `./references/geometry-system.md`.
- **Cố định cổng vào/ra (Port Assignment):**
  - Gán tường minh `exitX`, `exitY`, `entryX`, `entryY` chuẩn hóa từ `0.0` đến `1.0` trên các cạnh node.
  - Khi một Actor hoặc node nối với nhiều đối tượng cùng một phía, phân bổ dọc theo tỷ lệ (`0.25`, `0.5`, `0.75`) để tránh hiện tượng nhiều đường nối chụm chung một điểm mút (Port Congestion).
- **3 Cấp độ xác minh điểm đầu cuối (Endpoint Attachment Levels):**
  - *Cấp độ 1 — Toàn vẹn tham chiếu (Reference Integrity):* Thuộc tính `source` và `target` bắt buộc tồn tại và trỏ đến `id` hợp lệ có thực trong XML.
  - *Cấp độ 2 — Cấu hình cổng kết nối (Port Configuration):* Các tham số cổng `exitX, exitY, entryX, entryY` được cấu hình hợp lệ trong dải `[0.0, 1.0]`.
  - *Cấp độ 3 — Bám dính hình học thực tế (Geometric Attachment):* Đầu mút connector tiếp xúc vật lý chính xác với đường biên của node sau khi engine đồ họa render. Nếu môi trường chưa có công cụ render hình ảnh (drawio CLI / headless Chromium), Cấp độ 3 bắt buộc phải được ghi rõ trạng thái `Visual verification pending` (chờ xác minh trực quan), tuyệt đối không tự ý tuyên bố đã xác minh hình học khi mới chỉ kiểm tra tĩnh thuộc tính XML.
- **Định tuyến trực giao qua hành lang an toàn:**
  - Áp dụng `edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#000000;`.
  - Khai báo tường minh các điểm bẻ góc trong `<Array as="points"><mxPoint x="..." y="..." /></Array>`.
  - Dẫn connector qua các hành lang an toàn trống, ưu tiên điều chỉnh vị trí để loại bỏ giao cắt thay vì mặc nhiên coi giao cắt 90 độ là hợp lệ.

---

### Bước 5: Tuần tự hóa Draw.io XML (XML Serialization)

- Tham khảo mẫu cấu trúc tại `./references/xml-style-guide.md`.
- Khởi tạo đầy đủ cây phân cấp XML chuẩn:
  - Thẻ gốc `<mxfile host="app.diagrams.net" version="24.0.0" type="device">`.
  - Thẻ `<diagram id="..." name="...">`.
  - Thẻ `<mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" math="0" shadow="0">`.
  - Thẻ `<root>` kèm hai ô cơ sở bắt buộc: `<mxCell id="0" />` và `<mxCell id="1" parent="0" />`.
- Đảm bảo mỗi ô `mxCell` có định danh `id` duy nhất trong toàn bộ tệp XML.
- Mọi đường nối nghiệp vụ bắt buộc có `source` và `target` trỏ đến `id` node có thực.
- Sử dụng style mặc định sạch sẽ của Draw.io, không tự ý thêm màu trang trí.

---

### Bước 6: Kiểm định chất lượng hình học & Lưu trữ kết quả

1. **Thực thi kiểm tra tự động qua script:**
   Chạy công cụ kiểm tra tĩnh hình học:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .agents/skills/draw-diagram/scripts/validate_drawio_xml.ps1 -FilePath <duong-dan-file-xml>
   ```
   Xác nhận đạt 10 tiêu chí kiểm tra:
   - Check 1: Không có va chạm cứng giữa các node độc lập (Node-Node Collision).
   - Check 2: Cấu trúc lồng nhau hợp lệ, không có phần tử con tràn ngoài khung chứa (Container-Child Containment & Out-of-Bounds).
   - Check 3: Nhãn văn bản vừa vặn trong biên hình học (Text Overflow).
   - Check 4: Không có đường nối cắt xuyên qua node không liên quan (Edge-Node Collision).
   - Check 5: Nhãn đường nối không đè lên node (Edge-Label Collision).
   - Check 6: Không có đoạn đường nối trùng lặp kéo dài (Edge-Edge Overlap).
   - Check 7: Ghi nhận và tối ưu hóa các điểm giao cắt (Edge Crossing).
   - Check 8: Điểm đầu cuối bám dính đạt Cấp độ 1 & Cấp độ 2 (Level 3 ghi nhận `Visual verification pending`).
   - Check 9: Cổng kết nối phân bổ cân bằng, không tắc nghẽn (Port Congestion).
   - Check 10: Tọa độ toàn dương và nằm trong giới hạn canvas (Canvas Bounds).

2. **Lưu trữ artifact đầu ra:**
   - Lưu tệp XML nguồn: `PTTKHTTT/xml/<diagram-name>.drawio.xml` (hoặc output path do người dùng chỉ định).
   - Kết xuất hình ảnh đồ họa tương ứng: `PTTKHTTT/diagrams/<diagram-name>.svg` (hoặc `.png`, cùng basename với XML).
   - Nếu môi trường thiếu công cụ dòng lệnh render ảnh, ghi nhận minh bạch trong báo cáo rằng Visual Render QA và Geometric Attachment Cấp độ 3 đang chờ xác minh trực quan (`Visual verification pending`).

3. **Hỗ trợ đặc tả Use Case (Khi có yêu cầu):**
   Nếu người dùng yêu cầu đặc tả Use Case (không tự ý tạo khi chỉ yêu cầu vẽ), hỗ trợ đúng cấu trúc chuẩn 6 trường:
   1. Tên Usecase (PascalCase).
   2. Tác nhân.
   3. Tiền điều kiện.
   4. Mục đích.
   5. Dòng sự kiện chính.
   6. Dòng sự kiện phụ.

---

## 3. Danh Mục Tài Liệu Tham Khảo Kỹ Thuật

Các tài liệu bổ trợ chuyên sâu được lưu trữ tại thư mục tham khảo nội bộ của skill:
- Kiến trúc hình học và giải thuật định tuyến: `./references/geometry-system.md`
- Quy tắc bố cục chi tiết cho từng loại biểu đồ: `./references/layout-grammars.md`
- Cấu trúc XML chuẩn và thư viện style mặc định của Draw.io: `./references/xml-style-guide.md`

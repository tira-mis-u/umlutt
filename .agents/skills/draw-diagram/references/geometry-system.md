# Kiến Trúc Geometry System Và Thuật Toán Định Tuyến Cho Draw.io XML

Tài liệu này đặc tả chi tiết hệ tọa độ, quy tắc tính toán hình học, thuật toán ước lượng kích thước và kỹ thuật định tuyến trực giao tránh vật cản áp dụng cho việc tạo biểu đồ Draw.io XML tự động.

## 1. Hệ Tọa Độ Và Đơn Vị Đo

Để đảm bảo biểu đồ hiển thị chính xác, ổn định trên mọi phiên bản Draw.io và các bộ công cụ kết xuất, hệ thống áp dụng các quy tắc tọa độ thống nhất sau:

- Mặt phẳng tọa độ 2D phẳng: Gốc tọa độ `(0, 0)` được đặt tại góc trên bên trái của trang vẽ (canvas). Trục hoành x tăng dần từ trái sang phải; trục tung y tăng dần từ trên xuống dưới.
- Đơn vị đo lường: Đơn vị tính toán mặc định là pixel (px) theo tiêu chuẩn mxGraph.
- Quy chuẩn lưới vẽ (Grid Alignment):
  - Lưới chuẩn 10 px (`gridSize="10"`) và lưới phụ 5 px được sử dụng làm cơ sở căn chỉnh mặc định và khuyến nghị.
  - Không bắt buộc mọi kích thước và tọa độ đều phải là bội số tuyệt đối của 10 px trong mọi tình huống. Khi căn giữa các khối hình học, căn chỉnh nhãn có kích thước ký tự lẻ hoặc khi phân bổ các cổng kết nối (ports) đối xứng, cho phép sử dụng tọa độ theo lưới phụ 5 px hoặc giá trị số nguyên thực tế.
  - Nghiêm cấm phát sinh các giá trị số thực dạng dấu phẩy động kéo dài (ví dụ: `245.3333333333` hoặc `120.0000000004`). Mọi giá trị số đều phải được làm tròn về số nguyên hoặc số thập phân tối đa một chữ số có nghĩa.
- Không gian tọa độ cục bộ (Local Coordinate System):
  - Khi một phần tử nằm bên trong một khung chứa (như group, container, system boundary, lane), tọa độ `x` và `y` của phần tử con được tính tương đối theo góc trên bên trái của khung chứa cha, không dùng tọa độ tuyệt đối của toàn canvas.
  - Tuyệt đối không để phát sinh tọa độ âm trong vùng nội dung làm việc. Nếu một phần tử có tọa độ âm do quá trình căn chỉnh, toàn bộ cụm biểu đồ cùng các điểm chuyển hướng (waypoints) phải được tịnh tiến đồng thời sang miền tọa độ dương với khoảng đệm an toàn.
- Kích thước trang vẽ thích ứng linh hoạt:
  - Không áp đặt kích thước cố định A4 ngang (`pageWidth="1169"`, `pageHeight="827"`) cho mọi biểu đồ một cách máy móc.
  - Kích thước canvas phải được điều chỉnh thích ứng linh hoạt theo độ rộng nội dung, số lượng phân làn (swimlanes) hoặc số lượng cột tương tác thực tế của từng biểu đồ, hoặc cấu hình chế độ mở rộng tự động.

## 2. Mô Hình Bounding Box Và Khoảng Cách An Toàn Khuyến Nghị

Mỗi thực thể trực quan trên biểu đồ đều được định nghĩa qua một hộp bao hình học (Bounding Box):

- Khung bao chuẩn: Với một đỉnh hoặc khối hình `v`, hộp bao chuẩn được xác định bằng công thức `B(v) = [x, y, x + width, y + height]`.
- Khung bao mở rộng an toàn: Để phục vụ thuật toán kiểm tra va chạm và cách ly không gian, hộp bao mở rộng được tính theo công thức `B_margin(v) = [x - m, y - m, x + width + m, y + height + m]`, trong đó `m` là khoảng cách lề an toàn (clearance margin).
- Các khoảng cách an toàn mặc định có thể điều chỉnh (Adjustable Defaults):
  - Lề ngoài cùng của canvas (Canvas Outer Margin): Khuyến nghị mặc định tối thiểu 40 px tính từ mép ngoài của toàn bộ biểu đồ đến đường biên trang vẽ. Có thể tăng giảm tùy theo bố cục tổng thể.
  - Khoảng cách giữa hai node độc lập cùng cấp (Node-to-Node Clearance): Khuyến nghị mặc định tối thiểu 30 px. Khi mật độ phần tử dày đặc hoặc nhãn dài, khoảng cách này cần nâng lên từ 40 đến 50 px; với sơ đồ thưa có thể nới rộng hơn để tăng độ thoáng.
  - Khoảng cách từ đường nối đến node không liên quan (Edge-to-Unrelated-Node Clearance): Khuyến nghị mặc định tối thiểu 12 đến 16 px. Tránh việc đường nối đi sát sạt hoặc sượt qua bề mặt của một node thứ ba.
  - Khoảng cách giữa hai hành lang đường nối song song (Corridor Separation): Khuyến nghị mặc định tối thiểu 12 đến 20 px để mắt người có thể phân biệt rõ ràng từng luồng liên kết, không bị hiện tượng các đường hòa vào nhau.
  - Khoảng cách giữa Use Case và UML Note: Khuyến nghị mặc định từ 30 đến 40 px. Đường nối chú thích phải đi trực diện, không cắt qua các khối lân cận.
  - Khoảng đệm nội bộ của khung chứa (Container Internal Padding): Khuyến nghị mặc định từ 30 đến 40 px tính từ đường viền khung chứa (system boundary, package, lane) đến các node con nằm bên trong.

## 3. Thuật Toán Ước Lượng Kích Thước Theo Nội Dung (Sizing Before Positioning)

Áp dụng nguyên tắc: Ước lượng kích thước hoàn tất trước khi phân bổ vị trí tọa độ, tránh áp đặt kích thước cố định cho mọi hình dạng bất chấp chiều dài nhãn.

### Nguyên tắc tính kích thước văn bản và xử lý tiếng Việt

- Hệ số chiều rộng ký tự ước lượng ban đầu: Đối với phông chữ không chân thông dụng (Helvetica, Arial, Roboto) ở cỡ chữ 11 hoặc 12 px, mỗi ký tự trung bình chiếm chiều rộng xấp xỉ `charWidth = fontSize * 0.55`.
- Lưu ý đặc thù về chữ tiếng Việt và font metrics thực tế:
  - Công thức `fontSize * 0.55` chỉ là ước lượng khởi tạo ban đầu cho chuỗi ký tự Latin cơ bản.
  - Văn bản tiếng Việt có các ký tự chứa dấu thanh kết hợp (như ể, ễ, ậ, ồ, ũ) và một số nguyên âm có mũ thường có chiều cao thực tế lớn hơn và độ rộng ký tự nhỉnh hơn font Latin chuẩn.
  - Cần bổ sung thêm bước kiểm tra tràn văn bản (Text Overflow) hoặc render kiểm tra thực tế để bảo đảm chiều cao khung chứa đủ khoảng đệm cho dấu thanh, không để dấu bị cắt xén ở mép trên hoặc mép dưới của node.
- Chiều dài dòng chữ lớn nhất: Thuật toán xác định giới hạn ký tự tối đa trên một dòng `maxCharsPerLine` để tự động ngắt dòng, từ đó tính được `textWidth = maxCharsPerLine * fontSize * 0.55`.
- Chiều cao khối văn bản: Dựa trên số dòng ngắt thực tế `lineCount`, chiều cao nội dung được tính theo công thức `textHeight = lineCount * (fontSize * lineSpacing)`, trong đó hệ số giãn dòng `lineSpacing` thông thường từ 1.25 đến 1.35.

### Ước lượng cho từng loại hình dạng

- Hình elip Use Case:
  - Không gian bên trong hình elip bị thu hẹp đáng kể ở hai đầu và bốn góc do đường viền cong. Do đó, chiều rộng của elip phải lớn hơn đáng kể so với chiều rộng văn bản dài nhất: `ellipseWidth = textWidth * 1.4 + 40`.
  - Chiều cao elip phải bảo đảm lề trên và dưới: `ellipseHeight = textHeight + 40`.
  - Tỷ lệ hình dạng khuyến nghị cho Use Case: Tỷ lệ giữa chiều rộng và chiều cao dao động khuyến nghị từ 2.2:1 đến 2.5:1 (đây chỉ là tỷ lệ hình học gợi ý để elip trông cân đối, không phải tỷ lệ vàng toán học bắt buộc). Các kích cỡ tiêu chuẩn thường dùng gồm 140x60 px (nhãn 1 dòng ngắn), 160x70 px (nhãn 2 dòng), 180x80 px (nhãn 3 dòng).
- Biểu tượng Actor:
  - Bounding box của Actor bắt buộc phải bao trùm cả hình người stick figure lẫn nhãn tên Actor bên dưới.
  - Kích thước khuyến nghị: Chiều rộng từ 40 đến 60 px, chiều cao từ 80 đến 90 px (trong đó hình người chiếm khoảng 60 px chiều cao, nhãn văn bản chiếm từ 20 đến 30 px phía dưới).
- Khối chữ nhật bo góc (Activity Action / State):
  - Chiều rộng `width = textWidth + 30`.
  - Chiều cao `height = textHeight + 20`. Kích thước thông dụng tối thiểu là 120x50 px.
- Khối UML Note:
  - Chiều cao của khối Note phải tăng tương ứng theo số lượng dòng nội dung thực tế cần ghi chú, giải thích hoặc ràng buộc: `noteHeight = lineCount * 18 + 24`. Không dùng cùng một chiều cao 60 px cho cả Note 2 dòng và Note 8 dòng.

## 4. Hệ Thống Phân Loại Va Chạm Hình Học

Linter và thuật toán kiểm tra phân loại chính xác các hiện tượng không gian:

- Lỗi va chạm nghiêm trọng (Errors - Exit code 1):
  - Va chạm cứng (hard-overlap): Hai node độc lập cùng cấp có diện tích giao nhau thực tế lớn hơn 0 mà không có quan hệ chứa đựng hay lớp phủ hợp lệ.
  - Phần tử con tràn ngoài khung chứa (container-child-oob): Phần tử con khai báo thuộc container nhưng có tọa độ hoặc kích thước vượt ra ngoài ranh giới hình học của container cha.
  - Đường nối xuyên qua node (edge-through-node): Một đường connector cắt xuyên qua diện tích của một node không phải là điểm đầu (source) hoặc điểm cuối (target).
  - Lỗi bám điểm đầu cuối (endpoint-attachment-missing): Đường quan hệ nghiệp vụ thiếu thuộc tính `source` hoặc `target`, hoặc mút đường nối bị rời rạc khỏi đối tượng (vi phạm Cấp độ 1: Toàn vẹn tham chiếu), hoặc có cổng kết nối ngoài dải [0.0, 1.0] (vi phạm Cấp độ 2: Cấu hình cổng kết nối).
  - Tọa độ âm (canvas-bounds-negative): Phần tử có tọa độ x hoặc y âm trên canvas.
- Cảnh báo hình học cần tối ưu (Warnings - Exit code 0):
  - Tràn văn bản (text-overflow): Độ dài chuỗi chữ vượt quá chiều rộng hình khối hoặc chiều cao không đủ dẫn đến nguy cơ bị cắt xén khi không bật thuộc tính ngắt dòng (`whiteSpace=wrap`).
  - Tắc nghẽn cổng kết nối (port-congestion): Có từ 3 đường nối trở lên cùng chụm vào một điểm cổng kết nối duy nhất trên một cạnh node.
  - Hai đường nối trùng đoạn dài (edge-edge-overlap): Hai đường nối độc lập đi đè khít lên nhau một đoạn dài trên 25 px gây nguy cơ nhầm lẫn luồng thị giác. Khi chưa có engine render hình ảnh để kiểm tra pixel thực tế, hiện tượng này được phân loại và ghi nhận với trạng thái `Visual verification pending`.
  - Giao cắt giữa các đường nối (edge-crossing): Hai đường nối cắt chéo nhau. Tuyệt đối không coi giao cắt vuông góc 90 độ là mặc nhiên hợp lệ. Ưu tiên loại bỏ giao cắt bằng cách điều chỉnh vị trí node và chọn hành lang khác; chỉ chấp nhận giao cắt khi cấu trúc đồ thị quá dày đặc và đã tối ưu hóa vị trí.
  - Va chạm nhãn (label-collision): Nhãn văn bản của đường nối đè lên node, đè lên nhãn khác hoặc đè lên điểm chuyển hướng của đường khác.
  - Vi phạm khoảng cách an toàn (clearance-warning): Khoảng cách giữa hai node độc lập nhỏ hơn 30 px.
  - Vượt biên trang in dương (canvas-bounds-overflow): Khối hình nằm ngoài kích thước trang in khai báo (`pageWidth`, `pageHeight`) khi đang ở chế độ phân trang (`page="1"`).
- Hiện tượng hợp lệ và có chủ đích (Valid Structural Overlays - PASS):
  - Phần tử con trong khung chứa (container-child): Các Use Case nằm trọn vẹn bên trong khung System Boundary, hoặc các Action nằm bên trong Swimlane.
  - Lớp phủ có chủ đích (intentional-overlay): Nhãn text nằm trên thanh công cụ của Wireframe, biểu tượng icon đặt bên trong ô nút bấm, hoặc các trường thuộc tính trong khối bảng lớp đã được xác định vai trò sở hữu.

## 5. Thuật Toán Định Tuyến Trực Giao Và Hàm Chi Phí (Orthogonal Routing & Cost Function)

> [!NOTE]
> **Bản chất của giải thuật định tuyến A* trong hệ thống Skills:**
> Mô hình A* Manhattan Routing và Hàm chi phí (Cost Function) dưới đây là mô hình tư duy chuẩn mực (heuristic mental model) và cẩm nang thủ tục hướng dẫn dành cho AI Agent khi lập kế hoạch tọa độ, phân bổ hành lang và tính toán các waypoint trực giao cho Draw.io XML. Đây không phải là một module mã nguồn nhị phân độc lập chạy ngầm, mà là phương pháp luận toán học bắt buộc Agent phải tuân thủ khi thiết kế sơ đồ để tránh vật cản và tối ưu đường nối trước khi kết xuất mã XML.

Áp dụng định tuyến trực giao (Orthogonal / Manhattan Routing) dựa trên lưới khả kiến (Visibility Grid) kết hợp giải thuật tìm đường A*:

### Quy trình tạo lưới định tuyến

1. Thu thập danh sách chướng ngại vật: Lấy toàn bộ bounding box của các node, nhãn văn bản và khung chứa đang hiện diện trên bản vẽ.
2. Mở rộng biên an toàn: Áp dụng công thức `B_margin` với lề an toàn `m = 14 px` cho mọi chướng ngại vật để tạo thành vùng cấm xâm nhập (Forbidden Zones). Loại trừ hai node nguồn và đích của đường nối đang xét ra khỏi tập cấm tại vị trí các cổng nối được chọn.
3. Chiết xuất các trục hành lang (Corridor Generation):
   - Tập trục hoành Y: Lấy các giá trị y của cổng nguồn, cổng đích, cùng các cạnh trên và dưới của các vùng cấm.
   - Tập trục tung X: Lấy các giá trị x của cổng nguồn, cổng đích, cùng các cạnh trái và phải của các vùng cấm.
4. Xây dựng đồ thị giao điểm: Giao điểm của các trục X và Y tạo thành các nút định tuyến tiềm năng nằm hoàn toàn ngoài vùng cấm.

### Hàm chi phí định tuyến (Cost Function)

Thuật toán A* tìm đường đi từ cổng nguồn đến cổng đích bằng cách cực tiểu hóa hàm chi phí tổng hợp:

`Cost = (alpha * TotalLength) + (beta * BendCount) + (gamma * CrossingPenalty) + (delta * ProximityPenalty) + (epsilon * CongestionPenalty)`

Giải thích và các trọng số heuristic khởi tạo tham khảo (cần điều chỉnh và tinh chỉnh thực tế dựa trên mật độ phần tử, kích thước node và không gian trống của canvas):

- `TotalLength` (Độ dài đường đi): Tính bằng tổng chiều dài hình học Manhattan của các đoạn thẳng. Hệ số khởi tạo `alpha = 1.0` giúp ưu tiên các tuyến đường ngắn.
- `BendCount` (Số lượng góc rẽ): Số lần đổi hướng 90 độ của đường đi. Hệ số khởi tạo `beta = 40.0` để hạn chế đường đi zigzag khúc khuỷu, ưu tiên đường thẳng hoặc đường chỉ rẽ từ 1 đến 2 lần.
- `CrossingPenalty` (Hình phạt giao cắt): Đánh thuế nặng nếu đoạn đường dự kiến cắt ngang một đường nối đã tồn tại từ trước. Hệ số khởi tạo `gamma = 500.0` nhằm thúc đẩy thuật toán tìm đường vòng qua hành lang khác thay vì cắt ngang đường khác. Không coi góc 90 độ là miễn trừ phạt.
- `ProximityPenalty` (Hình phạt cự ly gần vật cản): Đánh thuế nếu đoạn đường đi sát sạt biên của vùng cấm thay vì đi ở giữa hành lang thông thoáng. Hệ số khởi tạo `delta = 20.0`.
- `CongestionPenalty` (Hình phạt tắc nghẽn cổng/hành lang): Đánh thuế nếu đường đi chọn một cổng hoặc một hành lang đang có nhiều đường khác lưu thông song song. Hệ số khởi tạo `epsilon = 30.0`.

### Rút gọn đường đi (Collinear Simplification)

Sau khi thuật toán A* tìm ra danh sách các điểm nút, bước rút gọn sẽ duyệt qua toàn bộ chuỗi điểm: nếu ba điểm liên tiếp `P1`, `P2`, `P3` cùng nằm trên một đường thẳng nằm ngang (`y1 == y2 == y3`) hoặc cùng nằm trên một đường thẳng đứng (`x1 == x2 == x3`), điểm trung gian `P2` sẽ bị loại bỏ. Kết quả cuối cùng là danh sách các waypoint rẽ góc tối giản.

## 6. Cơ Chế Phân Bổ Cổng (Port Assignment) Và Waypoint

Mỗi đường nối trong Draw.io XML cần cố định cổng vào và ra trên bề mặt của node để tránh việc phần mềm tự động tính toán lại làm vỡ đường đi trực giao:

### Ba Cấp Độ Xác Minh Điểm Đầu Cuối (Endpoint Attachment Levels)

Việc kiểm soát chất lượng điểm mút kết nối được chia thành ba cấp độ kiểm tra độc lập và minh bạch:

- **Cấp độ 1 — Toàn vẹn tham chiếu (Reference Integrity):**
  - Kiểm tra xem thẻ `<mxCell edge="1">` có chứa đầy đủ hai thuộc tính `source` và `target` hay không.
  - Cả hai thuộc tính bắt buộc phải tồn tại, không được rỗng và phải tham chiếu chính xác đến `id` của các vertex (node) thực sự tồn tại trong mô hình XML.
  - Cấp độ này được bảo đảm bằng bước phân tích cấu trúc cú pháp XML (XML Structural Validation).

- **Cấp độ 2 — Cấu hình cổng kết nối (Port Configuration):**
  - Kiểm tra các tham số cổng kết nối trên chuỗi style của edge: `exitX`, `exitY` (trên node nguồn) và `entryX`, `entryY` (trên node đích).
  - Mọi tọa độ cổng chuẩn hóa phải nằm trong dải hợp lệ từ `0.0` đến `1.0`.
  - Cấp độ này được bảo đảm bằng bước kiểm tra hình học tĩnh (Geometry Static Validation).

- **Cấp độ 3 — Bám dính hình học thực tế (Geometric Attachment):**
  - Kiểm tra sự tiếp xúc vật lý chính xác giữa đầu mút connector với chu vi hoặc bề mặt của node sau khi engine đồ họa (render engine của drawio / mxGraph / Chromium) tính toán và vẽ các nét vector / pixel thực tế lên canvas.
  - *Ràng buộc minh bạch:* Trình kiểm tra tĩnh trên tệp XML chỉ có thể chứng minh Cấp độ 1 và Cấp độ 2. Nếu môi trường thực thi chưa có công cụ kết xuất hình ảnh thực tế (drawio CLI hoặc headless Chromium), Cấp độ 3 bắt buộc phải được ghi nhận là `Visual verification pending` (chờ xác minh trực quan), tuyệt đối không được tuyên bố đã hoàn tất kiểm tra Geometric Attachment.

### Quy tắc phân bổ cổng và hướng quan hệ

- Các thuộc tính cổng kết nối:
  - `exitX` và `exitY`: Tọa độ tương đối của cổng xuất phát trên node nguồn (giá trị từ 0.0 đến 1.0).
  - `entryX` và `entryY`: Tọa độ tương đối của cổng tiếp nhận trên node đích (giá trị từ 0.0 đến 1.0).
- Quy tắc phân bổ cổng theo hướng luồng:
  - Luồng ngang: Cổng xuất phát ở mép phải `exitX=1;exitY=0.5;`, cổng tiếp nhận ở mép trái `entryX=0;entryY=0.5;` (hoặc ngược lại).
  - Luồng dọc: Cổng xuất phát ở mép dưới `exitX=0.5;exitY=1;`, cổng tiếp nhận ở mép trên `entryX=0.5;entryY=0;` (hoặc ngược lại).
  - Phân bổ đa cổng (Multiple Ports Distribution): Khi một Actor hoặc một khối kết nối với nhiều node khác nhau ở cùng một phía, phân bổ đều theo các tỷ lệ dọc như `exitY=0.25`, `exitY=0.5`, `exitY=0.75` để tạo các luồng tách biệt, tránh tình trạng nhiều đường nối chụm chung một điểm mút.
- Xác minh hướng và thuộc tính ngữ nghĩa của các loại quan hệ và thông điệp:
  - Association: Nối giữa Actor và Use Case, KHÔNG CÓ MŨI TÊN (`endArrow=none;endFill=0;`), không quy định chiều phụ thuộc.
  - Include: Nét đứt, đầu mũi tên nhọn hở (`dashed=1;endArrow=open;endSize=8;`), source bắt buộc là Base Use Case, target bắt buộc là Included Use Case, stereotype hiển thị nhãn `<<include>>`.
  - Extend: Nét đứt, đầu mũi tên nhọn hở (`dashed=1;endArrow=open;endSize=8;`), source bắt buộc là Extending Use Case, target bắt buộc là Base Use Case, stereotype hiển thị nhãn `<<extend>>`.
  - Generalization: Nét liền, đầu mũi tên tam giác rỗng ứng viên (`endArrow=classic;endFill=0;endSize=10;`, Visual verification pending theo tài liệu Draw.io Style Reference), source là phần tử con, target là phần tử cha.
  - Activity Control Flow: Nét liền, đầu mũi tên mở (`endArrow=open;endFill=0;endSize=8;`), từ hoạt động nguồn đến đích.
  - State Machine Transition: Nét liền, đầu mũi tên mở (`endArrow=open;endFill=0;endSize=8;`), nhãn `trigger [guard] / effect`.
  - Sequence Synchronous Call: Nét liền, TAM GIÁC TÔ ĐEN (`endArrow=classic;endFill=1;endSize=8;`, Visual verification pending), bên gửi dừng chờ.
  - Sequence Asynchronous Message: Nét liền, ĐẦU MỞ (`endArrow=open;endFill=0;endSize=8;`), bên gửi không chờ.
  - Sequence Reply / Return: Nét đứt, ĐẦU MỞ (`dashed=1;dashPattern=4 4;endArrow=open;endFill=0;endSize=8;`), trả kết quả.
  - Sequence Self-message: Nối vòng loopback trên cùng Lifeline/Activation, kiểu đầu mũi tên đồng bộ (`endArrow=classic;endFill=1;`, Visual verification pending) hoặc bất đồng bộ (`endArrow=open;endFill=0;`) tùy bản chất lời gọi (không mặc định chung một kiểu arrowhead).
  - Sequence Create Message (UML 2.5.1 Section 17.4): Nét đứt, đầu mũi tên mở (`dashed=1;dashPattern=4 4;endArrow=open;endFill=0;endSize=8;`), trỏ vào Participant mới, Lifeline bắt đầu tại đúng cao độ thời điểm tạo (không kéo dài lên trên đỉnh).
  - Sequence Destroy Message & Destruction Occurrence: Trỏ vào điểm hủy `shape=umlDestroy;whiteSpace=wrap;html=1;` (bảo toàn nét mặc định strokeWidth=1) ở cuối Lifeline; Lifeline kết thúc hoàn toàn tại điểm hủy và không kéo dài xuống dưới.
- Cấu trúc khai báo Waypoint trong XML:
  - Mọi điểm bẻ góc đều phải được lưu trữ tường minh bên trong thẻ `<Array as="points">`.
  - Ví dụ cấu trúc khai báo:
    `<Array as="points">`
      `<mxPoint x="360" y="240" />`
      `<mxPoint x="360" y="380" />`
    `</Array>`

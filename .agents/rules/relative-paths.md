---
trigger: always_on
---

# Quy Chuẩn Đường Dẫn Tương Đối

Quy tắc này áp dụng vô điều kiện cho mọi tác vụ đọc, ghi, liên kết và quản lý tệp trong repository này.

## 1. Ràng Buộc Đường Dẫn Tuyệt Đối

* **Tuyệt đối cấm hardcode đường dẫn máy tính cá nhân:** Không được ghi các đường dẫn có chứa ổ đĩa hoặc thư mục người dùng cá nhân (ví dụ: `C:\Users\...`, `D:\...`, `/home/...`, `/Users/...`) vào bất kỳ tệp tài liệu hay mã nguồn nào.
* Kho lưu trữ phải hoạt động hoàn toàn độc lập với môi trường clone và hệ điều hành.

## 2. Quy Chuẩn Liên Kết Markdown Nội Bộ

* Toàn bộ liên kết giữa các tệp tài liệu phải được tính tương đối từ vị trí tệp chứa liên kết:
  * Từ `.claude/skills/<skill>/SKILL.md` trỏ về nguồn chuẩn: `../../../.agents/skills/<skill>/SKILL.md`
  * Từ `SKILL.md` trỏ đến tài liệu tham khảo cùng cấp: `./references/<tệp>.md`
  * Từ `PTTKHTTT/README.md` trỏ đến các tệp hồ sơ: `01-khao-sat-va-pham-vi.md`

## 3. Quy Tắc Thao Tác Của Agent

Khi thực thi công cụ đọc/ghi tệp, agent phải xác định thư mục gốc của repository (thư mục chứa `.git`), sau đó sử dụng đường dẫn tương đối tính từ repository root.


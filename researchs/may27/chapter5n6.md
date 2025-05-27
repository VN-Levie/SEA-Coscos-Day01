# Chương 5-6

## **1. Tại sao dùng Trim và Raw cho ảnh (Sprite), và khi nào dùng?**

### **Trim**

* **Mục đích**: Cắt bỏ phần trong suốt (transparent) xung quanh ảnh trong SpriteFrame.
* **Tác dụng**:

  * **Giảm kích thước thực tế cần vẽ**, đặc biệt khi dùng ảnh từ Atlas – tăng hiệu năng, giảm draw call.
  * **Giữ nguyên vị trí chính giữa của ảnh thực**, có lợi khi canh chỉnh UI chính xác.
* **Khi nào dùng**:

  * **Dùng khi ảnh có nhiều khoảng trắng trong suốt**, và ta không muốn vẽ phần rỗng đó.
  * Phù hợp với các ảnh trong game như icon, vật phẩm, nhân vật cần đặt chính xác theo trục.

### **Raw**

* **Mục đích**: Dùng kích thước gốc của ảnh, không cắt trim.
* **Tác dụng**:

  * Duy trì **đúng kích thước file ảnh gốc**, kể cả phần trống.
  * Thường dùng để **so khớp vị trí hiển thị** giữa các ảnh có kích thước đồng nhất nhưng phần nội dung khác nhau (ví dụ khung nền UI).
* **Khi nào dùng**:

  * Khi bạn cần **giữ đúng layout theo kích thước ảnh gốc**.
  * Khi các ảnh cần **canh lề hoặc so kích thước chuẩn**, ví dụ các ô vuông bằng nhau trong 1 khung.

### **Tóm tắt:**

| Loại | Ưu điểm                      | Dùng khi nào                                  |
| ---- | ---------------------------- | --------------------------------------------- |
| Trim | Giảm phần rỗng, vẽ nhanh hơn | Ảnh nhỏ, cần chính xác, không lệ thuộc khung  |
| Raw  | Giữ đúng kích thước gốc      | Ảnh dùng làm nền, khung, layout lưới đồng đều |

---

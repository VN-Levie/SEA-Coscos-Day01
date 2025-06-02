# Chương 9: Các mẫu thiết kế phổ biến trong phát triển game

Mẫu thiết kế (Design Pattern) là các giải pháp hướng đối tượng cho những vấn đề thường gặp trong phần mềm. Mỗi mẫu có tên gọi riêng và giúp chúng ta dễ dàng trao đổi về các giải pháp thiết kế phức tạp.

## I. Command Pattern

### 1. Mục đích

Đóng gói các hành động thành đối tượng riêng biệt để tách biệt nơi phát sinh và nơi xử lý yêu cầu.

### 2. Tác dụng

- Dễ mở rộng, thêm hành động mới mà không ảnh hưởng mã nguồn cũ.
- Hỗ trợ Undo/Redo, xếp hàng hành động.
- Tăng tính linh hoạt cho hệ thống.

### 3. Khi nào dùng

- Khi cần thực hiện các thao tác Undo/Redo.
- Khi muốn tách biệt logic phát sinh và xử lý hành động.
- Khi cần lưu trữ lịch sử các hành động.

### 4. Thành phần chính

- **Client**: Tạo các đối tượng Command và gán cho đối tượng thực thi (Receiver).
- **Invoker**: Đối tượng gọi thực thi Command (ví dụ: hệ thống nhận input).
- **Command**: Định nghĩa giao diện thực thi hành động (execute, undo).
- **Receiver**: Đối tượng thực hiện hành động thực tế (ví dụ: nhân vật trong game).

---

## II. Flyweight Pattern

### 1. Mục đích

Tiết kiệm bộ nhớ bằng cách chia sẻ các đối tượng có dữ liệu giống nhau.

### 2. Tác dụng

- Giảm thiểu số lượng đối tượng được tạo ra.
- Tối ưu hiệu năng và bộ nhớ cho các đối tượng lặp lại nhiều lần.

### 3. Khi nào dùng

- Khi game có nhiều đối tượng giống nhau (cây, đạn, ô bản đồ...).
- Khi bộ nhớ là yếu tố quan trọng.

### 4. Thành phần chính

- **Client**: Quản lý trạng thái riêng biệt và sử dụng Flyweight.
- **FlyweightFactory**: Tạo và quản lý các đối tượng Flyweight dùng chung.
- **Flyweight**: Chứa dữ liệu dùng chung.

---

## III. Observer Pattern

### 1. Mục đích

Cho phép nhiều đối tượng nhận thông báo khi một đối tượng khác thay đổi trạng thái.

### 2. Tác dụng

- Tăng tính linh hoạt, giảm sự phụ thuộc giữa các thành phần.
- Dễ dàng mở rộng hệ thống sự kiện.

### 3. Khi nào dùng

- Khi cần cập nhật nhiều thành phần khi có sự kiện (UI, âm thanh...).
- Khi muốn xây dựng hệ thống sự kiện.

### 4. Thành phần chính

- **Subject**: Quản lý danh sách Observer và gửi thông báo khi có sự kiện.
- **Observer**: Nhận thông báo và xử lý khi có sự kiện.

---

## IV. State Pattern

### 1. Mục đích

Cho phép đối tượng thay đổi hành vi khi trạng thái nội bộ thay đổi.

### 2. Tác dụng

- Dễ quản lý các trạng thái phức tạp.
- Tăng tính mở rộng, dễ bảo trì.

### 3. Khi nào dùng

- Khi đối tượng có nhiều trạng thái và hành vi thay đổi theo trạng thái.
- Khi muốn xây dựng máy trạng thái (state machine).

### 4. Thành phần chính

- **Context**: Đối tượng chính, chứa trạng thái hiện tại.
- **State**: Định nghĩa các trạng thái cụ thể và hành vi tương ứng.

---

## V. Singleton Pattern

### 1. Mục đích

Đảm bảo một lớp chỉ có duy nhất một đối tượng tồn tại.

### 2. Tác dụng

- Quản lý tài nguyên dùng chung (âm thanh, cấu hình...).
- Đảm bảo truy cập toàn cục, nhất quán.

### 3. Khi nào dùng

- Khi chỉ cần một đối tượng duy nhất cho toàn bộ chương trình.
- Khi quản lý tài nguyên hoặc cấu hình toàn cục.

### 4. Thành phần chính

- **Singleton**: Đảm bảo chỉ có một thể hiện duy nhất và cung cấp điểm truy cập toàn cục.

---

## VI. Bảng so sánh tóm tắt các mẫu thiết kế

| Mẫu thiết kế   | Mục đích chính                           | Tác dụng nổi bật                | Khi nào dùng                        |
|----------------|------------------------------------------|----------------------------------|-------------------------------------|
| Command        | Đóng gói hành động                       | Undo/Redo, tách biệt xử lý       | Khi cần Undo/Redo, lưu lịch sử      |
| Flyweight      | Chia sẻ đối tượng dùng chung             | Tiết kiệm bộ nhớ                 | Khi có nhiều đối tượng giống nhau   |
| Observer       | Thông báo thay đổi trạng thái             | Hệ thống sự kiện linh hoạt       | Khi nhiều đối tượng cần cập nhật    |
| State          | Quản lý hành vi theo trạng thái           | Dễ mở rộng, bảo trì              | Khi có nhiều trạng thái phức tạp    |
| Singleton      | Đảm bảo một thể hiện duy nhất             | Quản lý tài nguyên toàn cục      | Khi cần đối tượng duy nhất          |

---

## Tóm tắt chương

Đây là 5 mẫu thiết kế cơ bản thường dùng trong phát triển game: Command, Flyweight, Observer, State, Singleton. Việc áp dụng các mẫu này giúp mã nguồn game dễ bảo trì, mở rộng và linh hoạt hơn.

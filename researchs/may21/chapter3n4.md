# Researchs Chapter 3 & 4

## Các khái niệm **Wrap Mode**, **Filter Mode**, **Premultiply Alpha** và **Auto Atlas** trong phát triển game

Trong phát triển game (đặc biệt là game 2D), chúng ta thường dùng các hình ảnh (texture) để vẽ nhân vật, vật thể. Một số khái niệm kỹ thuật về ảnh có thể khá khó hiểu với người mới, nhưng giải thích đơn giản thì không phức tạp. Trong Cocos Creator hay phát triển game nói chung, có những khái niệm quan trọng như **Wrap Mode**, **Filter Mode**, **Premultiply Alpha** và **Auto Atlas**. Bài viết này sẽ trình bày những khái niệm đó một cách sinh động, dễ hiểu, giúp bạn nắm bắt lý do chúng quan trọng.

### Wrap Mode

*Wrap Mode* quy định cách thức xử lý khi một hình ảnh (texture) được áp lên một không gian lớn hơn ảnh gốc. Nói đơn giản, nếu ảnh gốc nhỏ mà ta dùng làm nền lớn, Wrap Mode sẽ chỉ định cách tính màu cho phần ảnh nằm ngoài biên ảnh gốc. Trong Cocos Creator, Wrap Mode có thể chọn các chế độ như *Repeat* (lặp ảnh) hoặc *Clamp-to-edge* (kéo căng viền). Với *Repeat*, ảnh gốc sẽ được sao chép lặp đi lặp lại để lấp đầy vùng ngoài biên, giống như lát gạch hoa văn liên tục. Ví dụ, khi muốn tạo nền cỏ hoặc trời xanh trông vô tận, ta có thể dùng Repeat để tấm hình được lặp đến vô hạn. Ngược lại, *Clamp-to-edge* giữ nguyên phần ảnh bên trong và chỉ kéo dài màu tại mép ảnh ra ngoài (như khi phóng to một bức tranh nhỏ, các cạnh ảnh được dãn ra chứ không lặp lại). Ngoài ra còn có *Mirrored-repeat*, tức lặp ảnh xen kẽ với việc lật gương mỗi lần lặp, tạo hiệu ứng đối xứng qua mỗi lần lặp.

Trong thực tế, việc chọn Wrap Mode phù hợp giúp tránh các hiện tượng không mong muốn khi hiển thị. Ví dụ, dùng *Repeat* cho nền liên tục sẽ tiết kiệm được độ lớn của ảnh gốc mà vẫn cho cảm giác liền mạch, còn dùng *Clamp* cho sprite có viền trong suốt thì sẽ tránh việc tạo ra các vùng thừa không có nghĩa. Chọn Wrap Mode hợp lý cũng góp phần giảm số lần vẽ ảnh (draw calls) trong trường hợp lặp hình nền.

### Filter Mode

*Filter Mode* (chế độ lọc) xác định cách máy tính chọn màu khi một ảnh bị phóng to (zoom in) hoặc thu nhỏ (zoom out). Cocos Creator hỗ trợ ba chế độ: *Point* (còn gọi là *Nearest*), *Bilinear* và *Trilinear*. Ở chế độ *Point/Nearest*, mỗi điểm ảnh mới sẽ lấy đúng màu của pixel gần nhất trong ảnh gốc, không pha trộn màu với các pixel xung quanh. Kết quả là khi phóng to ảnh, bạn sẽ thấy rõ từng ô vuông pixel (giống đồ họa cổ điển) vì không có phép làm mượt giữa các điểm. Ngược lại, *Bilinear* sẽ lấy trung bình màu của 4 pixel lân cận để làm mịn ảnh, vì thế khi zoom ảnh sẽ mềm mại hơn, nhưng các cạnh có thể hơi nhòe nếu ảnh có nhiều chi tiết nhỏ. *Trilinear* là phiên bản nâng cao của Bilinear, kết hợp thêm việc dùng nhiều cấp ảnh thu nhỏ (mipmap) để giảm hiện tượng răng cưa khi nhìn vật ở xa.  Tóm lại, với phong cách đồ họa pixel art thường chọn *Point* để giữ nét vuông vắn, còn với ảnh vẽ tay hoặc 3D thì dùng *Bilinear/Trilinear* để hình ảnh mượt mà hơn.

### Premultiply Alpha

*Premultiply Alpha* (nhân trước kênh alpha) là cách lưu trữ màu của ảnh sao cho các kênh màu RGB đã được nhân trước với độ trong suốt (alpha) khi lưu. Ví dụ, một pixel màu đỏ nguyên (255, 0, 0) với độ trong suốt 50% sẽ được lưu thành (127, 0, 0, 0.5) khi bật premultiply (vì 255×0.5=127), trong khi nếu không dùng premultiply thì nó vẫn được lưu là (255, 0, 0, 0.5). Cách xử lý này giúp đơn giản hóa phép pha trộn màu khi hiển thị, vì màu đã được tính sẵn trước khi vẽ. Quan trọng hơn, nếu không dùng premultiply, việc nội suy màu (khi phóng to/thu nhỏ hoặc blend ảnh) có thể cho ra kết quả sai – thường thấy viền đen hoặc điểm màu lỗi ở các vùng trong suốt. Kích hoạt *Premultiply Alpha* giúp đảm bảo rằng các cạnh trong suốt được xử lý mượt mà hơn và ảnh hưởng của độ trong suốt lên màu sắc được tính toán chính xác hơn. Nói cách khác, premultiply tránh cho các vùng trong suốt không bị “lem” màu lên các pixel xung quanh khi vẽ ảnh lên nền.

### Auto Atlas (Sprite Atlas)

Trong game 2D thường có rất nhiều sprite (ảnh nhỏ) khác nhau, ví dụ nhân vật, hiệu ứng, giao diện… *Sprite Atlas* (hay sprite sheet) là khái niệm gom nhiều ảnh nhỏ vào chung một ảnh lớn để cùng vẽ. Cocos Creator có tính năng *Auto Atlas* tự động đóng gói (pack) các ảnh trong cùng một thư mục thành một sprite sheet lớn khi build game. Ví dụ, nếu bạn có nhiều file PNG nhỏ trong một thư mục (như hình các khung animation của nhân vật), Cocos sẽ tự động gộp toàn bộ chúng thành một ảnh lớn duy nhất trong quá trình biên dịch. Việc này giúp game engine chỉ cần tải một tấm texture để vẽ nhiều sprite khác nhau, thay vì phải liên tục đổi qua lại nhiều ảnh nhỏ. Nhờ vậy, số lần gọi vẽ (draw calls) và chi phí đổi bộ nhớ (texture binds) giảm đáng kể, tiết kiệm tài nguyên và tăng tốc độ render. Tóm lại, Auto Atlas (sprite atlas) giúp cải thiện hiệu suất game bằng cách dùng một bảng ảnh duy nhất cho nhiều đối tượng khác nhau, nhờ đó game chạy mượt mà hơn.

### Tổng kết

Hiểu rõ các khái niệm trên sẽ giúp bạn điều khiển tốt hơn chất lượng hình ảnh và hiệu năng của game. **Wrap Mode** và **Filter Mode** ảnh hưởng trực tiếp đến cách ảnh được lặp hoặc được lọc mượt khi phóng to/thu nhỏ. **Premultiply Alpha** đảm bảo quá trình pha trộn màu với các ảnh trong suốt diễn ra chính xác, tránh các điểm màu sai hoặc viền đen không mong muốn. Còn **Auto Atlas** (sprite atlas) là công cụ giúp gom nhiều ảnh nhỏ thành một, giảm số lần gọi vẽ và tiết kiệm tài nguyên cho game. Nắm vững những khái niệm này sẽ giúp bạn thiết kế đồ họa trong game vừa đẹp mắt vừa chạy hiệu quả.

## Tổng quan về WebAudio, DOMAudio và Prefab trong Cocos Creator

### Phần 1: So sánh WebAudio mode vs DOMAudio mode

Trong Cocos Creator, chế độ âm thanh Web (WebAudio) sử dụng **Web Audio API** của trình duyệt để tải và phát âm thanh, trong khi chế độ DOMAudio sử dụng phần tử `<audio>` chuẩn của HTML. Theo tài liệu, engine sẽ cố gắng sử dụng WebAudio mặc định và chỉ chuyển sang DOMAudio nếu trình duyệt không hỗ trợ WebAudio. WebAudio cung cấp giao diện điều khiển âm thanh hiện đại hơn, lưu trữ âm thanh dưới dạng bộ đệm (AudioBuffer) bên trong engine, còn DOMAudio tạo một thẻ audio riêng để phát.

* **WebAudio mode** (Audio Web): phù hợp để chơi nhiều hiệu ứng âm thanh cùng lúc và kiểm soát chi tiết (thay đổi âm lượng, tốc độ, xử lý hiệu ứng…). Ưu điểm của WebAudio là **tương thích tốt**, ổn định và cho phép phát đồng thời nhiều kênh âm thanh. Tuy nhiên nó có nhược điểm là **tốn nhiều bộ nhớ** (vì phải tải toàn bộ file âm thanh vào bộ đệm), và trên iOS cần sự kiện tương tác của người dùng lần đầu để kích hoạt audio. Ngoài ra, khi tạm ẩn/hiện (foreground/background) trên iOS đôi khi WebAudio có thể không tự động tạm dừng/tiếp tục mượt mà, cần xử lý thêm trong code.

  * *Ưu điểm*: tương thích tốt, hỗ trợ đồng thời nhiều âm thanh, cho phép điều khiển chi tiết (volume, loop…).
  * *Nhược điểm*: tiêu tốn bộ nhớ (cache toàn bộ file); trên iOS chỉ chạy sau khi người dùng chạm màn hình lần đầu.

* **DOMAudio mode** (Audio DOM): dùng thẻ `<audio>` của trình duyệt để phát âm thanh. Chế độ này chạy ổn định trên hầu hết thiết bị, và thích hợp với các file nhạc nền lớn vì **ít tốn bộ nhớ** hơn (hệ thống có thể vừa phát vừa tải). Tuy nhiên DOMAudio chỉ cho phép phát **một âm thanh tại một thời điểm** – nếu phát thêm thì âm thanh trước sẽ dừng lại. Trên iOS, DOMAudio còn có hạn chế không thể điều chỉnh âm lượng qua phần mềm, và mỗi lần phát phải được kích hoạt bởi một sự kiện người dùng (chạm màn hình).

  * *Ưu điểm*: dùng được cho các file nhạc dài (ví dụ nhạc nền) để giảm tải bộ nhớ; giải pháp dự phòng khi WebAudio không khả dụng.
  * *Nhược điểm*: chỉ phát tối đa một clip cùng lúc (không hỗ trợ phát đè); trên iOS không điều chỉnh được âm lượng; mỗi lần phát cần thao tác của người dùng.

Tóm lại, **WebAudio** là lựa chọn mặc định và phù hợp với hầu hết trường hợp (trò chơi cần nhiều hiệu ứng âm thanh, độ linh hoạt cao), còn **DOMAudio** chỉ dùng khi cần tiết kiệm bộ nhớ cho file nhạc lớn hoặc trên các trình duyệt cũ không hỗ trợ WebAudio. Ví dụ, động cơ sẽ tự động chuyển sang DOMAudio nếu phát hiện không thể dùng WebAudio.

### Phần 2: Prefab trong Cocos Creator

**Prefab** (viết tắt của “prefabricated asset”) là một tài nguyên chứa cấu hình sẵn cho một hoặc nhiều nút (Node) trong scene, bao gồm cả các component và dữ liệu trong đó. Prefab dùng để **tái sử dụng** các đối tượng giống nhau nhiều lần mà không cần sao chép thủ công, giúp duy trì sự nhất quán khi thay đổi: thay đổi Prefab gốc sẽ có thể áp dụng lên tất cả các instance của nó. Điều này thuận tiện hơn nhiều so với việc tạo bản copy (copy) của node, vì nếu copy, mỗi node là độc lập và không thể cập nhật đồng loạt.

* **Lợi ích của Prefab**:

  * Tái sử dụng các đối tượng chung, giảm việc tạo mới thủ công.
  * Giúp **đồng nhất**: khi sửa Prefab gốc, có thể cập nhật tất cả instance một cách nhất quán.
  * Tránh lộn xộn và dễ lỗi: không cần sao chép node bằng tay (nhỡ quên thay thành phần thì khó sửa).
    Ví dụ, Prefab phù hợp cho nhân vật kẻ địch, phần thưởng, hiệu ứng lặp đi lặp lại trong game.

* **Tạo và sử dụng Prefab trong Editor**:

  * Để tạo Prefab, ta có thể **kéo-thả một Node** trong Hierarchy vào thư mục Assets (hoặc vào một folder trong Assets). Cách này sẽ chuyển Node đó thành một Prefab Asset. (Ở các phiên bản mới, có thể tạo Prefab mới qua nút “+” trong Assets rồi kéo node vào.)
  * Sau khi tạo Prefab, ta có thể **kéo Prefab từ Assets vào Scene** (khu vực Hierarchy) để tạo một Prefab Instance. Ví dụ: kéo thả prefabs `star.prefab` vào scene sẽ sinh ra một node instance mầu xanh. Mỗi instance này sẽ kế thừa cấu hình của Prefab gốc nhưng có thể chỉnh sửa cục bộ.

* **Quản lý Prefab Instance trong Editor**: Khi chọn một Prefab Instance trong scene, ở góc trên bên phải của bảng Inspector sẽ có các nút chức năng:

  * **Save**: lưu (đồng bộ) các thay đổi vừa chỉnh trong instance vào Prefab gốc. Ví dụ, nếu chỉnh sửa component hay thuộc tính con, ấn “Save” sẽ cập nhật thay đổi lên asset Prefab.
  * **Go Back** (Return): hoàn tác các thay đổi của instance trở về trạng thái ban đầu của Prefab. Chú ý: thao tác rollback sẽ *không* tác động được lên các thuộc tính **tên, vị trí (Position), xoay (Rotation),** và **trạng thái active** của nút gốc, vì những thứ này được xem là đặc trưng riêng của instance trong scene.
  * Ngoài ra có nút **Select** để định vị Prefab gốc trong Assets.

* **Chế độ đồng bộ Auto Sync và Manual Sync**: Mỗi Prefab Instance có thể được đặt ở chế độ **Manual Sync** (mặc định) hoặc **Auto Sync** bằng cách nhấp nút đồng bộ trong Inspector.

  * Ở chế độ **Manual Sync**, khi sửa Prefab gốc thì instance sẽ *không* tự động cập nhật. Nếu muốn lấy thay đổi từ Prefab, phải ấn nút **Return** (hoặc “Apply”) thì instance mới đồng bộ thủ công.
  * Ở chế độ **Auto Sync**, instance sẽ tự động cập nhật mỗi khi Prefab gốc thay đổi. Trong trường hợp này, tên và các thuộc tính position/rotation/active của nút gốc sẽ được ngoại lệ (giữ giá trị riêng cho instance) để dễ tùy biến. Instance đang ở Auto Sync sẽ hiển thị màu xanh lục trong Hierarchy, còn Manual Sync là màu xanh đậm.

* **Lưu ý khi dùng Prefab**:

  * Với **Auto Sync**, Prefab Instance bị hạn chế **tham chiếu chéo**: các component bên trong một prefab instance *không được* tham chiếu đến đối tượng ngoài (nếu có, editor sẽ cảnh báo). Ngược lại, các component bên ngoài chỉ được trỏ đến **nút gốc của instance**, chứ không được truy xuất trực tiếp vào con hoặc component của instance đó. Điều này giúp tránh lỗi khi tự động đồng bộ.
  * Tóm lại: nếu cần một instance chứa tham chiếu phức tạp với scene, có thể để ở Manual Sync, hoặc không dùng Prefab cho phần đó.
  * Khi khôi phục (Go Back), các thuộc tính như tên node, vị trí, xoay, active sẽ **không được hoàn tác**, chỉ có thuộc tính của các component và node con mới được reset về giá trị Prefab gốc.

* **Sử dụng Prefab trong mã (script)**: Trong code, ta định nghĩa một thuộc tính kiểu `cc.Prefab` để tham chiếu đến Prefab asset. Để tạo mới node từ Prefab, dùng hàm `cc.instantiate(prefab)` và thêm vào scene. Ví dụ:

  ```js
  // Giả sử `this.starPrefab` là Prefab đã gán trong Inspector
  let newStar = cc.instantiate(this.starPrefab);
  this.node.addChild(newStar);
  newStar.setPosition( /* vị trí mong muốn */ );
  ```

  Phương thức `cc.instantiate()` sẽ **clone** Prefab và trả về một Node mới. Sau đó, ta có thể thiết lập thuộc tính, position… cho node này giống như bất kỳ node nào khác.

Tóm lại, Prefab trong Cocos Creator là công cụ mạnh giúp tái sử dụng đối tượng và đồng bộ dễ dàng giữa các scene. Nó giúp quản lý tài nguyên hiệu quả hơn so với copy node, đồng thời giảm thiểu sai sót và công sức khi cập nhật các đối tượng giống nhau.

**Nguồn tham khảo:** Thông tin được tổng hợp từ tài liệu chính thức Cocos Creator (Audio Compatibility, Asset Workflow – Prefab).

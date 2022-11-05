# Useful script - Contribute

## Cấu trúc thư mục:

- [scripts/](/scripts/) : Chứa tất cả các scripts chức năng của extension
- [popup/](/popup/) : Chứa code giao diện, logic hiển thị giao diện của trang popup (khi click extension)
- [pages/](/pages/) : Chứa các pages hỗ trợ *(Trang xem mã nguồn script, Trang cài đặt cho extension)*

## Các cách contribute

### Cách 1: Thêm scripts của bạn:

Nếu bạn có 1 `script hay`, hoặc `bookmarklets hay`, muốn `thêm vào extension` để mọi người cùng sử dụng. Hãy làm theo các bước sau:

1. Tạo 1 file javascript mới trong folder [scripts/](/scripts/), với `tên file mô tả ngắn gọn` chức năng script của bạn.

2. Sao chép nội dung file [empty_script.js](/empty_script.js) và dán vào file vừa tạo.

3. Ghi nội dung script:
    - `Icon`: icon hiển thị script, có thể là link ảnh, hoặc dùng fontawsome (ví dụ `<i class="fa-regular fa-id-card"></i>`)
    - `Name` và `Description`: tên và mô tả script *(cả tiếng anh `en` và tiếng việt `vi`)*
    - `Blacklist`: Danh sách url các trang web mà script không hỗ trợ.
    - `Whitelist`: Danh sách url các trang web và script hỗ trợ
        - *Ghi chú: Để mảng rỗng cả `Blacklist` và `Whitelist` nếu script của bạn **hỗ trợ mọi trang web**.*
    - Thêm code javascript của bạn vào `func`.

4. Import script của bạn trong file [/scripts/index.js](/scripts/index.js)

5. Ghi tên script của bạn trong biến `tabs` trong file [/popup/tabs.js](/popup/tabs.js)

6. Mở extension lên và dùng thử.


### Cách 2: Chỉnh sửa script có sẵn

Nếu bạn thấy `script` nào trong danh sách hiện có `bị lỗi` hoặc `có thể nâng cấp`. và bạn muốn sửa nó, chỉ cần mở đúng `file tương ứng` của chức năng đó trong folder [scripts/](/scripts/) để chỉnh sửa.

### Cách 3: Cập nhập logic chính

Nếu bạn có nhiều thời gian hơn để vọc code extension, và muốn `chỉnh sửa logic chính` của mình để `sửa lỗi` hoặc `nâng cấp`. Hãy

### Cách 4: Dịch

Bạn có thể giúp mình `dịch` các trang hướng dẫn này sang tiếng anh, hoặc bất kỳ ngôn ngữ mà bạn muốn.

## Liên hệ 

Gmail: 99.hoangtran@gmail.com

Facebook: [fb.com/99.hoangtran](https://fb.com/99.hoangtran)
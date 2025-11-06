# Contributing Guide | Hướng Dẫn Đóng Góp

[English](#english) | [Tiếng Việt](#tiếng-việt)

---

<a name="english"></a>

## English

Thank you for your interest in contributing to Useful Scripts! This guide will help you understand how to contribute to this Chrome extension.

### Table of Contents

- [Repository Structure](#repository-structure)
- [Ways to Contribute](#ways-to-contribute)
  - [1. Add Your Own Script](#1-add-your-own-script)
  - [2. Fix or Improve Existing Scripts](#2-fix-or-improve-existing-scripts)
  - [3. Improve Core Logic](#3-improve-core-logic)
  - [4. Translation](#4-translation)
- [Script Development Guide](#script-development-guide)
- [Testing Your Changes](#testing-your-changes)
- [Contact](#contact)

---

### Repository Structure

```
useful-script/
├── scripts/              # All script functionality
│   ├── @index.js        # Script registry (must update when adding new scripts)
│   ├── fb_*.js          # Facebook scripts
│   ├── youtube_*.js     # YouTube scripts
│   ├── helpers/         # Shared utility functions
│   └── ...
├── popup/               # Extension popup UI
│   ├── tabs.js          # Script categories (must update when adding new scripts)
│   ├── helpers/         # UI utilities
│   └── ...
├── pages/               # Supporting pages (script viewer, settings)
├── templates/           # Script templates
│   ├── simple.js        # Minimal template - start here!
│   └── full.js          # Complete template with all options
└── manifest.json        # Chrome extension configuration
```

---

### Ways to Contribute

#### 1. Add Your Own Script

Have a useful script or bookmarklet? Share it with the community!

**Step-by-step guide:**

1. **Create a new script file** in the `/scripts/` folder
   - Use a descriptive filename: `platform_feature.js`
   - Examples: `github_downloadRepo.js`, `twitter_saveMedia.js`

2. **Copy template content**
   - For simple scripts: Copy from `/templates/simple.js`
   - For advanced features: Refer to `/templates/full.js` for all options

   ```javascript
   export default {
     icon: '<i class="fa-solid fa-star"></i>',  // Font Awesome icon
     name: {
       en: "Your Script Name",
       vi: "Tên Script Của Bạn",
     },
     description: {
       en: "What does this script do?",
       vi: "Script này làm gì?",
     },

     // Only run on specific websites (optional)
     whiteList: ["https://*.example.com/*"],

     // Choose execution context (see templates/full.js for details)
     contentScript: {
       onClick: () => {
         // Your code here
         alert('Hello from Useful Scripts!');
       },
     },
   };
   ```

3. **Register your script in `/scripts/@index.js`**
   ```javascript
   // Add this line (maintain alphabetical order)
   export { default as yourScriptName } from "./yourScriptName.js";
   ```

4. **⚡ Regenerate metadata (IMPORTANT!)**
   ```bash
   npm run build:metadata
   ```

   **Why?** The popup uses a lazy loading system for fast performance:
   - Popup loads only lightweight metadata (not full scripts)
   - Scripts are loaded on-demand when clicked
   - This step updates `scripts/@metadata.js` so your new script appears in popup
   - **Without this, your script won't show up!**

5. **Add to category in `/popup/tabs.js`**
   ```javascript
   const tabs = [
     {
       ...CATEGORY.automation,  // Choose appropriate category
       scripts: [
         // Add your script here
         s.yourScriptName,
       ],
     },
   ];
   ```

6. **Test your script**
   - Load the extension in Chrome (`chrome://extensions/`)
   - Click "Load unpacked" and select the project folder
   - Open the popup and find your script
   - Test it on the target website

**Pro Tips:**
- Read `/templates/full.js` to understand all available options
- Look at existing scripts (e.g., `fb_toggleLight.js`) for examples
- Use `whiteList` to restrict scripts to specific websites
- Scripts can run automatically (autorun) or on-click
- **Always run `npm run build:metadata` after changes!** This ensures popup sees your updates

---

#### 2. Fix or Improve Existing Scripts

Found a bug or have an improvement idea?

**Steps:**
1. Find the script file in `/scripts/` folder
   - Naming pattern: `platform_feature.js`
   - Example: `fb_videoDownloader.js` for Facebook video downloader

2. Make your changes
   - Fix bugs
   - Add new features
   - Improve performance
   - Update for website changes

3. Test thoroughly
   - Ensure the script still works
   - Check for console errors
   - Test on different scenarios

4. Update `changeLogs` if needed
   ```javascript
   changeLogs: {
     "2024-11-06": "Fixed video download for new Facebook layout",
   },
   ```

---

#### 3. Improve Core Logic

Have more time and want to improve the extension itself?

**Areas for contribution:**
- **Popup UI**: Improve the extension popup interface (`/popup/`)
- **Performance**: Optimize script loading and execution
- **New Features**: Add settings, themes, or new capabilities
- **Code Quality**: Refactor, add comments, improve structure

**Getting started:**
- Read `CLAUDE.md` for architecture overview
- Explore the codebase and identify improvement areas
- Contact us if you need guidance

---

#### 4. Translation

Help make Useful Scripts accessible to more people!

**What to translate:**
- Script names and descriptions
- UI text in popup
- Documentation (README, guides)

**Supported languages:**
- Vietnamese (vi)
- English (en)
- Want to add more? Contact us!

---

### Script Development Guide

#### Understanding Execution Contexts

Scripts can run in different contexts with different capabilities:

| Context | Chrome APIs | Page Access | Use Case |
|---------|-------------|-------------|----------|
| `popupScript` | ✅ Full | ❌ No | User interactions from popup |
| `contentScript` | ⚠️ Limited | ✅ DOM only | Modify page content |
| `pageScript` | ❌ No | ✅ Full | Access page variables |
| `backgroundScript` | ✅ Full | ❌ No | Background tasks, events |

**Quick Reference:**
- **Need to modify page HTML?** → Use `contentScript`
- **Need to access page JavaScript variables?** → Use `pageScript`
- **Need to download files or use Chrome APIs?** → Use `popupScript` or `backgroundScript`
- **Need to listen for network requests?** → Use `backgroundScript`

#### Common Script Patterns

**Pattern 1: Simple DOM manipulation**
```javascript
contentScript: {
  onClick: () => {
    document.querySelectorAll('.ads').forEach(el => el.remove());
  },
}
```

**Pattern 2: Download content**
```javascript
popupScript: {
  onClick: async () => {
    const url = await getVideoUrl();  // Your logic
    chrome.downloads.download({ url, filename: 'video.mp4' });
  },
}
```

**Pattern 3: Auto-run on page load**
```javascript
contentScript: {
  onDocumentIdle: () => {
    // Runs automatically when enabled
    console.log('Script running on page load!');
  },
}
```

**Pattern 4: Wait for elements**
```javascript
import { UfsGlobal } from "./content-scripts/ufs_global.js";

contentScript: {
  onClick: () => {
    UfsGlobal.DOM.onElementsAdded('.video-player', (element) => {
      // Do something when element appears
    });
  },
}
```

---

### Testing Your Changes

1. **Load extension locally:**
   - Open Chrome: `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `useful-script` folder

2. **Make changes:**
   - Edit your script files
   - Save changes

3. **Reload extension:**
   - Go to `chrome://extensions/`
   - Click reload button on Useful Scripts extension
   - Or press `Ctrl+R` (Windows/Linux) / `Cmd+R` (Mac)

4. **Test:**
   - Open target website
   - Click extension icon
   - Run your script
   - Check browser console for errors (F12)

5. **Debug:**
   - Right-click extension popup → Inspect
   - Check console for popup errors
   - Use `console.log()` for debugging

---

### Contact

- **Email:** <99.hoangtran@gmail.com>
- **Facebook:** [fb.com/99.hoangtran](https://fb.com/99.hoangtran)
- **Facebook Group:** [Useful Scripts Community](https://www.facebook.com/groups/1154059318582088)
- **Issues:** Feel free to ask questions or report bugs

---

<a name="tiếng-việt"></a>

## Tiếng Việt

Cảm ơn bạn đã quan tâm đến việc đóng góp cho Useful Scripts! Hướng dẫn này sẽ giúp bạn hiểu cách đóng góp vào extension Chrome này.

### Mục Lục

- [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
- [Các Cách Đóng Góp](#các-cách-đóng-góp)
  - [1. Thêm Script Của Bạn](#1-thêm-script-của-bạn)
  - [2. Sửa Hoặc Nâng Cấp Script Có Sẵn](#2-sửa-hoặc-nâng-cấp-script-có-sẵn)
  - [3. Cải Thiện Logic Chính](#3-cải-thiện-logic-chính)
  - [4. Dịch Thuật](#4-dịch-thuật)
- [Hướng Dẫn Phát Triển Script](#hướng-dẫn-phát-triển-script)
- [Kiểm Tra Thay Đổi](#kiểm-tra-thay-đổi)
- [Liên Hệ](#liên-hệ)

---

### Cấu Trúc Thư Mục

```
useful-script/
├── scripts/              # Chứa tất cả các scripts
│   ├── @index.js        # Danh sách script (phải cập nhật khi thêm script mới)
│   ├── fb_*.js          # Các script Facebook
│   ├── youtube_*.js     # Các script YouTube
│   ├── helpers/         # Hàm tiện ích dùng chung
│   └── ...
├── popup/               # Giao diện popup của extension
│   ├── tabs.js          # Phân loại script (phải cập nhật khi thêm script mới)
│   ├── helpers/         # Tiện ích UI
│   └── ...
├── pages/               # Các trang hỗ trợ (xem code, cài đặt)
├── templates/           # Mẫu script
│   ├── simple.js        # Mẫu đơn giản - bắt đầu từ đây!
│   └── full.js          # Mẫu đầy đủ với tất cả tùy chọn
└── manifest.json        # Cấu hình Chrome extension
```

---

### Các Cách Đóng Góp

#### 1. Thêm Script Của Bạn

Bạn có một script hay hoặc bookmarklet hữu ích? Hãy chia sẻ với cộng đồng!

**Hướng dẫn từng bước:**

1. **Tạo file script mới** trong thư mục `/scripts/`
   - Đặt tên mô tả: `nền_tảng_chức_năng.js`
   - Ví dụ: `github_taiRepo.js`, `twitter_luuMedia.js`

2. **Sao chép nội dung template**
   - Script đơn giản: Copy từ `/templates/simple.js`
   - Script nâng cao: Xem `/templates/full.js` để biết thêm tùy chọn

   ```javascript
   export default {
     icon: '<i class="fa-solid fa-star"></i>',  // Icon Font Awesome
     name: {
       en: "Your Script Name",
       vi: "Tên Script Của Bạn",
     },
     description: {
       en: "What does this script do?",
       vi: "Script này làm gì?",
     },

     // Chỉ chạy trên các website cụ thể (tùy chọn)
     whiteList: ["https://*.example.com/*"],

     // Chọn ngữ cảnh thực thi (xem templates/full.js)
     contentScript: {
       onClick: () => {
         // Code của bạn ở đây
         alert('Xin chào từ Useful Scripts!');
       },
     },
   };
   ```

3. **Đăng ký script trong `/scripts/@index.js`**
   ```javascript
   // Thêm dòng này (giữ thứ tự alphabetical)
   export { default as tenScript } from "./tenScript.js";
   ```

4. **⚡ Regenerate metadata (QUAN TRỌNG!)**
   ```bash
   npm run build:metadata
   ```

   **Tại sao?** Popup dùng lazy loading để tăng tốc:
   - Popup chỉ load metadata nhẹ (không load toàn bộ scripts)
   - Scripts được load on-demand khi click
   - Bước này update `scripts/@metadata.js` để script mới xuất hiện
   - **Không chạy lệnh này script sẽ không hiện!**

5. **Thêm vào danh mục trong `/popup/tabs.js`**
   ```javascript
   const tabs = [
     {
       ...CATEGORY.automation,  // Chọn danh mục phù hợp
       scripts: [
         // Thêm script của bạn vào đây
         s.tenScript,
       ],
     },
   ];
   ```

6. **Kiểm tra script**
   - Mở extension trong Chrome (`chrome://extensions/`)
   - Click "Load unpacked" và chọn thư mục dự án
   - Mở popup và tìm script của bạn
   - Test trên website đích

**Mẹo:**
- Đọc `/templates/full.js` để hiểu tất cả tùy chọn
- Xem các script có sẵn (VD: `fb_toggleLight.js`) để tham khảo
- Dùng `whiteList` để giới hạn script chỉ chạy trên website cụ thể
- Script có thể tự chạy (autorun) hoặc chạy khi click
- **Luôn chạy `npm run build:metadata` sau khi thay đổi!** Đảm bảo popup nhận được updates

---

#### 2. Sửa Hoặc Nâng Cấp Script Có Sẵn

Tìm thấy lỗi hoặc có ý tưởng cải tiến?

**Các bước:**
1. Tìm file script trong thư mục `/scripts/`
   - Quy tắc đặt tên: `nền_tảng_chức_năng.js`
   - Ví dụ: `fb_videoDownloader.js` cho tính năng tải video Facebook

2. Thực hiện thay đổi
   - Sửa lỗi
   - Thêm tính năng mới
   - Cải thiện hiệu suất
   - Cập nhật cho thay đổi của website

3. Kiểm tra kỹ
   - Đảm bảo script vẫn hoạt động
   - Kiểm tra lỗi trong console
   - Test nhiều trường hợp khác nhau

4. Cập nhật `changeLogs` nếu cần
   ```javascript
   changeLogs: {
     "2024-11-06": "Sửa lỗi tải video với giao diện Facebook mới",
   },
   ```

---

#### 3. Cải Thiện Logic Chính

Có nhiều thời gian và muốn cải thiện extension?

**Lĩnh vực đóng góp:**
- **Giao diện Popup**: Cải thiện UI popup (`/popup/`)
- **Hiệu suất**: Tối ưu tải và chạy script
- **Tính năng mới**: Thêm cài đặt, theme, hoặc khả năng mới
- **Chất lượng code**: Refactor, thêm comment, cải thiện cấu trúc

**Bắt đầu:**
- Đọc `CLAUDE.md` để hiểu kiến trúc tổng quan
- Khám phá codebase và xác định điểm cải thiện
- Liên hệ nếu cần hướng dẫn

---

#### 4. Dịch Thuật

Giúp Useful Scripts tiếp cận nhiều người hơn!

**Nội dung cần dịch:**
- Tên và mô tả script
- Văn bản UI trong popup
- Tài liệu (README, hướng dẫn)

**Ngôn ngữ hỗ trợ:**
- Tiếng Việt (vi)
- Tiếng Anh (en)
- Muốn thêm ngôn ngữ khác? Liên hệ!

---

### Hướng Dẫn Phát Triển Script

#### Hiểu Về Ngữ Cảnh Thực Thi

Script có thể chạy trong các ngữ cảnh khác nhau với khả năng khác nhau:

| Ngữ cảnh | Chrome APIs | Truy cập trang | Dùng khi |
|----------|-------------|----------------|----------|
| `popupScript` | ✅ Đầy đủ | ❌ Không | Tương tác từ popup |
| `contentScript` | ⚠️ Hạn chế | ✅ Chỉ DOM | Sửa nội dung trang |
| `pageScript` | ❌ Không | ✅ Đầy đủ | Truy cập biến trang |
| `backgroundScript` | ✅ Đầy đủ | ❌ Không | Task nền, sự kiện |

**Tham khảo nhanh:**
- **Cần sửa HTML trang?** → Dùng `contentScript`
- **Cần truy cập biến JavaScript trang?** → Dùng `pageScript`
- **Cần tải file hoặc dùng Chrome APIs?** → Dùng `popupScript` hoặc `backgroundScript`
- **Cần lắng nghe network request?** → Dùng `backgroundScript`

#### Mẫu Script Phổ Biến

**Mẫu 1: Thao tác DOM đơn giản**
```javascript
contentScript: {
  onClick: () => {
    document.querySelectorAll('.ads').forEach(el => el.remove());
  },
}
```

**Mẫu 2: Tải xuống nội dung**
```javascript
popupScript: {
  onClick: async () => {
    const url = await getVideoUrl();  // Logic của bạn
    chrome.downloads.download({ url, filename: 'video.mp4' });
  },
}
```

**Mẫu 3: Tự động chạy khi tải trang**
```javascript
contentScript: {
  onDocumentIdle: () => {
    // Tự động chạy khi bật autorun
    console.log('Script đang chạy tự động!');
  },
}
```

**Mẫu 4: Đợi element xuất hiện**
```javascript
import { UfsGlobal } from "./content-scripts/ufs_global.js";

contentScript: {
  onClick: () => {
    UfsGlobal.DOM.onElementsAdded('.video-player', (element) => {
      // Làm gì đó khi element xuất hiện
    });
  },
}
```

---

### Kiểm Tra Thay Đổi

1. **Tải extension local:**
   - Mở Chrome: `chrome://extensions/`
   - Bật "Developer mode"
   - Click "Load unpacked"
   - Chọn thư mục `useful-script`

2. **Thực hiện thay đổi:**
   - Chỉnh sửa file script
   - Lưu thay đổi

3. **Reload extension:**
   - Vào `chrome://extensions/`
   - Click nút reload trên extension Useful Scripts
   - Hoặc nhấn `Ctrl+R` (Windows/Linux) / `Cmd+R` (Mac)

4. **Kiểm tra:**
   - Mở website đích
   - Click icon extension
   - Chạy script của bạn
   - Kiểm tra console lỗi (F12)

5. **Debug:**
   - Click phải popup extension → Inspect
   - Kiểm tra console lỗi popup
   - Dùng `console.log()` để debug

---

### Liên Hệ

- **Email:** <99.hoangtran@gmail.com>
- **Facebook:** [fb.com/99.hoangtran](https://fb.com/99.hoangtran)
- **Facebook Group:** [Cộng đồng Useful Scripts](https://www.facebook.com/groups/1154059318582088)
- **Issues:** Thoải mái đặt câu hỏi hoặc báo lỗi

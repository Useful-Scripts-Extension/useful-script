# Quick Start: Popup Optimization

Hướng dẫn nhanh để tối ưu popup loading trong 30 phút.

## Tổng Quan

**Vấn đề:** Popup load 176+ scripts → Chậm (500-1000ms)
**Giải pháp:** Chỉ load metadata → Nhanh (50-100ms) → **10-20x faster!** 🚀

## Bước 1: Tạo Metadata Registry

### Cách 1: Tự Động (Khuyến Nghị)

1. Copy file `examples/metadata-extractor.js` vào project
2. Thêm vào `package.json`:

```json
{
  "type": "module",
  "scripts": {
    "build:metadata": "node examples/metadata-extractor.js"
  }
}
```

3. Chạy:

```bash
npm run build:metadata
```

→ Tạo file `scripts/@metadata.js` chứa metadata của tất cả scripts

### Cách 2: Thủ Công (Nhanh hơn nhưng phải maintain)

Tạo file `scripts/@metadata.js`:

```javascript
export default {
  fb_toggleLight: {
    id: 'fb_toggleLight',
    icon: '<i class="fa-solid fa-lightbulb"></i>',
    name: { en: "Turn off light", vi: "Tắt đèn" },
    description: { en: "Hide bars", vi: "Ẩn thanh" },
    whiteList: ["https://*.facebook.com/*"],
    contexts: { content: true },
    canAutoRun: true
  },

  youtube_downloadVideo: {
    id: 'youtube_downloadVideo',
    // ... thêm metadata
  },

  // Thêm tất cả scripts...
};
```

## Bước 2: Update popup/tabs.js

**TRƯỚC:**

```javascript
import s from "../scripts/@allScripts.js";  // ❌ Load tất cả
```

**SAU:**

```javascript
import metadata from "../scripts/@metadata.js";  // ✅ Chỉ load metadata

// Tạo proxy objects
const s = {};
Object.entries(metadata).forEach(([id, meta]) => {
  s[id] = meta;
});

// Dùng bình thường, không cần thay đổi code khác!
const tabs = [
  {
    ...CATEGORY.facebook,
    scripts: [s.fb_toggleLight, s.fb_download],
  },
];
```

## Bước 3: Update popup/index.js

Thêm lazy loading function:

```javascript
// Cache loaded scripts
const scriptCache = new Map();

// Lazy load full script when needed
async function loadFullScript(scriptId) {
  if (scriptCache.has(scriptId)) {
    return scriptCache.get(scriptId);
  }

  const module = await import(`../scripts/${scriptId}.js`);
  const fullScript = module.default;
  fullScript.id = scriptId;

  scriptCache.set(scriptId, fullScript);
  return fullScript;
}
```

## Bước 4: Update Script Execution

Tìm hàm xử lý click script (thường trong `popup/index.js`):

**TRƯỚC:**

```javascript
function onScriptClick(script) {
  if (script.popupScript?.onClick) {
    script.popupScript.onClick();
  }
}
```

**SAU:**

```javascript
async function onScriptClick(scriptMeta) {
  // Load full script
  const script = await loadFullScript(scriptMeta.id);

  // Execute
  if (script.popupScript?.onClick) {
    await script.popupScript.onClick();
  }
  // ... content/page script execution
}
```

## Bước 5: Test

1. Mở extension popup → **Nhanh hơn rất nhiều!**
2. Click script → Vẫn hoạt động bình thường
3. Click lần 2 → Instant (dùng cache)

## Kết Quả Mong Đợi

```
TRƯỚC:
├── Popup mở: 500-1000ms ⏱️
├── Bundle: 2-5MB 📦
└── Memory: ~20MB 💾

SAU:
├── Popup mở: 50-100ms ⚡ (10-20x faster!)
├── Bundle: 50-200KB 📦 (95% nhỏ hơn!)
└── Memory: ~2MB 💾 (90% ít hơn!)
```

## Development Workflow Mới

Khi thêm script mới:

1. Tạo `scripts/yourScript.js` như bình thường
2. Thêm vào `scripts/@index.js`
3. **Chạy `npm run build:metadata`** ← BƯỚC MỚI
4. Thêm vào `popup/tabs.js`
5. Test

## Troubleshooting

### Lỗi: "Cannot find module"

→ Đảm bảo đã chạy `npm run build:metadata`

### Script không chạy

→ Kiểm tra console, có thể script chưa được cache đúng

### Popup vẫn chậm

→ Kiểm tra có đang import `@allScripts.js` ở đâu không

## Optimization Level 2 (Tùy Chọn)

Sau khi hoàn thành basic optimization, có thể tối ưu thêm:

### Preload Popular Scripts

```javascript
// Preload scripts thường dùng khi popup mở
async function preloadPopular() {
  const popular = ['fb_toggleLight', 'youtube_download'];
  await Promise.all(popular.map(id => loadFullScript(id)));
}

// Call sau khi popup load
setTimeout(preloadPopular, 100);
```

### Lazy Load Background Scripts

```javascript
// Chỉ load scripts cần auto-run cho URL hiện tại
async function loadAutoRunScripts(url) {
  const needed = Object.entries(metadata)
    .filter(([id, meta]) =>
      meta.canAutoRun &&
      checkWhiteList(meta.whiteList, url)
    )
    .map(([id]) => id);

  return Promise.all(
    needed.map(id => import(`../scripts/${id}.js`))
  );
}
```

## Tài Liệu Tham Khảo

- Chi tiết: `OPTIMIZATION_PLAN.md`
- Code examples: `examples/lazy-loading-example.js`
- Metadata extractor: `examples/metadata-extractor.js`

## Checklist Hoàn Thành

- [ ] Tạo metadata registry (auto hoặc manual)
- [ ] Update `popup/tabs.js` dùng metadata
- [ ] Thêm `loadFullScript()` vào `popup/index.js`
- [ ] Update script click handler dùng lazy load
- [ ] Test popup performance
- [ ] Update development workflow
- [ ] (Optional) Thêm preloading
- [ ] (Optional) Optimize background scripts

---

**Thời gian:** ~30 phút - 2 giờ (tùy cách chọn)
**Kết quả:** 10-20x faster popup! 🚀🎉

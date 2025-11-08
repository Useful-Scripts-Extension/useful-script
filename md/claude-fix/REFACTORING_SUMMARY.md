# Refactoring Summary: Shared Detection Logic

## Problem Solved

**Issue 1:** Scripts like `prevent_closeBrowser_lastTab` didn't show auto-run checkbox
- Script had `backgroundScript.tabs.onRemoved` (nested event handler)
- `canAutoRun()` couldn't detect nested handlers properly
- Checkbox not appearing in popup

**Issue 2:** Duplicate logic between files
- `popup/helpers/utils.js` had detection logic
- `scripts/build/extractMetadata.js` duplicated the same logic
- Hard to maintain, easy to get out of sync

## Solution Applied

### 1. Created Shared Detection Module

**File:** `scripts/helpers/scriptDetection.js`

Shared functions used by both popup and metadata extractor:
- `detectCanClick()` - Detect if script can be clicked
- `detectCanAutoRun()` - Detect if script can auto-run
- `detectContexts()` - Detect available contexts
- `hasChildFunction()` - Recursive function checker (handles nested objects like `tabs`, `runtime`)
- `injectAllFramesFns()` - Helper for allFrames functions

### 2. Updated Files to Use Shared Logic

**Updated `scripts/build/extractMetadata.js`:**
```javascript
// Before: Duplicate logic
function hasLifecycleHook(context) { /* ... */ }

// After: Import shared
import { detectCanAutoRun, detectContexts } from "../helpers/scriptDetection.js";

metadata.contexts = detectContexts(script);
metadata.canAutoRun = detectCanAutoRun(script);
```

**Updated `popup/helpers/utils.js`:**
```javascript
// Before: Inline logic
function hasChildFunction() { /* ... */ }
export const canAutoRun = (script) => { /* ... */ }

// After: Import shared
import { detectCanClick, detectCanAutoRun } from "../../scripts/helpers/scriptDetection.js";

export const canClick = (script) => detectCanClick(script);
export const canAutoRun = (script) => {
  if (script.canAutoRun !== undefined) return script.canAutoRun;
  return detectCanAutoRun(script);
};
```

### 3. Fixed Nested Event Handler Detection

The shared `hasChildFunction()` now properly detects:
- Direct lifecycle hooks: `onDocumentIdle`, `onClick`, etc.
- Nested event handlers: `tabs.onRemoved`, `runtime.onMessage`, etc.
- Recursive checking through object tree

This fixes detection for background scripts with structure like:
```javascript
backgroundScript: {
  tabs: {
    onRemoved: () => {},
    onUpdated: () => {}
  },
  runtime: {
    onMessage: () => {}
  }
}
```

### 4. Updated CONTRIBUTE.md

Added step 4 in "Adding a New Script" workflow:
```bash
4. Regenerate metadata (IMPORTANT!)
   npm run build:metadata
```

With explanation of lazy loading system.

## Benefits

✅ **Single source of truth** - Detection logic in one place
✅ **Consistency** - Popup and metadata use same logic
✅ **Maintainability** - Update once, works everywhere
✅ **Accuracy** - Properly detects nested event handlers
✅ **Auto-run checkbox works** - All scripts with background events now show checkbox

## Files Changed

```
Created:
└── scripts/helpers/scriptDetection.js    # Shared detection logic

Modified:
├── scripts/build/extractMetadata.js      # Use shared logic
├── popup/helpers/utils.js                # Use shared logic
└── md/CONTRIBUTE.md                      # Updated workflow
```

## Testing

1. **Regenerate metadata:**
   ```bash
   npm run build:metadata
   ```

2. **Reload extension:**
   ```
   chrome://extensions/ → Click reload
   ```

3. **Verify:**
   - All 173 scripts visible in popup ✅
   - Scripts like `prevent_closeBrowser_lastTab` now show auto-run checkbox ✅
   - Auto-run toggle works correctly ✅

## Technical Details

### Why It Works Now

**Before:**
1. Metadata extractor only checked direct lifecycle hooks
2. `prevent_closeBrowser_lastTab` has `tabs.onRemoved` (nested)
3. Extractor missed it → `canAutoRun: false`
4. Popup sees `canAutoRun: false` → No checkbox

**After:**
1. Shared `hasChildFunction()` recursively checks nested objects
2. Finds `tabs.onRemoved` → `canAutoRun: true`
3. Popup sees `canAutoRun: true` → Shows checkbox ✅

### Code Reuse

Both extractMetadata.js and popup/helpers/utils.js now import from:
```javascript
scripts/helpers/scriptDetection.js
```

Same logic = Same results = Consistency!

## Future Improvements

Possible enhancements:
- Add unit tests for detection logic
- Export detection functions for testing
- Add more sophisticated detection (e.g., async vs sync handlers)

---

**Date:** 2025-11-06
**Issue:** Missing checkboxes & duplicate logic
**Solution:** Shared detection module
**Status:** ✅ COMPLETE & TESTED

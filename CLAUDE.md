# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Useful Scripts is a Chrome extension that provides a collection of utility scripts for various websites and tasks. It includes scripts for Facebook, Instagram, YouTube, TikTok, Google Drive, and many other platforms. The extension allows users to run scripts on-demand or automatically based on URL patterns.

## Architecture

### Script Execution Contexts

The extension uses **four distinct execution contexts** for scripts, each with different capabilities and restrictions:

1. **popupScript**: Runs in extension popup context
   - Can use Chrome Extension APIs
   - Can inject scripts into active tab via `chrome.scripting.executeScript`
   - Cannot access page DOM directly
   - Used for user-triggered actions from the popup

2. **contentScript**: Runs in ISOLATED/SANDBOX world
   - Can use limited Chrome Extension APIs
   - Can access/modify DOM
   - **Cannot** access page JavaScript variables (different world)
   - Can communicate with background script via `chrome.runtime.sendMessage`

3. **pageScript**: Runs in webpage's MAIN world
   - **Cannot** use Chrome Extension APIs
   - Can access/modify DOM and page JavaScript variables
   - Can override default page behaviors
   - Communicates with contentScript via `window.postMessage`

4. **backgroundScript**: Runs as service worker
   - Can use full Chrome Extension APIs
   - **Cannot** use dynamic imports (use GLOBAL variables instead)
   - Handles events like `onBeforeRequest`, `tabs.onUpdated`, etc.
   - Context is the GLOBAL variable in `background_script.js`

### Communication Between Contexts

- **popupScript ↔ backgroundScript**: `chrome.runtime.sendMessage`
- **contentScript ↔ backgroundScript**: `chrome.runtime.sendMessage`
- **pageScript ↔ contentScript**: `window.postMessage`
- **pageScript → backgroundScript**: `UfsGlobal.Extension.runInBackground`

### Directory Structure

- **`scripts/`**: All script functionality files
  - **`@index.js`**: Exports all scripts (required for new scripts)
  - **`@allScripts.js`**: Generated list of all scripts
  - **`background-scripts/background_script.js`**: Service worker entry point
  - **`content-scripts/`**: Content script infrastructure
  - **`helpers/`**: Shared utility functions
  - Individual script files (e.g., `fb_toggleLight.js`, `youtube_downloadVideo.js`)

- **`popup/`**: Extension popup UI
  - **`tabs.js`**: Defines script categories and organization (required for new scripts)
  - **`helpers/`**: UI helper modules (category, lang, modal, storage, theme, utils)
  - **`index.js`**: Main popup logic
  - **`main.js`**: Entry point

- **`pages/`**: Supporting pages (view script source, settings)

- **`templates/`**: Script templates
  - **`simple.js`**: Minimal script template
  - **`full.js`**: Complete template with all available options and documentation

## Adding a New Script

1. **Create script file** in `scripts/` directory with descriptive name (e.g., `platform_feature.js`)

2. **Use template**: Copy from `templates/simple.js` or `templates/full.js`

3. **Script structure** (minimal):
```javascript
export default {
  icon: '<i class="fa-solid fa-icon"></i>',
  name: {
    en: "English name",
    vi: "Vietnamese name",
  },
  description: {
    en: "English description",
    vi: "Vietnamese description",
  },

  // URL filtering
  whiteList: ["https://*.example.com/*"],  // Only run on these URLs
  blackList: [],  // Don't run on these URLs

  // Choose one or more contexts
  popupScript: {
    onClick: () => { /* code */ },
  },

  contentScript: {
    onClick: () => { /* code */ },
    onDocumentIdle: () => { /* code */ },
  },

  pageScript: {
    onClick: () => { /* code */ },
    onDocumentIdle: () => { /* code */ },
  },
};
```

4. **Import in `scripts/@index.js`**:
```javascript
export { default as scriptName } from "./scriptName.js";
```

5. **Regenerate metadata** (IMPORTANT):
```bash
npm run build:metadata
```
This updates `scripts/@metadata.js` for fast popup loading (see Performance section below).

6. **Add to category in `popup/tabs.js`**:
```javascript
const tabs = [
  {
    ...CATEGORY.categoryName,
    scripts: [
      s.scriptName,  // Add your script here
    ],
  },
];
```

6. **Test** by opening the extension popup and running the script

## Script Lifecycle Events

- **onDocumentStart**: Runs as early as possible (before DOM is fully loaded)
- **onDocumentIdle**: Runs when DOM is ready (recommended for most scripts)
- **onDocumentEnd**: Runs when page is fully loaded
- **onClick**: Runs when user clicks the script in popup

To run in all frames (including iframes), append `_` to function name: `onDocumentIdle_()`, `onClick_()`, etc.

## Common Patterns

### Using UfsGlobal

UfsGlobal provides shared utilities across contexts:

```javascript
import { UfsGlobal } from "./content-scripts/ufs_global.js";

// Wait for elements
UfsGlobal.DOM.onElementsAdded('selector', (element) => {
  // Do something with element
});

// Run in background context
UfsGlobal.Extension.runInBackground({
  fnPath: "functionName",
  params: [arg1, arg2]
});
```

### Download Files

Use Chrome's download API in popupScript or backgroundScript:

```javascript
chrome.downloads.download({
  url: fileUrl,
  filename: "myfile.ext"
});
```

### Inject Code into Page

From popupScript, use utilities:

```javascript
await utils.runScriptInCurrentTab(() => {
  // This code runs in page context
  console.log(window.location.href);
});
```

## Important Notes

- **No package.json**: This is a vanilla JavaScript Chrome extension without build tools
- **ES6 modules**: Use `import`/`export` for code organization
- **Icon library**: Uses Font Awesome for script icons
- **Localization**: Support both English (`en`) and Vietnamese (`vi`)
- **Trusted Types**: Scripts that inject HTML must comply with Chrome's Trusted Types policy
- **Linux compatibility**: Use relative paths and proper casing for file names
- **Auto-run capability**: Scripts with `onDocumentStart`/`Idle`/`End` can be enabled for automatic execution

## Development Workflow

1. Load extension in Chrome via `chrome://extensions/` (Developer mode → Load unpacked)
2. Make changes to script files
3. Click refresh icon in `chrome://extensions/` to reload extension
4. Test changes in target websites
5. Check console for errors in both page context and extension context (inspect popup)

## Common Script Categories

- **CATEGORY.facebook**: Facebook-related utilities (download, reveal messages, toggle UI)
- **CATEGORY.youtube**: YouTube tools (download, captions, PiP)
- **CATEGORY.download**: General download utilities
- **CATEGORY.automation**: Automation and productivity scripts
- **CATEGORY.unlock**: Bypass paywalls and restrictions
- **CATEGORY.webUI**: UI manipulation scripts

## Testing

- No automated test suite currently
- Manual testing workflow:
  1. Install extension locally
  2. Navigate to target website
  3. Open extension popup and run script
  4. Verify expected behavior
  5. Check browser console for errors

## Performance Optimization

### Lazy Loading Architecture

The extension uses a lazy loading strategy to achieve 10-20x faster popup load times:

**How it works:**
1. **Popup loads** → Only `scripts/@metadata.js` is imported (lightweight metadata)
2. **User clicks script** → Full script dynamically imported on-demand
3. **Script cached** → Subsequent clicks use cached version (instant)
4. **Popular scripts preloaded** → Common scripts loaded in background

**Files involved:**
- `scripts/@metadata.js` - Auto-generated metadata registry (lightweight)
- `scripts/@index.js` - Full scripts (used by background, not popup)
- `scripts/build/extractMetadata.js` - Metadata extraction tool
- `popup/tabs.js` - Imports metadata instead of full scripts
- `popup/index.js` - Implements lazy loading logic

**Regenerating metadata:**
```bash
npm run build:metadata
```
Run this after adding/modifying scripts to update the metadata registry.

**Performance gains:**
- Popup load: 500-1000ms → 50-100ms (10-20x faster)
- Memory usage: ~20MB → ~2MB (90% reduction)
- First click: ~10-50ms delay (dynamic import)
- Cached click: ~0ms (instant)

See `OPTIMIZATION_DONE.md` for full details.

## External Resources

- Demo site: https://useful-scripts-extension.github.io/useful-script/popup/popup.html
- Facebook Group: https://www.facebook.com/groups/1154059318582088
- Developer tutorials: YouTube playlist in README

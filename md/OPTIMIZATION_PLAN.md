# Popup Loading Optimization Plan

## Problem
The extension popup loads all 176+ scripts synchronously, causing slow initial load time. Each script contains metadata (name, icon, description) AND implementation code (onClick functions, etc.). The popup only needs metadata for display.

## Solution: Metadata Registry + Lazy Loading

### Architecture

**Current (Slow):**
```
Popup Opens → Load @allScripts.js → Import ALL 176 scripts → Show UI
                                    (includes all functions)
```

**Optimized (Fast):**
```
Popup Opens → Load @metadata.js → Show UI
User Clicks → Dynamic import() → Load only that script
```

### Implementation Steps

#### Step 1: Create Metadata Extractor Script

Create `scripts/build/extractMetadata.js`:

```javascript
import * as allScripts from "../@index.js";
import fs from "fs";

// Fields to extract (lightweight, for display only)
const METADATA_FIELDS = [
  'id',
  'icon',
  'name',
  'description',
  'badges',
  'infoLink',
  'changeLogs',
  'whiteList',
  'blackList',
  'buttons'
];

function extractMetadata(script) {
  const metadata = {};
  METADATA_FIELDS.forEach(field => {
    if (script[field] !== undefined) {
      metadata[field] = script[field];
    }
  });

  // Check which contexts are available (for UI display)
  metadata.contexts = {
    hasPopup: !!script.popupScript,
    hasContent: !!script.contentScript,
    hasPage: !!script.pageScript,
    hasBackground: !!script.backgroundScript,
  };

  return metadata;
}

// Extract metadata from all scripts
const metadata = {};
Object.entries(allScripts).forEach(([id, script]) => {
  metadata[id] = extractMetadata({ ...script, id });
});

// Write to file
const output = `// Auto-generated metadata registry
// DO NOT EDIT - Run 'npm run build:metadata' to regenerate

export default ${JSON.stringify(metadata, null, 2)};
`;

fs.writeFileSync('./scripts/@metadata.js', output);
console.log(`✅ Generated metadata for ${Object.keys(metadata).length} scripts`);
```

#### Step 2: Update package.json

```json
{
  "scripts": {
    "build:metadata": "node scripts/build/extractMetadata.js"
  },
  "type": "module"
}
```

Run after adding/updating scripts:
```bash
npm run build:metadata
```

#### Step 3: Update Popup to Use Metadata

**Before (popup/tabs.js):**
```javascript
import s from "../scripts/@allScripts.js";  // Loads ALL scripts!

const tabs = [
  {
    ...CATEGORY.facebook,
    scripts: [
      s.fb_toggleLight,    // Full script object
      s.fb_download,
    ],
  },
];
```

**After (popup/tabs.js):**
```javascript
import metadata from "../scripts/@metadata.js";  // Only metadata!

// Create lightweight script references
const s = {};
Object.keys(metadata).forEach(id => {
  s[id] = { ...metadata[id], id };
});

const tabs = [
  {
    ...CATEGORY.facebook,
    scripts: [
      s.fb_toggleLight,    // Metadata only
      s.fb_download,
    ],
  },
];
```

#### Step 4: Lazy Load on Click

**Update popup/index.js:**

```javascript
// Add script cache
const scriptCache = new Map();

async function loadFullScript(scriptId) {
  // Check cache first
  if (scriptCache.has(scriptId)) {
    return scriptCache.get(scriptId);
  }

  // Dynamic import
  const module = await import(`../scripts/${scriptId}.js`);
  const fullScript = module.default;

  // Cache it
  scriptCache.set(scriptId, fullScript);

  return fullScript;
}

async function executeScript(scriptId) {
  // Load full script on-demand
  const script = await loadFullScript(scriptId);

  // Execute based on context
  if (script.popupScript?.onClick) {
    await script.popupScript.onClick();
  }
  // ... rest of execution logic
}
```

#### Step 5: Alternative - Manual Metadata Definition

If you don't want build scripts, manually define metadata:

**scripts/@metadata.js (Manual):**
```javascript
export default {
  fb_toggleLight: {
    id: 'fb_toggleLight',
    icon: '<i class="fa-solid fa-lightbulb"></i>',
    name: {
      en: "Turn off light facebook newfeed",
      vi: "Tắt đèn newfeed facebook",
    },
    description: {
      en: "Hide Navigator bar...",
      vi: "Ẩn giao diện 2 bên...",
    },
    whiteList: ["https://*.facebook.com/*"],
    contexts: {
      hasContent: true,
      hasPopup: false,
    }
  },

  youtube_download: {
    // ... metadata only
  },

  // Add more manually...
};
```

**Pros:** No build step
**Cons:** Manual maintenance (must update both files)

### Expected Performance Improvement

**Before:**
- Initial load: ~500-1000ms (all scripts)
- Bundle size: ~2-5MB

**After:**
- Initial load: ~50-100ms (metadata only)
- Bundle size: ~50-200KB metadata
- Click delay: ~10-50ms (dynamic import)

**Result:** 10-20x faster popup load! 🚀

### Migration Checklist

- [ ] Create `scripts/build/extractMetadata.js`
- [ ] Add `package.json` scripts
- [ ] Run `npm run build:metadata`
- [ ] Update `popup/tabs.js` to use metadata
- [ ] Update `popup/index.js` for lazy loading
- [ ] Test popup performance
- [ ] Update development workflow
- [ ] Document in CLAUDE.md

### Backward Compatibility

**Background script** still needs full scripts for auto-run:
- Keep `@index.js` as-is
- Background uses `@index.js`
- Popup uses `@metadata.js`

Both files coexist!

### Development Workflow

When adding new script:
1. Create `scripts/yourScript.js` as usual
2. Add to `scripts/@index.js`
3. **Run `npm run build:metadata`** ← NEW STEP
4. Add to `popup/tabs.js`

### Future Optimization

Could also lazy-load background scripts:
```javascript
// Only load auto-run scripts for current URL
const url = tab.url;
const scriptsToLoad = metadata.filter(s =>
  s.contexts.hasBackground &&
  checkWhiteList(s.whiteList, url)
);

// Load only needed scripts
for (const meta of scriptsToLoad) {
  const script = await import(`./scripts/${meta.id}.js`);
  // Register for auto-run
}
```

## Recommendation

**Phase 1 (Quick Win):**
- Use manual metadata definition
- Update popup to lazy load
- ~2-3 hours work
- 10x performance gain

**Phase 2 (Scalable):**
- Add automated metadata extraction
- Update CI/CD to regenerate
- ~1 day work
- Maintainable long-term

Start with Phase 1 for immediate results!

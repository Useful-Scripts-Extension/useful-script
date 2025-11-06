/**
 * Shared Script Detection Logic
 *
 * Used by both:
 * - popup/helpers/utils.js (runtime detection)
 * - scripts/build/extractMetadata.js (build-time detection)
 */

const CONTEXTS = [
  "popupScript",
  "contentScript",
  "pageScript",
  "backgroundScript",
];

/**
 * Check if object has any child function (recursive)
 */
export function hasChildFunction(object, excludedNamesSet = new Set()) {
  if (!object || typeof object !== 'object') return false;

  for (let key in object) {
    if (key.startsWith("_")) continue; // ignore private member
    if (!object[key]) continue;
    if (excludedNamesSet.has(key)) continue;
    if (typeof object[key] === "function") return true;
    if (typeof object[key] !== "object") continue;
    if (hasChildFunction(object[key], excludedNamesSet)) return true;
  }
  return false;
}

/**
 * Helper to inject allFrames function names
 * input ["onClick", "abc"] => output ["onClick", "onClick_", "abc", "abc_"]
 */
export function injectAllFramesFns(fns) {
  return fns.map((key) => [key, key + "_"]).flat();
}

/**
 * Detect if script has onClick capability
 */
export function detectCanClick(script) {
  for (let context of CONTEXTS) {
    for (let fn of injectAllFramesFns(["onClick"])) {
      if (typeof script[context]?.[fn] === "function") {
        return true;
      }
    }
  }
  return false;
}

/**
 * Detect if script can auto-run
 * Checks for lifecycle hooks and event handlers
 */
export function detectCanAutoRun(script) {
  const excludedNameSet = new Set(
    injectAllFramesFns([
      "onClick",
      "onInstalled",
      "onStartup",
      "onMessage",
      "onMessageExternal",
      "contextMenus",
    ])
  );

  for (let context of CONTEXTS) {
    if (hasChildFunction(script[context], excludedNameSet)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if has any context with implementation
 */
export function detectContexts(script) {
  return {
    popup: hasChildFunction(script.popupScript),
    content: hasChildFunction(script.contentScript),
    page: hasChildFunction(script.pageScript),
    background: hasChildFunction(script.backgroundScript),
  };
}

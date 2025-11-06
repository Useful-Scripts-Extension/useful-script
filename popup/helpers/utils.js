// Import shared detection logic
import {
  detectCanClick,
  detectCanAutoRun
} from "../../scripts/helpers/scriptDetection.js";

export const canClick = (script) => {
  // Use shared detection logic
  return detectCanClick(script);
};

export const canAutoRun = (script) => {
  // ⚡ OPTIMIZATION: Use pre-calculated canAutoRun from metadata
  // This is more accurate and handles nested event handlers (tabs, runtime, etc.)
  if (script.canAutoRun !== undefined) {
    return script.canAutoRun;
  }

  // Fallback: use shared detection logic for non-metadata scripts
  return detectCanAutoRun(script);
};

export const isTitle = (script) => !(canClick(script) || canAutoRun(script));

export async function viewScriptSource(script) {
  chrome.windows.create({
    url: chrome.runtime.getURL(
      "pages/viewScriptSource/index.html?file=" + script.id
    ),
    type: "popup",
    height: window.screen.height,
    width: 700,
    left: window.screen.width / 2 - 350,
    top: 0,
  });
}

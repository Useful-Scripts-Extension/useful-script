const CONTEXTS = [
  "popupScript",
  "contentScript",
  "pageScript",
  "backgroundScript",
];

export const canClick = (script) => {
  for (let context of CONTEXTS) {
    for (let fn of injectAllFramesFns(["onClick"])) {
      if (typeof script[context]?.[fn] === "function") {
        return true;
      }
    }
  }
  return false;
};

function hasChildFunction(object, excludedNamesSet = new Set()) {
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

export const canAutoRun = (script) => {
  let excludedNameSet = new Set(
    injectAllFramesFns([
      "onClick",
      "onInstalled",
      "onStartup",
      "onMessage",
      "contextMenus",
    ])
  );
  for (let context of CONTEXTS) {
    if (hasChildFunction(script[context], excludedNameSet)) return true;
  }
  return false;
};

// input ["onClick", "abc"] => output ["onClick", "onClick_", "abc", "abc_"]
const injectAllFramesFns = (fns) => fns.map((key) => [key, key + "_"]).flat();

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

const CONTEXTS = [
  "popupScript",
  "contentScript",
  "pageScript",
  "backgroundScript",
];

export const canClick = (script) => {
  for (let s of CONTEXTS) {
    if (typeof script[s]?.onClick === "function") return true;
  }
  return false;
};

function hasChildFunction(object, excludedNamesSet = new Set()) {
  for (let key in object) {
    if (key.startsWith("_")) continue;
    if (!object[key]) continue;
    if (excludedNamesSet.has(key)) continue;
    if (typeof object[key] === "function") return true;
    if (typeof object[key] !== "object") continue;
    if (hasChildFunction(object[key], excludedNamesSet)) return true;
  }
  return false;
}

export const canAutoRun = (script) => {
  let excludedNamesSet = new Set([
    "onClick",
    "onInstalled",
    "onStartup",
    "onMessage",
    "contextMenus",
  ]);
  for (let context of CONTEXTS) {
    if (hasChildFunction(script[context], excludedNamesSet)) return true;
  }
  return false;
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

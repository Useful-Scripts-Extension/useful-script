import { isFunction } from "../../scripts/helpers/utils.js";

export const canClick = (script) => {
  for (let s of ["popupScript", "contentScript", "pageScript"]) {
    if (isFunction(script[s]?.onClick)) return true;
  }
  return false;
};

export const canAutoRun = (script) => {
  for (let s of ["popupScript", "contentScript", "pageScript"]) {
    for (let e of [
      "onEnable",
      "onDisable",
      "onBeforeNavigate",
      "onDocumentStart",
      "onDocumentIdle",
      "onDocumentEnd",
    ]) {
      if (isFunction(script[s]?.[e])) return true;
    }
  }
  // TODO background scripts
  return false;
};

export const isTitle = (script) =>
  !(
    script.popupScript ||
    script.contentScript ||
    script.pageScript ||
    script.backgroundScript
  );

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

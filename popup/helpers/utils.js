import { isFunction } from "../../scripts/helpers/utils.js";

export const canClick = (script) => {
  for (let s of ["popupScript", "contentScript", "pageScript"]) {
    if (isFunction(script[s]?.onClick)) return true;
  }
  return false;
};

export const canAutoRun = (script) => {
  if (isFunction(script.popupScript?.onEnable)) return true;
  if (isFunction(script.popupScript?.onDisable)) return true;

  if (isFunction(script.backgroundScript?.onInstalled)) return true;
  if (isFunction(script.backgroundScript?.onStartup)) return true;

  for (let s of ["contentScript", "pageScript", "backgroundScript"]) {
    for (let e of [
      "onCreatedNavigationTarget",
      "onBeforeNavigate",
      "onDocumentStart",
      "onDocumentIdle",
      "onDocumentEnd",
    ]) {
      if (isFunction(script[s]?.[e])) return true;
    }
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

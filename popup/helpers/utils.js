import { OnClickType, ScriptType } from "../../scripts/helpers/constants.js";
import { isFunction } from "../../scripts/helpers/utils.js";

export const canClick = (script) =>
  isFunction(script[OnClickType.onClick]) ||
  isFunction(script[OnClickType.onClickExtension]) ||
  isFunction(script[OnClickType.onClickContentScript]);
export const canAutoRun = (script) =>
  ScriptType.contentScript in script || ScriptType.backgroundScript in script;
export const isTitle = (script) => !(canClick(script) || canAutoRun(script));

export async function viewScriptSource(script) {
  localStorage.viewScriptSource_sharedData = script.id;

  chrome.windows.create({
    url: chrome.runtime.getURL("pages/viewScriptSource/index.html"),
    type: "popup",
    height: window.screen.height,
    width: 700,
  });
}

import { ClickType, Events } from "../../scripts/helpers/constants.js";
import { isFunction } from "../../scripts/helpers/utils.js";

export const canClick = (script) =>
  isFunction(script[ClickType.onClick]) ||
  isFunction(script[ClickType.onClickExtension]) ||
  isFunction(script[ClickType.onClickContentScript]);

export const canAutoRun = (script) =>
  Events.onDocumentStart in script ||
  Events.onDocumentIdle in script ||
  Events.onDocumentEnd in script;

export const isTitle = (script) => !(canAutoRun(script) || canClick(script));

export async function viewScriptSource(script) {
  localStorage.viewScriptSource_sharedData = script.id;

  chrome.windows.create({
    url: chrome.runtime.getURL("pages/viewScriptSource/index.html"),
    type: "popup",
    height: window.screen.height,
    width: 700,
  });
}

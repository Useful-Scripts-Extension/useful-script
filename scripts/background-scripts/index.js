import { checkBlackWhiteList } from "../helpers/utils.js";
import { allScripts } from "../index.js";

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log(tabId, changeInfo, tab);
  const { LOADING, COMPLETE, UNLOADED } = chrome.tabs.TabStatus;

  if (changeInfo.status) {
    Object.values(allScripts).forEach((script) => {
      if (!checkBlackWhiteList(script, tab.url)) return;

      if (changeInfo.status === LOADING) {
        script.onDocumentStart?.();
      }
      if (changeInfo.status === COMPLETE) {
        script.onDocumentIdle?.();
      }
    });
  }
});

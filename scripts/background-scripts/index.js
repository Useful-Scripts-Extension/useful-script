import { checkBlackWhiteList, isEmptyFunction } from "../helpers/utils.js";
import { allScripts } from "../index.js";

const CACHED = {
  scriptRunInTabCounter: {},
  focusingTabId: null,
};

const eventsMap = {
  document_start: "onDocumentStart",
  document_end: "onDocumentEnd",
  document_idle: "onDocumentIdle",
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("> Received message:", request, sender?.tab?.id);

  if (request.type in eventsMap) {
    let tab = sender.tab;

    if (
      // init value
      !(tab.id in CACHED.scriptRunInTabCounter) ||
      // OR reset script count on document_start
      request.type === "document_start"
    )
      CACHED.scriptRunInTabCounter[tab.id] = 0;

    // run all scripts have valid blacklist/whitelist AND valid funcName
    Object.values(allScripts).forEach((script) => {
      let willRun = checkBlackWhiteList(script, tab?.url);
      if (!willRun) return;

      try {
        Object.entries(eventsMap).forEach(([eventKey, funcName], index) => {
          if (
            request.type === eventKey &&
            typeof script[funcName] === "function" &&
            !isEmptyFunction(script[funcName])
          ) {
            console.log("> Run " + script.id + " in tab " + tab.id);
            script[funcName](tab);
            CACHED.scriptRunInTabCounter[tab.id]++;
          }
        });
      } catch (e) {
        console.log("ERROR", e);
      }
    });

    // update badge
    updateBadge(tab.id, CACHED.scriptRunInTabCounter[tab.id]);
  }
});

function updateBadge(tabId, text = "", bgColor = "#666") {
  text = text.toString();
  chrome.action.setBadgeText({ tabId, text: text == "0" ? "" : text });
  chrome.action.setBadgeBackgroundColor({ color: bgColor });
}

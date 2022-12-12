import { checkBlackWhiteList } from "../helpers/utils.js";
import { allScripts } from "../index.js";

const CACHED = {
  scriptRunInTabCounter: {},
  fucusingTab: null,
};

const eventsMap = {
  document_start: "onDocumentStart",
  document_end: "onDocumentEnd",
  document_idle: "onDocumentIdle",
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Received message:", request, sender);

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
            typeof script[funcName] === "function"
          ) {
            script[funcName](tab);
            CACHED.scriptRunInTabCounter[tab.id]++;
          }
        });
      } catch (e) {
        console.log("ERROR", e);
      }
    });

    // update badge
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  let { tabId } = activeInfo;
  console.log(activeInfo, CACHED.scriptRunInTabCounter[tabId]?.toString());

  updateBadge(CACHED.scriptRunInTabCounter[tabId]?.toString() || "");
});

function updateBadge(text) {
  chrome.action.setBadgeText({ text });
}

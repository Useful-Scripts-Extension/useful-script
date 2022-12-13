import { allScripts } from "../index.js";
import { EventMap, Events } from "../helpers/constants.js";
import {
  checkBlackWhiteList,
  isEmptyFunction,
  isFunction,
} from "../helpers/utils.js";

const CACHED = {
  scriptRunInTabCounter: {},
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("> Received message:", request, sender?.tab?.id);

  let event = request.event;
  let funcName = EventMap[event];
  if (funcName) {
    let tab = sender.tab;

    if (
      // init value
      !(tab.id in CACHED.scriptRunInTabCounter) ||
      // OR reset script count on document_start
      event === Events.document_start
    )
      CACHED.scriptRunInTabCounter[tab.id] = 0;

    // run all scripts have valid blacklist/whitelist AND valid funcName
    Object.values(allScripts).forEach((script) => {
      let willRun = checkBlackWhiteList(script, tab?.url);
      if (!willRun) return;

      try {
        let func = script.backgroundScript?.[funcName];
        let isActive = script.isActive?.();

        if (isActive && isFunction(func) && !isEmptyFunction(func)) {
          console.log("> Run " + script.id + " in tab " + tab.id);
          func(tab);
          CACHED.scriptRunInTabCounter[tab.id]++;
        }
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

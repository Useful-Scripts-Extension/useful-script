import { allScripts } from "../index.js";
import { Events } from "../helpers/constants.js";
import { MsgType } from "../helpers/constants.js";
import {
  checkBlackWhiteList,
  isActiveScript,
  isEmptyFunction,
  isFunction,
  runScriptInTab,
} from "../helpers/utils.js";

const CACHED = {
  runCount: {},
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("> Received message:", message, sender?.tab?.url);

  switch (message.type) {
    case MsgType.runScript:
      runScript(message.event, sender.tab);
      break;
  }
});

async function runScript(event, tab) {
  let funcName = event,
    tabId = tab.id,
    url = tab.url;

  if (!(tabId in CACHED.runCount) || event === Events.onDocumentStart)
    CACHED.runCount[tabId] = 0;

  for (let script of Object.values(allScripts)) {
    try {
      if (!checkBlackWhiteList(script, url)) continue;

      let func = script[funcName];
      if (isFunction(func) && !isEmptyFunction(func)) {
        let isActive = (await isActiveScript(script.id)) ?? true;
        if (isActive) {
          runScriptInTab({ func, tabId });
          console.log(
            `%c > Run ${script.id} ${funcName} in ${url}`,
            "background: #222; color: #bada55"
          );
          CACHED.runCount[tabId]++;
        }
      }
    } catch (e) {
      console.log("ERROR at script " + script?.id, e);
    }
  }

  updateBadge(tabId, CACHED.runCount[tabId]);
}

function updateBadge(tabId, text = "", bgColor = "#666") {
  text = text.toString();
  chrome.action.setBadgeText({ tabId, text: text == "0" ? "" : text });
  chrome.action.setBadgeBackgroundColor({ color: bgColor });
}

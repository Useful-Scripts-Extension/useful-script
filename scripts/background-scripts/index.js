import { allScripts } from "../index.js";
import { Events } from "../helpers/constants.js";
import { MsgType } from "../helpers/constants.js";
import {
  checkBlackWhiteList,
  getActiveScript,
  isEmptyFunction,
  isFunction,
  runScriptInTab,
} from "../helpers/utils.js";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("> Received message:", message, sender?.tab?.url);

  try {
    switch (message.type) {
      case MsgType.runScript:
        let funcName = Events[message.event];
        if (!funcName) break;

        let count = 0,
          tabId = sender.tab.id,
          url = sender.tab.url;

        Object.values(allScripts).map(async (script) => {
          if (!checkBlackWhiteList(script, url)) return;

          let func = script[funcName];
          if (isFunction(func) && !isEmptyFunction(func)) {
            let isActive = (await getActiveScript(script.id)) ?? true;
            if (isActive) {
              runScriptInTab({ func, tabId });
              console.log(
                `%c > Run ${script.id} ${funcName} in ${url}`,
                "background: #222; color: #bada55"
              );
              count++;
            }
          }
        });

        updateBadge(tabId, count);
        break;
    }
  } catch (e) {
    console.log("ERROR: ", e);
  }
});

function updateBadge(tabId, text = "", bgColor = "#666") {
  text = text.toString();
  chrome.action.setBadgeText({ tabId, text: text == "0" ? "" : text });
  chrome.action.setBadgeBackgroundColor({ color: bgColor });
}

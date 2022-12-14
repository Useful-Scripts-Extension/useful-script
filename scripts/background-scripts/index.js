import { MsgType, ScriptType } from "../helpers/constants.js";
import { runAllScriptWithEventType } from "../helpers/utils.js";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("> Received message:", message, sender?.tab?.url);

  switch (message.type) {
    case MsgType.runScript:
      runAllScriptWithEventType(
        message.event,
        ScriptType.backgroundScript,
        sender.tab?.url
      );
      break;
  }
});

function updateBadge(tabId, text = "", bgColor = "#666") {
  text = text.toString();
  chrome.action.setBadgeText({ tabId, text: text == "0" ? "" : text });
  chrome.action.setBadgeBackgroundColor({ color: bgColor });
}

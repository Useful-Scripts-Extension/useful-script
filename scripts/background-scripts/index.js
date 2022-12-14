import { ScriptType } from "../helpers/constants.js";
import { runAllScriptWithEventType } from "../helpers/utils.js";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("> Received message:", request, sender?.tab?.url);

  runAllScriptWithEventType(
    request.event,
    ScriptType.backgroundScript,
    sender.tab?.url
  );
});

function updateBadge(tabId, text = "", bgColor = "#666") {
  text = text.toString();
  chrome.action.setBadgeText({ tabId, text: text == "0" ? "" : text });
  chrome.action.setBadgeBackgroundColor({ color: bgColor });
}

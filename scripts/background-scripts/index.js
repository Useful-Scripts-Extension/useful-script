import { checkBlackWhiteList } from "../helpers/utils.js";
import { allScripts } from "../index.js";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Received message:", request, sender);
  if (
    request.type == "document_start" ||
    request.type == "document_end" ||
    request.type == "document_idle"
  ) {
    let tab = sender.tab;
    Object.values(allScripts).forEach((script) => {
      let willRun = checkBlackWhiteList(script, tab?.url);
      if (!willRun) return;
      try {
        if (request.type == "document_start") script.onDocumentStart?.(tab);
        if (request.type == "document_end") script.onDocumentEnd?.(tab);
        if (request.type == "document_idle") script.onDocumentIdle?.(tab);
      } catch (e) {
        console.log("ERROR", e);
      }
    });
  }
});

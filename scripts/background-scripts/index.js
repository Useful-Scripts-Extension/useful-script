import { checkBlackWhiteList } from "../helpers/utils.js";
import { allScripts } from "../index.js";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (
    request.type == "document_start" ||
    request.type == "document_end" ||
    request.type == "document_idle"
  ) {
    console.log(sender);

    Object.values(allScripts).forEach((script) => {
      if (!checkBlackWhiteList(script, sender?.tab?.url)) return;
      try {
        if (request.type == "document_start") script.onDocumentStart?.();
        if (request.type == "document_end") script.onDocumentEnd?.();
        if (request.type == "document_idle") script.onDocumentIdle?.();
      } catch (e) {
        console.log("ERROR", e);
      }
    });
  }
});

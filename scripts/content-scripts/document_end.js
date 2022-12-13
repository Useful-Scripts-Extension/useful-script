// (async () => {
// const { injectScript, baseURL, injectCss } = await import("./utils.js");
// if (
//   location.hostname.includes("facebook.com") ||
//   location.hostname.includes("messenger.com")
// ) {
//   injectScript(baseURL + "fb_invisible_message.js");
// }
// })();

(async () => {
  const { allScripts } = await import("../index.js");
  Object.values(allScripts).map((script) => {
    script.contentScript?.onDocumentEnd?.();
  });
})();

(async () => {
  console.log("Useful-scripts: sending document_end to background...");
  const response = await chrome.runtime.sendMessage({ type: "document_end" });
  console.log("> Useful-scripts: document_end sent successfully", response);
})();

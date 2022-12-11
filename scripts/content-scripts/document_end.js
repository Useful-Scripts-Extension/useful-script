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
  const response = await chrome.runtime.sendMessage({ type: "document_end" });
  console.log("sent document_end to background", response);
})();

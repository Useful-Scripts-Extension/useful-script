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
  const { Events, ScriptType } = await import("../helpers/constants.js");
  const { runAllScriptWithEventType, sendEventToBackground } = await import(
    "../helpers/utils.js"
  );

  runAllScriptWithEventType(
    Events.document_end,
    ScriptType.contentScript,
    location.href
  );
  sendEventToBackground(Events.document_end);
})();

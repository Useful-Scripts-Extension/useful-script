// (async () => {
// https://stackoverflow.com/a/53033388
// const { injectScript, baseURL, injectCss } = await import("./utils.js");
// injectScript(baseURL + "track_settimeout.js");
// injectScript(baseURL + "globals_debugger.js");
// injectScript(baseURL + "useful-scripts-utils.js");
// injectScript(baseURL + "bypass_all_shortlink.js");
// if (location.hostname === "mp3.zing.vn")
//   injectScript(baseURL + "mp3.zing.vn.js");
// if (location.hostname === "www.instagram.com") {
//   injectCss(baseURL + "instagram.css");
//   injectScript(baseURL + "instagram_downloadBtn.js");
// }
// if (location.hostname === "www.studyphim.vn")
//   injectScript(baseURL + "studyphim.js");
// if (location.hostname === "www.studocu.com")
//   injectCss(baseURL + "studocu.css");
// })();

// (async () => {
//   const src = chrome.runtime.getURL("scripts/content-scripts/main.js");
//   const contentMain = await import(src);
//   contentMain.main();
// })();

(async () => {
  const response = await chrome.runtime.sendMessage({ type: "document_start" });
  console.log("sent document_start to background", response);
})();

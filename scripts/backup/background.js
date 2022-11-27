// https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/tutorials/focus-mode/background.js

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.action.setBadgeText({
//     text: "NEW",
//   });
// });

// ================= UNSTABLE =================

// import * as scripts from "./popup/scripts/scripts.js";

// let scriptsNeedRunBackground = Object.values(scripts).filter(
//   (script) =>
//     script.backgroundFunc && typeof script.backgroundFunc === "function"
// );

// console.log(
//   `run ${scriptsNeedRunBackground.length} background scripts`,
//   scriptsNeedRunBackground
// );

// scriptsNeedRunBackground.forEach((script) => {
//   script.backgroundFunc();
// });

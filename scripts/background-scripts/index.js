// import { allScripts } from "../index.js";
// import { Events, EventMap } from "../helpers/constants.js";

// chrome.scripting.registerContentScripts(
//   [
//     {
//       id: "ufs_global_webpage_context",
//       allFrames: true,
//       matches: ["<all_urls>"],
//       js: ["scripts/content-scripts/scripts/ufs_global_webpage_context.js"],
//       runAt: "document_start",
//       world: chrome.scripting.ExecutionWorld.MAIN,
//     },
//   ],
//   () => {
//     console.log("Register content script DONE.");
//   }
// );

// (() => {
//   let scripts = Object.values(allScripts)
//     .map((s) =>
//       Object.values(Events).map((e) => {
//         if (!e in s) return null;
//         let isString = typeof s[e] === "string";
//         let isArray = Array.isArray(s[e]);
//         if (!(isString || isArray)) return null;

//         let js = isString ? [getscriptURL(s[e])] : s[e].map(getscriptURL);

//         // add global helper to head of array
//         js.unshift(
//           getscriptURL("content-scripts/scripts/ufs_global_webpage_context.js")
//         );
//         return {
//           id: s.id + "-" + e,
//           allFrames: true,
//           matches: s.whiteList || ["<all_urls>"],
//           excludeMatches: s.blackList || [],
//           js: js,
//           runAt: EventMap[e],
//           world: chrome.scripting.ExecutionWorld.MAIN,
//         };
//       })
//     )
//     .flat()
//     .filter((_) => _);

//   console.log(scripts);

//   chrome.scripting.registerContentScripts(scripts, () => {
//     console.log("Register content script DONE.");
//   });
// })();

// function getscriptURL(fileName) {
//   return "scripts/" + fileName;
// }

// function updateBadge(tabId, text = "", bgColor = "#666") {
//   text = text.toString();
//   chrome.action.setBadgeText({ tabId, text: text == "0" ? "" : text });
//   chrome.action.setBadgeBackgroundColor({ color: bgColor });
// }

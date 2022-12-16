(async () => {
  function injectScript(url) {
    var s = document.createElement("script");
    s.src = url;
    (document.head || document.documentElement).appendChild(s);
    console.log("Useful-scripts injected " + url);
    s.remove();
  }

  let key = "activeScripts";
  let ids = (await chrome.storage.sync.get([key]))?.[key];
  let search = new URLSearchParams({
    ids: ids,
    path: chrome.runtime.getURL("/scripts/"),
    event: "onDocumentIdle",
  }).toString();

  injectScript(
    chrome.runtime.getURL("/scripts/content-scripts/run_scripts.js") +
      "?" +
      search
  );
})();

// (async () => {
//   try {
//     const { MsgType, Events } = await import("../helpers/constants.js");
//     const { sendEventToBackground } = await import("../helpers/utils.js");
//     sendEventToBackground({
//       type: MsgType.runScript,
//       event: Events.onDocumentIdle,
//     });
//   } catch (e) {
//     console.log("ERROR: ", e);
//   }
// })();

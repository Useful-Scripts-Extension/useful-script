import { EventMap, Events } from "../helpers/constants.js";

(async () => {
  // https://stackoverflow.com/a/53033388
  const { getURL, injectScript, injectCss } = await import("./utils.js");
  injectScript(getURL("./scripts/useful-scripts-utils.js"));

  // injectScript(getURL("./scripts/bypass_all_shortlink.js"));
  // injectScript(getURL("./scripts/track_settimeout.js"));
  // injectScript(getURL("./scripts/globals_debugger.js"));
  // if (location.hostname === "mp3.zing.vn")
  //   injectScript(getURL("./scripts/mp3.zing.vn.js"));
  // if (location.hostname === "www.instagram.com") {
  //   injectCss(getURL("./scripts/instagram.css"));
  //   injectScript(getURL("./scripts/instagram_downloadBtn.js"));
  // }
  // if (location.hostname === "www.studyphim.vn")
  //   injectScript(getURL("./scripts/studyphim.js"));
  // if (location.hostname === "www.studocu.com")
  //   injectCss(getURL("./scripts/studocu.css"));
})();

let event = Events.document_start;
let funcName = [EventMap[event]];

(async () => {
  const { allScripts } = await import("../index.js");
  Object.values(allScripts).map((script) => {
    script.contentScript?.[funcName]?.();
  });
})();

(async () => {
  console.log("Useful-scripts: sending " + event + " to background...");
  const response = await chrome.runtime.sendMessage({ event });
  console.log("> Useful-scripts: " + event + " sent successfully", response);
})();

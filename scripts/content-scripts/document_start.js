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

(async () => {
  const { allScripts } = await import("../index.js");
  console.log(allScripts);
  console.log(chrome);
})();

(async () => {
  console.log("Useful-scripts: sending document_start to background...");
  const response = await chrome.runtime.sendMessage({ type: "document_start" });
  console.log("> Useful-scripts: document_start sent successfully", response);
})();

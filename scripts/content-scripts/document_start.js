(async () => {
  // https://stackoverflow.com/a/53033388
  const { getURL, injectScript, injectCss } = await import("./utils.js");
  injectScript(getURL("useful-scripts-utils.js"));

  // injectScript(getURL("bypass_all_shortlink.js"));
  // injectScript(getURL("track_settimeout.js"));
  // injectScript(getURL("globals_debugger.js"));
  // if (location.hostname === "mp3.zing.vn")
  //   injectScript(getURL("mp3.zing.vn.js"));
  // if (location.hostname === "www.instagram.com") {
  //   injectCss(getURL("instagram.css"));
  //   injectScript(getURL("instagram_downloadBtn.js"));
  // }
  // if (location.hostname === "www.studyphim.vn")
  //   injectScript(getURL("studyphim.js"));
  // if (location.hostname === "www.studocu.com")
  //   injectCss(getURL("studocu.css"));
})();

(async () => {
  const { Events, ScriptType } = await import("../helpers/constants.js");
  const { runAllScriptWithEventType, sendEventToBackground } = await import(
    "../helpers/utils.js"
  );

  runAllScriptWithEventType(
    Events.document_start,
    ScriptType.contentScript,
    location.href
  );
  sendEventToBackground(Events.document_start);
})();

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
  const { allScripts } = await import("../index.js");
  const { MsgType, Events, ScriptType } = await import(
    "../helpers/constants.js"
  );
  const { runAllScriptWithEventType, sendEventToBackground, isFunction } =
    await import("../helpers/utils.js");

  runAllScriptWithEventType(
    Events.document_start,
    ScriptType.contentScript,
    location.href
  );

  sendEventToBackground({
    type: MsgType.runScript,
    event: Events.document_start,
  });

  // run script on receive event from popup
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    console.log("> Received message:", message);
    switch (message.type) {
      case MsgType.runScript:
        let scriptId = message.scriptId;
        if (
          scriptId in allScripts &&
          isFunction(allScripts[scriptId].onClick)
        ) {
          allScripts[scriptId].onClick();
          console.log("> Run script " + scriptId);
        }
        break;
    }
  });
})();

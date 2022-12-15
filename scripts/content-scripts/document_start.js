(async () => {
  try {
    const { MsgType, Events, ClickType: OnClickType } = await import(
      "../helpers/constants.js"
    );
    const { sendEventToBackground, isFunction } = await import(
      "../helpers/utils.js"
    );

    sendEventToBackground({
      type: MsgType.runScript,
      event: Events.onDocumentStart,
    });

    const { allScripts } = await import("../index.js");
    chrome.runtime.onMessage.addListener(function (
      message,
      sender,
      sendResponse
    ) {
      console.log("> Received message:", message);

      switch (message.type) {
        // run script on receive event from popup
        case MsgType.runScript:
          let scriptId = message.scriptId;
          if (
            scriptId in allScripts &&
            isFunction(allScripts[scriptId][OnClickType.onClickContentScript])
          ) {
            allScripts[scriptId][OnClickType.onClickContentScript]();
            console.log("> Run script " + scriptId);
          }
          break;
      }
    });

    // https://stackoverflow.com/a/53033388
    const { getURL, injectScript, injectCss } = await import("./utils.js");
    injectScript(getURL("useful-scripts-utils.js"));
  } catch (e) {
    console.log("ERROR: ", e);
  }
})();

(async () => {
  try {
    const { MsgType, Events, ClickType } = await import(
      "../helpers/constants.js"
    );
    const { sendEventToBackground, isFunction } = await import(
      "../helpers/utils.js"
    );

    sendEventToBackground({
      type: MsgType.runScript,
      event: Events.onDocumentStart,
    });

    chrome.runtime.onMessage.addListener(async function (
      message,
      sender,
      sendResponse
    ) {
      console.log("> Received message:", message);

      switch (message.type) {
        case MsgType.runScript:
          let scriptId = message.scriptId;
          const script = (await import("../" + scriptId + ".js"))?.default;

          if (script && isFunction(script[ClickType.onClickContentScript])) {
            script[ClickType.onClickContentScript]();
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

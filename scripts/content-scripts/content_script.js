// communication between page-script and content-script
(() => {
  function sendToPageScript(event, data) {
    window.dispatchEvent(
      new CustomEvent("ufs-contentscript-sendto-pagescript", {
        detail: { event, data },
      })
    );
  }
  window.addEventListener("ufs-pagescript-sendto-contentscript", async (e) => {
    let { event, data } = e.detail;
    switch (event) {
      case "getURL":
        sendToPageScript(event, chrome.runtime.getURL(data));
        break;
      case "getActiveScripts":
        const key = "activeScripts";
        let ids = (await chrome.storage.sync.get([key]))?.[key] || "";
        let path = chrome.runtime.getURL("/scripts/");
        sendToPageScript(event, { ids, path });
        break;
    }
  });
})();

// Run script on user click (if clicked script has onClickContentScript event)
(async () => {
  try {
    const { MsgType, ClickType } = await import("../helpers/constants.js");
    const { isFunction } = await import("../helpers/utils.js");

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
  } catch (e) {
    console.log("ERROR: ", e);
  }
})();

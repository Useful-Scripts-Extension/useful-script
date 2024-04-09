import("./scripts/ufs_global_webpage_context.js");

(async () => {
  async function getActiveScripts() {
    const key = "activeScripts";
    let ids = (await chrome.storage.sync.get([key]))?.[key] || "";
    let path = chrome.runtime.getURL("/scripts/");
    return { ids, path };
  }

  // communication between page-script and content-script
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
        let { ids, path } = await getActiveScripts();
        sendToPageScript(event, { ids, path });
        break;
    }
  });

  // save active scripts to local storage to share with page script
  localStorage.setItem(
    "ufs_active_scripts",
    JSON.stringify(await getActiveScripts())
  );

  // Run script on user click (if clicked script has onClickContentScript event)
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
          const script = (
            await import(chrome.runtime.getURL("/scripts/") + scriptId + ".js")
          )?.default;

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

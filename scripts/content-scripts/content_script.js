import("./ufs_global_webpage_context.js");

(async () => {
  const CACHED = {};

  async function getActiveScripts() {
    const key = "activeScripts";
    if (!CACHED[key]) {
      CACHED[key] = {
        ids: (await chrome.storage.sync.get([key]))?.[key] || [],
        path: chrome.runtime.getURL("/scripts/"),
      };
    }
    return CACHED[key];
  }

  // communication between page-script and content-script
  function sendToPageScript(event, data) {
    window.dispatchEvent(
      new CustomEvent("ufs-contentscript-sendto-pagescript", {
        detail: { event, data },
      })
    );
  }

  async function main() {
    let ids = [],
      path;

    window.addEventListener(
      "ufs-pagescript-sendto-contentscript",
      async (e) => {
        let { event, data } = e.detail;
        switch (event) {
          case "getURL":
            sendToPageScript(event, chrome.runtime.getURL(data));
            break;
          case "getActiveScripts":
            sendToPageScript(event, await getActiveScripts());
            break;
        }
      }
    );

    getActiveScripts().then(({ ids: _ids, path: _path }) => {
      ids = _ids;
      path = _path;
    });

    // Run script on user click (if clicked script has onClickContentScript event)
    try {
      const { MsgType, ClickType } = await import("../helpers/constants.js");

      chrome.runtime.onMessage.addListener(async function (
        message,
        sender,
        sendResponse
      ) {
        console.log("> Received message:", message);

        switch (message.type) {
          case MsgType.runScript:
            let scriptId = message.scriptId;
            const script = (await import("/scripts/" + scriptId + ".js"))
              ?.default;
            if (
              script &&
              typeof script[ClickType.onClickContentScript] === "function"
            ) {
              script[ClickType.onClickContentScript]();
              console.log("> Run script (content-script): " + scriptId);
            }
            break;
        }
      });
    } catch (e) {
      console.log("ERROR: ", e);
    }
  }

  main();
})();

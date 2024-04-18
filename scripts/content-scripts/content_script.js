import("./ufs_global_webpage_context.js");

const CACHED = {};

async function getActiveScripts() {
  const key = "activeScripts";
  if (!CACHED[key]) {
    CACHED[key] = {
      ids: (await chrome.storage.local.get([key]))?.[key] || [],
      path: chrome.runtime.getURL("/scripts/"),
    };
  }
  return CACHED[key];
}

// communication between page-script and content-script
function sendToPageScript(event, uuid, data) {
  console.log("sendToPageScript", event, uuid, data);
  window.dispatchEvent(
    new CustomEvent("ufs-contentscript-sendto-pagescript", {
      detail: { event, uuid, data },
    })
  );
}

(async () => {
  chrome.runtime.onMessage.addListener(async function (
    message,
    sender,
    sendResponse
  ) {
    // TODO
  });

  // listen page script (web page, cannot listen iframes ...)
  window.addEventListener("ufs-pagescript-sendto-contentscript", async (e) => {
    try {
      let { event, data, uuid } = e.detail;
      switch (event) {
        case "runInContentScript":
          const { params = [], fnPath = "" } = data || {};
          let fn = window;
          fnPath.split(".").forEach((part) => {
            fn = fn?.[part];
          });
          sendToPageScript(event, uuid, await fn?.(...params));
          break;
      }
    } catch (e) {
      console.log("ERROR: ", e);
    }
  });

  // get active scripts and store in CACHED
  getActiveScripts();

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
})();

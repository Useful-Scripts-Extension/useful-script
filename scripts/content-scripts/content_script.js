import("./ufs_global_webpage_context.js");

function backgroundFetch(url, options = {}) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { action: "fetch", params: { url, options } },
      function (response) {
        console.log("Response from background script:", response);
        resolve(response);
      }
    );
  });
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

window.ufs_runScritps = runScript;
function runScripts(scriptIds, event, path) {
  for (let scriptId of scriptIds) {
    runScript(scriptId, event);
  }
}

async function runScript(scriptId, event) {
  const script = (await import("/scripts/" + scriptId + ".js"))?.default;
  if (script && typeof script[event] === "function") {
    script[event]();
    console.log("> Run script (content-script): " + scriptId);
  }
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
          let fn = fnPath?.startsWith?.("chrome") ? chrome : window;
          fnPath.split(".").forEach((part) => {
            fn = fn?.[part] || fn;
          });
          console.log("runInContentScript", fnPath, params);
          sendToPageScript(event, uuid, await fn?.(...params));
          break;
      }
    } catch (e) {
      console.log("ERROR: ", e);
    }
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
          runScript(message.scriptId, ClickType.onClickContentScript);
          break;
      }
    });
  } catch (e) {
    console.log("ERROR: ", e);
  }
})();

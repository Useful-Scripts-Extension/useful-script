import("./ufs_global.js"); // to use UfsGlobal inside content-script
let utils;

// communication between page-script and content-script
function sendToPageScript(event, uuid, data) {
  console.log("sendToPageScript", event, uuid, data);
  window.dispatchEvent(
    new CustomEvent("ufs-contentscript-sendto-pagescript" + uuid, {
      detail: { event, data },
    })
  );
}

window.runScripts = runScripts;
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
  async function getUtils() {
    if (!utils) utils = await import("../helpers/utils.js");
    return utils;
  }

  getUtils(); // import and save utils

  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    try {
      console.log("> Received message:", message);

      switch (message.type) {
        case "runScript":
          runScript(message.scriptId, "onClickContentScript");
          break;
      }
    } catch (e) {
      console.log("ERROR : ", e);
    }
  });

  // listen page script (web page, cannot listen iframes ...)
  window.addEventListener("ufs-pagescript-sendto-contentscript", async (e) => {
    let { event, data, uuid } = e?.detail || {};
    try {
      switch (event) {
        case "ufs-runInContentScript":
          const { params = [], fnPath = "" } = data || {};
          console.log("runInContentScript", fnPath, params);
          const res = await (await getUtils()).runFunc(fnPath, params);
          sendToPageScript(event, uuid, res);
          break;
        case "ufs-runInBackground":
          chrome.runtime.sendMessage(
            { action: "ufs-runInBackground", data },
            function (response) {
              console.log("Response from background script:", response);
              sendToPageScript(event, uuid, response);
            }
          );
          break;
      }
    } catch (e) {
      console.log("ERROR: ", e);
      sendToPageScript(event, uuid, null);
    }
  });
})();

(() => {
  // to use UfsGlobal in isolated world.
  // I dont know why inject in manifest.json is not working
  // It seem like we can only inject each file once, no matter which world (MAIN/ISOLATED) it is in
  // import("./ufs_global.js");

  let utils;

  // communication between page-script and content-script
  function sendToPageScript(event, uuid, data) {
    // console.log("sendToPageScript", event, uuid, data);
    window.dispatchEvent(
      new CustomEvent("ufs-contentscript-sendto-pagescript" + uuid, {
        detail: { event, data },
      })
    );
  }

  window.ufs_runScripts = runScripts;
  function runScripts(scriptIds, event, path, details) {
    for (let scriptId of scriptIds) {
      runScript(scriptId, event, details);
    }
  }

  async function runScript(scriptId, event, details) {
    try {
      const { default: script } = await import("/scripts/" + scriptId + ".js");
      const s = script?.contentScript;
      const fn = s?.[event];
      if (
        typeof fn === "function" &&
        (s.runInAllFrames || details.frameType == "outermost_frame") &&
        checkWillRun(script)
      ) {
        console.log(
          "> Useful-script: Run content-script: " + scriptId + " " + event
        );
        fn(details);
      }
    } catch (e) {
      console.log("ERROR run content-script " + scriptId + " " + event, e);
    }
  }

  async function getUtils() {
    if (!utils) utils = await import("../helpers/utils.js");
    return utils;
  }

  getUtils(); // import and save utils

  // listen page script (web page, cannot listen iframes ...)
  window.addEventListener("ufs-pagescript-sendto-contentscript", async (e) => {
    let { event, data, uuid } = e?.detail || {};
    try {
      switch (event) {
        case "ufs-runInContentScript":
          const { params = [], fnPath = "" } = data || {};
          // console.log("runInContentScript", fnPath, params);
          const res = await (await getUtils()).runFunc(fnPath, params);
          sendToPageScript(event, uuid, res);
          break;
        case "ufs-runInBackground":
          chrome.runtime.sendMessage(
            { action: "ufs-runInBackground", data },
            function (response) {
              // console.log("Response from background script:", response);
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

  // import UfsGlobal take time => but we want onDocumentStart run ASAP
  // So just duplicate this code here until find a better solution.
  function checkWillRun(script, url = location?.href) {
    if (!url) return false;
    let hasWhiteList = script.whiteList?.length > 0;
    let hasBlackList = script.blackList?.length > 0;
    let inWhiteList = matchOneOfPatterns(url, script.whiteList || []);
    let inBlackList = matchOneOfPatterns(url, script.blackList || []);
    return (
      (!hasWhiteList && !hasBlackList) ||
      (hasWhiteList && inWhiteList) ||
      (hasBlackList && !inBlackList)
    );
  }

  function matchOneOfPatterns(url, patterns) {
    for (let pattern of patterns) {
      const regex = new RegExp(
        "^" +
          pattern
            .split("*")
            .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join(".*") +
          "$"
      );
      if (regex.test(url)) return true;
    }
    return false;
  }
})();

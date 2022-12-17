// https://stackoverflow.com/a/70949953
// https://stackoverflow.com/a/9517879
// https://stackoverflow.com/a/2920207/11898496

(async () => {
  // https://stackoverflow.com/a/8578840/11898496
  function injectScript(src) {
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.async = false;
    s.defer = false;
    s.addEventListener("load", () => {
      console.log("Useful-scripts injected " + src);
      // s.remove();
    });
    s.src = src;
    let head =
      document.head ||
      document.getElementsByTagName("head")[0] ||
      document.documentElement;
    head.insertBefore(s, head.firstChild);
    // (document.head || document.documentElement).prepend(s);
  }

  console.log(window.__d);

  // function injectScript(url) {
  //   var s = document.createElement("script");
  //   s.src = url;
  //   s.async = !1;
  //   (document.head || document.documentElement).appendChild(s);
  //   console.log("Useful-scripts injected " + url);
  //   s.remove();
  // }

  let key = "activeScripts";
  let ids = (await chrome.storage.sync.get([key]))?.[key];
  let search = new URLSearchParams({
    ids: ids,
    path: chrome.runtime.getURL("/scripts/"),
    event: "onDocumentStart",
  }).toString();

  injectScript(
    chrome.runtime.getURL("/scripts/content-scripts/run_scripts.js") +
      "?" +
      search
  );

  injectScript(
    chrome.runtime.getURL(
      "/scripts/content-scripts/scripts/ufs_global_webpage_context.js"
    )
  );
})();

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

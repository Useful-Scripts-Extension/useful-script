(async () => {
  const { getURL, injectScript, injectCss } = await import("./utils.js");
  if (location.hostname === "movies.hdviet.com")
    injectScript(getURL("./scripts/movie_hd_viet.js"));
})();

(async () => {
  const { allScripts } = await import("../index.js");
  Object.values(allScripts).map((script) => {
    script.contentScript?.onDocumentIdle?.();
  });
})();

(async () => {
  console.log("Useful-scripts: sending document_idle to background...");
  const response = await chrome.runtime.sendMessage({ type: "document_idle" });
  console.log("> Useful-scripts: document_idle sent successfully", response);
})();

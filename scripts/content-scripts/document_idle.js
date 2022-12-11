// (async () => {
// const { injectScript, injectCss, baseURL } = await import("./utils.js");
// if (location.hostname === "movies.hdviet.com")
//   injectScript(baseURL + "movie_hd_viet.js");
// })();

(async () => {
  const response = await chrome.runtime.sendMessage({ type: "document_idle" });
  console.log("sent document_idle to background", response);
})();

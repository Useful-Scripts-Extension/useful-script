(async () => {
  const { getURL, injectScript, injectCss } = await import("./utils.js");
  if (location.hostname === "movies.hdviet.com")
    injectScript(getURL("./scripts/movie_hd_viet.js"));
})();

(async () => {
  const { Events, ScriptType } = await import("../helpers/constants.js");
  const { runAllScriptWithEventType, sendEventToBackground } = await import(
    "../helpers/utils.js"
  );

  runAllScriptWithEventType(
    Events.document_idle,
    ScriptType.contentScript,
    location.href
  );
  sendEventToBackground(Events.document_idle);
})();

(async () => {
  // https://stackoverflow.com/a/53033388
  const { injectScript, baseURL } = await import("./utils.js");

  // injectScript(baseURL + "track_settimeout.js");
  injectScript(baseURL + "globals_debugger.js");
  injectScript(baseURL + "useful-scripts-utils.js");

  if (location.hostname === "mp3.zing.vn")
    injectScript(baseURL + "mp3.zing.vn.js");

  // if (location.hostname === "luanxt.com")
  //   injectScriptFile("//code.jquery.com/jquery-3.6.1.min.js", true);
})();

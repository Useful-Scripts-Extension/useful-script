function injectScriptFile(filePathOrUrl, isExternal = false) {
  try {
    var s = document.createElement("script");
    s.src = isExternal ? filePathOrUrl : chrome.runtime.getURL(filePathOrUrl);
    s.onload = function () {
      console.log("Useful-scripts injected " + s.src);
      this.remove();
    };
    s.onerror = function (e) {
      console.log("ERROR: Useful-scripts inject script FAILED " + s.src, e);
      this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
  } catch (e) {
    console.log(
      "ERROR: Useful-scripts inject script FAILED " + filePathOrUrl,
      e
    );
  }
}

const CONFIG = {
  enableUsefulScriptUtils: true,
};

if (CONFIG.enableUsefulScriptUtils) {
  // injectScriptFile("/content-scripts/track_settimeout.js");
  // injectScriptFile("/content-scripts/globals_debugger.js");
  injectScriptFile("/content-scripts/useful-scripts-utils.js");
}

if (location.hostname === "mp3.zing.vn")
  injectScriptFile("/content-scripts/mp3.zing.vn.js");

// if (location.hostname === "luanxt.com")
//   injectScriptFile("//code.jquery.com/jquery-3.6.1.min.js", true);

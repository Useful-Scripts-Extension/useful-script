function injectScriptFile(filePathOrUrl, isExternal = false) {
  var s = document.createElement("script");
  s.src = isExternal ? filePathOrUrl : chrome.runtime.getURL(filePathOrUrl);
  s.onload = function () {
    console.log("Useful-scripts injected " + s.src);
    this.remove();
  };
  s.onerror = function () {
    console.warn("ERROR: Useful-scripts inject script FAILED " + s.src);
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

injectScriptFile("/content-scripts/globals_debugger.js");
injectScriptFile("/content-scripts/useful-scripts-utils.js");

if (location.hostname === "mp3.zing.vn")
  injectScriptFile("/content-scripts/mp3.zing.vn.js");

// if (location.hostname === "luanxt.com")
//   injectScriptFile("//code.jquery.com/jquery-3.6.1.min.js", true);

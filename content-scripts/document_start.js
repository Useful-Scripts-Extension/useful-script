function injectFile(filePath) {
  var s = document.createElement("script");
  s.src = chrome.runtime.getURL(filePath);
  s.onload = function () {
    console.log("Useful-scripts injected " + filePath);
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

injectFile("/content-scripts/useful-scripts-utils.js");

if (location.hostname === "mp3.zing.vn")
  injectFile("/content-scripts/mp3.zing.vn.js");

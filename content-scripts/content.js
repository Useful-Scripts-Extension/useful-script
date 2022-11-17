function injectFile(filePath) {
  var s = document.createElement("script");
  s.src = chrome.runtime.getURL(filePath);
  s.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement || document.body).appendChild(s);
}

injectFile("/content-scripts/mp3.zing.vn.js");

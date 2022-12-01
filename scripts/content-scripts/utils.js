export const baseURL = "/scripts/content-scripts/scripts/";

export function injectScript(filePathOrUrl, isExternal = false) {
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

// TODO: https://developer.chrome.com/docs/extensions/reference/scripting/#method-insertCSS
// https://stackoverflow.com/a/17840622
export function injectCss(cssfileOrCode, isFile = true) {
  if (isFile) {
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = chrome.runtime.getURL(cssfileOrCode);
    window.onload = () => {
      document.body.appendChild(css);
      console.log("Useful-scripts injected " + css.href);
    };
  } else {
    var css = document.createElement("style");
    if ("textContent" in css) css.textContent = cssText;
    else css.innerText = cssText;
    window.onload = () => {
      document.body.appendChild(css);
      console.log("Useful-scripts injected " + css);
    };
  }
}

export const baseURL = "/content-scripts/scripts/";

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

// https://stackoverflow.com/a/17840622
export function injectCss(cssfile) {
  // var css = document.createElement("style");
  // if ("textContent" in css) css.textContent = cssText;
  // else css.innerText = cssText;
  // document.body.appendChild(css);

  var css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = chrome.runtime.getURL(cssfile);
  window.onload = () => {
    document.body.appendChild(css);
    console.log("Useful-scripts injected " + css.href);
  };
}

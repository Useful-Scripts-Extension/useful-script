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
export function injectCss(url_file_code, type = "file") {
  if (type === "file" || type === "url") {
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href =
      type === "file" ? chrome.runtime.getURL(url_file_code) : url_file_code;
    document.head.appendChild(css);
    console.log("Useful-scripts injected " + css.href);
  } else if (type === "code") {
    var css = document.createElement("style");
    if ("textContent" in css) css.textContent = url_file_code;
    else css.innerText = url_file_code;
    document.head.appendChild(css);
    console.log("Useful-scripts injected " + css);
  }
}

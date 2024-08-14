// TODO: split this file into multiple helper files

export const UfsGlobal = {
  Extension: {
    sendToContentScript,
    runInContentScript,
    runInBackground,
    fetchByPassOrigin,
    getURL,
    download,
    trackEvent,
    waitForTabToLoad,
  },
  DOM: {
    getSelectionText,
    keyDown,
    keyUp,
    closest,
    notifyStack,
    notify,
    deleteElements,
    onElementsAdded,
    onElementRemoved,
    onElementAttributeChanged,
    onElementTextContentChanged,
    onHrefChanged,
    injectCssCode,
    injectCssFile,
    getTrustedPolicy,
    createTrustedHtml,
    createTrustedScript,
    executeScript,
    injectScriptSrc,
    injectScriptSrcAsync,
    isElementInViewport,
    getOverlapScore,
    getWatchingVideoSrc,
  },
  Utils: {
    getRedirectedUrl,
    sanitizeName,
    debounce,
    makeUrlValid,
    getNumberFormatter,
    sleep,
    saveAs,
    formatSize,
    promiseAllStepN,
    copyToClipboard,
    moneyFormat,
    getOriginalWindowFunction,
    chooseFolderToDownload,
    downloadToFolder,
    downloadBlobUrl,
    downloadBlob,
    downloadData,
  },
};

if (typeof window !== "undefined") window.UfsGlobal = UfsGlobal;

// #region Extension

// TODO sentToPageScript

// use basic customEvent technique - only communicate within the same document or window context
function sendToContentScript(event, data) {
  return new Promise((resolve, reject) => {
    let uuid = Math.random().toString(36); // uuid to distinguish events
    let listenerKey = "ufs-contentscript-sendto-pagescript" + uuid;
    window.addEventListener(listenerKey, (evt) => resolve(evt.detail.data), {
      once: true,
    });
    window.dispatchEvent(
      new CustomEvent("ufs-pagescript-sendto-contentscript", {
        detail: { event, data, uuid },
      })
    );
  });
}
function runInContentScript(fnPath, params) {
  // WARNING: can only transfer serializable data
  return sendToContentScript("ufs-runInContentScript", {
    fnPath,
    params,
  });
}
function runInBackground(fnPath, params) {
  if (typeof chrome?.runtime?.sendMessage == "function") {
    return chrome.runtime.sendMessage({
      action: "ufs-runInBackground",
      data: { fnPath, params },
    });
  }
  return sendToContentScript("ufs-runInBackground", {
    fnPath,
    params,
  });
}
async function fetchByPassOrigin(url, options = {}) {
  try {
    let _url = makeUrlValid(url);
    let urlObject = new URL(_url);
    // https://stackoverflow.com/a/9375786/23648002
    if (location.hostname == urlObject?.hostname) {
      _url = urlObject.pathname;
    }
    return await fetch(_url, options);
  } catch (e) {
    console.log("NORMAL FETCH FAIL: ", e);
  }
  return await runInBackground("fetch", [url]);
}
function getURL(filePath) {
  return runInContentScript("chrome.runtime.getURL", [filePath]);
}
function trackEvent(scriptId) {
  return runInBackground("trackEvent", [scriptId]);
}
function waitForTabToLoad(tabId) {
  return runInBackground("utils.waitForTabToLoad", [tabId]);
}

// https://developer.chrome.com/docs/extensions/reference/api/downloads#type-DownloadOptions
/**
 * A function to trigger a download using chrome.downloads API.
 *
 * @param {Object} options - The options for the download operation.
 * @param {string} options.url - The URL to download.
 * @param {string} [options.body] - Post body.
 * @param {{name: string, value: string}[]} [options.headers] - Extra HTTP headers to send with the request if the URL uses the HTTP[s] protocol. Each header is represented as a dictionary containing the keys name and either value or binaryValue, restricted to those allowed by XMLHttpRequest.
 * @param {'GET'|'POST'} [options.method] - The HTTP method to use for the download.
 * @param {string} [options.filename] - A file path relative to the Downloads directory to contain the downloaded file, possibly containing subdirectories.
 * @param {string} [options.saveAs] - Use a file-chooser to allow the user to select a filename regardless of whether filename is set or already exists.
 * @param {'uniquify'|'overwrite'|'prompt'} [options.conflictAction] - The action to take if filename already exists.
 * @return {Promise<number>} - A promise that resolves to the ID of the created download.
 */
function download(options) {
  return runInBackground("chrome.downloads.download", [options]);
}

// #endregion

// #region DOM

function getSelectionText() {
  var text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text;
}

//prettier-ignore
function keyDown(e){let n=document.createEvent("KeyboardEvent");Object.defineProperty(n,"keyCode",{get:function(){return this.keyCodeVal}}),n.initKeyboardEvent?n.initKeyboardEvent("keydown",!0,!0,document.defaultView,e,e,"","",!1,""):n.initKeyEvent("keydown",!0,!0,document.defaultView,!1,!1,!1,!1,e,0),n.keyCodeVal=e,document.body.dispatchEvent(n)}
//prettier-ignore
function keyUp(e){let n=document.createEvent("KeyboardEvent");Object.defineProperty(n,"keyCode",{get:function(){return this.keyCodeVal}}),n.initKeyboardEvent?n.initKeyboardEvent("keyup",!0,!0,document.defaultView,e,e,"","",!1,""):n.initKeyEvent("keyup",!0,!0,document.defaultView,!1,!1,!1,!1,e,0),n.keyCodeVal=e,document.body.dispatchEvent(n)}

function closest(element, selector) {
  let el = element;
  while (el !== null) {
    if (el.matches(selector)) return el;

    let found = el.querySelector(selector);
    if (found) return found;

    el = el.parentElement;
  }
  return el;
}
// TODO: finish this
function notifyStack(msg) {
  let id = "ufs_notify_stack";
  let exist = document.getElementById(id);
  if (!exist) {
    exist = document.createElement("div");
    exist.id = id;
    (document.body || document.documentElement).appendChild(exist);

    let style = document.createElement("style");
    style.innerText = `
      #ufs_notify_stack {
        position: fixed;
        top: 10px;
        right: 10px;
        max-width: 300px;
        z-index: 2147483647;
      }
      .ufs-notify-stack-item {
        background-color: #333;
        color: #fff;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
        transition: all 0.3s ease;
      }
    `;
    exist.appendChild(style);
  }

  let notiItem = document.createElement("div");
  notiItem.classList.add("ufs-notify-stack-item");
  notiItem.innerText = msg;
  exist.appendChild(notiItem);

  setTimeout(() => {
    notiItem.remove();
  }, 3000);
}
function notify({
  msg = "",
  x = window.innerWidth / 2,
  y = window.innerHeight - 100,
  align = "center",
  styleText = "",
  duration = 3000,
} = {}) {
  let id = "ufs_notify_div";
  let exist = document.getElementById(id);
  if (exist) exist.remove();

  // create notify msg in website at postion, fade out animation, auto clean up
  let div = document.createElement("div");
  div.id = id;
  div.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      padding: 10px;
      background-color: #333;
      color: #fff;
      border-radius: 5px;
      z-index: 2147483647;
      transition: all 1s ease-out;
      ${
        align === "right"
          ? "transform: translateX(-100%);"
          : align === "center"
          ? "transform: translateX(-50%);"
          : ""
      }
      ${styleText || ""}
    `;
  div.innerHTML = createTrustedHtml(msg);
  (document.body || document.documentElement).appendChild(div);

  let timeouts = [];
  function closeAfter(_time) {
    timeouts.forEach((t) => clearTimeout(t));
    timeouts = [
      setTimeout(() => {
        if (div) {
          div.style.opacity = 0;
          div.style.top = `${y - 50}px`;
        }
      }, _time - 1000),
      setTimeout(() => {
        div?.remove();
      }, _time),
    ];
  }

  closeAfter(duration);

  return {
    closeAfter: closeAfter,
    remove() {
      if (div) {
        div.remove();
        div = null;
        return true;
      }
      return false;
    },
    setText(text, duration) {
      if (div) {
        div.innerHTML = createTrustedHtml(text);
        if (duration) closeAfter(duration);
        return true;
      }
      return false;
    },
    setPosition(x, y) {
      if (div) {
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        return true;
      }
      return false;
    },
  };
}
function deleteElements(selector, once) {
  onElementsAdded(
    selector,
    (nodes) => {
      [].forEach.call(nodes, function (node) {
        node.remove();
        console.log("Useful-scripts: element removed ", node);
      });
    },
    once
  );
}
// https://stackoverflow.com/a/46428962
function onHrefChanged(callback, once) {
  let oldHref = document.location.href;
  const body = document.querySelector("body");
  const observer = new MutationObserver((mutations) => {
    let curHref = document.location.href;
    if (oldHref !== curHref) {
      callback?.(oldHref, curHref);
      oldHref = document.location.href;
      if (once) observer.disconnect();
    }
  });
  observer.observe(body, { childList: true, subtree: true });
}
// Idea from  https://github.com/gys-dev/Unlimited-Stdphim
// https://stackoverflow.com/a/61511955/11898496
function onElementsAdded(selector, callback, once) {
  let nodes = document.querySelectorAll(selector);
  if (nodes?.length) {
    callback(nodes);
    if (once) return;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.addedNodes) return;

      for (let node of mutation.addedNodes) {
        if (node.nodeType != 1) continue; // only process Node.ELEMENT_NODE

        let n = node.matches(selector)
          ? [node]
          : Array.from(node.querySelectorAll(selector));

        if (n?.length) {
          callback(n);
          if (once) observer.disconnect();
        }
      }
    });
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });

  // return disconnect function
  return () => observer.disconnect();
}
function onElementRemoved(element, callback) {
  if (!element.parentElement) throw new Error("element must have parent");

  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        if (mutation.removedNodes.length > 0) {
          for (let node of mutation.removedNodes) {
            if (node === element) {
              callback?.(node);
              observer.disconnect();
            }
          }
        }
      }
    });
  });

  observer.observe(element.parentElement, {
    childList: true,
  });

  return () => observer.disconnect();
}
function onElementAttributeChanged(element, callback, once) {
  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "attributes") {
        console.log(mutation);
        callback?.(mutation);
        if (once) observer.disconnect();
      }
    });
  });

  observer.observe(element, {
    // TODO attributeFilter
    attributeOldValue: true,
    attributes: true,
  });

  return () => observer.disconnect();
}
function onElementTextContentChanged(element, callback, once) {
  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        callback?.(mutation);
        if (once) observer.disconnect();
      }
    });
  });
  // https://stackoverflow.com/a/40195712/23648002
  observer.observe(element, {
    characterData: false,
    attributes: false,
    childList: true,
    subtree: false,
  });
  return () => observer.disconnect();
}
function injectCssCode(code) {
  let css = document.createElement("style");
  if ("textContent" in css) css.textContent = code;
  else css.innerText = code;
  (document.head || document.documentElement).appendChild(css);
  return css;
}
function injectCssFile(filePath, id) {
  let css = document.createElement("link");
  css.setAttribute("rel", "stylesheet");
  css.setAttribute("type", "text/css");
  css.setAttribute("href", filePath);
  if (id) css.setAttribute("id", id);
  (document.head || document.documentElement).appendChild(css);
  return css;
}
function getTrustedPolicy() {
  let policy = window.trustedTypes?.ufsTrustedTypesPolicy || null;
  if (!policy) {
    policy = window.trustedTypes.createPolicy("ufsTrustedTypesPolicy", {
      createHTML: (string, sink) => string,
      createScriptURL: (string) => string,
      createScript: (string) => string,
    });
  }
  return policy;
}
function createTrustedHtml(html) {
  let policy = getTrustedPolicy();
  return policy.createHTML(html);
}
function createTrustedScript(code) {
  let policy = getTrustedPolicy();
  return policy.createScript(code);
}
function executeScript(code) {
  let script = document.createElement("script");
  script.textContent = createTrustedScript(code);
  (document.head || document.documentElement).appendChild(script);
  script.onload = function () {
    script.remove();
  };
}
function injectScriptSrc(src, callback) {
  let policy = getTrustedPolicy();
  let jsSrc = policy.createScriptURL(src);
  let script = document.createElement("script");
  script.onload = function () {
    callback?.(true);
  };
  script.onerror = function (e) {
    callback?.(false, e);
  };
  script.src = jsSrc; // Assigning the TrustedScriptURL to src
  (document.head || document.documentElement).appendChild(script);
  return script;
}
function injectScriptSrcAsync(src) {
  return new Promise((resolve, reject) => {
    let script = injectScriptSrc(src, (success, e) => {
      if (success) {
        resolve(script);
      } else {
        reject(e);
      }
    });
  });
}
// https://stackoverflow.com/a/7557433/23648002
function isElementInViewport(el) {
  // Special bonus for those using jQuery
  if (typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
  }

  let rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight ||
        document.documentElement.clientHeight) /* or $(window).height() */ &&
    rect.right <=
      (window.innerWidth ||
        document.documentElement.clientWidth) /* or $(window).width() */
  );
}
function getOverlapScore(el) {
  let rect = el.getBoundingClientRect();
  return (
    Math.min(
      rect.bottom,
      window.innerHeight || document.documentElement.clientHeight
    ) - Math.max(0, rect.top)
  );
}
function makeUrlValid(url) {
  if (url.startsWith("//")) {
    url = "https:" + url;
  }
  if (url.startsWith("/")) {
    url = location.origin + url;
  }
  return url;
}
function getWatchingVideoSrc() {
  // video or xg-video tag
  let videos = Array.from(document.querySelectorAll("video, xg-video"));
  let sorted = videos
    .filter((v) => isElementInViewport(v))
    .sort((a, b) => {
      return getOverlapScore(b) - getOverlapScore(a);
    });

  for (let v of sorted) {
    if (v.src) return makeUrlValid(v.src);
    let sources = Array.from(v.querySelectorAll("source"));
    for (let s of sources) {
      if (s.src) return makeUrlValid(s.src);
    }
  }
}
// #endregion

// #region Utils

async function getRedirectedUrl(url) {
  try {
    while (true) {
      let res = await UfsGlobal.Extension.fetchByPassOrigin(url, {
        method: "HEAD",
      });
      if (res?.redirected) {
        console.log("redirected:", url, "->", res.url);
        url = res.url;
      } else {
        return url;
      }
    }
  } catch (e) {
    console.log("ERROR:", e);
    return url;
  }
}

// https://github.com/parshap/node-sanitize-filename/blob/master/index.js
// https://github.com/Dinoosauro/tiktok-to-ytdlp/blob/main/script.js
function sanitizeName(name, modifyIfPosible = true) {
  if (typeof name !== "string") {
    throw new Error("Input must be string");
  }
  const replacement = "";
  const illegalRe = /[\/\?<>\\:\*\|"’#]/g;
  const controlRe = /[\x00-\x1f\x80-\x9f]/g;
  const reservedRe = /^\.+$/;
  const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
  const windowsTrailingRe = /[\. ]+$/;
  if (modifyIfPosible) {
    name = name
      .replaceAll("<", "‹")
      .replaceAll(">", "›")
      .replaceAll(":", "∶")
      .replaceAll('"', "″")
      .replaceAll("/", "∕")
      .replaceAll("\\", "∖")
      .replaceAll("|", "¦")
      .replaceAll("?", "¿");
  }
  const sanitized = name
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(windowsTrailingRe, replacement);
  return sanitized; // TODO truncates to length of 255
}
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

const numberFormatCached = {};
/**
 * Get number formatter
 * @param {string} optionSelect "compactLong", "standard", "compactShort"
 * @param {string|undefined} locale Browser locale
 * @return {Intl.NumberFormat}
 */
function getNumberFormatter(optionSelect, locale) {
  if (!locale) {
    if (document.documentElement.lang) {
      locale = document.documentElement.lang;
    } else if (navigator.language) {
      locale = navigator.language;
    } else {
      try {
        locale = new URL(
          Array.from(document.querySelectorAll("head > link[rel='search']"))
            ?.find((n) => n?.getAttribute("href")?.includes("?locale="))
            ?.getAttribute("href")
        )?.searchParams?.get("locale");
      } catch {
        console.log(
          "Cannot find browser locale. Use en as default for number formatting."
        );
        locale = "en";
      }
    }
  }
  let formatterNotation;
  let formatterCompactDisplay;
  switch (optionSelect) {
    case "compactLong":
      formatterNotation = "compact";
      formatterCompactDisplay = "long";
      break;
    case "standard":
      formatterNotation = "standard";
      formatterCompactDisplay = "short";
      break;
    case "compactShort":
    default:
      formatterNotation = "compact";
      formatterCompactDisplay = "short";
  }

  let key = locale + formatterNotation + formatterCompactDisplay;
  if (!numberFormatCached[key]) {
    const formatter = Intl.NumberFormat(locale, {
      notation: formatterNotation,
      compactDisplay: formatterCompactDisplay,
    });
    numberFormatCached[key] = formatter;
  }
  return numberFormatCached[key];
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function saveAs(url_blob_file, title = "download", options = {}) {
  try {
    if (!window.saveAs) {
      await import("../libs/file-saver/index.js");
    }

    window.saveAs(url_blob_file, title, options);
  } catch (e) {
    alert("Error: " + e);
  }
}
function formatSize(size, fixed = 0) {
  size = Number(size);
  if (!size) return "?";

  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return size.toFixed(fixed) + units[unitIndex];
}
// modified by chatgpt based on: https://gist.github.com/jcouyang/632709f30e12a7879a73e9e132c0d56b
function promiseAllStepN(n, list) {
  const head = list.slice(0, n);
  const tail = list.slice(n);
  const resolved = [];
  return new Promise((resolve) => {
    let processed = 0;
    function runNext() {
      if (processed === tail.length) {
        resolve(Promise.all(resolved));
        return;
      }
      const promise = tail[processed]();
      resolved.push(
        promise.then((result) => {
          runNext();
          return result;
        })
      );
      processed++;
    }
    head.forEach((func) => {
      const promise = func();
      resolved.push(
        promise.then((result) => {
          runNext();
          return result;
        })
      );
    });
  });
}
function copyToClipboard(text) {
  // Check if Clipboard API is supported
  if (!navigator.clipboard) {
    alert("Clipboard API not supported, falling back to older method.");
    function fallbackCopyToClipboard(text) {
      const tempInput = document.createElement("input");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      console.log("Text copied to clipboard (fallback method)");
    }
    return fallbackCopyToClipboard(text);
  }

  // Copy text to clipboard
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy text to clipboard:", err);
    });
}
function moneyFormat(number, fixed = 0) {
  if (isNaN(number)) return 0;
  number = number.toFixed(fixed);
  let delimeter = ",";
  number += "";
  let rgx = /(\d+)(\d{3})/;
  while (rgx.test(number)) {
    number = number.replace(rgx, "$1" + delimeter + "$2");
  }
  return number;
}
// https://stackoverflow.com/a/69543476/11898496
function getOriginalWindowFunction(fnName) {
  const key = "ufs_original_windown_fn";
  if (!window[key]) window[key] = {};

  if (!window[key][fnName]) {
    let iframe = window[key]["iframe"];

    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      window[key]["iframe"] = iframe;
    }

    window[key][fnName] = iframe.contentWindow[fnName];
  }

  return window[key][fnName];
}
async function chooseFolderToDownload(subDirName = "") {
  const dirHandler = await window.showDirectoryPicker({
    mode: "readwrite",
    // startIn: 'downloads',
  });
  await dirHandler.requestPermission({ writable: true });
  if (!subDirName) return dirHandler;

  const subDir = await dirHandler.getDirectoryHandle(subDirName, {
    create: true,
  });
  return subDir;
}
async function downloadToFolder({
  url,
  fileName,
  dirHandler,
  expectBlobTypes,
  subFolderName = "",
}) {
  if (!url) return false;
  try {
    // const f = getOriginalWindowFunction("fetch");
    const res = await fetch(url);
    const blob = await res.blob();
    // blobtype canbe regex
    if (
      expectBlobTypes?.length &&
      !expectBlobTypes.find((t) =>
        t?.test ? t.test(blob.type) : t === blob.type
      )
    ) {
      throw new Error(
        `Blob type ${blob.type} doesn't match expected type ${expectBlobTypes}`
      );
    }
    const fileHandler = await dirHandler.getFileHandle(fileName, {
      create: true,
    });
    const writable = await fileHandler.createWritable();
    await writable.write(blob);
    await writable.close();
    return true;
  } catch (e) {
    console.error(e, arguments);

    // backup download: using extension api
    await download({
      url: url,
      conflictAction: "overwrite",
      filename: (subFolderName ? subFolderName + "/" : "") + fileName,
    });
    return false;
  }
}

// TODO use saveAs instead all of these download functions
async function downloadBlobUrl(url, title) {
  try {
    let res = await fetch(url);
    let blob = await res.blob();
    downloadBlob(blob, title);
  } catch (e) {
    alert("Error: " + e);
  }
}
function downloadBlob(blob, filename) {
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  a.style.display = "none";
  a.click();
  URL.revokeObjectURL(blobUrl);
}
function downloadData(data, filename, type = "text/plain") {
  let file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    let a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
// #endregion

UfsGlobal.DEBUG = {
  // Có trang web tự động xoá console để ngăn cản người dùng xem kết quả thực thi câu lệnh trong console
  // Ví dụ: https://beta.nhaccuatui.com/
  // Hàm này sẽ tắt chức năng tự động clear console đó, giúp hacker dễ hack hơn :)
  disableAutoConsoleClear() {
    console.clear = () => null;
    console.log("Auto console.clear DISABLED!");
  },

  // Hiển thị tất cả các biến toàn cục được tạo ra trong trang web
  // https://mmazzarolo.com/blog/2022-02-14-find-what-javascript-variables-are-leaking-into-the-global-scope/
  listGlobalVariables() {
    let browserGlobals = [];
    const ignoredGlobals = ["UfsGlobal"];

    function collectBrowserGlobals() {
      const iframe = document.createElement("iframe");
      iframe.src = "about:blank";
      document.body.appendChild(iframe);
      let globals = Object.keys(iframe.contentWindow);
      document.body.removeChild(iframe);
      return globals;
    }

    function getRuntimeGlobals() {
      if (browserGlobals.length === 0) {
        browserGlobals = collectBrowserGlobals();
      }
      const runtimeGlobals = Object.keys(window).filter(
        (key) => !ignoredGlobals.includes(key) && !browserGlobals.includes(key)
      );
      const runtimeGlobalsObj = {};
      runtimeGlobals.forEach((key, i) => {
        runtimeGlobalsObj[key] = window[key];
      });
      return runtimeGlobalsObj;
    }

    return getRuntimeGlobals();
  },

  // https://mmazzarolo.com/blog/2022-02-16-track-down-the-javascript-code-responsible-for-polluting-the-global-scope/
  addGlobalToInspect(globalName) {
    function onGlobalDeclaration(globalName) {
      console.trace();
      debugger;
    }

    Object.defineProperty(window, globalName, {
      set: function (value) {
        onGlobalDeclaration(globalName);
        window[`__globals-debugger-proxy-for-${globalName}__`] = value;
      },
      get: function () {
        return window[`__globals-debugger-proxy-for-${globalName}__`];
      },
      configurable: true,
    });
  },

  // https://mmazzarolo.com/blog/2022-07-30-checking-if-a-javascript-native-function-was-monkey-patched/
  // Kiểm tra xem function nào đó có bị override hay chưa
  isNativeFunction(f) {
    return f.toString().toString().includes("[native code]");
  },

  // https://mmazzarolo.com/blog/2022-06-26-filling-local-storage-programmatically/
  // Làm đầy localStorage
  fillLocalStorage() {
    const key = "__filling_localstorage__";
    let max = 1;
    let data = "x";
    try {
      while (true) {
        data = data + data;
        localStorage.setItem(key, data);
        max <<= 1;
      }
    } catch {}
    for (let bit = max >> 1; bit > 0; bit >>= 1) {
      try {
        localStorage.setItem(key, data.substring(0, max | bit));
        max |= bit;
      } catch {
        console.success("Storage is now completely full 🍟");
      }
    }
    return function cleanup() {
      localStorage.removeItem(key);
      console.success("Storage is cleaned");
    };
  },

  // https://mmazzarolo.com/blog/2022-02-16-track-down-the-javascript-code-responsible-for-polluting-the-global-scope/
  // Tìm chuỗi xung quanh chuỗi bất kỳ
  // Ví dụ fullString = "abcd1234567890abcd" targetString = "6" bound = 3
  // => Kết quả around = 3456789
  getTextAround(fullString, targetString, bound = 10) {
    let curIndex = 0;
    let arounds = [];
    let limit = 100;

    while (limit) {
      let index = fullString.indexOf(targetString, curIndex);
      if (index === -1) break;

      let around = fullString.slice(
        Math.max(index - Math.floor(bound / 2) - 1, 0),
        Math.min(
          index + targetString.length + Math.floor(bound / 2),
          fullString.length
        )
      );
      arounds.push({ index, around });
      curIndex = index + (targetString.length || 1);
      limit--;
    }
    return arounds;
  },

  // https://stackoverflow.com/a/40410744/11898496
  // Giải mã từ dạng 'http\\u00253A\\u00252F\\u00252Fexample.com' về 'http://example.com'
  decodeEscapedUnicodeString(str) {
    if (!str) return "";
    let res = str;
    while (res.includes("\\u")) {
      res = decodeURIComponent(
        JSON.parse('"' + res.replace(/\"/g, '\\"') + '"')
      );
    }
    return res;
  },

  // https://stackoverflow.com/a/8649003
  searchParamsToObject(search = location.search) {
    const params = new URLSearchParams(search);
    const searchObject = Object.fromEntries(params);
    return searchObject;
  },
};

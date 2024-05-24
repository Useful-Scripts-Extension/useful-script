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
    getMousePos,
    isInCrossOriginFrame,
    isInIframe,
    checkElementvisibility,
    closest,
    addLoadingAnimation,
    addLoadingAnimationAtPos,
    enableDragAndZoom,
    getContentClientRect,
    dataURLToCanvas,
    notifyStack,
    notify,
    onDoublePress,
    createFlashTitle,
    clickASAP,
    deleteElements,
    waitForElements,
    onElementsVisible,
    injectCssCode,
    injectCssFile,
    getTrustedPolicy,
    createTrustedHtml,
    executeScript,
    injectScriptSrc,
    injectScriptSrcAsync,
    isElementInViewport,
    getOverlapScore,
    makeUrlValid,
    getWatchingVideoSrc,
  },
  Utils: {
    deepClone,
    debounce,
    throttle,
    domainCheck,
    sleep,
    setCookie,
    delCookie,
    strBetween,
    json2xml,
    xml2json,
    getLargestSrcset,
    svgBase64ToUrl,
    svgToBlobUrl,
    svgToBase64,
    getResolutionCategory,
    saveAs,
    isEmoji,
    formatTimeToHHMMSSDD,
    timeoutPromise,
    getRedirectedUrl,
    getLargestImageSrc,
    isImageSrc,
    findWorkingSrc,
    canonicalUri,
    formatSize,
    promiseAllStepN,
    hook,
    parseJwt,
    copyToClipboard,
    isEmptyFunction,
    escapeRegExp,
    unescapeRegExp,
    encodeQueryString,
    moneyFormat,
    zipAndDownloadBlobs,
    getBlobFromUrl,
    getBlobFromUrlWithProgress,
    downloadBlobUrl,
    downloadBlob,
    downloadURL,
    downloadData,
  },
};

// store cache for all functions in UfsGlobal
const CACHED = {
  mouse: {
    x: 0,
    y: 0,
  },
};

if (typeof window !== "undefined") {
  window.UfsGlobal = UfsGlobal;
  if (typeof window?.addEventListener === "function") {
    window.addEventListener("mousemove", (e) => {
      CACHED.mouse.x = e.clientX;
      CACHED.mouse.y = e.clientY;
    });
  }
}
function getMousePos() {
  return CACHED.mouse;
}

// #region Extension

// TODO sentToPageScript

// use basic customEvent technique - only communicate within the same document or window context
function sendToContentScript(event, data) {
  return new Promise((resolve, reject) => {
    let uuid = Math.random().toString(36); // uuid to distinguish events
    let listenerKey = "ufs-contentscript-sendto-pagescript" + uuid;
    let listener = (evt) => {
      resolve(evt.detail.data);
      window.removeEventListener(listenerKey, listener);
    };
    window.addEventListener(listenerKey, listener);
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
  return sendToContentScript("ufs-runInBackground", {
    fnPath,
    params,
  });
}
function fetchByPassOrigin(url, options = {}) {
  try {
    let _url = url;
    let urlObject = new URL(url);
    // https://stackoverflow.com/a/9375786/23648002
    if (location.hostname == urlObject?.hostname) {
      _url = urlObject.pathname;
    }
    return fetch(_url, options);
  } catch (e) {
    console.log("NORMAL FETCH FAIL: ", e);
  }
  return runInBackground("fetch", [url]);
}
function getURL(filePath) {
  return runInContentScript("chrome.runtime.getURL", [filePath]);
}
function download(options) {
  return runInBackground("chrome.downloads.download", [options]);
}
function trackEvent(scriptId) {
  return runInBackground("trackEvent", [scriptId]);
}
function waitForTabToLoad(tabId) {
  return runInBackground("utils.waitForTabToLoad", [tabId]);
}
// #endregion

// #region DOM
function isInCrossOriginFrame() {
  let result = true;
  try {
    if (window.top.localStorage || window.top.location.href) {
      result = false;
    }
  } catch (e) {
    result = true;
  }
  return result;
}
function isInIframe() {
  return window !== window.top;
}
function checkElementvisibility(elem) {
  if (!elem.offsetHeight && !elem.offsetWidth) {
    return false;
  }
  if (getComputedStyle(elem).visibility === "hidden") {
    return false;
  }
  return true;
}
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
function addLoadingAnimationAtPos(
  x,
  y,
  size = 40,
  containerStyle = "",
  loadingStyle = ""
) {
  let ele = document.createElement("div");
  ele.style.cssText = `
    position: fixed;
    left: ${x - size / 2}px;
    top: ${y - size / 2}px;
    width: ${size}px;
    height: ${size}px;
    z-index: 2147483647;
    pointer-events: none;
    user-select: none;
    ${containerStyle}
  `;
  addLoadingAnimation(ele, size, loadingStyle);
  document.body.appendChild(ele);
  return () => ele.remove();
}
function addLoadingAnimation(
  element,
  size = Math.min(element?.clientWidth, element?.clientHeight) || 0,
  customStyle = ""
) {
  let id = Math.random().toString(36).substr(2, 9);
  element.classList.add("ufs-loading-" + id);

  let borderSize = 4;

  // inject css code
  let style = document.createElement("style");
  style.id = "ufs-loading-style-" + id;
  style.textContent = `
    .ufs-loading-${id}::after {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: ${size}px;
      height: ${size}px;
      margin-top: -${size / 2}px;
      margin-left: -${size / 2}px;
      border-radius: 50%;
      border: ${borderSize}px solid #555 !important;
      border-top-color: #eee !important;
      animation: ufs-spin 1s ease-in-out infinite;
      box-sizing: border-box !important;
      ${customStyle}
    }
    @keyframes ufs-spin {
      to {
        transform: rotate(360deg);
      }
    }
    `;
  (document.head || document.documentElement).appendChild(style);

  return () => {
    if (element) element.classList.remove("ufs-loading-" + id);
  };
}
function enableDragAndZoom(element, container, callback) {
  // set style
  element.style.cssText += `
      cursor: grab;
      position: relative;
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -khtml-user-select: none;
      max-width: unset !important;
      max-height: unset !important;
      min-width: unset !important;
      min-height: unset !important;
      -webkit-user-drag: none !important;
    `;

  // Variables to track the current position
  var lastX = 0;
  var lastY = 0;
  var dragging = false;
  let mouse = { x: 0, y: 0 };

  // Mouse down event listener
  (container || element).addEventListener("mousedown", function (e) {
    e.preventDefault();
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    element.style.cursor = "grabbing";
  });

  // Mouse move event listener
  document.addEventListener("mousemove", function (e) {
    mouse = { x: e.clientX, y: e.clientY };
    if (dragging) {
      let x = e.clientX - lastX + element.offsetLeft;
      let y = e.clientY - lastY + element.offsetTop;

      element.style.left = x + "px";
      element.style.top = y + "px";
      callback?.({ x, y, type: "move" });

      lastX = e.clientX;
      lastY = e.clientY;
    }
  });

  // Mouse up event listener
  document.addEventListener("mouseup", function () {
    dragging = false;
    element.style.cursor = "grab";
  });

  // Mouse leave event listener
  document.addEventListener("mouseleave", function () {
    dragging = false;
    element.style.cursor = "grab";
  });

  // Mouse wheel event listener for zooming
  (container || element).addEventListener("wheel", function (e) {
    e.preventDefault();
    var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
    var scaleFactor = 1.2;
    var scale = delta > 0 ? scaleFactor : 1 / scaleFactor;

    // Calculate mouse position relative to the container
    // var rect = container.getBoundingClientRect();
    // var mouseX = e.clientX - rect.left;
    // var mouseY = e.clientY - rect.top;

    // Adjust scale at mouse position
    var offsetX = mouse.x - element.offsetLeft;
    var offsetY = mouse.y - element.offsetTop;

    var newWidth = element.width * scale;
    var newHeight = element.height * scale;

    if (newWidth < 3 || newHeight < 3) {
      return;
    }

    var newLeft =
      element.offsetLeft -
      (newWidth - element.width) * (offsetX / element.width);
    var newTop =
      element.offsetTop -
      (newHeight - element.height) * (offsetY / element.height);

    element.style.width = newWidth + "px";
    element.style.height = newHeight + "px";
    element.style.left = newLeft + "px";
    element.style.top = newTop + "px";

    callback?.({ type: "scale" });
  });
}
// prettier-ignore
function getContentClientRect(target) {
    var rect = target.getBoundingClientRect();
    var compStyle = window.getComputedStyle(target);
    var pFloat = parseFloat;
    var top = rect.top + pFloat(compStyle.paddingTop) + pFloat(compStyle.borderTopWidth);
    var right = rect.right - pFloat(compStyle.paddingRight) - pFloat(compStyle.borderRightWidth);
    var bottom = rect.bottom - pFloat(compStyle.paddingBottom) - pFloat(compStyle.borderBottomWidth);
    var left = rect.left + pFloat(compStyle.paddingLeft) + pFloat(compStyle.borderLeftWidth);
    return {
        top : top,
        right : right,
        bottom : bottom,
        left : left,
        width : right-left,
        height : bottom-top,
    };
  }
function dataURLToCanvas(dataurl, cb) {
  if (!dataurl) return cb(null);
  var ctx = canvas.getContext("2d");
  var img = new Image();
  img.setAttribute("crossOrigin", "anonymous");
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    cb(canvas);
  };
  img.onerror = function () {
    cb(null);
  };
  img.src = dataurl;
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
  div.textContent = msg;
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
    setText(text) {
      if (div) {
        div.textContent = text;
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
function onDoublePress(key, callback, timeout = 500) {
  let timer = null;
  let clickCount = 0;

  const keyup = (event) => {
    if (event.key !== key) return;

    clickCount++;
    if (clickCount === 2) {
      callback?.();
      clickCount = 0;
      return;
    }

    clearTimeout(timer);
    timer = setTimeout(() => {
      clickCount = 0;
    }, timeout);
  };

  document.addEventListener("keyup", keyup);

  return () => {
    clearTimeout(timer);
    document.removeEventListener("keyup", keyup);
  };
} // https://stackoverflow.com/a/3381522
function createFlashTitle(newMsg, howManyTimes) {
  var original = document.title;
  var timeout;

  function step() {
    document.title = document.title == original ? newMsg : original;
    if (--howManyTimes > 0) {
      timeout = setTimeout(step, 1000);
    }
  }
  howManyTimes = parseInt(howManyTimes);
  if (isNaN(howManyTimes)) {
    howManyTimes = 5;
  }
  clearTimeout(timeout);
  step();

  function cancel() {
    clearTimeout(timeout);
    document.title = original;
  }

  return cancel;
}
// click element as soon as possible
function clickASAP(selector, sleepTime = 0) {
  const events = ["mouseover", "mousedown", "mouseup", "click"];
  const selectors = selector.split(", ");
  if (selectors.length > 1) {
    return selectors.forEach(clickASAP);
  }
  if (sleepTime > 0) {
    return sleep(sleepTime * 1000).then(function () {
      clickASAP(selector, 0);
    });
  }
  waitForElements(selector).then(function (element) {
    element.removeAttribute("disabled");
    element.removeAttribute("target");
    events.forEach((eventName) => {
      const eventObject = new MouseEvent(eventName, { bubbles: true });
      element.dispatchEvent(eventObject);
    });
  });
}
function deleteElements(selector, once) {
  onElementsVisible(
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
function waitForElements(selector) {
  return new Promise((resolve, reject) => {
    onElementsVisible(selector, resolve, true);
  });
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
function onElementsVisible(selector, callback, once) {
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
function injectCssCode(code) {
  var css = document.createElement("style");
  if ("textContent" in css) css.textContent = code;
  else css.innerText = code;
  (document.head || document.documentElement).appendChild(css);
}
function injectCssFile(filePath, id) {
  var css = document.createElement("link");
  css.setAttribute("rel", "stylesheet");
  css.setAttribute("type", "text/css");
  css.setAttribute("href", filePath);
  if (id) css.setAttribute("id", id);
  (document.head || document.documentElement).appendChild(css);
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
function executeScript(code) {
  let policy = getTrustedPolicy();
  return policy.createScript(code);
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
}
function injectScriptSrcAsync(src) {
  return new Promise((resolve, reject) => {
    injectScriptSrc(src, (success, e) => {
      if (success) {
        resolve();
      } else {
        reject(e);
      }
    });
  });
}
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.left < window.innerWidth &&
    rect.top < window.innerHeight
  );
}
function getOverlapScore(el) {
  var rect = el.getBoundingClientRect();
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

/**
 * Make a deep copy of an object
 * @source - required (Object|Array) the object or array to be copied
 */
function deepClone(source) {
  var result = {};

  if (typeof source !== "object") {
    return source;
  }
  if (Object.prototype.toString.call(source) === "[object Array]") {
    result = [];
  }
  if (Object.prototype.toString.call(source) === "[object Null]") {
    result = null;
  }
  for (var key in source) {
    result[key] =
      typeof source[key] === "object" ? deepClone(source[key]) : source[key];
  }
  return result;
}

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// https://dev.to/jeetvora331/throttling-in-javascript-easiest-explanation-1081
function throttle(mainFunction, delay) {
  let timerFlag = null; // Variable to keep track of the timer

  // Returning a throttled version
  return (...args) => {
    if (timerFlag === null) {
      // If there is no timer currently running
      mainFunction(...args); // Execute the main function
      timerFlag = setTimeout(() => {
        // Set a timer to clear the timerFlag after the specified delay
        timerFlag = null; // Clear the timerFlag to allow the main function to be executed again
      }, delay);
    }
  };
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function domainCheck(domains) {
  return new RegExp(domains).test(location.host);
}
function setCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    let expires = "; expires=" + date.toGMTString();
  } else {
    var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
  }
}
function delCookie(name) {
  setCookie(name, "", -1);
}
function strBetween(s, front, back, trim = false) {
  if (trim) {
    s = s.replaceAll(" ", "");
    s = s.trim();
    s = s.replaceAll("\n", " ");
  }
  return s.slice(
    s.indexOf(front) + front.length,
    s.indexOf(back, s.indexOf(front) + front.length)
  );
}
async function json2xml(json) {
  if (!window.json2xml) {
    let url = await getURL("/scripts/libs/xml-json/json2xml.js");
    await injectScriptSrcAsync(url);
  }
  return window.json2xml(json);
}
async function xml2json(xml) {
  if (!window.xml2json) {
    let url = await getURL("/scripts/libs/xml-json/xml2json.js");
    await injectScriptSrcAsync(url);
  }
  return window.xml2json(xml);
}
function getLargestSrcset(srcset) {
  var srcs = srcset.split(/[xw],/i),
    largeSize = -1,
    largeSrc = null;
  if (!srcs.length) return null;
  srcs.forEach((srci) => {
    let srcInfo = srci.trim().split(/(\s+|%20)/),
      curSize = parseInt(srcInfo[2] || 0);
    if (srcInfo[0] && curSize > largeSize) {
      largeSize = curSize;
      largeSrc = srcInfo[0];
    }
  });
  return largeSrc;
}
function svgBase64ToUrl(sgvBase64) {
  try {
    if (!/^data:image\/svg/.test(sgvBase64)) throw new Error("Invalid SVG");
    const svgContent = atob(sgvBase64.split(",")[1]);
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    setTimeout(() => URL.revokeObjectURL(url), 6e4);
    return url;
  } catch (e) {
    console.log("ERROR: ", e);
    return null;
  }
}
function svgToBlobUrl(svg) {
  let url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  return url;
}
function svgToBase64(svg) {
  try {
    return (
      "data:image/svg+xml;charset=utf-8;base64," +
      btoa(new XMLSerializer().serializeToString(svg))
    );
  } catch (e) {
    console.log("ERROR: ", e);
    return null;
  }
}
function getResolutionCategory(width, height) {
  let min = Math.min(width, height);
  let max = Math.max(width, height);

  if (max <= 256 && min <= 144) return "144p";
  if (max <= 320 && min <= 180) return "240p";
  if (max <= 640 && min <= 360) return "360p";
  if (max <= 640 && min <= 480) return "SD (480p)";
  if (max <= 1280 && min <= 720) return "HD (720p)";
  if (max <= 1600 && min <= 900) return "HD+ (900p)";
  if (max <= 1920 && min <= 1080) return "FHD (1080p)";
  if (max <= 2560 && min <= 1440) return "QHD (1440p)";
  if (max <= 3840 && min <= 2160) return "4K (2160p)";
  if (max <= 5120 && min <= 2880) return "5K (2880p)";
  if (max <= 7680 && min <= 4320) return "8K (4320p)";
  if (max <= 10240 && min <= 4320) return "10K (4320p)";
  if (max <= 15360 && min <= 8640) return "16K (8640p)";
  return "> 16K";
}
async function saveAs(url_blob_file, title = "download", options = {}) {
  try {
    if (!window.saveAs) {
      let url = await getURL("/scripts/libs/file-saver/index.js");
      await injectScriptSrcAsync(url);
    }

    window.saveAs(url_blob_file, title, options);
  } catch (e) {
    alert("Error: " + e);
  }
}
// https://stackoverflow.com/a/67705964/23648002
function isEmoji(text) {
  return text?.match(
    /^(\u00a9|\u00ae|[\u25a0-\u27bf]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])+$/
  );
}
function formatTimeToHHMMSSDD(date) {
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  const milliseconds = ("00" + date.getMilliseconds()).slice(-3);
  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}
function timeoutPromise(prom, time) {
  return Promise.race([
    prom,
    new Promise((_r, rej) => setTimeout(() => rej("time out " + time), time)),
  ]);
}
async function getRedirectedUrl(url) {
  try {
    while (true) {
      let res = await fetchByPassOrigin(url, {
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
function uniqueArray(array) {
  return Array.from(new Set(array));
}
function replaceUsingRegex(str, r, s) {
  var results = [];

  if (!Array.isArray(r) && !Array.isArray(s)) {
    if (r && r.test && r.test(str)) {
      results.push(str.replace(r, s));
    }
  } else if (!Array.isArray(r) && Array.isArray(s)) {
    if (r && r.test && r.test(str)) {
      for (let si = 0; si < s.length; si++) {
        results.push(str.replace(r, s[si]));
      }
    }
  } else if (Array.isArray(r) && !Array.isArray(s)) {
    for (let ri = 0; ri < r.length; ri++) {
      let _r = r[ri];
      if (_r && _r.test && _r.test(str)) {
        results.push(str.replace(_r, s));
      }
    }
  } else if (Array.isArray(r) && Array.isArray(s)) {
    for (let ri = 0; ri < r.length; ri++) {
      let _r = r[ri];
      if (_r && _r.test && _r.test(str)) {
        let _s = Array.isArray(s[ri]) ? s[ri] : [s[ri]];
        for (let si = 0; si < _s.length; si++) {
          results.push(str.replace(_r, _s[si]));
        }
      }
    }
  }

  return uniqueArray(results);
}
function testRegex(str, regexs) {
  if (!Array.isArray(regexs)) regexs = [regexs];
  for (let regex of regexs) {
    if (regex && regex.test && regex.test(str)) {
      return true;
    }
  }
  return false;
}
async function getLargestImageSrc(imgSrc, webUrl) {
  if (/^data:/i.test(imgSrc)) {
    return null;
  }

  // bypass redirect
  let redirectedUrl = await getRedirectedUrl(imgSrc);
  if (redirectedUrl) {
    imgSrc = redirectedUrl;
  }

  function try1() {
    const url = new URL(imgSrc);
    switch (url.hostname) {
      // https://atlassiansuite.mservice.com.vn:8443/secure/useravatar?size=small&ownerId=JIRAUSER14656&avatarId=11605
      case "atlassiansuite.mservice.com.vn":
      case "atlassiantool.mservice.com.vn":
        if (url.href.includes("avatar")) {
          if (url.searchParams.get("size")) {
            url.searchParams.set("size", "256");
          } else {
            url.searchParams.append("size", "256");
          }
        }
        if (url.href.includes("/thumbnail/")) {
          return url.href.replace("/thumbnail/", "/attachments/");
        }
        if (url.href.includes("/thumbnails/")) {
          return url.href.replace("/thumbnails/", "/attachments/");
        }
        return url.toString();
    }
    return null;
  }

  async function try2() {
    if (!CACHED.largeImgSiteRules) {
      let url = await getURL("/scripts/auto_redirectLargestImageSrc_rules.js");
      let s = await import(url);
      CACHED.largeImgSiteRules = s.default;
    }
    for (let rule of CACHED.largeImgSiteRules) {
      if (rule.url && !testRegex(webUrl, rule.url)) continue;
      if (rule.src && !testRegex(imgSrc, rule.src)) continue;
      if (rule.exclude && testRegex(imgSrc, rule.exclude)) continue;
      if (rule.r) {
        let newSrc = replaceUsingRegex(imgSrc, rule.r, rule.s);
        if (newSrc?.length) {
          return newSrc;
        }
      }
    }
    return null;
  }

  // https://greasyfork.org/en/scripts/2312-resize-image-on-open-image-in-new-tab
  function try3() {
    return new Promise((resolve) => {
      var m = null;
      //google
      if (
        (m = imgSrc.match(
          /^(https?:\/\/lh\d+\.googleusercontent\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i
        ))
      ) {
        if (m[2] != "s0") {
          resolve(m[1] + "s0" + m[3]);
        }
      } else if (
        (m = imgSrc.match(
          /^(https?:\/\/lh\d+\.googleusercontent\.com\/.+=)(.+)(?:\?.+)?$/i
        ))
      ) {
        if (m[2] != "s0") {
          resolve(m[1] + "s0");
        }
      } else if (
        (m = imgSrc.match(
          /^(https?:\/\/\w+\.ggpht\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i
        ))
      ) {
        if (m[2] != "s0") {
          resolve(m[1] + "s0" + m[3]);
        }
      }

      //blogspot
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/\w+\.bp\.blogspot\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i
        ))
      ) {
        if (m[2] != "s0") {
          resolve(m[1] + "s0" + m[3]);
        }
      }

      //tumblr
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/\d+\.media\.tumblr\.com\/.*tumblr_\w+_)(\d+)(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i
        ))
      ) {
        if (m[2] < 1280) {
          var ajax = new XMLHttpRequest();
          ajax.onreadystatechange = function () {
            if (ajax.status == 200) {
              resolve(m[1] + "1280" + m[3]);
            }
          };
          ajax.open("HEAD", m[1] + "1280" + m[3], true);
          ajax.send();
        }
      }

      //twitter
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/\w+\.twimg\.com\/media\/[^\/:]+)\.(jpg|jpeg|gif|png|bmp|webp)(:\w+)?$/i
        ))
      ) {
        var format = m[2];
        if (m[2] == "jpeg") format = "jpg";
        resolve(m[1] + "?format=" + format + "&name=orig");
      } else if (
        (m = imgSrc.match(/^(https?:\/\/\w+\.twimg\.com\/.+)(\?.+)$/i))
      ) {
        let url = new URL(webUrl);
        var pars = url.searchParams;
        if (!pars.format || !pars.name) return;
        if (pars.name == "orig") return;
        resolve(m[1] + "?format=" + pars.format + "&name=orig");
      }

      //Steam (Only user content)
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/(images\.akamai\.steamusercontent\.com|steamuserimages-a\.akamaihd\.net)\/[^\?]+)\?.+$/i
        ))
      ) {
        resolve(m[1]);
      }

      //性浪微博
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/(?:(?:ww|wx|ws|tvax|tva)\d+|wxt|wt)\.sinaimg\.(?:cn|com)\/)([\w\.]+)(\/.+)(?:\?.+)?$/i
        ))
      ) {
        if (m[2] != "large") {
          resolve(m[1] + "large" + m[3]);
        }
      }

      //zhihu
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/.+\.zhimg\.com\/)(?:\d+\/)?([\w\-]+_)(\w+)(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i
        ))
      ) {
        if (m[3] != "r") {
          resolve(m[1] + m[2] + "r" + m[4]);
        }
      }

      //pinimg
      else if (
        (m = imgSrc.match(/^(https?:\/\/i\.pinimg\.com\/)(\w+)(\/.+)$/i))
      ) {
        if (m[2] != "originals") {
          resolve(m[1] + "originals" + m[3]);
        }
      } else if (
        (m = imgSrc.match(
          /^(https?:\/\/s-media[\w-]+\.pinimg\.com\/)(\w+)(\/.+)$/i
        ))
      ) {
        //need delete?
        if (m[2] != "originals") {
          resolve(m[1] + "originals" + m[3]);
        }
      }

      //bilibili
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/\w+\.hdslb\.com\/.+\.(jpg|jpeg|gif|png|bmp|webp))(@|_).+$/i
        ))
      ) {
        resolve(m[1]);
      }

      //taobao(tmall)
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/(?:.+?)\.alicdn\.com\/.+\.(jpg|jpeg|gif|png|bmp|webp))_.+$/i
        ))
      ) {
        resolve(m[1]);
      }

      //jd
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/(?:img\d+)\.360buyimg\.com\/)((?:.+?)\/(?:.+?))(\/(?:.+?))(\!.+)?$/i
        ))
      ) {
        if (m[2] != "sku/jfs") {
          resolve(m[1] + "sku/jfs" + m[3]);
        }
      }

      // https://s01.riotpixels.net/data/2a/b2/2ab23684-6cec-41da-9bce-f72c5264353a.jpg.240p.jpg
      else if (
        (m = imgSrc.match(
          /^(https?:\/\/(?:.+?)\.riotpixels\.net\/.+\.(jpg|jpeg|gif|png|bmp|webp))\..+?$/i
        ))
      ) {
        resolve(m[1]);
      }

      // reddit NEED TEST
      else if (
        (m = imgSrc.match(
          /^https?:\/\/preview\.redd\.it\/(.+\.(jpg|jpeg|gif|png|bmp|webp))\?.+?$/i
        ))
      ) {
        resolve("https://i.redd.it/" + m[1]);
      }

      // akamaized.net/imagecache NEED TEST
      else if (
        (m = imgSrc.match(
          /^(https:\/\/.+\.akamaized\.net\/imagecache\/\d+\/\d+\/\d+\/\d+\/)(\d+)(\/.+)$/i
        ))
      ) {
        if (m[2] < 1920) resolve(m[1] + "1920" + m[3]);
      }

      // 微信公众号 by sbdx
      else if (
        (m = imgSrc.match(
          /^(https:\/\/mmbiz\.qpic\.cn\/mmbiz_jpg\/.+?\/)(\d+)(\?wx_fmt=jpeg)/i
        ))
      ) {
        if (m[2] != 0) resolve(m[1] + "0" + m[3]);
      }

      //百度贴吧（然而对于画质提升什么的并没有什么卵用...）
      else if (
        (m = imgSrc.match(
          /^https?:\/\/imgsrc\.baidu\.com\/forum\/pic\/item\/.+/i
        ))
      ) {
        if (
          (m = imgSrc.match(
            /^(https?):\/\/(?:imgsrc|imgsa|\w+\.hiphotos)\.(?:bdimg|baidu)\.com\/(?:forum|album)\/.+\/(\w+\.(?:jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i
          ))
        ) {
          resolve(m[1] + "://imgsrc.baidu.com/forum/pic/item/" + m[2]);
        }
        //if( (m = imgSrc.match(/^(https?)(:\/\/(?:imgsrc|imgsa|\w+\.hiphotos|tiebapic)\.(?:bdimg|baidu)\.com\/)(?:forum|album)\/.+\/(\w+\.(?:jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i)) ){
        //	resolve(m[1] + m[2] + "forum/pic/item/" + m[3])
        //}
      } else {
        resolve(null);
      }
    });
  }

  for (let fn of [try1, try2, try3]) {
    try {
      let res = await timeoutPromise(fn(), 5000);
      if (res && res != imgSrc) {
        if (!Array.isArray(res)) res = [res];
        if (res.length) {
          let finalSrc = await findWorkingSrc(res, true);
          if (finalSrc?.length) return finalSrc;
        }
      }
    } catch (e) {
      console.log("ERROR getLargestImageSrc: " + fn.name + " -> ", e);
    }
  }

  return null;
}
async function isImageSrc(src) {
  try {
    const res = await fetchByPassOrigin(src, {
      method: "HEAD",
    });
    if (res.ok) {
      // const type = res.headers.get("content-type");
      const type = res.headers?.["content-type"];
      if (type && type.startsWith("image/")) {
        return true;
      }
    }
  } catch (error) {
    console.log("ERROR isImageSrc: " + src + " -> ", error);
  }

  return new Promise((resolve) => {
    let img = new Image();
    img.src = src;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
}
function findWorkingSrc(srcs, inOrder = true) {
  return new Promise((resolve, reject) => {
    if (!srcs || !Array.isArray(srcs) || srcs.length === 0) {
      reject("srcs is falsy, not an array, or empty");
    } else {
      const checkImage = (src) =>
        // prevent Error: Content Security Policy directive: "connect-src 'self'
        isImageSrc(src).then((value) => {
          if (inOrder) return value;
          if (value) resolve(src);
          return value;
        });

      const promises = srcs.map(checkImage);
      Promise.all(promises).then((res) => {
        let trueIndex = res.indexOf(true);
        if (trueIndex > -1) {
          resolve(srcs[trueIndex]);
        } else {
          reject("none of the URLs are valid images");
        }
      });
    }
  });
}
// resolve relative URLs into canonical absolute URLs based on the current location.
function canonicalUri(src, location = window.location) {
  if (src.charAt(0) == "#") return location.href + src;
  if (src.charAt(0) == "?")
    return location.href.replace(/^([^\?#]+).*/, "$1" + src);
  var root_page = /^[^?#]*\//.exec(location.href)[0],
    base_path = location.pathname.replace(/\/[^\/]+\.[^\/]+$/, "/"),
    root_domain = /^\w+\:\/\/\/?[^\/]+/.exec(root_page)[0],
    absolute_regex = /^\w+\:\/\//;
  src = src.replace("./", "");
  if (/^\/\/\/?/.test(src)) {
    src = location.protocol + src;
  } else if (!absolute_regex.test(src) && src.charAt(0) != "/") {
    src = (base_path || "") + src;
  }
  return absolute_regex.test(src)
    ? src
    : (src.charAt(0) == "/" ? root_domain : root_page) + src;
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
function hook(obj, name, callback) {
  const orig = obj[name];
  obj[name] = function (...args) {
    const result = orig.apply(this, args);
    callback?.({
      this: this,
      args: args,
      result: result,
    });
    return result;
  };
  return () => {
    // restore
    obj[name] = orig;
  };
}
// https://stackoverflow.com/a/38552302/11898496
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
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
// https://stackoverflow.com/a/7960435
function isEmptyFunction(func) {
  try {
    var m = func.toString().match(/\{([\s\S]*)\}/m)[1];
    return !m.replace(/^\s*\/\/.*$/gm, "");
  } catch (e) {
    console.log("Error isEmptyFunction", e);
    return false;
  }
}
// https://stackoverflow.com/a/9310752
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
// https://stackoverflow.com/q/38849009
function unescapeRegExp(text) {
  return text.replace(/\\(.)/g, "$1");
}
function encodeQueryString(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
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
async function zipAndDownloadBlobs(
  blobList,
  zipFileName,
  progressCallback,
  successCallback
) {
  if (!window.JSZip) {
    let url = await getURL("/scripts/libs/jzip/index.js");
    await injectScriptSrcAsync(url);
  }
  const zip = new window.JSZip();

  // Add each Blob to the ZIP archive with a unique name
  blobList.forEach(({ blob, fileName }, index) => {
    console.log(fileName);
    zip.file(fileName, blob);
  });

  // Generate the ZIP content with progress callback
  zip
    .generateAsync({ type: "blob" }, (metadata) => {
      if (progressCallback) {
        // Calculate progress as a percentage
        const progress = metadata.percent | 0;
        progressCallback(progress);
      }
    })
    .then((content) => {
      successCallback?.();
      saveAs(content, zipFileName);
    });
}
async function getBlobFromUrl(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    alert("Error: " + error);
  }
}
async function getBlobFromUrlWithProgress(url, progressCallback) {
  const response = await fetch(url, {});
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  const contentLength = response.headers.get("content-length");
  const total = parseInt(contentLength, 10);
  let loaded = 0;
  const reader = response.body.getReader();
  const chunks = [];

  const startTime = Date.now();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    loaded += value.byteLength;
    const ds = (Date.now() - startTime + 1) / 1000;
    progressCallback?.({
      loaded,
      total,
      speed: loaded / ds,
    });
    chunks.push(value);
  }

  const blob = new Blob(chunks, {
    type: response.headers.get("content-type"),
  });

  return blob;
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
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}
// https://stackoverflow.com/a/15832662/11898496
// TODO: chrome.downloads: https://developer.chrome.com/docs/extensions/reference/downloads/#method-download
function downloadURL(url, name) {
  var link = document.createElement("a");
  link.target = "_blank";
  link.download = name;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function downloadData(data, filename, type = "text/plain") {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    var a = document.createElement("a"),
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
    return decodeURIComponent(
      JSON.parse('"' + str.replace(/\"/g, '\\"') + '"')
    );
  },

  // https://stackoverflow.com/a/8649003
  searchParamsToObject(search = location.search) {
    const params = new URLSearchParams(search);
    const searchObject = Object.fromEntries(params);
    return searchObject;
  },
};

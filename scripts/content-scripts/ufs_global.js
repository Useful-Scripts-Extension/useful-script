/* This UsfGlobal can be used anywhere
content-script / page-script / popup-script / background-script
Call UseGlobal directly, no need to import
*/

(() => {
  const UfsGlobal = {
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
      injectScriptSrc,
      injectScriptSrcAsync,
      isElementInViewport,
      getOverlapScore,
      makeUrlValid,
      getWatchingVideoSrc,
    },
    Utils: {
      deepClone,
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

  (function (factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
      define([], factory);
    } else {
      var g;
      if (typeof window !== "undefined") {
        g = window;
      } else if (typeof global !== "undefined") {
        g = global;
      } else if (typeof self !== "undefined") {
        g = self;
      } else {
        g = this;
      }
      g.UfsGlobal = factory();
    }
  })(function () {
    return UfsGlobal;
  });

  // store cache for all functions in UfsGlobal
  const CACHED = {
    mouse: {
      x: 0,
      y: 0,
    },
  };

  if (typeof window !== "undefined") {
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
  function deleteElements(selector, willReRun) {
    onElementsVisible(
      selector,
      (nodes) => {
        [].forEach.call(nodes, function (node) {
          node.remove();
          console.log("Useful-scripts: element removed ", node);
        });
      },
      willReRun
    );
  }
  function waitForElements(selector) {
    return new Promise((resolve, reject) => {
      onElementsVisible(selector, resolve, false);
    });
  }
  // Idea from  https://github.com/gys-dev/Unlimited-Stdphim
  // https://stackoverflow.com/a/61511955/11898496
  function onElementsVisible(selector, callback, willReRun) {
    let nodes = document.querySelectorAll(selector);
    if (nodes?.length) {
      callback(nodes);
      if (!willReRun) return;
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
            if (!willReRun) observer.disconnect();
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
  async function getWatchingVideoSrc() {
    const { getOverlapScore, isElementInViewport, makeUrlValid } =
      UfsGlobal.DOM;

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
        let url = await getURL(
          "/scripts/auto_redirectLargestImageSrc_rules.js"
        );
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

  UfsGlobal.Facebook = {
    // Helpers
    async fetchGraphQl(str, fb_dtsg) {
      var fb_dtsg = "fb_dtsg=" + encodeURIComponent(fb_dtsg);
      fb_dtsg += str.includes("variables")
        ? "&" + str
        : "&q=" + encodeURIComponent(str);

      let res = await fetch("https://www.facebook.com/api/graphql/", {
        body: fb_dtsg,
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
      });

      let json = await res.json();
      return json;
    },
    decodeArrId(arrId) {
      return arrId[0] * 4294967296 + arrId[1];
    },
    async getFbdtsg() {
      let methods = [
        () => require("DTSGInitData").token,
        () => require("DTSG").getToken(),
        () => {
          return document.documentElement.innerHTML.match(
            /"DTSGInitialData",\[],{"token":"(.+?)"/
          )[1];
        },
        async () => {
          let res = await fetch("https://mbasic.facebook.com/photos/upload/");
          let text = await res.text();
          return text.match(/name="fb_dtsg" value="(.*?)"/)[1];
        },
        () => require("DTSG_ASYNC").getToken(), // TODO: trace xem tại sao method này trả về cấu trúc khác 2 method trên
      ];
      for (let m of methods) {
        try {
          let d = await m();
          if (d) return d;
        } catch (e) {}
      }
      return null;
    },
    // User Data
    getUserAvatarFromUid(uid) {
      return (
        "https://graph.facebook.com/" +
        uid +
        "/picture?height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"
      );
    },
    async getYourUserId() {
      let methods = [
        () => require("CurrentUserInitialData").USER_ID,
        () => require("RelayAPIConfigDefaults").actorID,
        () => document.cookie.match(/c_user=(\d+)/)[1],
        async () =>
          (
            await chrome.cookies.get({
              url: "https://www.facebook.com",
              name: "c_user",
            })
          ).value,
      ];
      for (let m of methods) {
        try {
          let d = await m();
          if (d) return d;
        } catch (e) {}
      }
      return null;
    },
    async getUserInfoFromUid(uid) {
      const variables = {
        userID: uid,
        shouldDeferProfilePic: false,
        useVNextHeader: false,
        scale: 1.5,
      };
      let f = new URLSearchParams();
      f.append("fb_dtsg", await UfsGlobal.Facebook.getFbdtsg());
      f.append("fb_api_req_friendly_name", "ProfileCometHeaderQuery");
      f.append("variables", JSON.stringify(variables));
      f.append("doc_id", "4159355184147969");

      let res = await fetch("https://www.facebook.com/api/graphql/", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: f,
      });

      let text = await res.text();
      return {
        uid: uid,
        name: UfsGlobal.DEBUG.decodeEscapedUnicodeString(
          /"name":"(.*?)"/.exec(text)?.[1]
        ),
        avatar: UfsGlobal.DEBUG.decodeEscapedUnicodeString(
          /"profilePicLarge":{"uri":"(.*?)"/.exec(text)?.[1] ||
            /"profilePicMedium":{"uri":"(.*?)"/.exec(text)?.[1] ||
            /"profilePicSmall":{"uri":"(.*?)"/.exec(text)?.[1] ||
            /"profilePic160":{"uri":"(.*?)"/.exec(text)?.[1]
        ),
        gender: /"gender":"(.*?)"/.exec(text)?.[1],
        alternateName: /"alternate_name":"(.*?)"/.exec(text)?.[1],
      };
    },
    async getUserInfo(uid, access_token) {
      let fields = [
        "birthday",
        "age_range",
        "email",
        "gender",
        "hometown",
        "languages",
        "last_name",
        "first_name",
        "location",
        "link",
        "middle_name",
        "name",
        "short_name",
        "picture",
      ].join(",");
      var n = `https://graph.facebook.com/${uid}/?fields=${fields}&access_token=${access_token}`;
      const e = await fetch(n);
      let json = await e.json();
      console.log(json);

      return {
        uid: uid,
        name: json?.name,
        avatar: json?.picture?.data?.url,
        gender: json?.gender,
      };
    },
    async getUidFromUrl(url) {
      let methods = [
        () => require("CometRouteStore").getRoute(url).rootView.props.userID,
        async () => {
          var response = await fetch(url);
          if (response.status == 200) {
            var text = await response.text();
            let uid = /(?<=\"userID\"\:\")(.\d+?)(?=\")/.exec(text);
            if (uid?.length) {
              return uid[0];
            }
          }
          return null;
        },
      ];

      for (let m of methods) {
        try {
          let uid = await m();
          if (uid) return uid;
        } catch (e) {}
      }
      return null;
    },
    // Story
    getStoryBucketIdFromURL(url) {
      return url.match(/stories\/(\d+)\//)?.[1];
    },
    getStoryId() {
      const htmlStory = document.getElementsByClassName(
        "xh8yej3 x1n2onr6 xl56j7k x5yr21d x78zum5 x6s0dn4"
      );
      return htmlStory[htmlStory.length - 1].getAttribute("data-id");
    },
    async getStoryInfo(bucketID, fb_dtsg) {
      // Source: https://pastebin.com/CNvUxpfc
      let body = new URLSearchParams();
      body.append("__a", 1);
      body.append("fb_dtsg", fb_dtsg);
      body.append(
        "variables",
        JSON.stringify({
          bucketID: bucketID,
          initialLoad: false,
          scale: 1,
        })
      );
      body.append("doc_id", 2586853698032602);

      let res = await fetch("https://www.facebook.com/api/graphql/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
        credentials: "include",
      });

      let json = await res.json();
      console.log(json);
      let data = json?.data?.bucket;

      if (!data) throw new Error("Không lấy được data");
      return {
        storyId: data.id,
        author: {
          id: data.owner.id,
          name: data.owner.name,
          avatar: data.owner.profile_picture.uri,
          avatarURL: data.owner.url,
        },
        Objects: data.unified_stories.edges.map((_, i) => {
          return {
            pictureBlurred:
              data.unified_stories.edges[i].node.attachments[0].media
                .blurredImage.uri,
            picturePreview:
              data.unified_stories.edges[i].node.attachments[0].media
                .previewImage.uri,
            totalReaction:
              data.unified_stories.edges[i].node.story_card_info
                .feedback_summary.total_reaction_count,
            backgroundCss:
              data.unified_stories.edges[i].node.story_default_background.color,
            backgroundCss3:
              data.unified_stories.edges[i].node.story_default_background
                .gradient.css,
            ...(data.unified_stories.edges[i].node.attachments[0].media
              .__typename == "Photo"
              ? {
                  caption:
                    data.unified_stories.edges[i].node.attachments[0].media
                      .accessibility_caption,
                  image:
                    data.unified_stories.edges[i].node.attachments[0].media
                      .image.uri,
                }
              : data.unified_stories.edges[i].node.attachments[0].media
                  .__typename == "Video"
              ? {
                  permanlinkUrl:
                    data.unified_stories.edges[i].node.attachments[0].media
                      .permalink_url,
                  playableVideo:
                    data.unified_stories.edges[i].node.attachments[0].media
                      .playable_url,
                  playableUrlDash:
                    data.unified_stories.edges[0].node.attachments[0].media
                      .playable_url_dash,
                  playableUrlHDString:
                    data.unified_stories.edges[i].node.attachments[0].media
                      .playableUrlHdString,
                  playableUrlHD:
                    data.unified_stories.edges[i].node.attachments[0].media
                      .playable_url_quality_hd,
                }
              : null),
          };
        }),
      };

      // let data =
      //   "__a=1&fb_dtsg=" +
      //   dtsg +
      //   "&variables=%7B%22bucketID%22%3A%22" +
      //   bucketID +
      //   "%22%2C%22initialLoad%22%3Afalse%2C%22scale%22%3A1%7D&doc_id=2586853698032602";

      // let xhr = new XMLHttpRequest();
      // xhr.withCredentials = true;
      // xhr.addEventListener("readystatechange", function () {
      //   if (this.readyState === 4) {

      //   }
      // });

      // xhr.open("POST", "https://www.facebook.com/api/graphql/");
      // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      // xhr.send(body);
    },
    // Friend
    async removeFriendConfirm(friend_uid, uid, fb_dtsg) {
      var f = new FormData();
      f.append("uid", friend_uid),
        f.append("unref", "bd_friends_tab"),
        f.append("floc", "friends_tab"),
        f.append("__user", uid),
        f.append("__a", 1),
        f.append("fb_dtsg", fb_dtsg);
      await fetch(
        "https://www.facebook.com/ajax/ajax/profile/removefriendconfirm.php?dpr=1",
        {
          method: "POST",
          credentials: "include",
          body: f,
        }
      );
    },
    async fetchAddedFriends(uid, fb_dtsg, cursor) {
      let variables = JSON.stringify({
        count: 8,
        cursor: cursor ?? null,
        category_key: "FRIENDS",
      });
      const t = new URLSearchParams();
      t.append("__user", uid),
        t.append("__a", 1),
        t.append("dpr", 1),
        t.append("fb_dtsg", fb_dtsg),
        t.append("fb_api_caller_class", "RelayModern"),
        t.append("fb_api_req_friendly_name", "ActivityLogStoriesQuery"),
        t.append("doc_id", "2761528123917382"),
        t.append("variables", variables);

      let res = await fetch("https://www.facebook.com/api/graphql/", {
        method: "POST",
        body: t,
      });
      let json = await res.json();

      let { edges, page_info } =
        json.data.viewer.activity_log_actor.activity_log_stories;

      return {
        nextCursor: page_info.end_cursor,
        data: edges
          .map((e) => {
            if (
              "UNFRIEND" === e.curation_options[0] ||
              e.node.attachments.length
            ) {
              return {
                uid: e.node.attachments[0].target.id,
                name: e.node.attachments[0].title_with_entities.text,
                avatar: e.node.attachments[0].media.image.uri,
                addedTime: 1e3 * e.node.creation_time,
              };
            }
            return null;
          })
          .filter((_) => _),
      };
    },
    async fetchAllAddedFriendsSince(uid, fb_dtsg, since, pageFetchedCallback) {
      let cursor = "";
      let allFriends = [];
      try {
        while (true) {
          let { nextCursor, data } = await UfsGlobal.Facebook.fetchAddedFriends(
            uid,
            fb_dtsg,
            cursor
          );
          cursor = nextCursor;
          allFriends = allFriends.concat(data);
          await pageFetchedCallback?.(data, allFriends);

          if (!nextCursor || (since && nextCursor < since)) break;
        }
      } catch (e) {
        console.log("ERROR fetch all added friends", e);
      }
      return allFriends;
    },
    // Messages
    async messagesCount(fb_dtsg) {
      return await UfsGlobal.Facebook.fetchGraphQl(
        `viewer(){
          message_threads {
            count,
            nodes {
              customization_info {
                emoji,
                outgoing_bubble_color,
                participant_customizations {
                  participant_id,
                  nickname
                }
              },
              all_participants {
                nodes {
                  messaging_actor {
                    name,
                    id,
                    profile_picture
                  }
                }
              },
              thread_type,
              name,
              messages_count,
              image,
              id
            }
          }
        }`.replace(/\s+/g, ""),
        fb_dtsg
      );
    },
    // Page
    async unlikePage(pageId, uid, fb_dtsg) {
      var f = new FormData();
      f.append("fbpage_id", pageId),
        f.append("add", false),
        f.append("reload", false),
        f.append("fan_origin", "page_timeline"),
        f.append("__user", uid),
        f.append("__a", 1),
        f.append("fb_dtsg", fb_dtsg);
      await fetch("https://www.facebook.com/ajax/pages/fan_status.php?dpr=1", {
        method: "POST",
        credentials: "include",
        body: f,
      });
    },
    async searchPageForOther(other_uid, cursor, uid, fb_dtsg) {
      let variables = JSON.stringify({
        count: 8,
        scale: 1,
        cursor: cursor ?? null,
        id: btoa(`app_collection:${other_uid}:2409997254:96`),
      });

      let f = new URLSearchParams();
      f.append("__user", uid);
      f.append("__a", 1);
      f.append("dpr", 1);
      f.append("fb_dtsg", fb_dtsg);
      f.append("fb_api_caller_class", "RelayModern");
      f.append(
        "fb_api_req_friendly_name",
        "ProfileCometAppCollectionGridRendererPaginationQuery"
      );
      f.append("variables", variables);
      f.append("doc_id", 2983410188445167);

      try {
        let res = await fetch("https://www.facebook.com/api/graphql/", {
          method: "POST",
          body: f,
        });

        let json = await res.json();
        let { items } = json.data.node;
        return {
          nextCursor: items.page_info.end_cursor,
          data: items.edges.map((e) => ({
            id: e.node.node?.id || btoa(e.node.id).split(":").at(-1),
            name: e.node.title.text,
            subTitle: e.node.subtitle_text?.text,
            url: e.node.url,
            image: e.node.image.uri,
            cursor: e.cursor,
          })),
          totalCount: items.count,
        };
      } catch (e) {
        console.log("ERROR fetch page", e);
        return {
          nextCursor: null,
          data: [],
          totalCount: 0,
        };
      }
    },
    async searchAllPageForOther(other_uid, uid, fb_dtsg, pageFetchedCallback) {
      let cursor = "";
      let allPages = [];
      try {
        while (true) {
          let { nextCursor, data, totalCount } =
            await UfsGlobal.Facebook.searchPageForOther(
              other_uid,
              cursor,
              uid,
              fb_dtsg
            );
          cursor = nextCursor;
          allPages = allPages.concat(data);
          await pageFetchedCallback?.(data, allPages, totalCount);

          if (!cursor) break;
        }
      } catch (e) {
        console.log("ERROR search all page for other", e);
      }
      return allPages;
    },
    // Group
    async leaveGroup(groupId, uid, fb_dtsg) {
      var f = new FormData();
      f.append("fb_dtsg", fb_dtsg),
        f.append("confirmed", 1),
        f.append("__user", uid),
        f.append("__a", 1);
      await fetch(
        "https://www.facebook.com/ajax/groups/membership/leave.php?group_id=" +
          groupId +
          "&dpr=1",
        {
          method: "POST",
          credentials: "include",
          body: f,
        }
      );
    },
    async searchGroupForOther(other_uid, cursor, uid, fb_dtsg) {
      let variables = JSON.stringify({
        count: 8,
        cursor: cursor ?? null,
        id: btoa(`app_collection:${other_uid}:2361831622:66`),
      });

      let f = new URLSearchParams();
      f.append("__user", uid);
      f.append("__a", 1);
      f.append("dpr", 1);
      f.append("fb_dtsg", fb_dtsg);
      f.append("fb_api_caller_class", "RelayModern");
      f.append(
        "fb_api_req_friendly_name",
        "ProfileCometAppCollectionGridRendererPaginationQuery"
      );
      f.append("variables", variables);
      f.append("doc_id", 5244211935648733);

      try {
        let res = await fetch("https://www.facebook.com/api/graphql/", {
          method: "POST",
          body: f,
        });

        let json = await res.json();
        let { pageItems } = json.data.node;
        return {
          nextCursor: pageItems.page_info.end_cursor,
          data: pageItems.edges.map((e) => ({
            id: e.node.node?.id || btoa(e.node.id).split(":").at(-1),
            title: e.node.title.text,
            subTitle: e.node.subtitle_text?.text,
            url: e.node.url,
            visibility: e.node.node.visibility,
            image: e.node.image.uri,
            membersCount: Number(
              // e.node.node.forum_member_profiles.formatted_count_text ||
              // e.node.node.group_member_profiles.formatted_count_text
              (e.node.subtitle_text.text.split("\n")?.[0] || "")
                .match(/\d+/g)
                .join("") ?? 1
            ),
            cursor: e.cursor,
          })),
        };
      } catch (e) {
        console.log("ERROR fetch page", e);
        return {
          nextCursor: null,
          data: [],
        };
      }
    },
    async searchAllGroupForOther(other_uid, uid, fb_dtsg, pageFetchedCallback) {
      let cursor = "";
      let allGroups = [];
      try {
        while (true) {
          let { nextCursor, data } =
            await UfsGlobal.Facebook.searchGroupForOther(
              other_uid,
              cursor,
              uid,
              fb_dtsg
            );
          cursor = nextCursor;
          allGroups = allGroups.concat(data);
          await pageFetchedCallback?.(data, allGroups);

          if (!cursor) break;
        }
      } catch (e) {
        console.log("ERROR search all group for other", e);
      }
      return allGroups;
    },
  };
  UfsGlobal.Instagram = {
    CACHED: {
      followers: {
        hash: "37479f2b8209594dde7facb0d904896a",
        edge: "edge_followed_by",
      },
      following: {
        hash: "58712303d941c6855d4e888c5f0cd22f",
        edge: "edge_follow",
      },
    },
    getBiggestMediaFromNode(node) {
      if (node.is_video) {
        return UfsGlobal.Instagram.getUniversalCdnUrl(node.video_url);
      } else {
        let r = node.display_resources;
        return r[r.length - 1]?.src;
      }
    },
    getUniversalCdnUrl(cdnLink) {
      const cdn = new URL(cdnLink);
      cdn.host = "scontent.cdninstagram.com";
      return cdn.href;
    },
    async getAllMedia({ uid, progressCallback, limit = 0 }) {
      let all_urls = [];
      let after = "";
      while (true) {
        let data = await fetch(
          `https://www.instagram.com/graphql/query/?query_hash=396983faee97f4b49ccbe105b4daf7a0&variables={"id":"${uid}","first":50,"after":"${after}"}`
        );
        let json = await data.json();
        console.log(json);
        let edges = json?.data?.user?.edge_owner_to_timeline_media?.edges || [];

        let urls = [];
        edges.forEach((e) => {
          let childs = e.node?.edge_sidecar_to_children?.edges;
          if (childs) {
            urls.push(
              ...childs.map((c) =>
                UfsGlobal.Instagram.getBiggestMediaFromNode(c.node)
              )
            );
          } else {
            urls.push(UfsGlobal.Instagram.getBiggestMediaFromNode(e.node));
          }
        });
        all_urls.push(...urls);
        progressCallback?.({
          current: all_urls.length,
          data: all_urls,
        });

        let pageInfo =
          json?.data?.user?.edge_owner_to_timeline_media?.page_info;
        if (!pageInfo?.has_next_page || (limit > 0 && all_urls.length >= limit))
          break;
        after = pageInfo?.end_cursor;
      }

      return all_urls;
    },
    async getInstaUserInfo(username) {
      let res = await fetch(
        "https://www.instagram.com/web/search/topsearch/?query=" + username
      );
      let json = await res.json();
      if (json.status != "ok")
        throw Error(
          t({ vi: "Server trả về lỗi", en: "Server response error" })
        );
      console.log(json);
      return json;
    },
    async getUidFromUsername(username) {
      let json = await UfsGlobal.Instagram.getInstaUserInfo(username);
      console.log(json);
      let firstUser = json?.users[0]?.user || {};
      if (firstUser.username != username) return null;
      return firstUser.pk;
    },
    getCrftoken() {
      try {
        return document.cookie
          .split("; ")
          .find((_) => _.startsWith("csrftoken"))
          .split("=")[1];
      } catch (e) {
        console.log("ERROR getCrftoken: ", e);
        return null;
      }
    },
    async getAllFollow({ type, uid, csrftoken, progressCallback, limit = 0 }) {
      if (!(type in UfsGlobal.Instagram.CACHED))
        throw Error(`Invalid type: ${type}`);

      async function _getFollow(uid, end_cursor) {
        let url = new URL("https://www.instagram.com/graphql/query/");
        Object.entries({
          query_hash: UfsGlobal.Instagram.CACHED[type].hash,
          variables: JSON.stringify({
            id: uid,
            after: end_cursor || "",
            first: 50,
          }),
        }).forEach(([k, v]) => url.searchParams.append(k, v));

        let res = await fetch(url, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": csrftoken,
            "x-requested-with": "XMLHttpRequest",
            "x-instagram-ajax": 1,
          },
        });
        return await res.json();
      }

      let cursor = "";
      let total = 0;
      let users = [];
      while (true) {
        try {
          let json = await _getFollow(uid, cursor);
          let {
            edges = [],
            count = 0,
            page_info,
          } = json?.data?.user?.[UfsGlobal.Instagram.CACHED[type].edge] || {};

          if (!total) total = limit <= 0 ? count : Math.min(count, limit);

          edges.forEach((e) => users.push(e.node));

          progressCallback?.({
            total,
            current: users.length,
            data: users,
          });

          if (
            !page_info?.has_next_page ||
            !edges.length ||
            (limit > 0 && users.length >= limit)
          )
            break;
          cursor = page_info?.end_cursor || "";
        } catch (e) {
          console.log("ERROR", e);
          break;
        }
      }

      return users;
    },
  };
  UfsGlobal.Tiktok = {
    downloadTiktokVideoFromId: async function (videoId) {
      for (let api of [
        "https://api22-normal-c-useast2a.tiktokv.com/aweme/v1/feed/?aweme_id=",
        "https://api16-normal-useast5.us.tiktokv.com/aweme/v1/feed/?aweme_id=",
        "https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=",
        "https://api2.musical.ly/aweme/v1/feed/?aweme_id=",
      ]) {
        try {
          const ts = Math.round(Date.now() / 1000);
          const parameters = {
            aweme_id: videoId,
            // version_name: appVersion,
            // version_code: manifestAppVersion,
            // build_number: appVersion,
            // manifest_version_code: manifestAppVersion,
            // update_version_code: manifestAppVersion,
            // openudid: UTIL.ranGen("0123456789abcdef", 16),
            // uuid: UTIL.ranGen("0123456789", 16),
            _rticket: ts * 1000,
            ts: ts,
            device_brand: "Google",
            device_type: "Pixel 4",
            device_platform: "android",
            resolution: "1080*1920",
            dpi: 420,
            os_version: "10",
            os_api: "29",
            carrier_region: "US",
            sys_region: "US",
            region: "US",
            app_name: "trill",
            app_language: "en",
            language: "en",
            timezone_name: "America/New_York",
            timezone_offset: "-14400",
            channel: "googleplay",
            ac: "wifi",
            mcc_mnc: "310260",
            is_my_cn: 0,
            aid: 1180,
            ssmix: "a",
            as: "a1qwert123",
            cp: "cbfhckdckkde1",
          };
          const params = Object.keys(parameters)
            .map((key) => `&${key}=${parameters[key]}`)
            .join("");
          let data = await runInBackground("fetch", [
            api + videoId + "&" + params,
          ]);
          console.log(data);
          let json = JSON.parse(data.body);
          console.log(json);
          let item = json.aweme_list.find((a) => a.aweme_id == videoId);
          if (!item) throw Error("Không tìm thấy video");
          let url =
            item?.video?.play_addr?.url_list?.[0] ||
            item?.video?.download_addr?.url_list?.[0];
          if (url) return url;
        } catch (e) {
          console.log("ERROR: " + e);
        }
      }
      return null;
    },
    CACHE: {
      snapTikToken: null,
    },
    downloadTiktokVideoFromUrl: async function (url, background = false) {
      try {
        let token = UfsGlobal.Tiktok.CACHE.snapTikToken;
        if (!token) {
          let token = await UfsGlobal.SnapTik.getToken(background);
          if (!token) throw Error("Không tìm thấy token snaptik");
          UfsGlobal.Tiktok.CACHE.snapTikToken = token;
        }

        let form = new FormData();
        form.append("url", url);
        form.append("token", token);

        let text;
        if (background) {
          let res = await runInBackground("fetch", [
            "https://snaptik.app/abc2.php",
            {
              method: "POST",
              body:
                "ufs-formData:" +
                JSON.stringify({
                  url: url,
                  token: token,
                }),
            },
          ]);
          text = res.body;
        } else {
          let res = await fetch("https://snaptik.app/abc2.php", {
            method: "POST",
            body: form,
          });
          text = await res.text();
        }
        let result = UfsGlobal.SnapTik.decode(text);
        return result;
      } catch (e) {
        console.log("ERROR: ", e);
      }
    },
  };
  UfsGlobal.SnapTik = {
    getToken: async (background = false) => {
      let text;
      if (background) {
        let res = await runInBackground("fetch", ["https://snaptik.app/"]);
        text = res.body;
      } else {
        let res = await fetch("https://snaptik.app/");
        text = await res.text();
      }
      let token = text.match(/name="token" value="(.+?)"/)?.[1];
      return token;
    },
    decode: (encoded) => {
      function b(d, e, f) {
        var g =
          "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split(
            ""
          );
        var h = g.slice(0, e);
        var i = g.slice(0, f);
        var j = d
          .split("")
          .reverse()
          .reduce(function (a, b, c) {
            if (h.indexOf(b) !== -1)
              return (a += h.indexOf(b) * Math.pow(e, c));
          }, 0);
        var k = "";
        while (j > 0) {
          k = i[j % f] + k;
          j = (j - (j % f)) / f;
        }
        return k || 0;
      }
      function c(h, u, n, t, e, r) {
        r = "";
        for (var i = 0, len = h.length; i < len; i++) {
          var s = "";
          while (h[i] !== n[e]) {
            s += h[i];
            i++;
          }
          for (var j = 0; j < n.length; j++)
            s = s.replace(new RegExp(n[j], "g"), j);
          r += String.fromCharCode(b(s, e, 10) - t);
        }
        return decodeURIComponent(escape(r));
      }

      let params = encoded.match(/}\((.*?)\)\)/)?.[1];
      params = params.split(",").map((_) => {
        if (!isNaN(Number(_))) return Number(_);
        if (_.startsWith('"')) return _.slice(1, -1);
        return _;
      });

      let result = c(...params);
      let jwt = result.match(/d\?token=(.*?)\&dl=1/)?.[1];
      if (!jwt) return null;
      let payload = parseJwt(jwt);
      return payload?.url;
    },
  };
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
          (key) =>
            !ignoredGlobals.includes(key) && !browserGlobals.includes(key)
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
})();

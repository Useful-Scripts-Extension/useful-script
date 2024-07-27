// Những hàm hay nhưng chưa được xài ở đâu sẽ được để ở đây
// Giúp giảm dung lượng cho UfsGlobal.js

// https://stackoverflow.com/a/3381522
function createFlashTitle(newMsg, howManyTimes) {
  let original = document.title;
  let timeout;

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

function waitForElements(selector) {
  return new Promise((resolve, reject) => {
    onElementsAdded(selector, resolve, true);
  });
}
function onElementVisibilityChanged(el, option, callback) {
  // use interaction observer
  let observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        callback?.(entry.isIntersecting);
      });
    },
    {
      root: option?.root ?? null,
      rootMargin: option?.rootMargin ?? "0px",
      threshold: option?.threshold ?? 0,
    }
  );
  observer.observe(el);
  return () => observer.unobserve(el);
}
/**
 * Waits for a condition to be true within a specified timeout.
 *
 * @param {function} condition - The condition to be evaluated.
 * @param {number} [timeout=1000] - The timeout in milliseconds.
 * @return {Promise} A Promise that resolves when the condition is true.
 */
function waitFor(condition, timeout = 0) {
  // return new Promise((resolve) => {
  //   let timer = setInterval(() => {
  //     if (condition()) {
  //       clearInterval(timer);
  //       resolve();
  //     }
  //   }, timeout);
  // });
  return new Promise(async (resolve) => {
    while (true) {
      if (condition()) {
        resolve();
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }
  });
}
// https://stackoverflow.com/a/7616484/23648002
function hashString(str) {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
/**
 * Make a deep copy of an object
 * @source - required (Object|Array) the object or array to be copied
 */
function deepClone(source) {
  let result = {};

  if (typeof source !== "object") {
    return source;
  }
  if (Object.prototype.toString.call(source) === "[object Array]") {
    result = [];
  }
  if (Object.prototype.toString.call(source) === "[object Null]") {
    result = null;
  }
  for (let key in source) {
    result[key] =
      typeof source[key] === "object" ? deepClone(source[key]) : source[key];
  }
  return result;
}
function domainCheck(domains) {
  return new RegExp(domains).test(location.host);
}
function setCookie(name, value, days) {
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    let expires = "; expires=" + date.toGMTString();
  } else {
    let expires = "";
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
    await import("../libs/xml-json/json2xml.js");
  }
  return window.json2xml(json);
}
async function xml2json(xml) {
  if (!window.xml2json) {
    await import("../libs/xml-json/xml2json.js");
  }
  return window.xml2json(xml);
}
function formatTimeToHHMMSSDD(date) {
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  const milliseconds = ("00" + date.getMilliseconds()).slice(-3);
  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}
// resolve relative URLs into canonical absolute URLs based on the current location.
function canonicalUri(src, location = window.location) {
  if (src.charAt(0) == "#") return location.href + src;
  if (src.charAt(0) == "?")
    return location.href.replace(/^([^\?#]+).*/, "$1" + src);
  let root_page = /^[^?#]*\//.exec(location.href)[0],
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
// https://stackoverflow.com/a/7960435
function isEmptyFunction(func) {
  try {
    let m = func.toString().match(/\{([\s\S]*)\}/m)[1];
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
  let str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}
async function zipAndDownloadBlobs(
  blobList,
  zipFileName,
  progressCallback,
  successCallback
) {
  if (!window.JSZip) {
    await import("../libs/jzip/index.js");
  }
  const zip = new window.JSZip();
  console.log(zip);

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
// https://stackoverflow.com/a/15832662/11898496
// TODO: chrome.downloads: https://developer.chrome.com/docs/extensions/reference/downloads/#method-download
function downloadURL(url, name) {
  let link = document.createElement("a");
  link.target = "_blank";
  link.download = name;
  link.href = url;
  link.click();
}

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

import { GlobalBlackList } from "./constants.js";

export async function sendEventToBackground(data) {
  // console.log("... Sending ", data, " to background...");
  const response = await chrome.runtime.sendMessage(data);
  // console.log("> ", data, " sent to background successfully", response);
  return response;
}

export async function sendEventToTab(tabId, data) {
  console.log("... Sending ", data, " to tab...");
  const response = await chrome.tabs.sendMessage(tabId, data);
  console.log("> ", data, " sent to tab successfully", response);
  return response;
}

// #region Storage Utils

// https://developer.chrome.com/docs/extensions/reference/storage/
export const localStorage = {
  set: async (key, value) => {
    await chrome.storage.sync.set({ [key]: value });
    return value;
  },
  get: async (key, defaultValue = "") => {
    let result = await chrome.storage.sync.get([key]);
    return result[key] || defaultValue;
  },
};

const listActiveScriptsKey = "activeScripts";
export async function setActiveScript(scriptId, isActive = true) {
  let list = await getAllActiveScriptId();
  if (isActive) list.push(scriptId);
  else list = list.filter((_) => _ != scriptId);
  list = list.filter((_) => _);
  await localStorage.set(listActiveScriptsKey, list.join(","));
  return list;
}

export async function isActiveScript(scriptId) {
  let currentList = await getAllActiveScriptId();
  return currentList.find((_) => _ == scriptId) != null;
}

export async function getAllActiveScriptId() {
  return (await localStorage.get(listActiveScriptsKey, "")).split(",");
}

export async function toggleActiveScript(scriptId) {
  let current = await isActiveScript(scriptId);
  let newVal = !current;
  await setActiveScript(scriptId, newVal);
  return newVal;
}

// #endregion

// #region Tab Utils

// https://developer.chrome.com/docs/extensions/reference/windows/#method-getLastFocused
// Lấy window trình duyệt được sử dụng gần nhất
// export const getLastFocusedWindow = () => {
//   return !!CACHED.lastWindowId
//     ? chrome.windows.get(CACHED.lastWindowId)
//     : chrome.windows.getLastFocused({
//         // populate: true,
//         windowTypes: ["normal"],
//       });
// };

// const CACHED = {
//   lastWindowId: 0,
// };

// https://developer.chrome.com/docs/extensions/reference/windows/#event-onFocusChanged
// chrome.windows.onFocusChanged.addListener(
//   (windowId) => {
//     if (windowId !== chrome.windows.WINDOW_ID_NONE)
//       CACHED.lastWindowId = windowId;
//   },
//   { windowTypes: ["normal"] }
// );

// Lấy ra tab hiện tại, trong window sử dung gần nhất
export const getCurrentTab = async () => {
  let tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });
  return tabs[0];
};

export const getCurrentTabId = async () => {
  return (await getCurrentTab())?.id;
};

// https://stackoverflow.com/a/25226679/11898496
export function focusToTab(tab) {
  return chrome.tabs.update(tab.id, { active: true });
}

export function closeTab(tab) {
  return chrome.tabs.remove(tab.id);
}

export const runScriptInTab = async ({ func, tabId, args = [] }) => {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        func: func,
        args: args,
        world: chrome.scripting.ExecutionWorld.MAIN,
        injectImmediately: true,
      },
      (injectionResults) => {
        // https://developer.chrome.com/docs/extensions/reference/scripting/#handling-results
        resolve(injectionResults?.find?.((_) => _.result)?.result);
      }
    );
  });
};

export const runScriptFile = ({ scriptFile, tabId, args = [] }) => {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: [scriptFile],
        args: args,
        world: chrome.scripting.ExecutionWorld.MAIN,
        injectImmediately: true,
      },
      (injectionResults) => {
        // https://developer.chrome.com/docs/extensions/reference/scripting/#handling-results
        resolve(injectionResults?.find?.((_) => _.result)?.result);
      }
    );
  });
};

export const runScriptInCurrentTab = async (func, args) => {
  const tab = await getCurrentTab();
  focusToTab(tab);
  return await runScriptInTab({ func, args, tabId: tab.id });
};

export const runScriptFileInCurrentTab = async (scriptFile, args) => {
  const tab = await getCurrentTab();
  focusToTab();
  return await runScriptFile({ scriptFile, args, tabId: tab.id });
};

export function checkBlackWhiteList(script, url) {
  if (!url) return false;

  let w = script.whiteList,
    b = script.blackList,
    hasWhiteList = w?.length > 0,
    hasBlackList = b?.length > 0,
    inWhiteList = w?.findIndex((_) => isUrlMatchPattern(url, _)) >= 0 ?? true,
    inBlackList = b?.findIndex((_) => isUrlMatchPattern(url, _)) >= 0 ?? false,
    inGlobalBlackList =
      GlobalBlackList.findIndex((_) => isUrlMatchPattern(url, _)) >= 0 ?? true;

  let willRun =
    !inGlobalBlackList &&
    ((!hasWhiteList && !hasBlackList) ||
      (hasWhiteList && inWhiteList) ||
      (hasBlackList && !inBlackList));

  return willRun;
}

export function isUrlMatchPattern(url, pattern) {
  // https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API
  // return new URLPattern(pattern).test(url);

  if (pattern.indexOf("*") < 0)
    return new URL(url).toString() == new URL(pattern).toString();

  let curIndex = 0,
    visiblePartsInPattern = pattern.split("*").filter((_) => _ !== "");
  for (let p of visiblePartsInPattern) {
    let index = url.indexOf(p, curIndex);
    if (index < 0) return false;
    curIndex = index + p.length;
  }
  return true;
}

// https://stackoverflow.com/a/68634884/11898496
export async function openWebAndRunScript({
  url,
  func,
  args,
  focusAfterRunScript = true,
  closeAfterRunScript = false,
}) {
  let tab = await chrome.tabs.create({ active: false, url: url });
  let res = await runScriptInTab({ func, tabId: tab.id, args });
  !closeAfterRunScript && focusAfterRunScript && focusToTab(tab);
  closeAfterRunScript && closeTab(tab);
  return res;
}

export function attachDebugger(tab) {
  return chrome.debugger.attach({ tabId: tab.id }, "1.2");
}
export function detachDebugger(tab) {
  return chrome.debugger.detach({ tabId: tab.id });
}

// OMG: https://www.howtogeek.com/423558/how-to-take-full-page-screenshots-in-google-chrome-without-using-an-extension/
// https://developer.chrome.com/docs/extensions/reference/debugger/#method-attach
// https://chromedevtools.github.io/devtools-protocol/
// https://chromedevtools.github.io/devtools-protocol/tot/Page/#event-captureScreenshot
export async function sendDevtoolCommand(tab, commandName, commandParams = {}) {
  let res = await chrome.debugger.sendCommand(
    { tabId: tab.id },
    commandName,
    commandParams
  );
  return res;
}

// https://developer.chrome.com/docs/extensions/reference/tabs/#method-captureVisibleTab
// https://stackoverflow.com/q/14990822/11898496
// Merge image uri
// https://stackoverflow.com/a/50658710/11898496
// https://stackoverflow.com/a/50658710/11898496
export async function captureVisibleTab(options = {}, willDownload = true) {
  let imgData = await chrome.tabs.captureVisibleTab(null, {
    format: options.format || "png",
    quality: options.quality || 100,
  });
  willDownload && downloadURI(imgData, "img.png");
  return imgData;
}

// #endregion

// #region Function Utils

export const isFunction = (o) => typeof o === "function";

// https://stackoverflow.com/a/7960435
export const isEmptyFunction = (func) => {
  try {
    var m = func.toString().match(/\{([\s\S]*)\}/m)[1];
    return !m.replace(/^\s*\/\/.*$/gm, "");
  } catch (e) {
    console.log("Error isEmptyFunction", e);
    return false;
  }
};

// #endregion

// #region String Utils

// https://stackoverflow.com/a/9310752
export function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// https://stackoverflow.com/q/38849009
export function unescapeRegExp(text) {
  return text.replace(/\\(.)/g, "$1");
}

// https://gist.github.com/bluzky/b8c205c98ff3318907b30c3e0da4bf3f
export function removeAccents(str) {
  var from =
      "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
    to =
      "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }

  str = str.toLowerCase().trim();
  // .replace(/[^a-z0-9\-]/g, "-")
  // .replace(/-+/g, "-");

  return str;
}

export function encodeQueryString(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

// #endregion

// #region Download Utils

// https://stackoverflow.com/a/39914235
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// https://stackoverflow.com/a/15832662/11898496
// TODO: chrome.downloads: https://developer.chrome.com/docs/extensions/reference/downloads/#method-download
export function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadData(data, filename, type) {
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

// #region Security

export async function getCookie(domain, raw = false) {
  let cookies = await chrome.cookies.getAll({ domain });
  return raw
    ? cookies
    : cookies.map((_) => _.name + "=" + decodeURI(_.value)).join(";");
}

export const JSONUtils = {
  // https://stackoverflow.com/a/9804835/11898496
  isJson(item) {
    item = typeof item !== "string" ? JSON.stringify(item) : item;
    try {
      item = JSON.parse(item);
    } catch (e) {
      return false;
    }
    if (typeof item === "object" && item !== null) {
      return true;
    }
    return false;
  },

  // https://stackoverflow.com/a/52799327/11898496
  hasJsonStructure(str) {
    if (typeof str !== "string") return false;
    try {
      const result = JSON.parse(str);
      const type = Object.prototype.toString.call(result);
      return type === "[object Object]" || type === "[object Array]";
    } catch (err) {
      return false;
    }
  },

  // https://stackoverflow.com/a/52799327/11898496
  safeJsonParse(str) {
    try {
      return [null, JSON.parse(str)];
    } catch (err) {
      return [err];
    }
  },

  // https://stackoverflow.com/a/54174739/11898496
  strObjToObject(strObj) {
    try {
      let jsonStr = strObj.replace(/(\w+:)|(\w+ :)/g, function (s) {
        return '"' + s.substring(0, s.length - 1) + '":';
      });
      prompt("", jsonStr);
      return [null, JSON.parse(jsonStr)];
    } catch (e) {
      return [e];
    }
  },
};

// https://stackoverflow.com/a/38552302/11898496
export function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

//#endregion

// #region Snap Utils (snaptik, snapinsta)

//prettier-ignore
export function doSomething(e,i,n){for(var r="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),t=r.slice(0,i),f=r.slice(0,n),o=e.split("").reverse().reduce(function(e,n,r){if(-1!==t.indexOf(n))return e+t.indexOf(n)*Math.pow(i,r)},0),c="";o>0;)c=f[o%n]+c,o=(o-o%n)/n;return c||"0"}
//prettier-ignore
export function doSomething2(r,o,e,n,a,f){f="";for(var t=0,g=r.length;t<g;t++){for(var h="";r[t]!==e[a];)h+=r[t],t++;for(var l=0;l<e.length;l++)h=h.replace(RegExp(e[l],"g"),l);f+=String.fromCharCode(doSomething(h,a,10)-n)}return decodeURIComponent(escape(f))}

// #endregion

// #region UI

// const seperated_popup_search_param = "isSeparatedPopup";

// Kiểm tra xem extension đang chạy trong popup rời hay không
// export const isExtensionInSeperatedPopup = () => {
//   let url = new URL(location.href);
//   return url.searchParams.has(seperated_popup_search_param);
// };

// Mở extension trong popup rời
// export const openExtensionInSeparatedPopup = () => {
//   let url = new URL(location.href);
//   url.searchParams.set(seperated_popup_search_param, 1);
//   popupCenter({ url: url.href, title: "Useful scripts", w: 450, h: 700 });
// };

// https://stackoverflow.com/a/4068385/11898496
export function popupCenter({ url, title, w, h }) {
  var left = screen.width / 2 - w / 2;
  var top = screen.height / 2 - h / 2;
  const newWindow = window.open(
    url,
    title,
    `
    scrollbars=yes,
    width=${w}, 
    height=${h}, 
    top=${top}, 
    left=${left}
    `
  );
  // newWindow.document.title = title;
  setTimeout(() => (newWindow.document.title = title), 0);
}

export function showLoading(text = "") {
  let html = `
    <div class="loading-container">
        <div>
            <div class="loader"></div><br/>
            <p class="text">${text}</p>
        </div>
    </div>
  `;
  let div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);

  return {
    closeLoading: () => div?.remove?.(),
    setLoadingText: (textOrFunction) => {
      let textP = document.querySelector(".loading-container .text");
      if (!textP) return;
      if (typeof textOrFunction === "function") {
        textP.innerHTML = textOrFunction(textP.innerHTML);
      } else {
        textP.innerHTML = textOrFunction;
      }
    },
  };
}

export function showPopup(title = "", innerHTML = "") {
  let html = `<div class="popup-container">
    <div class="popup-inner-container">
        <button class="close-btn">X</button>
        <h2 style="text-align: center; margin-bottom:10px">${title}</h2>
        ${innerHTML}
    </div>
  </div>`;
  let div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);

  document
    .querySelector(".popup-container .close-btn")
    ?.addEventListener?.("click", () => {
      div?.remove?.();
    });

  return {
    closePopup: () => div?.remove?.(),
  };
}

export function openPopupWithHtml(html, width = 300, height = 300) {
  let win = window.open(
    "",
    "",
    `scrollbars=yes,width=${width},height=${height}`
  );
  win.document.write(html);
}

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content. Forked for use without JQuery.
    Usage example:
        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );
        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (element) {
            element.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: Without JQuery, this fork does not look into the content of
    iframes.
*/
export function waitForKeyElements(
  selectorTxt /* Required: The selector string that specifies the desired element(s).*/,
  actionFunction /* Required: The code to run when elements are found. It is passed a jNode to the matched element.*/,
  bWaitOnce /* Optional: If false, will continue to scan for new elements even after the first match is found.*/
) {
  var targetNodes, btargetsFound;
  targetNodes = document.querySelectorAll(selectorTxt);

  if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    /*--- Found target node(s).  Go through each and act if they are new. */
    targetNodes.forEach(function (element) {
      var alreadyFound =
        element.dataset.found == "alreadyFound" ? "alreadyFound" : false;

      if (!alreadyFound) {
        //--- Call the payload function.
        var cancelFound = actionFunction(element);
        if (cancelFound) btargetsFound = false;
        else element.dataset.found = "alreadyFound";
      }
    });
  } else {
    btargetsFound = false;
  }

  //--- Get the timer-control variable for this selector.
  var controlObj = waitForKeyElements.controlObj || {};
  var controlKey = selectorTxt.replace(/[^\w]/g, "_");
  var timeControl = controlObj[controlKey];

  //--- Now set or clear the timer as appropriate.
  if (btargetsFound && bWaitOnce && timeControl) {
    //--- The only condition where we need to clear the timer.
    clearInterval(timeControl);
    delete controlObj[controlKey];
  } else {
    //--- Set a timer, if needed.
    if (!timeControl) {
      timeControl = setInterval(function () {
        waitForKeyElements(selectorTxt, actionFunction, bWaitOnce);
      }, 300);
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}

// #endregion

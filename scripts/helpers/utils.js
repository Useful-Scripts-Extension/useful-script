// LƯU Ý: Các hàm trong này chỉ dùng được trong extension context (các scripts có thuộc tính runInExtensionContext = true)
import { allScripts } from "../index.js";

const CACHED = {
  lastWindowId: 0,
};

// https://developer.chrome.com/docs/extensions/reference/windows/#event-onFocusChanged
chrome.windows.onFocusChanged.addListener(
  (windowId) => {
    if (windowId !== chrome.windows.WINDOW_ID_NONE)
      CACHED.lastWindowId = windowId;
  },
  { windowTypes: ["normal"] }
);

const seperated_popup_search_param = "isSeparatedPopup";
export const isExtensionInSeperatedPopup = () => {
  let url = new URL(location.href);
  return url.searchParams.has(seperated_popup_search_param);
};

export const openExtensionInSeparatedPopup = () => {
  let url = new URL(location.href);
  url.searchParams.set(seperated_popup_search_param, 1);
  popupCenter({ url: url.href, title: "Useful scripts", w: 450, h: 700 });
};

// https://developer.chrome.com/docs/extensions/reference/windows/#method-getLastFocused
export const getLastFocusedWindow = () => {
  return !!CACHED.lastWindowId
    ? chrome.windows.get(CACHED.lastWindowId)
    : chrome.windows.getLastFocused({
        // populate: true,
        windowTypes: ["normal"],
      });
};

export const getCurrentTab = async () => {
  let win = await getLastFocusedWindow();
  let tabs = await chrome.tabs.query({
    // currentWindow: false,
    // lastFocusedWindow: false,
    windowId: win.id,
    active: true,
  });
  return tabs[0];
};

export const runScript = async (func, tabId) => {
  return chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: func,
    world: "MAIN",
  });
};

export const runScriptFile = (scriptFile, tabId) => {
  return chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: [scriptFile],
    world: "MAIN",
  });
};

export const runScriptInCurrentTab = async (func) => {
  const tab = await getCurrentTab();
  focusToTab(tab);
  return await runScript(func, tab.id);
};

export const runScriptFileInCurrentTab = async (scriptFile) => {
  const tab = await getCurrentTab();
  focusToTab();
  return await runScriptFile(scriptFile, tab.id);
};

export const openUrlInNewTab = async (url) => {
  return chrome.tabs.create({ url });
};

export const openUrlAndRunScript = async (url, func) => {
  let tab = await openUrlInNewTab(url);
  return await runScript(func, tab.id);
};

export async function getCookie(domain, raw = false) {
  let cookies = await chrome.cookies.getAll({ domain });
  return raw
    ? cookies
    : cookies.map((_) => _.name + "=" + decodeURI(_.value)).join(";");
}

// https://stackoverflow.com/a/25226679/11898496
export function focusToTab(tab) {
  return chrome.tabs.update(tab.id, { active: true });
}

export function closeTab(tab) {
  return chrome.tabs.remove(tab.id);
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
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: func,
    args: args,
  });
  focusAfterRunScript && focusToTab(tab);
  closeAfterRunScript && closeTab(tab);
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

// https://developer.chrome.com/docs/extensions/reference/debugger/#event-onEvent
export async function onDebuggerEvent(commandName, callback) {
  ALL_DEBUGGER_EVENTS[commandName] = callback;
}
const ALL_DEBUGGER_EVENTS = {};
chrome.debugger.onEvent.addListener((source, commandName, commandParams) => {
  ALL_DEBUGGER_EVENTS[commandName]?.(commandParams, source);
});

// https://developer.chrome.com/docs/extensions/reference/tabs/#method-captureVisibleTab
// https://stackoverflow.com/q/14990822/11898496
export async function captureVisibleTab(options = {}, willDownload = true) {
  let imgData = await chrome.tabs.captureVisibleTab(null, {
    format: options.format || "png",
    quality: options.quality || 100,
  });
  willDownload && downloadURI(imgData, "img.png");
  return imgData;
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

// Merge image uri
// https://stackoverflow.com/a/50658710/11898496
// https://stackoverflow.com/a/50658710/11898496

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

export async function getAvailableScripts() {
  let url = (await getCurrentTab()).url;
  let avai = [];
  for (let script of Object.values(allScripts)) {
    if (await checkBlackWhiteList(script, url)) {
      avai.push(script);
    }
  }

  return avai;
}

export const GlobalBlackList = ["edge://*", "chrome://*"];
export async function checkBlackWhiteList(script, url = null) {
  if (!url) {
    url = (await getCurrentTab()).url;
  }

  let w = script.whiteList,
    b = script.blackList,
    hasWhiteList = w?.length > 0,
    hasBlackList = b?.length > 0,
    inWhiteList = w?.findIndex((_) => isUrlMatchPattern(url, _)) >= 0,
    inBlackList = b?.findIndex((_) => isUrlMatchPattern(url, _)) >= 0,
    inGlobalBlackList =
      GlobalBlackList.findIndex((_) => isUrlMatchPattern(url, _)) >= 0;

  let willRun =
    !inGlobalBlackList &&
    ((!hasWhiteList && !hasBlackList) ||
      (hasWhiteList && inWhiteList) ||
      (hasBlackList && !inBlackList));

  return willRun;
}

export function isUrlMatchPattern(url, pattern) {
  let curIndex = 0,
    visiblePartsInPattern = pattern.split("*").filter((_) => _ !== "");

  for (let p of visiblePartsInPattern) {
    let index = url.indexOf(p, curIndex);
    if (index < 0) return false;
    curIndex = index + p.length;
  }

  return true;
}

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
            <div class="loader"></div>
            ${text && `<br/><p class="text">${text}</p>`}
        </div>
    </div>

    <style>
        .loading-container {
            position: fixed;
            top:0;left:0;right:0;bottom:0;
            background:#333e;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
        }
        .loading-container .text {
            color: white;
        }
        .loading-container .loader {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            animation: spin 1s linear infinite;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            margin: 0 auto 5px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
  `;
  let div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);

  let textP = document.querySelector(".loading-container .text");

  return {
    closeLoading: () => div?.remove?.(),
    setLoadingText: (textOrFunction) => {
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
        ${
          title
            ? `<h2 style="text-align: center; margin-bottom:10px">${title}</h2>`
            : ""
        }
        ${innerHTML}
    </div>

    <style>
        .popup-container {
            position: fixed;
            top:0;left:0;right:0;bottom:0;
            background:#333e;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
        }
        .popup-inner-container {
          position: relative;
          max-width: 100vw;
          max-height: 100vh;
          padding: 10px;
          background: #eee;
          overflow: auto;
        }
        .popup-container .close-btn {
          position: absolute;
          top:0px;
          right:0px;
          background: #e22;
          color: white;
          padding: 5px 10px;
          border:none;
          cursor: pointer;
          max-width: 95%;
          max-height: 95%;
        }
    </style>
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

export function openPopupWithHtml(html) {
  let win = window.open("", "", "scrollbars=yes");
  win.document.write(html);
}

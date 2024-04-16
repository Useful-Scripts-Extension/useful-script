export async function sendEventToTab(tabId, data) {
  console.log("... Sending ", data, " to tab...");
  const response = await chrome.tabs.sendMessage(tabId, data);
  console.log("> ", data, " sent to tab successfully", response);
  return response;
}

// #region Storage Utils

// https://developer.chrome.com/docs/extensions/reference/storage/
// export const localStorage = {
//   set: async (key, value) => {
//     await chrome.storage.sync.set({ [key]: value });
//     return value;
//   },
//   get: async (key, defaultValue = "") => {
//     let result = await chrome.storage.sync.get([key]);
//     return result[key] || defaultValue;
//   },
// };

const listActiveScriptsKey = "activeScripts";
export async function setActiveScript(scriptId, isActive = true) {
  let list = await getAllActiveScriptId();
  if (isActive) list.push(scriptId);
  else list = list.filter((_) => _ != scriptId);
  list = list.filter((_) => _);
  // localStorage.setItem(listActiveScriptsKey, JSON.stringify(list));
  chrome.storage.local.set({ [listActiveScriptsKey]: list }); // save to storage => content script can access
  return list;
}

export async function isActiveScript(scriptId) {
  let currentList = await getAllActiveScriptId();
  return currentList.find((_) => _ == scriptId) != null;
}

export function getAllActiveScriptId() {
  return new Promise((resolve) => {
    chrome.storage.local.get([listActiveScriptsKey], (result) => {
      resolve(result[listActiveScriptsKey] || []);
    });
  });
}

export async function toggleActiveScript(scriptId) {
  let current = await isActiveScript(scriptId);
  let newVal = !current;
  setActiveScript(scriptId, newVal);
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

export const getCurrentTabUrl = async () => {
  return (await getCurrentTab())?.url;
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

  let w = script.whiteList || [],
    b = script.blackList || [],
    hasWhiteList = w.length > 0,
    hasBlackList = b.length > 0,
    inWhiteList = matchOneOfPatterns(url, w) ?? true,
    inBlackList = matchOneOfPatterns(url, b) ?? false;

  let willRun =
    (!hasWhiteList && !hasBlackList) ||
    (hasWhiteList && inWhiteList) ||
    (hasBlackList && !inBlackList);

  return willRun;
}

function matchOneOfPatterns(url, patterns) {
  for (let pattern of patterns) {
    const regex = new RegExp(
      "^" +
        pattern
          .split("*")
          .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join(".*") +
        "$"
    );
    if (regex.test(url)) return true;
  }
  return false;
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
  willDownload && UfsGlobal.Utils.downloadURL(imgData, "img.png");
  return imgData;
}

// #endregion

// https://gist.github.com/bluzky/b8c205c98ff3318907b30c3e0da4bf3f
export function removeAccents(str) {
  let from =
      "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
    to =
      "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }

  str = str.toLowerCase().trim();
  // .replace(/[^a-z0-9\-]/g, "-")
  // .replace(/-+/g, "-");

  return str;
}

export const isFunction = (o) => typeof o === "function";

// #region Download Utils

// https://stackoverflow.com/a/39914235
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Create a function to zip and download Blobs

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

//#endregion

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
  let left = screen.width / 2 - w / 2;
  let top = screen.height / 2 - h / 2;
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
  let html = /*html*/ `
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
  let html = /*html*/ `<div class="popup-container">
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
  setTimeout(() => {
    win.focus();
  }, 500);
  return {
    closePopup: () => win?.close?.(),
  };
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
  let targetNodes, btargetsFound;
  targetNodes = document.querySelectorAll(selectorTxt);

  if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    /*--- Found target node(s).  Go through each and act if they are new. */
    targetNodes.forEach(function (element) {
      let alreadyFound =
        element.dataset.found == "alreadyFound" ? "alreadyFound" : false;

      if (!alreadyFound) {
        //--- Call the payload function.
        let cancelFound = actionFunction(element);
        if (cancelFound) btargetsFound = false;
        else element.dataset.found = "alreadyFound";
      }
    });
  } else {
    btargetsFound = false;
  }

  //--- Get the timer-control letiable for this selector.
  let controlObj = waitForKeyElements.controlObj || {};
  let controlKey = selectorTxt.replace(/[^\w]/g, "_");
  let timeControl = controlObj[controlKey];

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

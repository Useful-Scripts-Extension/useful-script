//  Utils used by popup and background-script (and content-script?)

const { version } =
  typeof chrome?.runtime?.getManifest === "function"
    ? chrome.runtime.getManifest()
    : {};

const CACHED = {
  userID: null,
};

export function checkBlackWhiteList(script, url = location?.href) {
  if (!url) return false;
  let hasWhiteList = script.whiteList?.length > 0;
  let hasBlackList = script.blackList?.length > 0;
  let inWhiteList = matchOneOfPatterns(url, script.whiteList || []);
  let inBlackList = matchOneOfPatterns(url, script.blackList || []);
  return (
    (!hasWhiteList && !hasBlackList) ||
    (hasWhiteList && inWhiteList) ||
    (hasBlackList && !inBlackList)
  );
}

export function matchOneOfPatterns(url, patterns) {
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

export function getExtensionId() {
  return chrome.runtime.id;
}

export async function getNextDynamicRuleIds(count = 1) {
  const ruleList = await chrome.declarativeNetRequest.getDynamicRules();
  const ids = new Set(ruleList.map((rule) => rule.id));

  const result = [];
  let nextAvailableId = 1;

  while (result.length < count) {
    if (!ids.has(nextAvailableId)) {
      result.push(nextAvailableId);
      ids.add(nextAvailableId);
    }
    nextAvailableId++;
  }

  return count === 1 ? result[0] : result;
}

export async function hasUserId() {
  return !!(await Storage.get("userId"));
}

export async function setUserId(uid = new Date().getTime()) {
  CACHED.userID = uid;
  await Storage.set("userId", uid);
}

export async function getUserId() {
  if (!CACHED.userID) {
    CACHED.userID = await Storage.get("userId");
  }
  if (!CACHED.userID) {
    await setUserId();
  }
  return CACHED.userID;
}

export function waitForTabToLoad(tabId) {
  return new Promise((resolve) => {
    // check if tab already loaded
    if (chrome.tabs.get(tabId)?.status === "complete") {
      resolve();
      return;
    }

    // listen for tab load
    chrome.tabs.onUpdated.addListener(function listener(_tabId, info) {
      if (tabId === _tabId && info.status === "complete") {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    });
  });
}

export function runFunc(fnPath = "", params = [], global = {}) {
  return new Promise((resolve) => {
    let fn = fnPath?.startsWith("chrome") ? chrome : global;
    fnPath.split(".").forEach((part) => {
      fn = fn?.[part] || fn;
    });

    let hasCallback = false;
    let _params = params.map((p) => {
      if (p === "callback") {
        hasCallback = true;
        return resolve;
      }
      return p;
    });

    if (typeof fn !== "function") return resolve(null);

    try {
      let res = fn(..._params);

      if (!hasCallback) {
        if (typeof res?.then === "function") {
          res.then?.(resolve);
        } else {
          resolve(res);
        }
      }
    } catch (e) {
      console.log("ERROR runFunc: ", e);
      resolve(null);
    }
  });
}

export async function trackEvent(scriptId) {
  console.log("trackEvent", scriptId, version);
  return;
  try {
    let res = await fetch(
      // "http://localhost:3000/count",
      "https://useful-script-statistic.glitch.me/count",
      // "https://useful-script-statistic.onrender.com/count",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: scriptId,
          version: version,
          uid: await getUserId(),
        }),
      }
    );
    return await res.text();
  } catch (e) {
    console.log("ERROR update script click count: ", e);
    return null;
  }
}

export async function sendEventToTab(tabId, data) {
  console.log("... Sending ", data, " to tab...");
  const response = await chrome.tabs.sendMessage(tabId, data);
  console.log("> ", data, " sent to tab successfully", response);
  return response;
}

// #region Storage Utils

// https://developer.chrome.com/docs/extensions/reference/storage/
export const Storage = {
  set: async (key, value) => {
    await chrome.storage.local.set({ [key]: value });
    return value;
  },
  get: async (key, defaultValue) => {
    let result = await chrome.storage.local.get([key]);
    return result[key] || defaultValue;
  },
  remove: async (key) => {
    return await chrome.storage.local.remove(key);
  },
};

export const listActiveScriptsKey = "activeScripts";
export async function setActiveScript(scriptId, isActive = true) {
  let list = await getAllActiveScriptIds();
  if (isActive) list.push(scriptId);
  else list = list.filter((_) => _ != scriptId);
  list = list.filter((_) => _);
  Storage.set(listActiveScriptsKey, list); // save to storage => content script can access
  return list;
}

export async function isActiveScript(scriptId) {
  let currentList = await getAllActiveScriptIds();
  return currentList.find((_) => _ == scriptId) != null;
}

export async function getAllActiveScriptIds() {
  return await Storage.get(listActiveScriptsKey, []);
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

// https://developer.chrome.com/docs/extensions/reference/windows/#event-onFocusChanged
// chrome.windows.onFocusChanged.addListener(
//   (windowId) => {
//     if (windowId !== chrome.windows.WINDOW_ID_NONE)
//       CACHED.lastWindowId = windowId;
//   },
//   { windowTypes: ["normal"] }
// );

export const mergeObject = (...objs) => {
  // merge without null value
  let res = {};
  for (let obj of objs) for (let key in obj) if (obj[key]) res[key] = obj[key];
  return res;
};

export const getAllTabs = async () => {
  let tabs = await chrome.tabs.query({
    // url: ["https://*/*", "http://*/*"],
    // windowType: "normal",
  });
  return tabs;
};

export function getPopupURL() {
  return chrome.runtime.getURL("/popup/popup.html");
}

export const getLastFocusedWindowIds = () => {
  return chrome.runtime.sendMessage({
    action: "ufs-runInBackground",
    data: {
      fnPath: "getCache",
      params: ["lastFocusedWindowIds"],
    },
  });
};

export const getLastFocusedTab = async () => {
  const lastFocusedWindowIds = await getLastFocusedWindowIds();
  const windows = await chrome.windows.getAll({ populate: true });
  const lastFocusedWindow = windows
    // sort windows by lastFocused
    .sort(
      (a, b) =>
        lastFocusedWindowIds.indexOf(a.id) - lastFocusedWindowIds.indexOf(b.id)
    )
    // get windows that not popup extension
    .filter((w) => w.type !== "popup" && w.tabs[0].url !== getPopupURL())?.[0];

  if (!lastFocusedWindow) return null;
  const tab = lastFocusedWindow.tabs.find(
    (tab) => tab.active && tab.url !== getPopupURL()
  );
  return tab;
};

export const getCurrentTab = async () => {
  // case normal popup
  let tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  if (tabs?.[0]?.url !== getPopupURL()) return tabs[0];

  return await getLastFocusedTab();
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

export function pinTab(tab, pinned = true) {
  return chrome.tabs.update(tab.id, { pinned: pinned });
}

export const runScriptInTabWithEventChain = ({
  target,
  scriptIds,
  path = chrome.runtime.getURL("/scripts/"),
  world = "MAIN",
  details = {},
  eventChain,
  silent = false,
}) => {
  return runScriptInTab({
    target,
    func: async (scriptIds, path, eventChain, details, silent) => {
      const promises = [];
      for (let scriptId of scriptIds) {
        const url = `${path}${scriptId}.js`;
        promises.push(
          import(url)
            .then(({ default: script }) => {
              let fn = script;

              let beforeFnName = eventChain.split(".");
              let fnName = beforeFnName.pop();
              beforeFnName.forEach((e) => (fn = fn?.[e]));
              fn = fn?.[fnName + "_"] || fn?.[fnName]; // higher priority for allframes function

              if (typeof fn === "function") {
                if (!silent)
                  console.log(
                    `> Useful-script: Run SUCCESS`,
                    scriptId + "\n",
                    eventChain,
                    details
                  );
                fn(details);
                return scriptId;
              }
              return false;
            })
            .catch((e) => {
              console.log(
                `> Useful-script: Run FAILED`,
                scriptId + "\n",
                eventChain,
                details,
                e
              );
              return false;
            })
        );
      }
      let res = await Promise.all(promises);
      let successScripts = res.filter(Boolean);
      return successScripts;
    },
    args: [scriptIds, path, eventChain, details, silent],
    world,
  });
};

export const runScriptInTab = async (config = {}) => {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      mergeObject(
        {
          world: "MAIN",
          injectImmediately: true,
        },
        config
      ),
      (injectionResults) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        }
        // https://developer.chrome.com/docs/extensions/reference/scripting/#handling-results
        else resolve(injectionResults?.find?.((_) => _.result)?.result);
      }
    );
  });
};

export const runScriptFile = (config = {}) => {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      mergeObject(
        {
          world: "MAIN",
          injectImmediately: true,
        },
        config
      ),
      (injectionResults) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        }
        // https://developer.chrome.com/docs/extensions/reference/scripting/#handling-results
        else resolve(injectionResults?.find?.((_) => _.result)?.result);
      }
    );
  });
};

export const runScriptInCurrentTab = async (func, args, world = "MAIN") => {
  const tab = await getCurrentTab();
  // focusToTab(tab);
  return await runScriptInTab({ func, args, target: { tabId: tab.id }, world });
};

export const runScriptFileInCurrentTab = async (scriptFile, world = "MAIN") => {
  const tab = await getCurrentTab();
  // focusToTab();
  return await runScriptFile({
    target: { tabId: tab.id },
    files: [scriptFile],
    world,
  });
};

// https://stackoverflow.com/a/68634884/11898496
// WARNING: should be run in backgound script
// If use this in popup script, when tab is focus, popup page will be closed => script not finish
export async function openWebAndRunScript({
  url,
  func,
  args = [],
  world = "MAIN",
  waitUntilLoadEnd = true,
  focusAfterRunScript = true,
  closeAfterRunScript = false,
  focusImmediately = false,
}) {
  let tab = await chrome.tabs.create({ active: focusImmediately, url: url });
  if (waitUntilLoadEnd) await waitForTabToLoad(tab.id);
  let res = await runScriptInTab({
    func,
    target: { tabId: tab.id },
    args,
    world,
  });
  if (closeAfterRunScript) {
    closeTab(tab);
  } else if (focusAfterRunScript) {
    focusToTab(tab);
  }
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

// need to import UfsGlobal !!! => impact performace?

// export async function captureVisibleTab(options = {}, willDownload = true) {
//   let imgData = await chrome.tabs.captureVisibleTab(null, {
//     format: options.format || "png",
//     quality: options.quality || 100,
//   });
//   willDownload && UfsGlobal.Utils.downloadURL(imgData, "img.png");
//   return imgData;
// }

// #endregion

export const convertBlobToBase64 = (blob) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
      resolve(null);
    };
  });

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

// #endregion

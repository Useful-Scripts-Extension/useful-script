import * as utils from "../helpers/utils.js";
import allScripts from "../_allScripts.js";
import { UfsGlobal } from "../content-scripts/ufs_global.js";
// import "../content-scripts/ufs_global.js"; // https://stackoverflow.com/a/62806068/23648002
// importScripts()

const {
  convertBlobToBase64,
  getAllActiveScriptIds,
  trackEvent,
  setUserId,
  listActiveScriptsKey,
} = utils;

const { ISOLATED, MAIN } = chrome.scripting.ExecutionWorld;
const CACHED = {
  path: chrome.runtime.getURL("/scripts/"),
  lastFocusedWindowIds: [],
  activeScriptIds: [],
  badges: {},
};
const GLOBAL = {
  utils,
  UfsGlobal,
  log: console.log,
  trackEvent,
  fetch: customFetch,
  runScriptsTab,
  runScriptsBackground,
  checkWillRun,
  getCache,
  setCache,
  removeCache,
};

// keyChain = "" => get all cached
function getCache(keyChain, defaultValue = null) {
  let value = CACHED;
  keyChain?.split(".")?.forEach((key) => {
    value = value?.[key] ?? null;
  });
  return value ?? defaultValue;
}

function setCache(keyChain, value) {
  let keys = keyChain?.split(".");
  let obj = CACHED;
  keys?.forEach((key, i) => {
    if (i === keys.length - 1) {
      obj[key] = value;
    } else {
      obj = obj[key] ?? (obj[key] = {});
    }
  });
}

function removeCache(keyChain) {
  let keys = keyChain?.split(".");
  let obj = CACHED;
  keys?.forEach((key, i) => {
    if (i === keys.length - 1) {
      delete obj[key];
    } else {
      obj = obj[key];
    }
  });
}

function cacheActiveScriptIds() {
  getAllActiveScriptIds().then((ids) => {
    CACHED.activeScriptIds = ids;
  });
}

async function runScriptsTab(eventChain, world, details, silent = false) {
  if (
    (details.sourceTabId == null || details.sourceFrameId == null) &&
    (details.tabId == null || details.frameId == null)
  ) {
    console.log("Invalid details", eventChain, world, details);
    return;
  }
  const context = world === "MAIN" ? "pageScript" : "contentScript";
  const scriptIds = CACHED.activeScriptIds.filter((id) =>
    checkWillRun(id, context, eventChain, details)
  );

  if (scriptIds.length === 0) return;

  // make details serializable
  const _details = { ...details };
  const { frameId, tabId } = getDetailIds(details);

  let successScripts = await utils.runScriptInTabWithEventChain({
    target: {
      tabId: tabId,
      frameIds: [frameId],
    },
    scriptIds,
    eventChain: context + "." + eventChain,
    details: _details,
    world,
    silent,
  });

  if (frameId === 0 && successScripts?.length) {
    CACHED.badges[tabId].push(...successScripts);
    CACHED.badges[tabId] = [...new Set(CACHED.badges[tabId])];
    let badge = CACHED.badges[tabId]?.length + "";
    chrome.action.setBadgeText({
      tabId: tabId,
      text: badge,
    });
    chrome.action.setTitle({
      tabId: tabId,
      title: "Useful Scripts " + (badge ? "(" + badge + ")" : ""),
    });
  }
}

function getDetailIds(details) {
  return {
    tabId: details.sourceTabId ?? details.tabId,
    frameId: details.sourceFrameId ?? details.frameId,
  };
}

function runScriptsBackground(
  eventChain,
  details,
  data,
  runAllScripts = false
) {
  let allResponse;
  let scriptIds = runAllScripts
    ? Object.keys(allScripts)
    : CACHED.activeScriptIds;

  for (let scriptId of scriptIds) {
    const fn = checkWillRun(scriptId, "backgroundScript", eventChain, details);
    if (fn) {
      try {
        // inject background context (GLOBAL) to func
        let res = fn(data ?? details, GLOBAL);
        console.log(
          "runScriptsBackground",
          scriptId,
          eventChain,
          details,
          data,
          res
        );
        if (res) {
          if (!allResponse) allResponse = {};
          allResponse[scriptId] = res;
        }
      } catch (e) {
        console.log(
          "runScriptsBackground ERROR",
          scriptId,
          eventChain,
          details,
          data,
          e
        );
      }
    }
  }
  return allResponse;
}

function checkWillRun(scriptId, context, eventChain, details) {
  const script = allScripts[scriptId];
  const s = script?.[context];

  let beforeFnName = eventChain.split(".");
  let fnName = beforeFnName.pop();

  let fn = s;
  beforeFnName.forEach((e) => (fn = fn?.[e]));
  fn = fn?.[fnName + "_"] || fn?.[fnName];

  if (
    typeof fn === "function" &&
    (!details ||
      ((fn.name.endsWith("_") || details.frameType == "outermost_frame") &&
        utils.checkBlackWhiteList(script, details.url)))
  )
    return fn;

  return false;
}

async function customFetch(url, options) {
  try {
    if (
      typeof options?.body === "string" &&
      options.body.startsWith("ufs-formData:")
    ) {
      let body = options.body.replace("ufs-formData:", "");
      body = JSON.parse(body);
      options.body = new FormData();
      for (const [key, value] of Object.entries(body)) {
        options.body.append(key, value);
      }
    }

    const res = await fetch(url, options);
    let body;

    // https://github.com/w3c/webextensions/issues/293
    try {
      if (res.headers.get("Content-Type").startsWith("text/")) {
        body = await res.clone().text();
      } else if (
        res.headers.get("Content-Type").startsWith("application/json")
      ) {
        body = await res.clone().json();
      } else {
        // For other content types, read the body as blob
        const blob = await res.clone().blob();
        body = await convertBlobToBase64(blob);
      }
    } catch (e) {
      body = await res.clone().text();
    }

    const data = {
      headers: Object.fromEntries(res.headers),
      ok: res.ok,
      redirected: res.redirected,
      status: res.status,
      statusText: res.statusText,
      type: res.type,
      url: res.url,
      body: body,
    };
    // console.log("Response from background script:", data);
    return data;
  } catch (e) {
    console.log("Fetch failed:", e);
    return null;
  }
}

function listenWebRequest() {
  Object.entries({
    onBeforeRedirect: [
      "webRequest.onBeforeRedirect",
      ["responseHeaders", "extraHeaders"],
    ],
    onBeforeRequest: [
      "webRequest.onBeforeRequest",
      ["requestBody", "extraHeaders"],
    ],
    onBeforeSendHeaders: [
      "webRequest.onBeforeSendHeaders",
      ["requestHeaders", "extraHeaders"],
    ],
    onCompleted: [
      "webRequest.onCompleted",
      ["responseHeaders", "extraHeaders"],
    ],
    onErrorOccurred: ["webRequest.onErrorOccurred", ["extraHeaders"]],
    onHeadersReceived: [
      "webRequest.onHeadersReceived",
      ["responseHeaders", "extraHeaders"],
    ],
    onResponseStarted: [
      "webRequest.onResponseStarted",
      ["responseHeaders", "extraHeaders"],
    ],
    onSendHeaders: [
      "webRequest.onSendHeaders",
      ["requestHeaders", "extraHeaders"],
    ],
  }).forEach(([rqEvent, [eventChain, extraInfoSpec]]) => {
    chrome.webRequest[rqEvent].addListener(
      function (details) {
        if (details.initiator?.startsWith("chrome-extension://")) return;

        // console.log("details ne", rqEvent, details);
        let allData = runScriptsBackground(eventChain, details);

        let modifiedDetails = {
          ...details,
          ufsModifiedWebRequest: allData,
        };
        runScriptsTab(eventChain, ISOLATED, modifiedDetails, true);
        runScriptsTab(eventChain, MAIN, modifiedDetails, true);

        let keys = Object.keys(allData || {});
        if (allData && keys.length > 0) {
          // WARNING: only first script's response is returned to webRequestHandler
          // Other scripts' responses will be lost
          console.log("return", allData, allData[keys[0]]);
          return allData[keys[0]];
        }
      },
      { urls: ["<all_urls>"] },
      extraInfoSpec
    );
  });
}

function listenNavigation() {
  // listen web navigation - occur in all frames of all tabs
  Object.entries({
    onCommitted: "onDocumentStart",
    onDOMContentLoaded: "onDocumentIdle",
    onCompleted: "onDocumentEnd",

    onCreatedNavigationTarget: "webNavigation.onCreatedNavigationTarget",
    onHistoryStateUpdated: "webNavigation.onHistoryStateUpdated",
    onBeforeNavigate: "webNavigation.onBeforeNavigate",
    // optional
    // onTabReplaced: "onTabReplaced",
    // onErrorOccurred: "onErrorOccurred",
    // onReferenceFragmentUpdated: "onReferenceFragmentUpdated",
  }).forEach(([navEvent, eventChain]) => {
    chrome.webNavigation[navEvent].addListener((details) => {
      // console.log(navEvent, details);
      try {
        const { tabId, frameId } = getDetailIds(details);

        if (eventChain === "onDocumentStart") {
          // clear badge cache on main frame load
          if (details.frameId === 0) CACHED.badges[tabId] = [];
          injectUfsGlobal(tabId, frameId, details);
        }

        runScriptsTab(eventChain, MAIN, details);
        runScriptsTab(eventChain, ISOLATED, details);
        runScriptsBackground(eventChain, details);
      } catch (e) {
        console.log("ERROR:", e);
      }
    });
  });
}

function listenTabs() {
  [
    "onActivated",
    "onAttached",
    "onCreated",
    "onDetached",
    "onHighlighted",
    "onMoved",
    "onRemoved",
    "onReplaced",
    "onUpdated",
    // "onZoomChange",
  ].forEach((event) => {
    chrome.tabs[event].addListener((...details) => {
      // these events will fired in all scripts active scripts (no need to call checkWillRun)
      runScriptsBackground("tabs." + event, null, details);
    });
  });
}

function listenMessage() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
      if (request.action === "ufs-runInBackground") {
        const { params = [], fnPath = "" } = request.data || {};
        utils.runFunc(fnPath, params, GLOBAL).then((res) => {
          sendResponse(res);
        });
        return true;
      } else {
        let sent = false;
        let internalSendEvent = (data) => {
          sent = true;
          sendResponse(data);
        };
        runScriptsBackground(
          "runtime.onMessage",
          null,
          // {
          //   tabId: sender.tab.id,
          //   frameIds: [sender.frameId],
          // },
          { request, sender, sendResponse: internalSendEvent },
          true
        );
        return !sent;
      }
    } catch (e) {
      console.log("ERROR:", e);
      sendResponse({ error: e.message });
    }
  });
}

function listenExternalMessage() {
  chrome.runtime.onMessageExternal.addListener(
    (request, sender, sendResponse) => {
      console.log("onExternalMessage", request, sender);

      try {
        let sent = false;
        let internalSendEvent = (data) => {
          sent = true;
          sendResponse(data);
        };
        runScriptsBackground(
          "runtime.onMessageExternal",
          null,
          // {
          //   tabId: sender.tab.id,
          //   frameIds: [sender.frameId],
          // },
          { request, sender, sendResponse: internalSendEvent },
          true
        );
        return !sent;
      } catch (e) {
        console.log("ERROR:", e);
        sendResponse({ error: e.message });
      }
    }
  );
}

function listenWindows() {
  ["onBoundsChanged", "onCreated", "onFocusChanged", "onRemoved"].forEach(
    (event) => {
      chrome.windows[event].addListener((...details) => {
        // listen and cache last window focus
        if (event === "onFocusChanged") {
          let windowId = details[0];

          CACHED.lastFocusedWindowIds.unshift(windowId);
          // remove duplicate
          for (let i = 1; i < CACHED.lastFocusedWindowIds.length; i++) {
            if (windowId === CACHED.lastFocusedWindowIds[i]) {
              CACHED.lastFocusedWindowIds.splice(i, 1);
              break;
            }
          }
        }

        if (event === "onRemoved") {
          let index = CACHED.lastFocusedWindowIds.indexOf(details[0]);
          if (index >= 0) CACHED.lastFocusedWindowIds.splice(index, 1);
        }

        runScriptsBackground("windows." + event, null, details);
      });
    }
  );
}

function injectUfsGlobal(tabId, frameId, details) {
  [
    [["ufs_global.js", "content_script.js"], ISOLATED],
    [["ufs_global.js"], MAIN],
  ].forEach(([files, world]) => {
    let paths = files.map((file) => CACHED.path + "content-scripts/" + file);
    utils.runScriptFile({
      target: {
        tabId: tabId,
        frameIds: [frameId],
      },
      func: (paths, frameId, world, url) => {
        paths.forEach((path) => {
          import(path)
            // .then(() => console.log("Ufs import SUCCESS", frameId, world, url))
            .catch((e) =>
              console.error("Ufs import FAILED", frameId, world, url, e)
            );
        });
      },
      args: [paths, frameId, world, details.url],
      world: world,
    });
  });
}

function listenContextMenus() {
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    let parent = info.parentMenuItemId;
    parent = parent === "root" ? "" : parent + ".";
    utils.trackEvent(parent + info.menuItemId + "-CONTEXT-MENU");

    runScriptsBackground("contextMenus.onClicked", null, { info, tab }, true);
  });
}

function main() {
  cacheActiveScriptIds();
  chrome.storage.onChanged.addListener((changes, areaName) => {
    // areaName = "local" / "sync" / "managed" / "session" ...
    if (changes?.[listActiveScriptsKey]) cacheActiveScriptIds();
    runScriptsBackground("storage.onChanged", null, { changes, areaName });
  });

  // listenWebRequest();
  listenNavigation();
  listenTabs();
  listenMessage();
  listenExternalMessage();
  listenWindows();
  listenContextMenus();

  chrome.runtime.onStartup.addListener(async function () {
    runScriptsBackground("runtime.onStartup", null, null, true);
  });

  chrome.runtime.onInstalled.addListener(async function (reason) {
    // reasons: browser_update / chrome_update / update / install

    if (await utils.hasUserId()) {
      await trackEvent("ufs-RE-INSTALLED");
    }
    // create new unique id and save it
    await setUserId();
    trackEvent("ufs-INSTALLED");

    // create root item in context menu
    chrome.contextMenus.create({
      id: "root",
      title: "Useful Script",
      contexts: ["all"],
    });

    runScriptsBackground("runtime.onInstalled", null, reason, true);
  });

  chrome.action.setBadgeBackgroundColor({ color: "#666" });
  chrome.action.setBadgeTextColor({ color: "#fff" });
}

try {
  main();
} catch (e) {
  console.log("ERROR:", e);
}

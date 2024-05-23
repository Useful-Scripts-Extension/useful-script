import * as utils from "../helpers/utils.js";
import { allScripts } from "../index.js";
import "../content-scripts/ufs_global.js"; // https://stackoverflow.com/a/62806068/23648002

console.log(UfsGlobal);

const {
  convertBlobToBase64,
  getAllActiveScriptIds,
  trackEvent,
  setUserId,
  listActiveScriptsKey,
} = utils;

const { ISOLATED, MAIN } = chrome.scripting.ExecutionWorld;
const CACHED = {
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
  let fn = s;
  eventChain.split(".").forEach((e) => {
    fn = fn?.[e];
  });
  if (
    typeof fn === "function" &&
    (!details ||
      ((s.runInAllFrames || details.frameType == "outermost_frame") &&
        utils.checkWillRun(script, details.url)))
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

        // inject ufsglobal, contentscript, pagescript before run any scripts
        if (eventChain === "onDocumentStart") {
          // clear badge cache on main frame
          if (details.frameId === 0) CACHED.badges[tabId] = [];
          injectUfsGlobal(tabId, frameId);
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
        // console.log("runInBackground", fnPath, params);
        utils.runFunc(fnPath, params, GLOBAL).then((res) => {
          sendResponse(res);
        });
        return true;
      } else {
        let sended = false;
        let internalSendEvent = (data) => {
          sended = true;
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
        return sended ? false : true;
      }
    } catch (e) {
      console.log("ERROR:", e);
      sendResponse({ error: e.message });
    }
  });
}

function injectUfsGlobal(tabId, frameId) {
  [
    { files: ["ufs_global.js", "content_script.js"], world: ISOLATED },
    { files: ["ufs_global.js"], world: MAIN },
  ].forEach(({ files, world }) => {
    utils.runScriptFile({
      files: files.map((file) => "/scripts/content-scripts/" + file),
      target: {
        tabId: tabId,
        frameIds: [frameId],
      },
      world: world,
    });
  });
}

function main() {
  // listen change active scripts
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

  chrome.contextMenus.onClicked.addListener(async (info) => {
    runScriptsBackground("contextMenus.onClicked", null, info, true);
  });

  chrome.runtime.onStartup.addListener(async function () {
    runScriptsBackground("runtime.onStartup", null, null, true);
  });

  chrome.runtime.onInstalled.addListener(async function (reason) {
    // reasons: browser_update / chrome_update / update / install

    if (utils.hasUserId()) {
      await trackEvent("ufs-RE-INSTALLED");
    }
    // create new unique id and save it
    await setUserId();
    trackEvent("ufs-INSTALLED");

    runScriptsBackground("runtime.onInstalled", null, reason, true);

    // inject ufsGlobal to all frames in all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.webNavigation.getAllFrames({ tabId: tab.id }, (frames) => {
          frames.forEach((frame) => {
            injectUfsGlobal(tab.id, frame.frameId);
          });
        });
      });
    });
  });

  chrome.action.setBadgeBackgroundColor({ color: "#666" });
  chrome.action.setBadgeTextColor({ color: "#fff" });
}

try {
  main();
} catch (e) {
  console.log("ERROR:", e);
}

// https://developer.chrome.com/docs/extensions/develop/migrate/blocking-web-requests

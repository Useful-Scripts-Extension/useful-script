import * as utils from "../helpers/utils.js";
import { allScripts } from "../index.js";
import "../content-scripts/ufs_global.js"; // https://stackoverflow.com/a/62806068/23648002

console.log(UfsGlobal);

const {
  runScriptInCurrentTab,
  convertBlobToBase64,
  runScriptInTab,
  getAllActiveScriptIds,
  trackEvent,
  setUserId,
  listActiveScriptsKey,
} = utils;

const { ISOLATED, MAIN } = chrome.scripting.ExecutionWorld;
const CACHED = {
  path: chrome.runtime.getURL("/scripts/"),
  activeScriptIds: [],
  badges: {},
};
const GLOBAL = {
  utils,
  UfsGlobal,
  log: console.log,
  trackEvent,
  fetch: customFetch,
  getCached,
};

function getCached() {
  return CACHED;
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

  let successScripts = await runScriptInTab({
    target: {
      tabId: tabId,
      frameIds: [frameId],
    },
    func: async (scriptIds, path, context, eventChain, details, silent) => {
      const promises = [];
      for (let scriptId of scriptIds) {
        const url = `${path}${scriptId}.js`;
        promises.push(
          import(url)
            .then(({ default: script }) => {
              let fn = script?.[context];
              eventChain.split(".").forEach((e) => {
                fn = fn?.[e];
              });
              if (typeof fn === "function") {
                if (!silent)
                  console.log(
                    `> Useful-script: Run SUCCESS`,
                    scriptId + "\n",
                    context,
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
                context,
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
    args: [scriptIds, CACHED.path, context, eventChain, _details, silent],
    world,
  });

  if (frameId === 0 && successScripts?.length) {
    CACHED.badges[tabId].push(...successScripts);
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

function runScripts(eventChain, details, data) {
  let allResponse;
  for (let scriptId of CACHED.activeScriptIds) {
    const fn = checkWillRun(scriptId, "backgroundScript", eventChain, details);
    if (fn) {
      let res = fn(data ?? details);
      if (res) {
        if (!allResponse) allResponse = {};
        allResponse[scriptId] = res;
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
        let allData = runScripts(eventChain, details);

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
        runScriptsTab(eventChain, MAIN, details);
        runScriptsTab(eventChain, ISOLATED, details);
        runScripts(eventChain, details);
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
    chrome.tabs[event].addListener((details) => {
      runScripts("tabs." + event, details);
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
        runScripts(
          "runtime.onMessage",
          null,
          // {
          //   tabId: sender.tab.id,
          //   frameIds: [sender.frameId],
          // },
          { request, sender, sendResponse: internalSendEvent }
        );
        return sended ? false : true;
      }
    } catch (e) {
      console.log("ERROR:", e);
      sendResponse({ error: e.message });
    }
  });
}

function main() {
  // listen change active scripts
  cacheActiveScriptIds();
  chrome.storage.onChanged.addListener((changes, areaName) => {
    runScripts("storage.onChanged", null, { changes, areaName });

    // areaName = "local" / "sync" / "managed" / "session" ...
    if (changes?.[listActiveScriptsKey]) cacheActiveScriptIds();
  });

  // listenWebRequest();
  listenNavigation();
  listenTabs();
  listenMessage();

  chrome.contextMenus.onClicked.addListener((info) => {
    console.log(info);
    if (info.menuItemId == "ufs-magnify-image") {
      trackEvent("magnify-image-CONTEXT-MENU");
      /*
      {
        "editable": false,
        "frameId": 2491,
        "frameUrl": "https://www.deviantart.com/_nsfgfb/?realEstateId=166926a9-15ab-458d-b424-4385d5c9acde&theme=dark&biClientId=fdb7b474-671d-686c-7ebc-7027eecd49f0&biClientIdSigned=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJiaUNsaWVudElkIjoiZmRiN2I0NzQtNjcxZC02ODZjLTdlYmMtNzAyN2VlY2Q0OWYwIiwidHMiOjE3MTM0NjgyNTAsInVzZXJVdWlkIjoiZmRiN2I0NzQtNjcxZC02ODZjLTdlYmMtNzAyN2VlY2Q0OWYwIn0.z98X9tXSYMaUubtwGGG08NsikaoZ7iODsn_aWaeiGD0&newApi=2&platform=desktop",
        "linkUrl": "https://www.deviantart.com/join?referer=https%3A%2F%2Fwww.deviantart.com%2Fdreamup%3Fda_dealer_footer=1",
        "mediaType": "image",
        "menuItemId": "ufs-magnify-image",
        "pageUrl": "https://www.deviantart.com/kat-zaphire/art/Deep-in-the-forest-989494503",
        "srcUrl": "https://wixmp-70a14ff54af6225c7974eec7.wixmp.com/offers-assets/94f22a36-bb47-4836-8bce-fea45f844aa4.gif"
    } */
      runScriptInCurrentTab(
        (imgUrl) => {
          let fn = window.top?.ufs_magnify_image_createPreview;
          if (typeof fn === "function") {
            fn(imgUrl, window.top.innerWidth / 2, window.top.innerHeight / 2);
          } else {
            alert(
              "Useful-script:\n\n" +
                "Vui lòng bật chức năng 'Tự động hoá' > 'Phóng to mọi hình ảnh' trước.\n\n" +
                "Please enable 'Automation' > 'Magnify any Image' first."
            );
          }
        },
        [info.srcUrl]
      );
    }
  });

  chrome.runtime.onStartup.addListener(async function () {
    runScripts("runtime.onStartup");
  });

  chrome.runtime.onInstalled.addListener(async function (reason) {
    if (utils.hasUserId()) {
      await GLOBAL.trackEvent("ufs-RE-INSTALLED");
    }
    // create new unique id and save it
    await setUserId();
    GLOBAL.trackEvent("ufs-INSTALLED");

    chrome.contextMenus.create({
      title: "Magnify this image",
      contexts: ["image"],
      id: "ufs-magnify-image",
    });

    runScripts("runtime.onInstalled", null, reason);
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

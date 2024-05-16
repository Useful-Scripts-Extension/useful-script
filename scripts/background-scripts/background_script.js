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
  activeScriptIds: [],
  path: chrome.runtime.getURL("/scripts/"),
};
const GLOBAL = {
  utils,
  UfsGlobal,
  log: console.log,
  trackEvent,
  fetch: customFetch,
};

function cacheActiveScriptIds() {
  getAllActiveScriptIds().then((ids) => {
    CACHED.activeScriptIds = ids;
  });
}

function runScriptsTab(event, world, details) {
  /*
  onCreatedNavigationTarget:
  {
    "sourceFrameId": 0,
    "sourceProcessId": 26,
    "sourceTabId": 84866565,
    "tabId": 84866833,
    "timeStamp": 1715869017808.223,
    "url": "https://www.google.com/imghp?hl=en&authuser=0&ogbl"
  }

  other navigation event:
  {
    "documentId": "BF8A5B9EAB9736CEF224E6DC75E6A2B7",
    "documentLifecycle": "active",
    "frameId": 0,
    "frameType": "outermost_frame",
    "parentFrameId": -1,
    "processId": 26,
    "tabId": 84866565,
    "timeStamp": 1715869322353.945,
    "url": "https://www.google.com/"
  }
*/

  if (
    (details.sourceTabId == null || details.sourceFrameId == null) &&
    (details.tabId == null || details.frameId == null)
  ) {
    console.log("Invalid details", event, world, details);
    return;
  }
  // make details serializable
  const _details = { ...details };
  const context = world === "MAIN" ? "pageScript" : "contentScript";
  const scriptPaths = CACHED.activeScriptIds
    .filter((id) => checkWillRun(id, context, event, details))
    .map((id) => `${CACHED.path}${id}.js`);

  return runScriptInTab({
    target: {
      tabId: details.sourceTabId ?? details.tabId,
      frameIds: [details.sourceFrameId ?? details.frameId],
    },
    func: (scriptPaths, context, event, details) => {
      for (let path of scriptPaths) {
        let scriptId = path.split("/").pop().split(".")[0];
        import(path)
          .then(({ default: script }) => {
            const fn = script?.[context]?.[event];
            if (typeof fn === "function") {
              console.log(
                `> Useful-script: Run SUCCESS`,
                scriptId,
                context,
                event,
                details
              );
              fn(details);
            }
          })
          .catch((e) => {
            console.log(
              `> Useful-script: Run FAILED`,
              scriptId,
              context,
              event,
              details,
              e
            );
          });
      }
    },
    args: [scriptPaths, context, event, _details],
    world,
  });
}

function runScripts(event, details) {
  for (let scriptId of CACHED.activeScriptIds) {
    const fn = checkWillRun(scriptId, "backgroundScript", event, details);
    if (fn) return fn();
  }
}

function checkWillRun(scriptId, context, event, details) {
  const script = allScripts[scriptId];
  const s = script?.[context];
  const fn = s?.[event];
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

function main() {
  // listen change active scripts
  cacheActiveScriptIds();
  chrome.storage.onChanged.addListener((changes, areaName) => {
    // areaName = "local" / "sync" / "managed" / "session" ...
    if (changes?.[listActiveScriptsKey]) cacheActiveScriptIds();
  });

  // listen web navigation - occur in all frames of all tabs
  Object.entries({
    onCreatedNavigationTarget: "onCreatedNavigationTarget",
    onBeforeNavigate: "onBeforeNavigate",
    onCommitted: "onDocumentStart",
    onDOMContentLoaded: "onDocumentIdle",
    onCompleted: "onDocumentEnd",

    // optional
    // onErrorOccurred: "onErrorOccurred",
    // onHistoryStateUpdated: "onHistoryStateUpdated",
    // onReferenceFragmentUpdated: "onReferenceFragmentUpdated",
    // onTabReplaced: "onTabReplaced",
  }).forEach(([navEvent, event]) => {
    chrome.webNavigation[navEvent].addListener((details) => {
      // console.log(navEvent, details);
      try {
        // inject ufsglobal, contentscript, pagescript before run any scripts
        if (event === "onDocumentStart") {
          [
            { files: ["ufs_global.js", "content_script.js"], world: ISOLATED },
            { files: ["ufs_global.js"], world: MAIN },
          ].forEach(({ files, world }) => {
            utils.runScriptFile({
              files: files.map((file) => "/scripts/content-scripts/" + file),
              target: {
                tabId: details.tabId,
                frameIds: [details.frameId],
              },
              world: world,
            });
          });
        }
        runScriptsTab(event, MAIN, details);
        runScriptsTab(event, ISOLATED, details);
        runScripts(event, details);
      } catch (e) {
        console.log("ERROR:", e);
      }
    });
  });

  // listen content script message
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log("request", request);
    try {
      if (request.action === "ufs-runInBackground") {
        const { params = [], fnPath = "" } = request.data || {};
        // console.log("runInBackground", fnPath, params);
        utils.runFunc(fnPath, params, GLOBAL).then((res) => {
          sendResponse(res);
        });
        return true;
      }
    } catch (e) {
      console.log("ERROR:", e);
      sendResponse({ error: e.message });
    }
  });

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
    runScripts("onStartup");
  });

  chrome.runtime.onInstalled.addListener(async function () {
    runScripts("onInstalled");

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
  });
}

try {
  main();
} catch (e) {
  console.log("ERROR:", e);
}

// https://developer.chrome.com/docs/extensions/develop/migrate/blocking-web-requests

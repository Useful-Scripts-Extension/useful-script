import * as utils from "../helpers/utils.js";

const {
  runScriptInCurrentTab,
  convertBlobToBase64,
  runScriptInTab,
  getAllActiveScriptIds,
  trackEvent,
  setUserId,
} = utils;

const { ISOLATED, MAIN } = chrome.scripting.ExecutionWorld;
const CACHED = {
  activeScriptIds: [],
  path: chrome.runtime.getURL("/scripts/"),
};
const GLOBAL = {
  utils,
  log: console.log,
  trackEvent,
  fetch: customFetch,
};

function cacheActiveScriptIds() {
  getAllActiveScriptIds().then((ids) => {
    CACHED.activeScriptIds = ids;
    console.log("active scritps", ids);
  });
}

function runScripts(tabId, event, world) {
  return runScriptInTab({
    tabId: tabId,
    func: (scriptIds, event, path) => {
      (() => {
        let interval = setInterval(() => {
          if (typeof window.runScripts === "function") {
            clearInterval(interval);
            window.runScripts(scriptIds, event, path);
          }
        }, 10);
      })();
    },
    args: [CACHED.activeScriptIds, event, CACHED.path],
    world,
  });
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
    console.log("Response from background script:", data);
    return data;
  } catch (e) {
    console.log("Fetch failed:", e);
    return null;
  }
}

function main() {
  // listen change active scripts
  cacheActiveScriptIds();
  chrome.storage.onChanged.addListener(() => {
    cacheActiveScriptIds();
  });

  // listen documentStart
  chrome.webNavigation.onCommitted.addListener((details) => {
    try {
      if (details.frameType == "outermost_frame") {
        runScripts(details.tabId, "onDocumentStart", MAIN);
        runScripts(details.tabId, "onDocumentStartContentScript", ISOLATED);
      }
    } catch (e) {
      console.log("ERROR:", e);
    }
  });

  // listen documentIdle
  chrome.webNavigation.onDOMContentLoaded.addListener((details) => {
    try {
      if (details.frameType == "outermost_frame") {
        runScripts(details.tabId, "onDocumentIdle", MAIN);
        runScripts(details.tabId, "onDocumentIdleContentScript", ISOLATED);
      }
    } catch (e) {
      console.log("ERROR:", e);
    }
  });

  // listen documentEnd
  chrome.webNavigation.onCompleted.addListener((details) => {
    try {
      if (details.frameType == "outermost_frame") {
        runScripts(details.tabId, "onDocumentEnd", MAIN);
        runScripts(details.tabId, "onDocumentEndContentScript", ISOLATED);
      }
    } catch (e) {
      console.log("ERROR:", e);
    }
  });

  // listen content script message
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("request", request);
    try {
      if (request.action === "ufs-runInBackground") {
        const { params = [], fnPath = "" } = request.data || {};
        console.log("runInBackground", fnPath, params);
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
        (_data) => {
          if (typeof window.ufs_magnify_image_createPreview === "function") {
            window.ufs_magnify_image_createPreview(
              _data?.srcUrl,
              window.innerWidth / 2,
              window.innerHeight / 2
            );
          } else {
            alert(`Useful-script:

    Vui lòng bật chức năng 'Tự động hoá' > 'Phóng to mọi hình ảnh' trước.

    Please enable 'Automation' > 'Magnify any Image' first.
            `);
          }
        },
        [info]
      );
    }
  });

  chrome.runtime.onInstalled.addListener(function () {
    GLOBAL.trackEvent("ufs-INSTALLED");

    // create new unique id and save it
    setUserId();

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

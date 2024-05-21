// WARNING: avoid import anything here, use dynamic imports instead

export default {
  icon: "",
  name: {
    en: "",
    vi: "",
  },
  description: {
    en: "",
    vi: "",
    img: "",
  },
  infoLink: "",

  changeLogs: {
    date: "description",
  },

  blackList: [],
  whiteList: [],

  // run in extension popup context
  // - CANNOT autorun - only executed when user click
  // - can use chrome extension APIs
  // - can use imported functions (utils, shared)
  //    + can access/modify DOM/variables in webpage/content-script context (via utils.runScriptInCurrentTab)
  // - can use UfsGlobal
  //    + can run scripts in background-context (limited - via UseGlobal.Extension)
  popupScript: {
    // run when enable/disable autorun script
    onEnable: () => {},
    onDisable: () => {},

    onClick: () => {},
  },

  // run in content-script context (ISOLATED/SANDBOX world)
  // - can autorun
  // - can use chrome extension APIs (limited)
  // - CANNOT use imported functions (utils, shared)
  // - can access/modify DOM
  // - CANNOT access/modify variables in page context (different world)
  // - can use UfsGlobal
  //    + can run scripts in background-context (limited - via UseGlobal.Extension)
  contentScript: {
    // run (if enable autorun) in content-script context
    onDocumentStart: (details) => {},
    onDocumentIdle: (details) => {},
    onDocumentEnd: (details) => {},
    runInAllFrames: false, // false => only outermost_frame, true => all frames (including sub-frames, iframes)

    onClick: () => {},

    // advanced
    webNavigation: {
      onCreatedNavigationTarget: (details) => {},
      onHistoryStateUpdated: (details) => {},
      onBeforeNavigate: (details) => {},
    },
    webRequest: {
      onBeforeRedirect: (details) => {},
      onBeforeRequest: (details) => {},
      onBeforeSendHeaders: (details) => {},
      onCompleted: (details) => {},
      onErrorOccurred: (details) => {},
      onHeadersReceived: (details) => {},
      onResponseStarted: (details) => {},
      onSendHeaders: (details) => {},
    },
  },

  // run in webpage context (MAIN world)
  // - can autorun
  // - CANNOT use chrome extension APIs
  // - CANNOT use imported functions (utils, shared)
  // - can access/modify DOM/variables -> can override default behaviors
  // - can use UfsGlobal
  //    + can run scripts in background-context (limited - via UseGlobal.Extension)
  pageScript: {
    // run (if enable autorun) in webpage context
    onDocumentStart: (details) => {},
    onDocumentIdle: (details) => {},
    onDocumentEnd: (details) => {},
    runInAllFrames: false,

    onClick: () => {},

    // advanced
    webNavigation: {
      onCreatedNavigationTarget: (details) => {},
      onHistoryStateUpdated: (details) => {},
      onBeforeNavigate: (details) => {},
    },
    webRequest: {
      onBeforeRedirect: (details) => {},
      onBeforeRequest: (details) => {},
      onBeforeSendHeaders: (details) => {},
      onCompleted: (details) => {},
      onErrorOccurred: (details) => {},
      onHeadersReceived: (details) => {},
      onResponseStarted: (details) => {},
      onSendHeaders: (details) => {},
    },
  },

  // run in background (service worker) context
  // - can autorun
  // - can use chrome extension APIs
  // - CANNOT use dynamic imports, but can use GLOBAL variables in background_script.js
  // - can use UfsGlobal
  // - context => background context => can access GLOBAL in background_script.js
  backgroundScript: {
    onDocumentStart: (details, context) => {},
    onDocumentIdle: (details, context) => {},
    onDocumentEnd: (details, context) => {},

    // advanced
    runtime: {
      onInstalled: (reason, context) => {},
      onStartup: (nil, context) => {},
      onMessage: ({ request, sender, sendResponse }, context) => {},
    },
    webNavigation: {
      onCreatedNavigationTarget: (details, context) => {},
      onHistoryStateUpdated: (details, context) => {},
      onBeforeNavigate: (details, context) => {},
    },
    webRequest: {
      // Can only modify requestHeaders (onBeforeSendHeaders) AND responseHeaders (onHeadersReceived)
      // Don't use async await for these two events if you want to return modified values
      onBeforeRedirect: (details, context) => {},
      onBeforeRequest: (details, context) => {},
      onBeforeSendHeaders: (details, context) => {},
      onCompleted: (details, context) => {},
      onErrorOccurred: (details, context) => {},
      onHeadersReceived: (details, context) => {},
      onResponseStarted: (details, context) => {},
      onSendHeaders: (details, context) => {},
    },
    tabs: {
      onActivated: (details, context) => {},
      onAttached: (details, context) => {},
      onCreated: (details, context) => {},
      onDetached: (details, context) => {},
      onHighlighted: (details, context) => {},
      onMoved: (details, context) => {},
      onRemoved: (details, context) => {},
      onReplaced: (details, context) => {},
      onUpdated: (details, context) => {},
      onZoomChange: (details, context) => {},
    },
    storage: {
      onChanged: (details, context) => {},
    },
  },
};

// functions/attributes that other scripts can import and use
// can only used by popupScript, backgroundScript
export const shared = {};

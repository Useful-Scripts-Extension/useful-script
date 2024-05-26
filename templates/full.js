// WARNING: only import js inside scripts/ folder

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

  // buttons that show beside favorite/view-source button
  // show on hover script
  buttons: [
    {
      icon: '<i class="fa-regular fa-circle-question"></i>',
      name: {
        vi: "Đây là gì?",
        en: "What is this?",
      },
      onClick: () => {},
    },
  ],

  // easier way to add infor button beside favorite/view-source button
  // will open link in new tab when user click
  infoLink: "",

  // show change-logs at the bottom of script's description
  changeLogs: {
    date: "description",
  },

  // determize which website this script supported
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
    onEnable: () => {}, // tip: 'return false' to cancel enable action
    onDisable: () => {}, // tip: 'return false' to cancel disable action

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

    onClick: () => {},

    // advanced
    runtime: {
      onInstalled: (reason) => {},
      onStartup: (nil) => {},
      onMessage: (request, sender, sendResponse) => {},
    },
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

    onClick: () => {},

    // advanced
    runtime: {
      onInstalled: (reason) => {},
      onStartup: (nil) => {},
      onMessage: (request, sender, sendResponse) => {},
    },
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
  // - context = GLOBAL variable in background_script.js
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

// NOTES: if you want to run script in allFrames (main-frames/sub-frame/iframes)
// just add _ at the end of function name
// e.g: onDocumentStart_() onMessage_()

// these functions are not support allFrames:
// onInstalled, onStartup
// onMessage, storage.onChanged, tabs.*: default to listen all messages (included allFrames + popup + background)

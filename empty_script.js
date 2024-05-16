// WARNING: avoid importing anything here, use dynamic imports instead

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
    onCreatedNavigationTarget: (details) => {},
    onBeforeNavigate: (details) => {},
    onDocumentStart: (details) => {},
    onDocumentIdle: (details) => {},
    onDocumentEnd: (details) => {},
    runInAllFrames: false, // false => only outermost_frame, true => all frames (including sub-frames, iframes)

    onClick: () => {},
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
    onCreatedNavigationTarget: (details) => {},
    onBeforeNavigate: (details) => {},
    onDocumentStart: (details) => {},
    onDocumentIdle: (details) => {},
    onDocumentEnd: (details) => {},
    runInAllFrames: false,

    onClick: () => {},
  },

  // run in background (service worker) context
  // - can autorun
  // - can use chrome extension APIs
  // - CANNOT use dynamic imports, but can use GLOBAL variables in background_script.js
  // - can use UfsGlobal
  backgroundScript: {
    onInstalled: () => {},
    onStartup: () => {},

    onCreatedNavigationTarget: (details) => {},
    onBeforeNavigate: (details) => {},
    onDocumentStart: (details) => {},
    onDocumentIdle: (details) => {},
    onDocumentEnd: (details) => {},
  },
};

// functions/attributes that other scripts can import and use
// can only used by popupScript, backgroundScript
export const shared = {};

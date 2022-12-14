export default {
  icon: "",
  name: {
    en: "",
    vi: "",
  },
  description: {
    en: "",
    vi: "",
  },
  blackList: [],
  whiteList: [],

  // run (if autorun) in background context
  backgroundScript: {
    onDocumentStart: (tab) => {},
    onDocumentEnd: (tab) => {},
    onDocumentIdle: (tab) => {},
  },

  // run (if autorun) in web page context
  contentScript: {
    onDocumentStart: () => {},
    onDocumentEnd: () => {},
    onDocumentIdle: () => {},
  },

  // run onclick in extension-popup-page context
  onClickExtension: () => {},

  // run onclick in content-script context
  onClickContentScript: () => {},

  // run onclick in web page context
  // cannot access to shared or any variable outside of webpage
  onClick: () => {},
};

// functions/attributes that other scripts can import and use
export const shared = {};

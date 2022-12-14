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

  // run (if active) in background context
  backgroundScript: {
    onDocumentStart: (tab) => {},
    onDocumentEnd: (tab) => {},
    onDocumentIdle: (tab) => {},
  },

  // run (if active) in web page context
  contentScript: {
    onDocumentStart: () => {},
    onDocumentEnd: () => {},
    onDocumentIdle: () => {},
  },

  // run onclick in extension-popup-page context
  onClickExtension: () => {},

  // run onclick in web page context
  onClick: () => {},
};

// functions/attributes that other scripts can import and use
export const shared = {};

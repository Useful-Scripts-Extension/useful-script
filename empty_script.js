import { runScript, runScriptInCurrentTab } from "./helpers/utils.js";

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

  // Check if this script is on (show checkmark on UI)
  getActive: () => {},
  setActive: () => {},

  // run in background context
  backgroundScript: {
    onDocumentStart: (tab) => {},
    onDocumentEnd: (tab) => {},
    onDocumentIdle: (tab) => {},
  },

  // run in web page context
  contentScript: {
    onDocumentStart: () => {},
    onDocumentEnd: () => {},
    onDocumentIdle: () => {},
  },

  // run in extension-popup-page context
  onClickExtension: () => {},

  // run in web page context
  onClick: () => {},
};

// functions/attributes that other scripts can import and use
export const shared = {};

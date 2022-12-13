import { runScript } from "./helpers/utils.js";

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
  isActive: () => {},

  // run in background context
  backgroundScript: {
    onDocumentStart: () => {},
    onDocumentEnd: () => {},
    onDocumentIdle: () => {},
  },

  // run in web page context
  contentScript: {
    onDocumentStart: () => {},
    onDocumentEnd: () => {},
    onDocumentIdle: () => {},
  },

  // run in extension-popup-page context
  onClick: () => {},
};

// functions/attributes that other scripts can import and use
export const shared = {};

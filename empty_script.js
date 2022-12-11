import { runScriptInCurrentTab } from "./helpers/utils.js";

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
  checked: function () {},

  // run in background script context
  onDocumentStart: function () {},
  onDocumentEnd: function () {},
  onDocumentIdle: function () {},

  // run in extension popup page context
  onClick: function () {},
};

// functions/attributes that other scripts can import and use
export const shared = {};

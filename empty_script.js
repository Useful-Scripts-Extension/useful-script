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
  checked: function () {},

  // run in background script context
  onDocumentStart: function (tab) {},
  onDocumentEnd: function (tab) {},
  onDocumentIdle: function (tab) {},

  // run in extension popup page context
  onClick: function () {},
};

// functions/attributes that other scripts can import and use
export const shared = {};

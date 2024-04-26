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
    ["version"]: {
      ["date"]: "description",
    },
  },

  blackList: [],
  whiteList: [],

  // run when event enable/disable script. Run in extension-popup-page context
  onEnable: () => {},
  onDisable: () => {},

  // run (if enable autorun) in web page context
  onDocumentStart: () => {},
  onDocumentIdle: () => {},
  onDocumentEnd: () => {},

  // run onclick in extension-popup-page context
  onClickExtension: () => {},

  // run onclick in content-script context
  onClickContentScript: () => {},
  onDocumentStartContentScript: () => {},
  onDocumentIdleContentScript: () => {},
  onDocumentEndContentScript: () => {},

  // run onclick in web page context
  // cannot access to shared or any variable outside of webpage
  onClick: () => {},
};

// functions/attributes that other scripts can import and use
export const shared = {};

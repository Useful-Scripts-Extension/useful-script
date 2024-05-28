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

  popupScript: {
    onEnable: () => {},
    onDisable: () => {},

    onClick: () => {},
  },

  contentScript: {
    onDocumentStart: (details) => {},
    onDocumentIdle: (details) => {},
    onDocumentEnd: (details) => {},

    onClick: () => {},
  },

  pageScript: {
    onDocumentStart: (details) => {},
    onDocumentIdle: (details) => {},
    onDocumentEnd: (details) => {},

    onClick: () => {},
  },

  backgroundScript: {
    onDocumentStart: (details, context) => {},
    onDocumentIdle: (details, context) => {},
    onDocumentEnd: (details, context) => {},
  },
};

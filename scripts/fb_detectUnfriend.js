export default {
  icon: '<i class="fa-solid fa-user-large-slash fa-lg"></i>',
  name: {
    en: "Facebook - Detect unfriend",
    vi: "Facebook - Xem ai huỷ kết bạn",
  },
  description: {
    en: "Detect unfriend, know who unfriend you on facebook",
    vi: "Xem ai đã huỷ kết bạn với bạn trên facebook",
    img: "",
  },

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

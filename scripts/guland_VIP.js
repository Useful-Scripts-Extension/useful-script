import { UfsGlobal } from "./content-scripts/ufs_global.js";

export default {
  icon: "https://guland.vn/bds/img/apple-touch-icon.png",
  name: {
    en: "Guland VIP",
    vi: "Guland VIP - Xem quy hoạch đất",
  },
  description: {
    en: "VIP for Guland.vn, view map without restriction",
    vi: "Xem quy hoạch đất không bị làm phiền bởi popup vip tại Guland.vn",
    img: "/scripts/guland_VIP.png",
  },
  infoLink: "https://guland.vn",
  changeLogs: {
    "2024-07-14": "init",
  },
  whiteList: ["https://guland.vn/*"],

  contentScript: {
    onDocumentStart: (details) => {
      UfsGlobal.DOM.deleteElements(".modal-backdrop");
      UfsGlobal.DOM.deleteElements("#Modal-NotificationWithButton");
    },
  },
};

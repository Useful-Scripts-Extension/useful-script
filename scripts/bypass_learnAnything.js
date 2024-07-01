import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { BADGES } from "./helpers/badge.js";

export default {
  icon: "https://learn-anything.xyz/favicon.ico",
  name: {
    en: "Mở khoá Learn Anything",
    vi: "Bypass Learn Anything",
  },
  description: {
    en: "View learn-anything.xyz content without become a member",
    vi: "Xem nội dung web learn-anything.xyz không cần đăng ký member",
    img: "/scripts/bypass_LearnAnything.png",
  },
  badges: [BADGES.new],
  changeLogs: {
    "2024-07-01": "init",
  },
  infoLink: "https://learn-anything.xyz/",

  whiteList: ["https://learn-anything.xyz/*"],

  contentScript: {
    onDocumentStart: (details) => {
      UfsGlobal.DOM.injectCssCode(`
        #InfoMain .absolute {
          visibility: hidden !important;
        }
      `);
    },
  },
};

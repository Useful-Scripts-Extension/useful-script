import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { CANCEL_XHR, hookXHR } from "./libs/ajax-hook/index.js";

export default {
  icon: '<i class="fa-solid fa-eye-slash fa-lg"></i>',
  name: {
    en: "Insta - Anonymous story viewer",
    vi: "Insta - Xem story ẩn danh",
  },
  description: {
    en: "Watch instagram stories anonymously",
    vi: "Xem story instagram không bị đối phương phát hiện",
  },
  infoLink:
    "https://greasyfork.org/en/scripts/468385-instagram-anonymous-story-viewer",

  changeLogs: {
    "2024-04-15": "init",
  },

  whiteList: ["*://www.instagram.com/*"],

  pageScript: {
    onDocumentStart: () => {
      hookXHR({
        onBeforeSend: ({ method, url, async, user, password }, dataSend) => {
          let s = dataSend?.toString() || "";
          if (s.includes("viewSeenAt") || s.includes("SeenMutation")) {
            UfsGlobal.DOM.notify({
              msg: "Useful-script: Blocked story view tracking",
            });
            return CANCEL_XHR;
          }
        },
      });
    },

    onDocumentEnd: () => {
      UfsGlobal.DOM.notify({
        msg: "Useful-script: Blocked story view tracking READY",
      });
    },
  },
};

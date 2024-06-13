import { UfsGlobal } from "./content-scripts/ufs_global.js";

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
      (function () {
        var originalXMLSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
          let s = arguments[0]?.toString() || "";
          if (s.includes("viewSeenAt") || s.includes("SeenMutation")) {
            UfsGlobal.DOM.notify({
              msg: "Useful-script: Blocked story view tracking",
            });
          } else {
            originalXMLSend.apply(this, arguments);
          }
        };
      })();
    },

    onDocumentEnd: () => {
      UfsGlobal.DOM.notify({
        msg: "Useful-script: Blocked story view tracking READY",
      });
    },
  },
};

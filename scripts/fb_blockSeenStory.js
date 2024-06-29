import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { BADGES } from "./helpers/badge.js";
import { hookXHR } from "./libs/ajax-hook/index.js";

export default {
  icon: '<i class="fa-solid fa-user-ninja fa-lg"></i>',
  name: {
    en: "👀 Block seen story facebook",
    vi: '👀 Chặn "Đã xem" story facebook',
  },
  description: {
    en: "Block 'Seen' story in facebook. Your friend will not know that you have seen his/her stories.",
    vi: "Chặn 'Đã xem' cho story facebook. Bạn bè sẽ không biết được bạn đã xem story của họ.",
  },
  badges: [BADGES.new],
  changeLogs: {
    "2024-05-31": "init",
  },

  whiteList: ["https://*facebook.com/*"],

  pageScript: {
    onDocumentStart_: async (details) => {
      hookXHR({
        onBeforeSend: ({ method, url, async, user, password }, dataSend) => {
          if (
            method === "POST" &&
            dataSend?.toString?.()?.includes?.("storiesUpdateSeenStateMutation")
          ) {
            UfsGlobal.DOM.notify({
              msg: "Useful script: facebook story seen BLOCKED",
            });
            return null;
          }
        },
      });
    },
  },
};

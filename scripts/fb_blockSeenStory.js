import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-solid fa-user-ninja fa-lg"></i>',
  name: {
    en: "Block seen story facebook",
    vi: 'Chặn "Đã xem" story facebook',
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
      const e = window.XMLHttpRequest;
      window.XMLHttpRequest = new Proxy(e, {
        construct(o, r) {
          const instance = new o(...r),
            open = instance.open;
          instance.open = function (method, url, m, y, f) {
            return (
              (this._method = method),
              (this._url = url),
              open.apply(this, arguments)
            );
          };
          const send = instance.send;
          return (
            (instance.send = function (data) {
              if (
                !(
                  this._method === "POST" &&
                  data?.toString().includes("storiesUpdateSeenStateMutation")
                )
              )
                return send.apply(this, arguments);
              else {
                UfsGlobal.DOM.notify({
                  msg: "Useful script: facebook story seen BLOCKED",
                });
              }
            }),
            instance
          );
        },
      });
    },
  },
};

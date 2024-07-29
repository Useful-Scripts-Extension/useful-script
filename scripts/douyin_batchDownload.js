import { hookFetch, hookXHR } from "./libs/ajax-hook/index.js";

export default {
  icon: "",
  name: {
    en: "Douyin - Batch download",
    vi: "Douyin - Tải hàng loạt",
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

  whiteList: ["https://www.douyin.com/*"],

  pageScript: {
    onDocumentStart: (details) => {
      const CACHED = {
        list: [],
        byAwemeId: new Map(),
      };

      window.ufs_douyin_batchDownload = CACHED;

      hookXHR({
        onAfterSend: async (
          { method, url, async, user, password },
          dataSend,
          response
        ) => {
          console.log(method, url, dataSend, response);

          if (url.includes("aweme/") && url.includes("/post")) {
            const res = response.clone();
            const json = await res.json();
            console.log(json);

            if (json?.aweme_list?.length) {
              CACHED.list.push(...json.aweme_list);
              json.aweme_list.forEach((item) => {
                if (!CACHED.byAwemeId.has(item.aweme_id)) {
                  CACHED.byAwemeId.set(item.aweme_id, item);
                }
              });
            }
          }
        },
      });
    },

    onClick: () => {},
  },
};

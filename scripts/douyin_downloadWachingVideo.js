import { runScriptInCurrentTab } from "./helpers/utils.js";

export default {
  icon: "https://www.douyin.com/favicon.ico",
  name: {
    en: "Douyin - Download watching video",
    vi: "Douyin - Tải video đang xem",
  },
  description: {
    en: "Show all downloadable videos in current douyin webpage",
    vi: "Hiển thị mọi video có thể tải trong trang douyin hiện tại",
  },
  whiteList: ["https://www.douyin.com/*"],

  onClickExtension: async function () {
    const { downloadURL, downloadBlobUrl } =
      UsefulScriptGlobalPageContext.Utils;

    const src = await runScriptInCurrentTab(async () => {
      return await UsefulScriptGlobalPageContext.DOM.getWatchingVideoSrc();
    });

    if (!src) {
      alert("Không tìm thấy video nào.");
      return;
    }

    downloadBlobUrl(src, "douyin_video.mp4");
  },
};

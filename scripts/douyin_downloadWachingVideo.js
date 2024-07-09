import { UfsGlobal } from "./content-scripts/ufs_global.js";

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

  popupScript: {
    onClick: async function () {
      const { runScriptInCurrentTab, showLoading } = await import(
        "./helpers/utils.js"
      );

      const { closeLoading, setLoadingText } = showLoading(
        "Đang tìm video url..."
      );

      const src = await runScriptInCurrentTab(async () => {
        return await UfsGlobal.DOM.getWatchingVideoSrc();
      });

      if (!src) {
        alert("Không tìm thấy video nào.");
      } else {
        setLoadingText("Đang tải video...");
        window.open(src);
      }
      closeLoading();
    },
  },
};

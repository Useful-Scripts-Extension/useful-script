import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: "<i class='fa-solid fa-video fa-lg'></i>",
  name: {
    en: "Download watching video",
    vi: "Tải video đang xem",
  },
  description: {
    en: "tiktok, doutu.be, phimmoi2...",
    vi: "tiktok, doutu.be, phimmoi2...",
  },

  onClickExtension: async () => {
    let src = await runScriptInCurrentTab(async () => {
      return await UfsGlobal.DOM.getWatchingVideoSrc();
    });

    if (!src) {
      alert("Không tìm thấy video");
      return;
    }

    const { closeLoading, setLoadingText } = showLoading("Đang tải video...");
    await UfsGlobal.Utils.downloadBlobUrl(src, "video.mp4", (loaded, total) => {
      let loadedMB = ~~(loaded / 1024 / 1024);
      let totalMB = ~~(total / 1024 / 1024);
      let percent = ((loaded / total) * 100) | 0;
      setLoadingText(
        `Đang tải video... (${loadedMB}/${totalMB}MB - ${percent}%)`
      );
    });
    closeLoading();
  },
};

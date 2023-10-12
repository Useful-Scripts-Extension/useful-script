import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: "https://s2.googleusercontent.com/s2/favicons?domain=doutu.be",
  name: {
    en: "Download watching video doutu.be",
    vi: "Tải video doutu.be đang xem",
  },
  description: {
    en: "Download video doutu.be that you are watching",
    vi: "Tải video doutu.be bạn đang xem",
  },
  whiteList: ["https://doutu.be/*"],

  onClickExtension: async function () {
    const { downloadBlobUrl } = UsefulScriptGlobalPageContext.Utils;

    const src = await runScriptInCurrentTab(async () => {
      return await UsefulScriptGlobalPageContext.DOM.getWatchingVideoSrc();
    });

    if (!src) {
      alert("Không tìm thấy video nào.");
      return;
    }

    const { closeLoading, setLoadingText } = showLoading("Đang tải video...");
    await downloadBlobUrl(src, "doutube_video.mp4", (loaded, total) => {
      setLoadingText(`Đang tải video... (${((loaded / total) * 100) | 0}%)`);
    });
    closeLoading();
  },
};

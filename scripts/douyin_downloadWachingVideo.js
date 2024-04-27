import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";

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
    const {
      downloadURL,
      downloadBlob,
      getBlobFromUrlWithProgress,
      formatSize,
    } = UfsGlobal.Utils;

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
      // downloadURL(src, "douyin_video.mp4");
      window.open(src);
      // const blob = await getBlobFromUrlWithProgress(
      //   src,
      //   ({ loaded, total, speed }) => {
      //     const percent = ((loaded / total) * 100) | 0;
      //     setLoadingText(
      //       `Đang tải video...<br/>` +
      //         `Vui lòng không tắt popup <br/>` +
      //         `${formatSize(loaded)}/${formatSize(total)} (${percent}%)` +
      //         ` - ${formatSize(speed)}/s`
      //     );
      //   }
      // );
      // await downloadBlob(blob, "douyin_video.mp4");
    }
    closeLoading();
  },
};

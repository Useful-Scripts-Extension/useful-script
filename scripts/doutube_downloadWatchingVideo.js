import {
  downloadBlob,
  runScriptInCurrentTab,
  showLoading,
} from "./helpers/utils.js";

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
    const src = await runScriptInCurrentTab(() => {
      const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.left < window.innerWidth &&
          rect.top < window.innerHeight
        );
      };
      for (let v of Array.from(document.querySelectorAll("video"))) {
        if (isElementInViewport(v)) {
          if (v.src) return v.src;
          let sources = Array.from(v.querySelectorAll("source"));
          for (let s of sources) {
            if (s.src) return s.src;
          }
        }
      }
    });

    if (src) {
      const { closeLoading } = showLoading("Đang tải video...");
      downloadBlob(src, "doutube_video.mp4").then(closeLoading);
    } else {
      alert("Không tìm thấy video nào.");
    }
  },
};

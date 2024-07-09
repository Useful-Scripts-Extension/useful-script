import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { BADGES } from "./helpers/badge.js";
import {
  attachDebugger,
  detachDebugger,
  getCurrentTab,
  sendDevtoolCommand,
  showLoading,
} from "./helpers/utils.js";

export default {
  icon: "https://gofullpage.com/favicon.ico",
  name: {
    en: "Screenshot full webpage",
    vi: "Chụp ảnh toàn bộ web",
  },
  description: {
    en: "Taking a screenshot of an entire webpage",
    vi: "Tạo 1 ảnh chụp màn hình chứa toàn bộ nội dung website",
  },
  badges: [BADGES.hot],

  popupScript: {
    onClick: async function () {
      const { setLoadingText, closeLoading } = showLoading(
        "Đang lấy kích thước trang..."
      );
      try {
        let tab = await getCurrentTab();
        await attachDebugger(tab);
        let res = await sendDevtoolCommand(tab, "Page.getLayoutMetrics", {});
        const { x, y, width, height } = res.cssContentSize;

        if (
          confirm(`Kích thước trang: ${width} x ${height}\n Bấm OK để chụp`)
        ) {
          setLoadingText("Đang tạo ảnh chụp màn hình...");
          let img = await sendDevtoolCommand(tab, "Page.captureScreenshot", {
            format: "png",
            quality: 100,
            fromSurface: true,
            captureBeyondViewport: true,
            clip: { x: 0, y: 0, width, height, scale: 1 },
          });
          console.log(img);

          setLoadingText("Đang lưu ảnh...");
          UfsGlobal.Extension.download({
            url: "data:image/png;base64," + img.data,
            filename: "fullpage.png",
          });
        }
        await detachDebugger(tab);
      } catch (e) {
        alert("Lỗi: " + e);
      } finally {
        closeLoading();
      }
    },
  },
};

function backup() {
  // var blob = new Blob(img.data, { type: "image/png" });
  // var url = URL.createObjectURL(blob);
  // chrome.downloads.download({
  //   url: url,
  //   filename: "screenshot.png",
  // });
  // window.open("data:image/png;base64," + img.data);
}

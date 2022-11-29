import {
  attachDebugger,
  detachDebugger,
  downloadURI,
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
    vi: "Tạo ảnh chụp màn hình toàn bộ website",
  },
  runInExtensionContext: true,

  func: async function () {
    const { setLoadingText, closeLoading } = showLoading(
      "Đang lấy kích thước trang..."
    );
    try {
      let tab = await getCurrentTab();
      await attachDebugger(tab);
      let res = await sendDevtoolCommand(tab, "Page.getLayoutMetrics", {});
      const { x, y, width, height } = res.cssContentSize;

      setLoadingText("Đang tạo ảnh chụp màn hình...");
      let img = await sendDevtoolCommand(tab, "Page.captureScreenshot", {
        format: "png",
        quality: 100,
        fromSurface: true,
        captureBeyondViewport: true,
        clip: { x: 0, y: 0, width, height, scale: 1 },
      });
      console.log(img);
      await detachDebugger(tab);

      setLoadingText("Đang lưu ảnh...");
      downloadURI("data:image/png;base64," + img.data, "fullpage.png");
    } catch (e) {
      alert("Lỗi: " + e);
    }
    closeLoading();
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

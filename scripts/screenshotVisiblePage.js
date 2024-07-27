import { UfsGlobal } from "./content-scripts/ufs_global.js";
import {
  attachDebugger,
  detachDebugger,
  getCurrentTab,
  sendDevtoolCommand,
  showLoading,
} from "./helpers/utils.js";

export default {
  icon: '<i class="fa-solid fa-camera fa-lg"></i>',
  name: {
    en: "Screenshot webpage",
    vi: "Chụp ảnh web",
  },
  description: {
    en: "Taking a screenshot of visible webpage (bypass websites that block screenshots such as Netflix, ...)",
    vi: "Chụp ảnh trang web hiện tại (bypass những trang web cấm chụp màn hình như Netflix,...)",
  },

  buttons: [
    {
      icon: '<i class="fa-solid fa-question"></i>',
      name: {
        vi: "Cách cấm chụp màn hình hoạt động?",
        en: "How these web prevent screenshot?",
      },
      onClick: () => {
        window.open(
          "https://www.google.com/search?q=Stream+DRM+la+gi",
          "_blank"
        );
      },
    },
    {
      icon: '<i class="fa-solid fa-arrow-up-right-from-square"></i>',
      name: {
        vi: "Web ví dụ",
        en: "Example web",
      },
      onClick: () => {
        window.open(
          "https://www.theoplayer.com/theoplayer-drm-aes-128-encryption",
          "_blank"
        );
      },
    },
  ],
  changeLogs: {
    "2024-06-10": "init",
  },

  popupScript: {
    onClick: async function () {
      const { setLoadingText, closeLoading } = showLoading(
        "Đang tạo ảnh chụp màn hình..."
      );
      try {
        let tab = await getCurrentTab();
        await attachDebugger(tab);

        let img = await sendDevtoolCommand(tab, "Page.captureScreenshot", {
          format: "png",
          quality: 100,
          fromSurface: true,
          captureBeyondViewport: false,
        });
        console.log(img);

        setLoadingText("Đang lưu ảnh...");
        UfsGlobal.Extension.download({
          url: "data:image/png;base64," + img.data,
          filename: "webpage.png",
        });

        await detachDebugger(tab);
      } catch (e) {
        alert("Lỗi: " + e);
      } finally {
        closeLoading();
      }
    },
  },
};

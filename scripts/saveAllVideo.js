import { getCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: "https://saveallvideo.net/assets/img/favicon.png",
  name: {
    en: "Save All Video",
    vi: "Save All Video",
  },
  description: {
    en: "Download video from Douyin Twitter Instagram TikTok Youtube",
    vi: "Tải video từ Douyin Twitter Instagram TikTok Youtube",
  },
  infoLink: "https://saveallvideo.net",
  // "https://www.facebook.com/groups/j2team.community/posts/2316412945357479/",

  changeLogs: {
    1.65: {
      "2024-03-13": "init",
    },
  },

  onClickExtension: async () => {
    const { closeLoading, setLoadingText } = showLoading(
      "Đang lấy thông tin tab..."
    );
    try {
      let tab = await getCurrentTab();
      setLoadingText("Vui lòng nhập link video muốn tải...");
      let url = prompt(
        "Nhập link video (Douyin Twitter Instagram TikTok Youtube): ",
        tab.url
      );
      if (url == null) return;

      setLoadingText("Đang tải thông tin từ saveallvideo...");
      let res = await fetch(
        "https://saveallvideo.net/apiget?apiuser=j2team&apipass=j2team&url=" +
          url
      );
      setLoadingText("Đang xử lý thông tin...");
      let json = await res.json();
      let download_url = json?.url;
      if (download_url) window.open(download_url);
      else throw Error("API không trả link video.");
    } catch (e) {
      alert("ERROR: " + e);
      window.open("https://saveallvideo.net");
    } finally {
      closeLoading();
    }
  },
};

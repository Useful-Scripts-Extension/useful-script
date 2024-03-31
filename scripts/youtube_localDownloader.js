import { runScriptInCurrentTab } from "./helpers/utils.js";

export default {
  icon: "https://www.youtube.com/s/desktop/accca349/img/favicon_48x48.png",
  name: {
    en: "Youtube local downloader",
    vi: "Youtube tải video local",
  },
  description: {
    en: "",
    vi: "",
  },

  whiteList: ["https://*youtube.com/*"],

  onClickExtension: async () => {
    const yt_data = await runScriptInCurrentTab(() => {
      return document.getElementsByTagName("ytd-app")[0].data.playerResponse;
    });

    if (!yt_data) {
      alert("Không tìm thấy video data");
      return;
    }

    localStorage.setItem(
      "ufs_youtube_localDownloader",
      JSON.stringify(yt_data)
    );

    window.open("/scripts/youtube_localDownloader.html");
  },
};

import download_watchingVideo from "./download_watchingVideo.js";

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

  onClickExtension: download_watchingVideo.onClickExtension,
};

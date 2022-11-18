export default {
  icon: "https://zjs.zmdcdn.me/zmp3-desktop/releases/v1.7.64/static/media/icon_zing_mp3_60.f6b51045.svg",
  name: {
    en: "Zingmp3 old layout",
    vi: "Zingmp3 giao diện cũ",
  },
  description: {
    en: "Go back to zingmp3 old layout",
    vi: "Trở về giao diện zingmp3 cũ",
  },
  blackList: [],
  whiteList: ["https://zingmp3.vn/*"],

  func: function () {
    location.hostname = "mp3.zing.vn";
  },
};

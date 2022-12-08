export default {
  icon: "https://zjs.zmdcdn.me/zmp3-desktop/releases/v1.7.64/static/media/icon_zing_mp3_60.f6b51045.svg",
  name: {
    en: "Zingmp3 old/new layout",
    vi: "Zingmp3 giao diện cũ/mới",
  },
  description: {
    en: "Toggle UI zingmp3 old/new",
    vi: "Bật/tắt giao diện zingmp3 mới/cũ",
  },
  blackList: [],
  whiteList: ["https://zingmp3.vn/*", "https://mp3.zing.vn/*"],

  onClick: function () {
    // Mặc định thì mp3.zing.vn (giao diện cũ) sẽ tự động redirect người dùng về zingmp3.vn (giao diện mới)

    // Vui lòng xem file content-script/scripts/mp3.zing.vn.js và content-script/document_start.js
    // Để biết cách bypass quá trình tự động này

    if (location.hostname === "mp3.zing.vn") location.hostname = "zingmp3.vn";
    else location.hostname = "mp3.zing.vn";
  },
};

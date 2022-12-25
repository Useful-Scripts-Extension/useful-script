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
    whiteList: ["https://zingmp3.vn/*", "https://mp3.zing.vn/*"],

  onDocumentStart : () => {
    // prevent auto redirect from https://mp3.zing.vn/ to https://zingmp3.vn/
    window.MP3_MEDIA_USER_UPLOAD = 1;

    // mp3 VIP (test)
    window.onload = () => {
      if (window.MP3) {
        window.MP3.ACCOUNT_ID = new Date().getTime();
        window.MP3.ACCOUNT_NAME = "VIP - Useful scripts";
        window.MP3.VIP = 1;
        window.MP3.IS_IP_VN = true;
      }

      window.checkLogin = () => true;

      if (window.ZVip) {
        window.ZVip.isVip = 1;
        window.ZVip.vip = 1;
      }
    };
  },

  onClick: function () {
    if (location.hostname === "mp3.zing.vn") location.hostname = "zingmp3.vn";
    else location.hostname = "mp3.zing.vn";
  },
};

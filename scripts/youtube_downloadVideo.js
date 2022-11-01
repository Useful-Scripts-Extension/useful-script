export default {
  name: {
    en: "Download youtube video (bypass 18+)",
    vi: "Tải video youtube (bypass 18+)",
  },
  description: {
    en: "Bypass age restriction, without login",
    vi: "Tải cả video giới hạn độ tuổi, không cần đăng nhập",
  },
  blackList: [],
  whiteList: ["www.youtube.com"],

  func: function () {
    window.open("https://9xbuddy.com/process?url=" + location.href);
  },
};

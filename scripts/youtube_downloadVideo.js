export default {
  icon: `https://www.google.com/s2/favicons?domain=youtube.com`,
  name: {
    en: "Download youtube video (bypass 18+)",
    vi: "Tải video youtube (bypass 18+)",
  },
  description: {
    en: "Bypass age restriction, without login",
    vi: "Tải cả video giới hạn độ tuổi, không cần đăng nhập",
  },
  blackList: [],
  whiteList: ["*://*.youtube.com/*"],

  func: function () {
    let options = [
      {
        name: "yt1s.com",
        url: "https://yt1s.com/vi/youtube-to-mp4?q=",
      },
      {
        name: "10downloader.com",
        url: "https://10downloader.com/download?v=",
      },
      {
        name: "9xbuddy.com",
        url: "https://9xbuddy.com/process?url=",
      },
      {
        name: "ymp4.com",
        url: "https://ymp4.download/en50/?url=/",
      },
    ];

    let choose = prompt(
      "Tải video youtube: \n\n" +
        options.map((_, i) => `${i}: ${_.name}`).join("\n") +
        "\n\nNhập lựa chọn:",
      0
    );

    if (choice != null && choose >= 0 && choose < options.length) {
      window.open(options[choose] + location.href);
    }
  },
};

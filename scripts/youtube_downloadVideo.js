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

  func: function () {
    // https://stackoverflow.com/a/8260383/11898496
    function getIdFromYoutubeURL(url) {
      var regExp =
        /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      return match && match[1].length == 11 ? match[1] : false;
    }

    let options = [
      {
        name: "yt1s.com",
        func: (url) => {
          window.open("https://yt1s.com/vi/youtube-to-mp4?q=" + url);
        },
      },
      {
        name: "10downloader.com",
        func: (url) => {
          window.open("https://10downloader.com/download?v=" + url);
        },
      },
      {
        name: "ymp4.com",
        func: (url) => {
          window.open("https://ymp4.download/en50/?url=" + url);
        },
      },
      {
        name: "9xbuddy.com",
        func: (url) => {
          window.open("https://9xbuddy.com/process?url=" + url);
        },
      },
      {
        name: "getlinks.vip",
        url: "https://getlinks.vip/vi/youtube/",
        func: (url) => {
          window.open(
            "https://getlinks.vip/vi/youtube/" + getIdFromYoutubeURL(url)
          );
        },
      },
    ];

    let choose = prompt(
      "Tải video youtube: \n\n" +
        options.map((_, i) => `${i}: ${_.name}`).join("\n") +
        "\n\nNhập lựa chọn:",
      0
    );

    if (choose != null && choose >= 0 && choose < options.length) {
      let url = window.prompt("Nhập link youtube:", location.href);
      url && options[choose].func(url);
    }
  },
};

export default {
  icon: `https://www.youtube.com/s/desktop/ff71ea81/img/favicon_48x48.png`,
  name: {
    en: "Download youtube video",
    vi: "Tải video youtube",
  },
  description: {
    en: "Bypass age restriction, without login",
    vi: "Tải cả video giới hạn độ tuổi, không cần đăng nhập",
  },

  onClick: function () {
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
      let url = prompt("Nhập link youtube:", location.href);
      url && options[choose].func(url);
    }
  },
};

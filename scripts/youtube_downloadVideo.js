import { BADGES } from "./helpers/badge.js";

export default {
  icon: `https://www.youtube.com/s/desktop/ff71ea81/img/favicon_48x48.png`,
  name: {
    en: "Download youtube video/audio",
    vi: "Tải video/audio youtube",
  },
  description: {
    en: "Bypass age restriction, without login",
    vi: "Tải cả video giới hạn độ tuổi, không cần đăng nhập",
  },
  badges: [BADGES.hot],

  contentScript: {
    onClick: function () {
      let options = [
        {
          name: "y2mate.com",
          func: (url) => url.replace("youtube.com", "youtubepp.com"),
        },
        {
          name: "yt1s.com",
          func: (url) => "https://yt1s.com/vi/youtube-to-mp4?q=" + url,
        },
        {
          name: "yt5s.com",
          func: (url) => url.replace("youtube.com", "youtube5s.com"),
        },
        {
          name: "tubemp3.to",
          func: (url) => "https://tubemp3.to/" + url,
        },
        {
          name: "10downloader.com",
          func: (url) => "https://10downloader.com/download?v=" + url,
        },
        {
          name: "9xbuddy.com",
          func: (url) => "https://9xbuddy.com/process?url=" + url,
        },
        {
          name: "getlinks.vip",
          func: (url) =>
            "https://getlinks.vip/vi/youtube/" + getIdFromYoutubeURL(url),
        },
        {
          name: "ymp4.com",
          func: (url) => "https://ymp4.download/en50/?url=" + url,
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
        if (url) {
          url = options[choose].func(url);
          let myWin = window.open(
            url,
            "Download Youtube Video",
            "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=800, height=900"
          );
        }
      }
    },
  },
};

// https://stackoverflow.com/a/8260383/11898496
export function getIdFromYoutubeURL(url) {
  let regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  let match = url.match(regExp);
  return match && match[1].length == 11 ? match[1] : false;
}

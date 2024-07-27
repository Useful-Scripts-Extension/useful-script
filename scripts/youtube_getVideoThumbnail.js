import { getIdFromYoutubeURL } from "./youtube_downloadVideo.js";

export default {
  icon: '<i class="fa-regular fa-image fa-lg"></i>',
  name: {
    en: "Get Youtube video's thumbnail",
    vi: "Lấy thumbnail video trên Youtube",
  },
  description: {
    en: "Get largest thumbnail of playing youtube video",
    vi: "Tải về hình thumbnail độ phân giải lớn nhất của video youtube đang xem",
  },
  changeLogs: {
    "2024-07-04": "init",
  },

  whiteList: ["https://*.youtube.com/*"],

  pageScript: {
    onClick: () => {
      const methods = [
        () =>
          document
            .getElementsByTagName("ytd-app")[0]
            .data.playerResponse.videoDetails.thumbnail.thumbnails.sort(
              (a, b) => b.width * b.height - a.width * a.height
            )[0].url,
        () =>
          ytplayer.config.args.raw_player_response.videoDetails.thumbnail.thumbnails.sort(
            (a, b) => b.width * b.height - a.width * a.height
          )[0].url,
        () =>
          `https://i.ytimg.com/vi/${getIdFromYoutubeURL(
            location.href
          )}/maxresdefault.jpg`,
      ];

      for (let f of methods) {
        try {
          let url = f();
          if (url) {
            window.open(url, "_blank");
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
  },
};

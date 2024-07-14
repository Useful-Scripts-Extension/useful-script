import { BADGES } from "./helpers/badge.js";
import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { shared as fb_videoDownloader } from "./fb_videoDownloader.js";
import { showLoading, runScriptInCurrentTab } from "./helpers/utils.js";

export default {
  icon: "https://www.facebook.com/favicon.ico",
  name: {
    en: "Download watching fb video",
    vi: "Tải video fb đang xem",
  },
  description: {
    en: "Download any facebook video that you are watching (watch / story / comment / reel / chat)",
    vi: "Tải bất kỳ video facebook nào mà bạn đang xem (watch / story / comment / reel / chat / bình luận / tin nhắn)",
  },
  badges: [BADGES.hot],
  changeLogs: {
    "2024-06-26": "fix logic",
  },

  whiteList: ["https://*.facebook.com/*"],
  infoLink:
    "https://greasyfork.org/en/scripts/477748-facebook-video-downloader",

  popupScript: {
    onClick: async function () {
      let { closeLoading, setLoadingText } = showLoading(
        "Đang lấy videoId từ trang web..."
      );
      try {
        let listVideoId = await shared.getListVideoIdInWebsite();
        if (!listVideoId?.length > 0) throw Error("Không tìm thấy video nào");

        setLoadingText("Đang lấy token dtsg...");
        let dtsg = await fb_videoDownloader.getDtsg();

        let downloaded = 0;
        for (let videoId of listVideoId) {
          setLoadingText("Đang tìm video url...");
          let videoUrl = await fb_videoDownloader.getLinkFbVideo(videoId, dtsg);
          if (videoUrl) {
            downloaded++;
            UfsGlobal.Extension.download({
              url: videoUrl,
              filename: "fb_video.mp4",
            });
          }
        }
        if (downloaded === 0) {
          alert("Không tìm thấy link video");
        }
      } catch (e) {
        alert("ERROR: " + e);
      } finally {
        closeLoading();
      }
    },
  },
};

export const shared = {
  getListVideoIdInWebsite: async function () {
    return await runScriptInCurrentTab(() => {
      let allVideos = Array.from(document.querySelectorAll("video"));
      let result = [];
      for (let video of allVideos) {
        try {
          let key = "";
          for (let k in video.parentElement) {
            if (k.startsWith("__reactProps")) {
              key = k;
              break;
            }
          }
          result.push({
            overlapScore: UfsGlobal.DOM.getOverlapScore(video),
            videoId: video.parentElement[key].children.props.videoFBID,

            // https://stackoverflow.com/a/31196707/23648002
            playing: !!(
              video.currentTime > 0 &&
              !video.paused &&
              !video.ended &&
              video.readyState > 2
            ),
          });
        } catch (e) {
          console.log("ERROR on get videoFBID: ", e);
        }
      }

      // if there is playing video => return that
      let playingVideo = result.find((_) => _.playing);
      if (playingVideo) return [playingVideo.videoId];

      // else return all videos in-viewport
      return result
        .filter((_) => _.videoId && (_.overlapScore > 0 || _.playing))
        .sort((a, b) => b.overlapScore - a.overlapScore)
        .map((_) => _.videoId);
    });
  },
};

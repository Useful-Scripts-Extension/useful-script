import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";
import { shared as fb_videoDownloader } from "./fb_videoDownloader.js";

export default {
  icon: "https://www.facebook.com/favicon.ico",
  name: {
    en: "Download watching fb video",
    vi: "Tải video fb đang xem",
  },
  description: {
    en: "Download any facebook video that you are watching (watch/story/comment/reel/chat)",
    vi: "Tải bất kỳ video facebook nào mà bạn đang xem (watch/story/comment/reel/chat/bình luận/tin nhắn)",
  },
  whiteList: ["https://*.facebook.com/*"],
  infoLink:
    "https://greasyfork.org/en/scripts/477748-facebook-video-downloader",

  onClickExtension: async function () {
    let { closeLoading, setLoadingText } = showLoading(
      "Đang lấy videoId từ trang web..."
    );
    try {
      let listVideoId = await shared.getListVideoIdInWebsite();
      let watchingVideoId = listVideoId[0];
      if (!watchingVideoId) throw Error("Không tìm thấy video nào");

      setLoadingText("Đang lấy token dtsg...");
      let dtsg = await fb_videoDownloader.getDtsg();

      setLoadingText("Đang tìm video url...");
      let videoUrl = await fb_videoDownloader.getLinkFbVideo(
        watchingVideoId,
        dtsg
      );

      if (videoUrl) {
        UsefulScriptGlobalPageContext.Utils.downloadURL(
          videoUrl,
          "fb_video.mp4"
        );
      } else throw Error("Không tìm được video link");
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

export const shared = {
  getListVideoIdInWebsite: async function () {
    return await runScriptInCurrentTab(() => {
      const { getOverlapScore } = UsefulScriptGlobalPageContext.DOM;

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
            overlapScore: getOverlapScore(video),
            videoId: video.parentElement[key].children.props.videoFBID,
          });
        } catch (e) {
          console.log("ERROR on get videoFBID: ", e);
        }
      }

      return result
        .sort((a, b) => b.overlapScore - a.overlapScore)
        .map((_) => _.videoId);
    });
  },
};

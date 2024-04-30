import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";
import { shared as tiktok_downloadVideo } from "./tiktok_downloadVideo.js";

export default {
  icon: "https://www.tiktok.com/favicon.ico",
  name: {
    en: "Tiktok - Download watching video",
    vi: "Tiktok - Tải video đang xem",
  },
  description: {
    en: "Download tiktok video you are watching (no watermark)",
    vi: "Tải video tiktok bạn đang xem (không watermark)",
  },

  changeLogs: {
    "2024-04-27": "fix bug - use snaptik",
  },

  whiteList: ["https://www.tiktok.com/*"],

  onClickExtension: async function () {
    const { closeLoading, setLoadingText } = showLoading("Đang lấy video id..");

    let title = "tiktok_video";

    const getLinkFuncs = [
      async () => {
        setLoadingText("Đang tìm videoid...");
        const videos = await shared.getListVideoIdInWebsite();
        if (videos.length) {
          let video = videos[0];
          title = video?.title?.split?.("#")?.[0] || video.id || title;
          setLoadingText(`Đang tìm link tải video ${title}...`);

          let res = await tiktok_downloadVideo.getVideoNoWaterMark(
            shared.genTiktokUrl(video.author, video.id)
          );
          return res;
        }
      },

      async () => {
        setLoadingText("Đang tìm video url từ DOM...");
        return await runScriptInCurrentTab(
          async () => await UfsGlobal.DOM.getWatchingVideoSrc()
        );
      },
    ];

    let link;
    for (let func of getLinkFuncs) {
      try {
        link = await func();
        if (link) break;
      } catch (e) {
        alert("lol");
      }
    }

    if (!link) alert("Không tìm được link video");
    else {
      setLoadingText("Đang tải video...");
      await UfsGlobal.Utils.downloadBlobUrl(link, title + ".mp4");
    }

    closeLoading();
  },
};

export const shared = {
  genTiktokUrl(author, videoId) {
    return `https://www.tiktok.com/@${author}/video/${videoId}`;
  },
  getListVideoIdInWebsite: async function () {
    return await runScriptInCurrentTab(() => {
      const { getOverlapScore, closest } = UfsGlobal.DOM;

      let allVideos = Array.from(document.querySelectorAll("video"));
      let result = [];
      for (let video of allVideos) {
        try {
          result.push({
            overlapScore: getOverlapScore(video),
            id: video.parentElement.id.split("-").at(-1),
            title: closest(video, '[data-e2e="video-desc"]')?.textContent,
            author: closest(video, '[data-e2e="video-author-avatar"]')?.href,
          });
        } catch (e) {
          console.log("ERROR on get: ", e);
        }
      }

      return result.sort((a, b) => b.overlapScore - a.overlapScore);
    });
  },
};

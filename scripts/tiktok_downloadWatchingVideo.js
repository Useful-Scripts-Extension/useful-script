import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";

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

  whiteList: ["https://www.tiktok.com/*"],

  onClickExtension: async function () {
    const { closeLoading, setLoadingText } = showLoading("Đang lấy video id..");

    const getLinkFuncs = [
      async () => {
        setLoadingText("Đang tìm videoid...");
        const videoIds = await shared.getListVideoIdInWebsite();
        if (videoIds.length) {
          setLoadingText(`Đang tìm link tải video ${videoIds[0]}...`);
          return await UsefulScriptGlobalPageContext.Tiktok.downloadTiktokVideoFromId(
            videoIds[0]
          );
        }
      },

      async () => {
        setLoadingText("Đang tìm video url từ DOM...");
        return await runScriptInCurrentTab(
          async () =>
            await UsefulScriptGlobalPageContext.DOM.getWatchingVideoSrc()
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
      await UsefulScriptGlobalPageContext.Utils.downloadBlobUrl(
        link,
        "tiktok_video.mp4"
      );
    }

    closeLoading();
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
          result.push({
            overlapScore: getOverlapScore(video),
            videoId: video.parentElement.id.split("-").at(-1),
            title: video.parentElement.parentElement.previousElementSibling.alt,
          });
        } catch (e) {
          console.log("ERROR on get: ", e);
        }
      }

      return result
        .sort((a, b) => b.overlapScore - a.overlapScore)
        .map((_) => _.videoId);
    });
  },
};

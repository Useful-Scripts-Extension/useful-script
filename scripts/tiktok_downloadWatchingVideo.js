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

  onClickExtension: async function () {
    const { closeLoading, setLoadingText } = showLoading("Đang lấy video id..");
    try {
      const videoIds = await shared.getListVideoIdInWebsite();
      if (!videoIds.length) throw Error("Không tìm thấy video nào");
      else {
        setLoadingText(`Đang tìm link tải video ${videoIds[0]}...`);
        const link =
          await UsefulScriptGlobalPageContext.Tiktok.downloadTiktokVideoFromId(
            videoIds[0]
          );
        if (link) {
          // await UsefulScriptGlobalPageContext.Utils.downloadBlobUrl(
          //   link,
          //   "video.mp4",
          //   (loaded, total) => {
          //     let loadedMB = ~~(loaded / 1024 / 1024);
          //     let totalMB = ~~(total / 1024 / 1024);
          //     let percent = ((loaded / total) * 100) | 0;
          //     setLoadingText(
          //       `Đang tải video... (${loadedMB}/${totalMB}MB - ${percent}%)`
          //     );
          //   }
          // );
          window.open(link);
        } else alert("Không tìm được video đang xem");
      }
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

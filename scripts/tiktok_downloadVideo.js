import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: "https://www.tiktok.com/favicon.ico",
  name: {
    en: "Tiktok - Download video from URL",
    vi: "Tiktok - Tải video từ URL",
  },
  description: {
    en: "Download tiktok video from url (no watermark)",
    vi: "Tải video tiktok từ link (không watermark)",
  },

  changeLogs: {
    "2024-04-27": "fix bug - use snaptik",
  },

  onClickExtension: async function () {
    let url = prompt(
      "Nhập link tiktok video: ",
      await runScriptInCurrentTab(() => location.href)
    );
    if (url == null) return;

    let { closeLoading } = showLoading(
      "Đang lấy link video không watermark..."
    );
    try {
      let link = "";
      link = await shared.getVideoNoWaterMark(url);
      if (link) window.open(link);
      else throw Error("Không tìm được video không watermark");
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

export const shared = {
  // Source code: https://github.com/karim0sec/tiktokdl
  getTiktokVideoIdFromUrl: function (url) {
    if (url.includes("@") && url.includes("/video/"))
      return url.split("/video/")[1].split("?")[0];
    throw Error("URL video tiktok không đúng địng dạng");
  },

  getVideoNoWaterMark: async function (video_url, isVideoId = false) {
    let link = await UfsGlobal.Tiktok.downloadTiktokVideoFromUrl(video_url);
    if (!link) {
      let videoId = isVideoId
        ? video_url
        : shared.getTiktokVideoIdFromUrl(video_url);
      if (!videoId) throw Error("Video URL không đúng định dạng");
      link = await UfsGlobal.Tiktok.downloadTiktokVideoFromId(videoId);
    }
    return link;
  },
};

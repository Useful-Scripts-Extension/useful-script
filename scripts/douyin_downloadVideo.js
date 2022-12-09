import { getCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: "https://www.douyin.com/favicon.ico",
  name: {
    en: "Douyin - Download video (API)",
    vi: "Douyin - Tải video (API)",
  },
  description: {
    en: "Download video from douyin using API",
    vi: "Tải video douyin sử dụng API",
  },
  runInExtensionContext: true,

  onClick: async function () {
    let { closeLoading, setLoadingText } = showLoading();
    try {
      let tab = await getCurrentTab();
      let url = prompt("Nhập  link video douyin:", tab.url);
      if (url == null) return;

      setLoadingText("Đang tìm video...");
      let videoUrl = await shared.getVideoFromUrl(url);
      if (videoUrl) window.open(videoUrl);
      else throw Error("Không tìm thấy video");
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

export const shared = {
  // https://github.com/soimort/you-get/blob/develop/src/you_get/extractors/douyin.py
  extractVideoIdFromUrl: function (url) {
    return /(\d+)/.exec(url)?.[1];
  },
  getFullVideoUrl: async function (shortUrl) {
    let res = await fetch(shortUrl);
    return res.url;
  },
  getVideoFromUrl: async function (url) {
    if (url.includes("v.douyin.com")) {
      url = await shared.getFullVideoUrl(url);
    }
    let videoId = shared.extractVideoIdFromUrl(url);
    if (!videoId) throw Error("Không tìm được video id.");
    return await shared.getVideoFromVideoId(videoId);
  },
  getVideoFromVideoId: async function (videoId) {
    let res = await fetch(
      "https://www.douyin.com/web/api/v2/aweme/iteminfo/?item_ids=" + videoId
    );
    let json = await res.json();
    return json.item_list[0].video.play_addr.url_list[0];
  },
};

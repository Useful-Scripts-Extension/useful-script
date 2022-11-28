import showTheVideos from "./showTheVideos.js";

export default {
  icon: "https://www.tiktok.com/favicon.ico",
  name: {
    en: "Douyin - Download watching video",
    vi: "Douyin - Tải video đang xem",
  },
  description: {
    en: "Show all downloadable videos in current douyin webpage",
    vi: "Hiển thị mọi video có thể tải trong trang douyin hiện tại",
  },
  blackList: [],
  whiteList: ["https://www.douyin.com/*"],

  func: showTheVideos.func,
};

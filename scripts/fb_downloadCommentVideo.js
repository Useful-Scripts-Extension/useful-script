import fb_storySaver from "./fb_storySaver.js";

export default {
  icon: "https://www.facebook.com/favicon.ico",
  name: {
    en: "Download facebook comment video",
    vi: "Tải video trong comment facebook",
  },
  description: {
    en: "Download facebook comment video that you are watching",
    vi: "Tải video trong comment facebook bạn đang xem",
  },
  whiteList: [],
  runInExtensionContext: false,

  func: fb_storySaver.func,
};

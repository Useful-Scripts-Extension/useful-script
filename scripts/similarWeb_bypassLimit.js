import removeCookies from "./removeCookies.js";

export default {
  icon: "https://files.startupranking.com/startup/thumb/19950_8743c12283f6a62f069b5b05d518e1ba31465150_similarweb_l.png",
  name: {
    en: "Bypass limit in SimilarWeb",
    vi: "SimilarWeb - không bị giới hạn",
  },
  description: {
    en:
      "You can use SimilarWeb forever without login.<br/><br/>" +
      "<h2>How it work:</h2>Your cookies will be deleted each times enter this web.",
    vi:
      "Sử dụng SimilarWeb không giới hạn, không cần đăng nhập.<br/><br/>" +
      "<h2>Cách hoạt động:</h2>Cookies của bạn sẽ được xoá mỗi khi vào trang web",
    img: "/scripts/similarWeb_bypassLimit.png",
  },

  changeLogs: {
    "2024-04-27": "init",
  },

  whiteList: ["https://www.similarweb.com/*"],

  pageScript: {
    onDocumentEnd: () => removeCookies.onClick(true),
  },
};

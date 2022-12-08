export default {
  icon: "https://d20ohkaloyme4g.cloudfront.net/img/favicon.ico",
  name: {
    en: "Studocu - Download documents",
    vi: "Studocu - Tải documents",
  },
  description: {
    en: "Download document pdf on Studocu.com for free",
    vi: "Tải PDF document trên Studocu.com miễn phí",
  },
  blackList: [],
  whiteList: ["https://www.studocu.com/*"],
  runInExtensionContext: false,

  onClick: function () {
    let url = new URL(location.href);
    url.hostname = "www.downstudocu.com";
    window.open(url);
  },
};

// Những thuộc tính/hàm có thể chia sẻ cho cách scripts khác sử dụng sẽ được viết vào đây
export const shared = {};

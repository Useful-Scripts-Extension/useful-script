export default {
  icon: "https://documents-downloader.pages.dev/apple-icon-57x57.png",
  name: {
    en: "Scribd - Download documents",
    vi: "Scribd - Tải documents",
  },
  description: {
    en: "Download document on Scribd for free",
    vi: "Tải miễn phí document trên Scribd",
  },
  whiteList: ["https://www.scribd.com/document/*"],
  runInExtensionContext: false,

  onClick: function () {
    // Post: https://www.facebook.com/groups/j2team.community/posts/1642123806119733/
    // Source: https://chrome.google.com/webstore/detail/documents-downloader/ikecplijfhabpahaolhdgglbbafknkdo?utm_source=j2team&utm_medium=url_shortener&utm_campaign=documents-downloader

    window.open(
      "https://documents-downloader.pages.dev/?documentUrl=" + location.href
    );
  },
};

import { getCurrentTab } from "./helpers/utils.js";

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

  onClickExtension: async function () {
    // Post: https://www.facebook.com/groups/j2team.community/posts/1642123806119733/
    // Source: https://chrome.google.com/webstore/detail/documents-downloader/ikecplijfhabpahaolhdgglbbafknkdo?utm_source=j2team&utm_medium=url_shortener&utm_campaign=documents-downloader

    let tab = await getCurrentTab();
    let url = prompt(
      "Nhập link document:\nĐịnh dạng: https://www.scribd.com/document/...",
      tab.url
    );
    if (url != null)
      // window.open("https://documents-downloader.pages.dev/?documentUrl=" + url);
      window.open(
        "https://scribd.downloader.tips/" +
          url.replace("https://www.scribd.com", "")
      );
  },
};

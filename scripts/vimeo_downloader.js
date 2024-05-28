export default {
  icon: "https://vimeo.com/favicon.ico",
  name: {
    en: "Vimeo - video downloader",
    vi: "Vimeo - tải video",
  },
  description: {
    en: "Download video from vimeo",
    vi: "Tải video trên vimeo",
  },

  popupScript: {
    onClick: async function () {
      const { getCurrentTab } = await import("./helpers/utils.js");

      let tab = await getCurrentTab();
      let url = prompt("Enter vimeo video url: ", tab.url);
      if (url == null) return;

      window.open("https://www.savethevideo.com/vimeo-downloader?url=" + url);
    },
  },
};

import { getCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: "https://freesound.org/favicon.ico",
  name: {
    en: "Freesound - Download audio",
    vi: "Freesound - Tải âm thanh",
  },
  description: {
    en: "Download audio on freesound.org",
    vi: "Tải âm thanh trên freesound.org",
  },
  runInExtensionContext: true,

  onClick: async function () {
    // https://github.com/soimort/you-get/blob/develop/src/you_get/extractors/freesound.py

    let tab = await getCurrentTab();
    let url = prompt("Nhập link freesound: ", tab.url);
    if (url == null) return;

    let { closeLoading } = showLoading("Đang tìm file âm thanh...");
    try {
      let res = await fetch(url);
      let html = await res.text();

      // prettier-ignore
      let title = new RegExp('<meta property="og:title" content="([^"]*)"').exec(html)?.[1]
      // prettier-ignore
      let preview_url = new RegExp('<meta property="og:audio" content="([^"]*)"').exec(html)?.[1];
      preview_url = "https://" + preview_url.split("://").at(-1);

      if (preview_url) window.open(preview_url);
      else throw Error("Không tìm thấy file âm thanh");
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

export const shared = {};

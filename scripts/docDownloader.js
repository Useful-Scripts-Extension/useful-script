import { getCurrentTab } from "./helpers/utils.js";

export default {
  icon: "https://docdownloader.com/public/img/apple-icon-180x180.png",
  name: {
    en: "DocDownloader - Download document",
    vi: "DocDownloader - Tải document",
  },
  description: {
    en: "Download document on Scribd, Issuu, Slideshare, Academia",
    vi: "Tải document từ Scribd, Issuu, Slideshare, Academia",
  },
  onClickExtension: async () => {
    let tab = await getCurrentTab();
    let url = prompt("Nhập document URL:", tab.url);
    if (url == null) return;

    window.open("https://docdownloader.com/?url=" + url);
  },
};

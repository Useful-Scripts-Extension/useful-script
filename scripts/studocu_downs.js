import { getCurrentTab } from "./helpers/utils.js";

export default {
  icon: "https://d20ohkaloyme4g.cloudfront.net/img/favicon.ico",
  name: {
    en: "Studocu - Download documents (Downstudocu)",
    vi: "Studocu - Tải documents (Downstudocu)",
  },
  description: {
    en: "Download document pdf on Studocu.com for free",
    vi: "Tải PDF document trên Studocu.com miễn phí",
  },
  runInExtensionContext: true,

  onClick: async function () {
    let tab = await getCurrentTab();
    let url = prompt("Nhập link studocu document:", tab.url);
    if (url == null) return;
    url = new URL(url);
    url.hostname = "www.downstudocu.com";
    window.open(url);
  },
};

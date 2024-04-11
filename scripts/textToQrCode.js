import { getCurrentTab } from "./helpers/utils.js";

export default {
  icon: '<i class="fa-solid fa-qrcode"></i>',
  name: {
    en: "Text to QRCode",
    vi: "Chữ sang QRCode",
  },
  description: {
    en: "Convert text/url to QRCode",
    vi: "Chuyển chữ/link sang QRCode",
  },

  onClickExtension: async () => {
    const tab = await getCurrentTab();

    let text = prompt("Nhập text/url: ", tab.url);
    if (text) {
      window.open(
        "https://hoothin.com/qrcode/#" + text,
        "",
        "scrollbars=no,width=700,height=700"
      );
    }
  },
};

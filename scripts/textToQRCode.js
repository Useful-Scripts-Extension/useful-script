import { popupCenter } from "./helpers/utils.js";

export default {
  icon: `<i class="fa-solid fa-qrcode fa-lg"></i>`,
  name: {
    en: "Text to QR Code",
    vi: "Chuyển chữ thành QRCode",
  },
  description: {
    en: "Convert text to QR Code",
    vi: "Nhập vào chữ và nhận về QRCode tương ứng",
  },

  onClickExtension: function () {
    let text = prompt("Enter text / Nhập chữ:", "");
    if (text === null) return;

    popupCenter({
      url: chrome.runtime.getURL("/scripts/textToQRCode.html?text=" + text),
      title: "Text To QRCode",
    });
  },
};

import { getCurrentTab, popupCenter } from "./helpers/utils.js";

export default {
  icon: `<i class="fa-solid fa-barcode fa-lg"></i>`,
  name: {
    en: "URL to QR Code",
    vi: "Lấy QRCode cho web hiện tại",
  },
  description: {
    en: "Convert current website URL to QR Code",
    vi: "Chuyển URL của trang web sang QR Code",
  },

  onClickExtension: async function () {
    let tab = await getCurrentTab();
    let url = tab.url;
    if (!url) {
      alert("Không tìm thấy url web hiện tại");
      return;
    }

    popupCenter({
      url: chrome.runtime.getURL("/scripts/textToQRCode.html?text=" + url),
      title: "Text To QRCode",
    });

    // var url =
    //   "http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=" +
    //   encodeURIComponent(location.href);
    // w = open(
    //   url,
    //   "w",
    //   "location=no,status=yes,menubar=no,scrollbars=no,resizable=yes,width=500,height=500,modal=yes,dependent=yes"
    // );
    // if (w) {
    //   setTimeout("w.focus()", 1000);
    // } else {
    //   location = url;
    // }
  },
};

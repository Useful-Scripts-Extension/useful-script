export default {
  icon: '<i class="fa-solid fa-qrcode fa-lg"></i>',
  name: {
    en: "Text to QRCode",
    vi: "Chữ sang QRCode",
  },
  description: {
    en: "Convert text/url to QRCode",
    vi: "Chuyển chữ/link sang QRCode",
  },

  popupScript: {
    onClick: async () => {
      const { getCurrentTab, popupCenter } = await import("./helpers/utils.js");
      const tab = await getCurrentTab();

      let text = prompt("Nhập text/url: ", tab.url);
      if (text) {
        popupCenter({
          url: "/scripts/textToQrCode.html#" + text,
          title: "Text to QRCode",
          w: 400,
          h: 500,
        });
      }
    },
  },
};

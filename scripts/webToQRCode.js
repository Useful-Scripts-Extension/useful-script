export default {
  icon: `<i class="fa-solid fa-barcode"></i>`,
  name: {
    en: "URL to QR Code",
    vi: "Lấy QRCode cho web hiện tại",
  },
  description: {
    en: "Convert current website URL to QR Code",
    vi: "Chuyển URL của trang web sang QR Code",
  },

  onClick: function () {
    var url =
      "http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=" +
      encodeURIComponent(location.href);
    w = open(
      url,
      "w",
      "location=no,status=yes,menubar=no,scrollbars=no,resizable=yes,width=500,height=500,modal=yes,dependent=yes"
    );
    if (w) {
      setTimeout("w.focus()", 1000);
    } else {
      location = url;
    }
  },
};

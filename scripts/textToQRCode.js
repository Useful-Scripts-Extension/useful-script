export default {
  icon: `<i class="fa-solid fa-qrcode"></i>`,
  name: {
    en: "Text to QR Code",
    vi: "Chuyển chữ thành QRCode",
  },
  description: {
    en: "Convert text to QR Code",
    vi: "Nhập vào chữ và nhận về QRCode tương ứng",
  },
  runInExtensionContext: true,

  onClick: function () {
    let text = prompt("Enter text / Nhập chữ:", "");
    if (text === null) return;

    let url =
      "http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=" + text;
    let w = window.open(
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

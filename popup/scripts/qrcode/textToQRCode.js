export default {
  name: {
    en: "Text to QR Code",
    vi: "Chuyển chữ thành QRCode",
  },
  description: {
    en: "Convert text to QR Code",
    vi: "Nhập vào chữ và nhận về QRCode tương ứng",
  },
  func: function () {
    var text = window.prompt("Enter text", "");
    var url =
      "http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=" + text;
    w = window.open(
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

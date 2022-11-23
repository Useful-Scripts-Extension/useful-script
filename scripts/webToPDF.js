export default {
  icon: `https://www.web2pdfconvert.com/img/favicon/favicon.ico`,
  name: {
    en: "Web to PDF",
    vi: "In web ra PDF",
  },
  description: {
    en: "Convert current website to PDF",
    vi: "Chuyển trang web hiện tại thành PDF",
  },

  func: function () {
    window.open("https://www.web2pdfconvert.com#" + location.href);
  },
};

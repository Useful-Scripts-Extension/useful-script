export default {
  icon: `<i class="fa-solid fa-print"></i>`,
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

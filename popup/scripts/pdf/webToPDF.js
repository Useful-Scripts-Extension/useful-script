export default {
  name: {
    en: "Web to PDF",
    vi: "In web ra PDF",
  },
  description: {
    en: "Convert current website to PDF",
    vi: "Chuyển trang web hiện tại thành PDF",
  },
  func() {
    window.open("https://www.web2pdfconvert.com#" + location.href);
  },
};

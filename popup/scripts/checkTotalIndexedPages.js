export default {
  name: {
    en: "Check total indexed pages",
    vi: "Xem các trang con được google quét",
  },
  description: {
    en: "Know how many pages of current website is indexed in Google",
    vi: "Biết có bao nhiêu trang con của website hiện tại đã được quét bởi Google",
  },
  func: function () {
    window.open(
      "http://www.google.com/search?num=100&q=site:" + escape(location.hostname)
    );
  },
};

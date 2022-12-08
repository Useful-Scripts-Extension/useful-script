export default {
  icon: `<i class="fa-brands fa-google"></i>`,
  name: {
    en: "Check total indexed pages",
    vi: "Xem các pages được google quét",
  },
  description: {
    en: "Know how many pages of current website is indexed in Google",
    vi: "Biết có bao nhiêu trang con của website hiện tại đã được quét bởi Google",
  },

  onClick: function () {
    window.open(
      "http://www.google.com/search?num=100&q=site:" + escape(location.hostname)
    );
  },
};

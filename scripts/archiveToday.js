export default {
  icon: `<i class="fa-solid fa-box-archive"></i>`,
  name: {
    en: "Archive the current Page online",
    vi: "Lưu trữ online trang hiện tại",
  },
  description: {
    en: "Creates an archive of the current page on archive.today.",
    vi: "Lưu trang web hiện tại lên archive.today",
  },
  blackList: [],
  whiteList: [],

  func: function () {
    window.open(
      "https://archive.today/?run=1&url=" +
        encodeURIComponent(document.location)
    );
  },
};

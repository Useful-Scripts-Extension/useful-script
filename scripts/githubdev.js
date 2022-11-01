export default {
  name: {
    en: "Open repo in github.dev",
    vi: "Mở repo trong github.dev",
  },
  description: {
    en: "Open current repo in github.dev",
    vi: "Mở repo hiện tại trong trang github.dev để xem code",
  },
  blackList: [],
  whiteList: ["github.com"],

  func: function () {
    window.open("https://github.dev" + location.pathname);
  },
};

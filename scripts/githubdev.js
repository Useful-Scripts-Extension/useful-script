export default {
  icon: `<i class="fa-solid fa-square-arrow-up-right fa-lg"></i>`,
  name: {
    en: "Open repo in github.dev",
    vi: "Mở repo trong github.dev",
  },
  description: {
    en: "Open current repo in github.dev",
    vi: "Mở repo hiện tại trong trang github.dev để xem code",
  },
  whiteList: ["https://github.com/*"],

  onClick: function () {
    window.open("https://github.dev" + location.pathname);
  },
};

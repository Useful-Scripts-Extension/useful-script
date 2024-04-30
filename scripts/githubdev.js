export default {
  icon: `<i class="fa-solid fa-square-arrow-up-right fa-lg"></i>`,
  name: {
    en: "Open repo in github.dev",
    vi: "Mở repo trong github.dev",
  },
  description: {
    en:
      "Open current repo in github.dev<br/>" +
      "<h1>Tip</h1>Press dot (.) when in github repo to open github.dev",
    vi:
      "Mở repo hiện tại trong trang github.dev để xem code<br/>" +
      "<h1>Mẹo</h1>Bấm dấu chấm (.) để mở repo github trong github.dev",
  },

  changeLogs: {
    "2024-04-27": "add tips",
  },

  whiteList: ["https://github.com/*"],

  onClick: function () {
    window.open("https://github.dev" + location.pathname);
  },
};

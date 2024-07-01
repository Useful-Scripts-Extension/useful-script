import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-solid fa-square-arrow-up-right fa-lg"></i>',
  name: {
    en: "Github - HTML preview",
    vi: "Github - xem trước file HTML",
  },
  description: {
    en: "Preview github's HTML file in any repo without download code.",
    vi: "Xem trước giao diện file HTML trên bất kỳ repo github nào mà không cần tải code về.",
  },
  badges: [BADGES.new],
  changeLogs: {
    "2024-06-14": "init",
  },

  whiteList: ["https://github.com/*", "https://bitbucket.org/*"],

  contentScript: {
    onClick: () => {
      window.open("https://htmlpreview.github.io/?" + location.href);
    },
  },
};

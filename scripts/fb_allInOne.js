import { BADGES } from "./helpers/badge.js";
import { runFunc } from "./helpers/utils.js";

const GLOBAL = {
  fetch: (url, options) => fetch(url, options || {}).then((res) => res.text()),
};

export default {
  icon: '<i class="fa-brands fa-square-facebook fa-2xl"></i>',
  name: {
    en: "Facebook - All In One",
    vi: "Facebook - All In One",
  },
  badges: [BADGES.new, BADGES.hot],
  description: {
    en: "Combine all bulk download / statistic features on facebook into single page",
    vi: "Tổng hợp tất cả chức năng tải hàng loạt / thống kê facebook",
  },

  popupScript: {
    onClick: () => {
      window.open(
        "https://useful-scripts-extension.github.io/facebook-all-in-one/dist/index.html"
      );
    },
  },

  backgroundScript: {
    runtime: {
      onMessageExternal: async ({ request, sender, sendResponse }, context) => {
        if (request.action === "fb_allInOne_runFunc") {
          runFunc(request.fnPath, request.params, GLOBAL).then(sendResponse);
          return true;
        }
      },
    },
  },
};

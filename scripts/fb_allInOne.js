import { BADGES } from "./helpers/badge.js";
import { getFbdtsg, getYourUserId } from "./fb_GLOBAL.js";

const CACHED = {
  uid: null,
  fb_dtsg: null,
};

export default {
  icon: '<i class="fa-brands fa-square-facebook fa-2xl"></i>',
  name: {
    en: "Facebook - All In One",
    vi: "Facebook - All In One",
  },
  badges: [BADGES.hot, BADGES.new],
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
        if (request.action === "fb_allInOne_init") {
          init().then(sendResponse);
          return true;
        }

        if (request.action === "request_graphql" && request.query) {
          (async () => {
            if (!CACHED.fb_dtsg) await init();

            fetch(request.url || "https://www.facebook.com/api/graphql/", {
              body: request.query + "&fb_dtsg=" + CACHED.fb_dtsg,
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              credentials: "include",
            })
              .then((res) => res.text())
              .then(sendResponse)
              .catch((e) => sendResponse({ error: e.message }));
          })();
          return true;
        }

        if (request.action === "fetch") {
          fetch(request.url, request.options || {})
            .then((res) => res.text())
            .then(sendResponse)
            .catch((e) => sendResponse({ error: e.message }));
          return true;
        }
      },
    },
  },
};

async function init() {
  CACHED.uid = await getYourUserId();
  CACHED.fb_dtsg = await getFbdtsg();
  return CACHED;
}

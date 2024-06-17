import { BADGES } from "./helpers/badge.js";
import { getFbdtsg, getYourUserId } from "./fb_GLOBAL.js";

const CACHED = {
  uid: null,
  fb_dtsg: null,
};

export default {
  icon: '<i class="fa-solid fa-cloud-arrow-down fa-lg"></i>',
  name: {
    en: "Facebook - Bulk download",
    vi: "Facebook - Tải hàng loạt",
  },
  badges: [BADGES.comingSoon],
  description: {
    en: "Combine all bulk download features on facebook into single page",
    vi: "Tổng hợp tất cả chức năng tải hàng loạt facebook",
  },

  popupScript: {
    onClick: () => {
      window.open("http://localhost:5173/");
    },
  },

  backgroundScript: {
    runtime: {
      onMessageExternal: async ({ request, sender, sendResponse }, context) => {
        if (request.action === "fb_bulkDownload_init") {
          (async () => {
            CACHED.uid = await getYourUserId();
            CACHED.fb_dtsg = await getFbdtsg();
            sendResponse(CACHED);
          })();
          return true;
        }

        if (request.action === "request_graphql" && request.query) {
          fetch(request.url || "https://www.facebook.com/api/graphql/", {
            body: request.query + "&fb_dtsg=" + CACHED.fb_dtsg,
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            credentials: "include",
          })
            .then((res) => res.text())
            .then(sendResponse)
            .catch((e) => sendResponse({ error: e.message }));
          return true;
        }
      },
    },
  },
};

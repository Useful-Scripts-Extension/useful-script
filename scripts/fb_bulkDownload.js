import { BADGES } from "./helpers/badge.js";

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
      window.open(chrome.runtime.getURL("scripts/fb_bulkDownload.html"));
    },
  },
};

export const shared = {};

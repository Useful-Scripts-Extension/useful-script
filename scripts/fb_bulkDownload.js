import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-solid fa-cloud-arrow-down"></i>',
  name: {
    en: "Facebook - Bulk download",
    vi: "Facebook - Tải hàng loạt",
  },
  badges: [BADGES.comingSoon],
  description: {
    en: "",
    vi: "",
  },

  popupScript: {
    onClick: () => {
      window.open(chrome.runtime.getURL("scripts/fb_bulkDownload.html"));
    },
  },
};

export const shared = {};

export default {
  icon: '<i class="fa-solid fa-cloud-arrow-down"></i>',
  name: {
    en: "Facebook - Bulk download",
    vi: "Facebook - Tải hàng loạt",
  },
  description: {
    en: "",
    vi: "",
  },

  onClickExtension: () => {
    window.open(chrome.runtime.getURL("scripts/fb_bulkDownload.html"));
  },
};

export const shared = {};

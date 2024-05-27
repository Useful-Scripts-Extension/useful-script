import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-solid fa-clock-rotate-left fa-lg"></i>',
  name: {
    en: "Facebook - Messenger history",
    vi: "Facebook - Xem tin nhắn đầu tiên",
  },
  description: {
    en: "View first message in facebook messenger",
    vi: "Xem tin nhắn đầu tiên với bạn bè trong facebook messenger",
  },
  badges: [BADGES.comingSoon],

  popupScript: {
    onClick: async () => {
      Swal.fire({
        icon: "info",
        title: "Coming soon!",
        text: "This feature is coming soon!",
      });
      // window.open(chrome.runtime.getURL("scripts/fb_messengerHistory.html"));
    },
  },
};

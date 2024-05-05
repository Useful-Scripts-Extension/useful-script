export default {
  icon: '<i class="fa-solid fa-clock-rotate-left fa-lg"></i>',
  name: {
    en: "Facebook messenger history",
    vi: "Facebook xem tin nhắn đầu tiên",
  },
  description: {
    en: "View first message in facebook messenger",
    vi: "Xem tin nhắn đầu tiên với bạn bè trong facebook messenger",
  },

  popupScript: {
    onClick: async () => {
      window.open(chrome.runtime.getURL("scripts/fb_messengerHistory.html"));
    },
  },
};

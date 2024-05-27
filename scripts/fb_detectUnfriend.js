import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-solid fa-user-large-slash fa-lg"></i>',
  name: {
    en: "Facebook - Detect unfriend",
    vi: "Facebook - Xem ai huỷ kết bạn",
  },
  description: {
    en: "Detect unfriend, know who unfriend you on facebook",
    vi: "Xem ai đã huỷ kết bạn với bạn trên facebook",
    img: "",
  },
  badges: [BADGES.new],
  changeLogs: {
    "2024-05-28": "init",
  },

  popupScript: {
    // onEnable: () => {},
    // onDisable: () => {},

    onClick: () => {
      window.open("/scripts/fb_detectUnfriend.html", "_blank");
    },
  },
};

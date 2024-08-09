import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-solid fa-check fa-lg"></i>',
  name: {
    en: "📝 Auto remove fb group's spam posts",
    vi: "📝 Auto duyệt bài spam group fb",
  },
  description: {
    en: "Auto Accept / Reject spam posts on your facebook group.",
    vi: "Tự động Đăng / Xoá những bài spam trong group facebook của bạn.",
    img: "/scripts/fb_autoRemoveSpamPostGroup.png",
  },
  badges: [BADGES.new],

  changeLogs: {
    "2024-08-09": "init",
  },
  whiteList: ["https://www.facebook.com/*"],

  popupScript: {
    onClick: () => {
      window.open("/scripts/fb_autoRemoveSpamPostGroup.html", "_self");
    },
  },
};

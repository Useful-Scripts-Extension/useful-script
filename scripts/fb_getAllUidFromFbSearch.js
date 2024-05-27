import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-solid fa-magnifying-glass fa-lg"></i>',
  name: {
    en: "Get all fb User ID from search page",
    vi: "Lấy tất cả fb user ID từ trang tìm kiếm",
  },
  description: {
    en: "Get id of all user from facebook search page",
    vi: "Lấy id của tất cả user từ trang tìm kiếm người dùng facebook",
  },
  badges: [BADGES.new],
  changeLogs: {
    "2024-04-27": "x100 faster api",
  },

  whiteList: ["https://*.facebook.com/*"],

  pageScript: {
    onClick: async function () {
      const { getUidFromUrl } = await import("./fb_GLOBAL.js");

      let list_a = Array.from(
        document.querySelectorAll("a[role='presentation']")
      );
      let uids = [];
      for (let a of list_a) {
        let l = a.href;
        let uid = l.split("profile.php?id=")[1];
        if (uid) {
          uids.push(uid);
          console.log(uid);
          continue;
        }
        let name = l.split("facebook.com/")[1];
        uid = await getUidFromUrl(l);
        uids.push(uid);
        console.log(name, uid);
      }
      console.log(uids);
      prompt(`Tìm được ${uids.length} UID, Copy ngay: `, uids.join("\n"));
    },
  },
};

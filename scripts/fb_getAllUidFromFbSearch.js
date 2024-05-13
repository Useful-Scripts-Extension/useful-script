export default {
  name: {
    en: "Get all fb User ID from search page",
    vi: "Lấy tất cả fb user ID từ trang tìm kiếm",
  },
  description: {
    en: "Get id of all user from facebook search page",
    vi: "Lấy id của tất cả user từ trang tìm kiếm người dùng facebook",
  },

  changeLogs: {
    "2024-04-27": "x100 faster api",
  },

  whiteList: ["https://*.facebook.com/*"],

  popupScript: {
    onClick: async function () {
      const { runScriptInCurrentTab, showLoading } = await import(
        "./helpers/utils.js"
      );
      const { closeLoading } = showLoading("Đang tìm user ID...");

      await runScriptInCurrentTab(async () => {
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
          uid = await UfsGlobal.Facebook.getUidFromUrl(l);
          uids.push(uid);
          console.log(name, uid);
        }
        console.log(uids);
        prompt(`Tìm được ${uids.length} UID, Copy ngay: `, uids.join("\n"));
      });

      closeLoading();
    },
  },
};

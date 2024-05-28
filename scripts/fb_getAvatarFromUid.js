import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { getUserAvatarFromUid } from "./fb_GLOBAL.js";
import { showLoading } from "./helpers/utils.js";

export default {
  icon: '<i class="fa-solid fa-user fa-lg"></i>',
  name: {
    en: "Get avatar from fb user id",
    vi: "Tải avatar từ fb user id",
  },
  description: {
    en: "Get avatar from list facebook user ids",
    vi: "Tải danh sách avatar từ danh sách user id facebook",
  },

  popupScript: {
    onClick: async function () {
      let uids = prompt("Nhập danh sách uid, Mỗi uid 1 dòng:");
      if (!uids) return;

      const { closeLoading, setLoadingText } = showLoading();
      try {
        uids = uids.split("\n");
        let urls = [];
        for (let uid of uids) {
          setLoadingText("Đang lấy avatar của " + uid + "...");
          let url = getUserAvatarFromUid(uid);
          let res = await fetch(url);
          url = res.url;
          if (url) {
            urls.push(url);
          }
        }

        if (urls.length === 0) alert("Không tìm được avatar nào!");
        else if (urls.length === 1) window.open(urls[0]);
        else {
          if (
            confirm(
              "Tìm được " + urls.length + " avatars.\nBấm Ok để tải xuống."
            )
          )
            UfsGlobal.Utils.downloadData(
              urls.join("\n"),
              `uid-${new Date().toLocaleString()}.txt`
            );
        }
      } catch (e) {
        alert("ERROR: " + e);
      } finally {
        closeLoading();
      }
    },
  },
};

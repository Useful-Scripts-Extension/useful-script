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
      const { showLoading } = await import("./helpers/utils.js");
      const { downloadData } = UfsGlobal.Utils;

      let uids = prompt("Nhập danh sách uid, Mỗi uid 1 dòng:");
      if (!uids) return;

      const { closeLoading, setLoadingText } = showLoading();
      try {
        uids = uids.split("\n");
        let urls = [];
        for (let uid of uids) {
          setLoadingText("Đang lấy avatar của " + uid + "...");
          let url = UfsGlobal.Facebook.getUserAvatarFromUid(uid);
          let res = await fetch(uid);
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
            downloadData(
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

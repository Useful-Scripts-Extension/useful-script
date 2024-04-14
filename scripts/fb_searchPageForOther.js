import { showLoading } from "./helpers/utils.js";

export default {
  icon: '<i class="fa-solid fa-flag fa-lg"></i>',
  name: {
    en: "Facebook - View your friend's liked pages",
    vi: "Facebook - Xem các trang bạn bè thích",
  },
  description: {
    en: "Know about your friends's liked pages (public pages) on facebook",
    vi: "Biết bạn bè của bạn đang thích các trang (công khai) nào trên facebook",
  },

  onClickExtension: async () => {
    let url = prompt("Nhập link facebook bạn bè (hoặc của bạn): ");
    if (url == null) return;

    let { setLoadingText, closeLoading } = showLoading("Đang chuẩn bị...");
    try {
      let {
        getUidFromUrl,
        getYourUserId,
        getFbdtsg,
        searchAllPageForOther,
        getUserInfoFromUid,
      } = UfsGlobal.Facebook;

      setLoadingText("Đang lấy uid, token...");
      let other_uid = await getUidFromUrl(url);
      let uid = await getYourUserId();
      let dtsg = await getFbdtsg();
      let info = await getUserInfoFromUid(other_uid);
      console.log(info);

      setLoadingText("Đang tải danh sách page...");
      let allPages = await searchAllPageForOther(
        other_uid,
        uid,
        dtsg,
        (pages, all, totalCount) => {
          setLoadingText(
            `Đang tải danh sách page...<br/>Tải được ${all.length}/${totalCount} page.`
          );
        }
      );
      console.log(allPages);
      localStorage.ufs_fb_searchPageForOther = JSON.stringify(allPages);
      localStorage.ufs_fb_searchPageForOther_owner = JSON.stringify(info);

      window.open(chrome.runtime.getURL("scripts/fb_searchPageForOther.html"));
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};
